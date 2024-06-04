import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Profile from './pages/Profile'
import RestaurantDetails from './pages/RestaurantDetails'
import HostRestaurantDetails from './pages/HostRestaurantDetails'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import OpenRestaurant from './pages/OpenRestaurant/OpenRestaurant'

// eslint-disable-next-line react-refresh/only-export-components
function AdminProtectedRouter() {
  const { info } = useContext(AppContext)
  const check = Boolean(info?.role === 1)
  return check ? <Outlet /> : <Navigate to='/' />
}
// eslint-disable-next-line react-refresh/only-export-components
function UserProtectedRouter() {
  const { info } = useContext(AppContext)
  const check = Boolean(info?.role === 0)
  return check ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '/restaurant/:id',
      index: true,
      element: (
        <MainLayout>
          <RestaurantDetails />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <UserProtectedRouter />,
      children: [
        {
          path: '/profile',
          index: true,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: '/open_restaurant',
          index: true,
          element: (
            <MainLayout>
              <OpenRestaurant />
            </MainLayout>
          )
        },
        {
          path: '/host_restaurant/:id',
          index: true,
          element: (
            <MainLayout>
              <HostRestaurantDetails />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    }
  ])
  return routeElement
}
