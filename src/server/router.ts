import Router from '@koa/router';
import { livecheck } from 'src/server/middleware/livecheck';
import { robots } from 'src/server/middleware/robots';
import { ssr } from 'src/server/middleware/ssr';

export const router = new Router();

router.get('/livecheck', livecheck);
router.get('/robots.txt', robots);
router.get('/:path', ssr);
