import App from '../App';
import { Contacts, Pool, Swap } from '../components';

export const routes = [
  {
    id: 1,
    path: '/dex',
    element: <App />,
  },
  {
    id: 2,
    path: '/swap',
    element: <Swap />,
  },
  {
    id: 3,
    path: '/pool',
    element: <Pool />,
  },
  {
    id: 4,
    path: '/contacts',
    element: <Contacts />,
  },
];

export default routes;
