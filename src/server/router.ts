import cors from '@koa/cors';
import Router from '@koa/router';

import { livecheck } from 'src/server/middleware/livecheck';
import { robots } from 'src/server/middleware/robots';
import { sentry } from 'src/server/middleware/sentry';
import { ssr } from 'src/server/middleware/ssr';
import { MAIN } from 'src/client/utils/routes';

// TODO get from aws appconfig
const corsConfig = {
    allowHeaders: 'sentry-trace',
    allowMethods: 'GET,HEAD',
    credentials: true,
    origin: '*',
};

const router = new Router();

router.get('/livecheck', livecheck);
router.get('/robots.txt', robots);
router.get(MAIN, cors(corsConfig), sentry('ssr'), ssr);

export { router };
