import { Navigate } from 'dumi';

export const patchClientRoutes = ({ routes }) => {
  routes.unshift({
    path: '/',
    element: <Navigate to="/components/user-select-base" replace />,
  });
};
