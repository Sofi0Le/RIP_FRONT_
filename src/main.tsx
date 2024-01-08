import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CalculationsPage from './components/Calculations/Calculations';
/*import CalculationsDetailedPage from './components/CalculationsDetailed/CalculationsDetailed';*/
import RegistrationPage from './components/Registration'
import LoginPage from './components/LoginPage';
/*import ModeratorCalculationsPage from './Moderator_calculations';
import ModeratorCalculationsChangePage from './Moderator_calculations_change';
import ModeratorCalculationsNewPage from './Moderator_calculations_new'*/
import { Provider } from 'react-redux'; // Импортируйте Provider
import { store } from './redux/store'; // Импортируйте ваш Redux store


const router = createBrowserRouter([
  /*{
    path: '/moderator/operations/new/',
    element: <ModeratorCalculationsNewPage />,
  },
  {
    path: '/moderator/operations/',
    element: <ModeratorCalculationsPage />,
  },*/
  {
    path: '/login/',
    element: <LoginPage />,
  },
  {
    path: '/register/',
    element: <RegistrationPage />,
  },
  {
    path: '/operations/',
    element: <CalculationsPage />,
  },/*
  {
    path: '/operations/:id/',
    element: <CalculationsDetailedPage />,
  },
  {
    path: '/moderator/bouquets/change/:id/',
    element: <ModeratorCalculationsChangePage />,
  },
  {
    path: '/calculations/',
    element: <CalculationsPage />,
  },
  {
    path: '/calculations/:id/',
    element: <CalculationsDetailedPage />,
  },*/
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <hr />
    <Provider store={store}> {/* Оберните ваше приложение в Provider */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);