import Router from '@koa/router';
import { livecheck } from 'src/server/middleware/livecheck';
import { robots } from 'src/server/middleware/robots';
import { ssr } from 'src/server/middleware/ssr';
import koaSend from 'koa-send';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const router = new Router();

if (process.env.NODE_ENV === 'development') {
    router.get('/favicon.ico', async (ctx) =>
        koaSend(ctx, ctx.path, {
            root: resolve(__dirname, '../../public'),
            maxAge: 1000 * 60 * 60 * 24,
        }),
    );
}

router.get('/livecheck', livecheck);
router.get('/robots.txt', robots);
router.get('/(.*)', ssr);
