import { Root } from 'src/client/routes/Root';
import { Landing } from 'src/client/routes/Landing';
import { Route } from 'react-router-dom';
import { Home } from 'src/client/routes/Home';
import { AuthBoundary } from 'src/client/components/AuthBoundary';

export const routes = (
    <Route element={<Root />} path="">
        <Route
            element={
                <AuthBoundary>
                    <Home />
                </AuthBoundary>
            }
            path="/home"
        />
        <Route element={<Landing />} path="/" />
    </Route>
);
