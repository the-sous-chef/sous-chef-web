import { readFileSync } from 'fs';
import { Next, ParameterizedContext } from 'koa';
import { head } from 'src/server/templates/head';
import { bottom, top } from 'src/server/templates/body';
import { init } from 'src/server/lib/i18n';
import { renderToPipeableStream } from 'react-dom/server';
import { Manifest } from 'vite';
import { App } from 'src/client/ssr';
import path from 'path';
import i18next from 'i18next';
import isbot from 'isbot';
import { Writable } from 'node:stream';

// TODO config
const ABORT_DELAY = 10000;

function loadViteManifest(): Manifest {
    try {
        const contents = readFileSync(path.resolve(__dirname, 'dist/manifest.json'), { encoding: 'utf-8' });

        return JSON.parse(contents) as Manifest;
    } catch (e) {
        return {} as Manifest;
    }
}

// Load manifest once
const manifest = loadViteManifest();

export const ssr = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
    const context = {
        manifest,
        development: process.env.NODE_ENV === 'development',
        devServer: {
            hostname: 'localhost',
            port: 5173,
        },
        publicPath: '',
    };

    await init(ctx.state.locale);

    const isBot = isbot(ctx.headers['user-agent']);
    const callbackName = isBot ? 'onAllReady' : 'onShellReady';

    ctx.response.set('content-type', 'text/html');
    ctx.res.write(`<!DOCTYPE html><html lang="${i18next.language}"><head>${head(context, i18next)}`);

    const stream = new Writable({
        write(chunk, _encoding, cb): void {
            ctx.res.write(chunk, cb);
        },
        final(): void {
            ctx.res.write(bottom(context));
            ctx.res.end('</body></html>');
        },
    });

    const p = new Promise<void>((resolve, reject): void => {
        const { pipe, abort } = renderToPipeableStream(
            <App />,
            {
                bootstrapModules: ['/main.js'],
                [callbackName]() {
                    ctx.respond = false;
                    ctx.res.statusCode = 200;
                    // TODO collect head from react injecting preload?
                    ctx.res.write(`</head><body>${top(context)}`);
                    resolve();
                },
                onShellError(e) {
                    if (isBot) {
                        ctx.res.statusCode = 500;
                    }

                    // TODO different shell?
                    ctx.res.write('</head><body><p>Error Loading...</p>');
                    reject(e);
                },
                onError(e) {
                    if (isBot) {
                        ctx.res.statusCode = 500;
                    }

                    ctx.log.error(e, (e as Error).message);
                },
            },
        );

        pipe(stream);

        setTimeout(() => {
            abort();
            reject();
        }, ABORT_DELAY);
    });

    await p;

    return next();
};
