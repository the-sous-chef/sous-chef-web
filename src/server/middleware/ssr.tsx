import { readFileSync } from 'node:fs';
import { Next, ParameterizedContext } from 'koa';
import { init } from 'src/server/utils/i18n';
import path from 'node:path';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { render } from 'src/server/utils/renderNodeStream';
import { body } from 'src/server/fragments/body';
import { head } from 'src/server/fragments/head';
import i18next from 'i18next';
import type { Manifest } from 'vite';

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
    const span = ctx.state.transaction
        ? ctx.state.transaction.startChild({
              description: ctx.route,
              op: 'ssr',
          })
        : null;

    const queryClient = new QueryClient();
    const development = process.env.NODE_ENV === 'development';
    const context: App.RenderContext = {
        manifest,
        development,
        dehydratedState: dehydrate(queryClient),
        devServer: {
            hostname: process.env.HOSTNAME,
            port: process.env.PORT ? parseInt(process.env.PORT as string, 10) : undefined,
        },
        publicPath: ctx.app.context.config.publicPath,
    };
    const close = (): void => {
        queryClient.clear();

        if (span) {
            span.finish();
        }
    };

    await init(ctx.state.locale);

    ctx.status = 200;
    ctx.type = 'text/html';

    const stream = render(
        ctx,
        context,
        i18next.language,
        queryClient,
        () => body(context),
        () => head(context, i18next),
    );
    const waiter = new Promise<void>((resolve, reject) => {
        stream.on('error', (e) => {
            close();
            reject(e);
        });
        stream.on('finish', () => {
            try {
                close();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });

    ctx.body = stream;

    await waiter;

    return next();
};
