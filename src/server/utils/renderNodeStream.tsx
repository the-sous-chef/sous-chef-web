import { QueryClient } from '@tanstack/react-query';
import isbot from 'isbot';
import { ParameterizedContext } from 'koa';
import { renderToPipeableStream } from 'react-dom/server';
import { SSR } from 'src/client/ssr';
import { PassThrough } from 'node:stream';
import { bodyEnd, bodyStart } from 'src/server/fragments/body';
import { htmlClose, htmlStart } from 'src/server/fragments/html';

export const render = (
    ctx: ParameterizedContext,
    context: App.RenderContext,
    language: string,
    queryClient: QueryClient,
    body: () => string,
    head: () => string,
): PassThrough => {
    let pid: ReturnType<typeof setTimeout> | undefined;
    const isBot = isbot(ctx.headers['user-agent']);
    const stream = new PassThrough();
    const pipeableStream = renderToPipeableStream(
        <SSR dehydratedState={context.dehydratedState} queryClient={queryClient} />,
        {
            bootstrapModules: [
                `${
                    context.development
                        ? `http://${context.devServer.hostname}:${context.devServer.port}/src/client`
                        : '/public'
                }/browser.tsx`,
            ],
            onAllReady() {
                if (isBot) {
                    stream.push(`${htmlStart(language)}${head()}${bodyStart()}`);
                    pipeableStream.pipe(stream);
                    // TODO collect head from react injecting preload?
                }

                stream.push(`${body()}${htmlClose()}`);
                stream.push(null);
                stream.end();

                if (pid) {
                    clearTimeout(pid);
                }
            },
            onShellReady() {
                if (!isBot) {
                    stream.push(`${head()}${bodyStart()}`);
                    pipeableStream.pipe(stream);
                    // TODO collect head from react injecting preload?
                }
            },
            onShellError(e) {
                ctx.status = 500;
                // TODO different shell and head?
                if (isBot) {
                    stream.push(`${head()}${bodyStart()}`);
                    // TODO collect head from react injecting preload?
                }

                stream.push(`<p>Error Loading...</p>${bodyEnd()}${htmlClose()}`);
                stream.destroy(e as Error);
            },
            onError(e) {
                if (isBot) {
                    ctx.status = 500;
                }

                ctx.log.error(e, (e as Error).message);
            },
        },
    );

    if (!isBot) {
        stream.push(htmlStart(language));
    }

    pid = setTimeout(() => {
        ctx.response.status = 408;
        pipeableStream.abort();
        stream.destroy(new Error('Request timed out'));
    }, ctx.app.context.config.abortDelay);

    return stream;
};
