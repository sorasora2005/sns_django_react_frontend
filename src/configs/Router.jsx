import { createBrowserRouter } from 'react-router-dom';
import Top from '../components/Top/index';
import ProfileComponent from '../components/Top/profile';

const router = createBrowserRouter([
  { path: "/", element: <Top /> },
  { path: "/profile", element: <ProfileComponent /> },
]);

export default router;
