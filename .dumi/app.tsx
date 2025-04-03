import { Navigate } from 'dumi';

export const patchClientRoutes = ({ routes }) => {
  routes.unshift({
    path: '/',
    element: <Navigate to="/guide" replace />,
  });
};
