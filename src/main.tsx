import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CalculationsPage from './Calculations';
import CalculationsDetailedPage from './CalculationsDetailed';
const router = createBrowserRouter([
  {
    path: '/calculations',
    element: <CalculationsPage />,
  },
  {
    path: '/calculations/:id/',
    element: <CalculationsDetailedPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <hr />
    <RouterProvider router={router} />
  </React.StrictMode>,
);