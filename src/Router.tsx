import { lazy, } from 'react';
import { createBrowserRouter, redirect, RouteObject, } from 'react-router-dom';

import RootLayout from './apps/Root/RootLayout';

const routes: Array<RouteObject> = [
  {
    id: 'root',
    path: '',
    element: <RootLayout />,
    children: [
      {
        id: 'home',
        path: '',
        Component: lazy(
          () => import('./apps/Home/pages/Home'),
        ),
      },
      {
        id: 'hotelDetail',
        path: 'hotelDetail/:id',
        Component: lazy(
          () => import('./apps/HotelDetail/pages/HotelDetail'),
        ),
      },
      {
        id: 'Reservation',
        path: 'reservation/:roomId',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            alert ('User is not authenticated');
            return redirect('/login');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Reservation/pages/Reservation'),
        ),
      },
      {
        id: 'MyReservation',
        path: 'reservations/myreservations',
        Component: lazy(
          () => import('./apps/MyReservation/pages/MyReservation'),
        ),
      },
      {
        id: 'login',
        path: 'login',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }

          return true
        },
        Component: lazy(
          () => import('./apps/Login/pages/Login'),
        ),
      },
      {
        id: 'register',
        path: 'signup',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Signup/pages/Signup'),
        ),
      },
      {
        id: 'admin',
        path: 'dashboard',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard'),
        ),
      },
      {
        id: 'admin-hotels',
        path: 'dashboard/hotels',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.hotels'),
        ),
      },
      {
        id: 'admin-create-hotel',
        path: 'dashboard/hotels/create',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.createHotel'),
        ),
      },
      {
        id: 'admin-edit-hotel',
        path: 'dashboard/hotels/edit/:id',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.editHotel'),
        ),
      },
      {
        id: 'admin-rooms',
        path: 'dashboard/rooms',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.rooms'),
        ),
      },
      {
        id: 'admin-create-room',
        path: 'dashboard/rooms/create',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.createRoom'),
        ),
      },
      {
        id: 'admin-edit-room',
        path: 'dashboard/rooms/edit/:id',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }

          return true;
        },
        Component: lazy(
          () => import('./apps/Dashboard/pages/Dashboard.editRoom'),
        ),
      },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;