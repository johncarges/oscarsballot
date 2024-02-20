import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Ballot from './components/Ballot';
import Layout from './components/layout';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <Ballot />
      },
      {
        path: '/groups',
        element: <h1>Groups!</h1>,
      }
    ]
  },
  
  
])


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
