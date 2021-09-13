import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import Helmet from 'react-helmet';
import { Next, ParameterizedContext } from 'koa';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { StaticRouterContext } from 'react-router';
// TODO remove stubbed typing
import { pipeToNodeWritable } from 'react-dom/server';
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';

import { SsrApp } from 'src/client/App.ssr';
import { ERROR } from 'src/client/utils/routes';
import { EMOTION_CACHE_KEY } from 'src/client/constants';

// TODO move to consts
const ABORT_DELAY = 2000;

const cache = createCache({ key: EMOTION_CACHE_KEY });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

export const ssr = async (ctx: ParameterizedContext, next: Next): Promise<unknown> => {
    // TODO how do I do aws appconfig on ssr?
    // TODO different apollo cache?
    // TODO html webpack plugin

    ctx.socket.on('error', (e) => {
        // TODO handle. Maybe redirect?
        ctx.log.error(e);
    });

    const routerContext: StaticRouterContext = {};
    const client = new ApolloClient({
        ssrMode: true,
        link: createHttpLink({
            // TODO fix this - this url needs to be coonfigured to point to the federated gateway lambda
            // Need to setup local aws services to mock appconfig
            uri: 'http://localhost:3010',
            credentials: 'same-origin',
            headers: ctx.req.headers,
        }),
        cache: new InMemoryCache(),
    });

    const app = (
        <SsrApp
            cache={cache}
            client={client}
            location={ctx.req.url}
            routerContext={routerContext}
        />
    );

    const html = await getDataFromTree(app);

    if (routerContext.statusCode) {
        ctx.status = routerContext.statusCode;
    }

    // Handle React Router redirection
    if (routerContext.url) {
        ctx.status = routerContext.statusCode === 301 ? 301 : 302;
        ctx.redirect(routerContext.url);
        return null;
    }

    const emotionChunks = extractCriticalToChunks(html);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    const apolloState = client.extract();
    const helmet = Helmet.renderStatic();

    const { startWriting, abort } = pipeToNodeWritable(app, ctx.res, {
        onCompleteAll() {
            // TODO render footer
            ctx.res.write('</div></body></html>');
        },
        onReadyToStream() {
            // TODO write head
            ctx.status = 200;
            ctx.res.setHeader('Content-type', 'text/html');
            ctx.res.write(`
                <!DOCTYPE html>
                <html ${helmet.htmlAttributes.toString()}>
                    <head>
                        <meta name="sentry-trace" content="${ctx.transaction.toSentryTrace()}" />
                        ${helmet.title.toString()}
                        ${helmet.meta.toString()}
                        ${helmet.link.toString()}
                        ${emotionCss}
                        <script>
                            window.__APOLLO_STATE__ = ${JSON.stringify(apolloState).replace(/</g, '\\u003c')};
                        </script>
                    </head>
                    <body ${helmet.bodyAttributes.toString()}>
                        <div id="app">`);
            startWriting();
        },
        onError(e: any) {
            // TODO will redirect work?
            ctx.log.error(e);
            ctx.status = 301;
            ctx.redirect(ERROR);
        },
    });

    setTimeout(abort, ABORT_DELAY);

    return next();
};
