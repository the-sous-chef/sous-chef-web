import { App } from 'src/client/routes/App';
import { Landing } from 'src/client/routes/Landing';
import { Route } from 'react-router-dom';
import { Home } from 'src/client/routes/Home';
import { ProtectedRoute } from 'src/client/components/ProtectedRoute';

export const routes = (
    <Route element={<App />} path="/">
        <Route index element={<Landing />} />
        <Route element={<ProtectedRoute component={Home} />} path="home" />
    </Route>
);
