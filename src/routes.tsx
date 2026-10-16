import { createBrowserRouter, useRoutes, Link } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useStoreContext } from './context';

export const Routes = ({ storeSlug }: { storeSlug: string }) => {
  const { store } = useStoreContext();
  const { slug } = useRoutes();

  // Determinar slug: de variable env o de ruta /:slug
  const currentSlug = slug || storeSlug || 'ferreteria-del-sur';

  // Definición de routes como objeto para createBrowserRouter
  const routes = [
    {
      path: '/',
      element: CatalogPage,
      evaluator: () => ({ storeSlug: currentSlug }),
    },
    {
      path: '/:slug',
      element: CatalogPage,
      evaluator: ({ params }) => ({ storeSlug: params.slug }),
    },
    {
      path: '/admin',
      element: AdminPage,
    },
    {
      path: '/*',
      element: NotFoundPage,
    },
  ];

  return createBrowserRouter(routes);
};