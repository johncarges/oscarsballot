import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Ballot, {loader as ballotLoader} from './pages/ballot'
import Admin, {loader as adminLoader} from './pages/admin'
import Layout from './components/layout';
import Auth from './components/auth';
import Groups, {loader as groupsLoader} from './pages/groups'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <Ballot />,
        loader: ballotLoader
      },
      {
        path: '/groups',
        element: <Groups />,
        loader: groupsLoader,
      },
      {
        path:'/admin',
        element: <Admin />,
        loader: adminLoader,
      }
    ]
  },
  {
    path: '/auth',
    element: <Auth />
  }
  
  
])


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
