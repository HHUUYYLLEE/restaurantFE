import { getAllUserRestaurants } from '../../../api/restaurants.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfoFromLS } from '../../../utils/auth'
import Restaurant from './Restaurant/Restaurant'
import { NavLink } from 'react-router-dom'
export default function RestaurantsList() {
  const user_id = getInfoFromLS()._id

  const { status, data, isLoading } = useQuery({
    queryKey: ['userRestaurants', user_id],
    queryFn: () => {
      return getAllUserRestaurants(user_id)
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })
  const dataUserRestaurants = data?.data?.restaurants
  console.log(dataUserRestaurants)
  return (
    <>
      <div className='mx-auto mt-[10vh] sm:w-[80%] w-[90%] p-4'>
        <div className='flex items-center gap-x-4'>
          <div className='sm:text-3xl'>Danh sách nhà hàng của bạn</div>
          <NavLink to='/open_restaurant'>
            <button
              className=' hover:bg-green-500 bg-orange-500  text-white py-[0.3rem] px-[0.5rem]
               font-ibm-plex-serif-700 rounded-lg
              sm:px-[0.8rem] sm:py-[0.4rem] italic '
            >
              Mở thêm nhà hàng
            </button>
          </NavLink>
        </div>
        <div className='mt-[5vh] grid sm:grid-cols-5 grid-cols-2 gap-y-3 gap-x-5'>
          {dataUserRestaurants &&
            dataUserRestaurants?.map((restaurant) => {
              return <Restaurant key={restaurant._id} restaurant={restaurant} />
            })}
        </div>
      </div>
    </>
  )
}
