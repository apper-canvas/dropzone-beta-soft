import Home from '@/components/pages/Home';

export const routes = [
  {
    id: 'home',
    label: 'File Uploader',
    path: '/',
    component: Home
  }
];

export const routeArray = Object.values(routes);
export default routes;