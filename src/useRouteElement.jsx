import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'

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
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Home />
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
        }
      ]
    }
  ])
  return routeElement
}
