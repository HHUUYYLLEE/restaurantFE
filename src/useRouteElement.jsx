import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Adminlayout from './layouts/AdminLayout/AdminLayout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import RestaurantDetails from './pages/RestaurantDetails'
import HostRestaurantDetails from './pages/HostRestaurantDetails'
import OrderList from './pages/OrderList/OrderList'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import OpenRestaurant from './pages/OpenRestaurant/OpenRestaurant'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Search from './pages/Search/Search'
import SearchByLocation from './components/SearchLocationResults/SearchLocationResults'
import UpdateRestaurant from './pages/UpdateRestaurant'
import BloggerRestaurantsResults from './pages/BloggerRestaurantsResults/BloggerRestaurantsResults'
import HostOrderDetail from './pages/HostOrderDetail/HostOrderDetail'
import HostOrderTableDetail from './pages/HostOrderDetail/HostOrderDetail'
import CompletedOrder from './pages/CompletedOrder/CompletedOrder'
import TableOrderForm from './pages/TableOrderForm'
import TableOrder from './pages/TableOrder'
import CompletedTableOrder from './pages/CompletedTableOrder/CompletedTableOrder'
import Admin from './pages/Admin/Admin'
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
// eslint-disable-next-line react-refresh/only-export-components
function NonAdminRouter() {
  const { info } = useContext(AppContext)
  const check = Boolean(info?.role === 1)
  return check ? <Navigate to='/' /> : <Outlet />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '',
      element: <UserProtectedRouter />,
      children: [
        {
          path: '/table_order/:id',
          index: true,
          element: (
            <MainLayout>
              <TableOrderForm />
            </MainLayout>
          )
        },
        {
          path: '/table_order',
          index: true,
          element: (
            <MainLayout>
              <TableOrder />
            </MainLayout>
          )
        },
        {
          path: '/host_order_detail/:id',
          index: true,
          element: (
            <MainLayout>
              <HostOrderDetail />
            </MainLayout>
          )
        },
        {
          path: '/host_order_table_detail/:id',
          index: true,
          element: (
            <MainLayout>
              <HostOrderTableDetail />
            </MainLayout>
          )
        },
        {
          path: '/place_order/:id',
          index: true,
          element: (
            <MainLayout>
              <PlaceOrder />
            </MainLayout>
          )
        },
        {
          path: '/completed_order/:id',
          index: true,
          element: (
            <MainLayout>
              <CompletedOrder />
            </MainLayout>
          )
        },
        {
          path: '/order_food',
          index: true,
          element: (
            <MainLayout>
              <OrderList />
            </MainLayout>
          )
        },
        {
          path: '/completed_table_order/:id',
          index: true,
          element: (
            <MainLayout>
              <CompletedTableOrder />
            </MainLayout>
          )
        },
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
        },
        {
          path: '/update_restaurant/:id',
          index: true,
          element: (
            <MainLayout>
              <UpdateRestaurant />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <AdminProtectedRouter />,
      children: [
        {
          path: '/admin',
          index: true,
          element: (
            <Adminlayout>
              <Admin />
            </Adminlayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <NonAdminRouter />,
      children: [
        {
          path: '/search_location',
          index: true,
          element: (
            <MainLayout>
              <SearchByLocation />
            </MainLayout>
          )
        },
        {
          path: '/search',
          index: true,
          element: (
            <MainLayout>
              <Search />
            </MainLayout>
          )
        },
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
          path: '/find_blogger_restaurants',
          index: true,
          element: (
            <MainLayout>
              <BloggerRestaurantsResults />
            </MainLayout>
          )
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
      ]
    }
  ])
  return routeElement
}
