import isbot from 'isbot';
import { ParameterizedContext } from 'koa';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { bodyEnd, bodyStart } from 'src/server/fragments/body';
import { htmlClose, htmlStart } from 'src/server/fragments/html';

export type Options = {
    ctx: ParameterizedContext;
    context: App.RenderContext;
    language: string;
    body: () => string;
    head: () => string;
};

export const render = (App: JSX.Element, options: Options): PassThrough => {
    // eslint-disable-next-line prefer-const
    let pid: ReturnType<typeof setTimeout> | undefined;
    const isBot = isbot(options.ctx.headers['user-agent']);
    const stream = new PassThrough();
    const pipeableStream = renderToPipeableStream(App, {
        bootstrapModules: [
            `${
                options.context.development
                    ? `http://${options.context.devServer.hostname}:${options.context.devServer.port}/src/client`
                    : '/public'
            }/browser.tsx`,
        ],
        onAllReady() {
            if (isBot) {
                stream.push(`${htmlStart(options.language)}${options.head()}${bodyStart()}`);
                pipeableStream.pipe(stream);
                // TODO collect head from react injecting preload?
            }

            stream.push(`${options.body()}${htmlClose()}`);
            stream.push(null);
            stream.end();

            if (pid) {
                clearTimeout(pid);
            }
        },
        onShellReady() {
            if (!isBot) {
                stream.push(`${options.head()}${bodyStart()}`);
                pipeableStream.pipe(stream);
                // TODO collect head from react injecting preload?
            }
        },
        onShellError(e) {
            options.ctx.status = 500;
            // TODO different shell and head?
            if (isBot) {
                stream.push(`${options.head()}${bodyStart()}`);
                // TODO collect head from react injecting preload?
            }

            stream.push(`<p>Error Loading...</p>${bodyEnd()}${htmlClose()}`);
            stream.destroy(e as Error);
        },
        onError(e) {
            if (isBot) {
                options.ctx.status = 500;
            }

            options.ctx.log.error(e, (e as Error).message);
        },
    });

    if (!isBot) {
        stream.push(htmlStart(options.language));
    }

    pid = setTimeout(() => {
        options.ctx.response.status = 408;
        pipeableStream.abort();
        stream.destroy(new Error('Request timed out'));
    }, options.ctx.app.context.config.abortDelay);

    return stream;
};
