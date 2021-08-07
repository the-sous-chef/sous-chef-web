import {
    Switch,
    Route,
} from 'react-router-dom';

import * as routes from 'src/client/utils/routes';
import { ErrorPage } from 'src/client/pages/ErrorPage';
import { MainPage } from 'src/client/pages/MainPage';
import { NotFoundPage } from 'src/client/pages/NotFoundPage';

export const Router = (): JSX.Element => (
    <Switch>
        <Route path={routes.ERROR} component={ErrorPage} />
        <Route path={routes.NOT_FOUND} component={NotFoundPage} />
        <Route path={routes.MAIN} component={MainPage} />
    </Switch>
);
