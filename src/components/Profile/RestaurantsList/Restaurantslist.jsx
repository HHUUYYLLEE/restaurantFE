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
      <div className='mx-auto mt-[25vh] w-[75%] '>
        <div className='flex items-center gap-x-4'>
          <div className='text-3xl'>Danh sách nhà hàng của bạn</div>
          <NavLink to='/open_restaurant'>
            <button className=' hover:bg-[#0366FF] bg-orange-500  text-white py-[1.2rem] px-[1rem] font-ibm-plex-serif-700 rounded-lg'>
              Mở thêm nhà hàng
            </button>
          </NavLink>
        </div>
        <div className='mt-[5vh] grid grid-cols-5 grid-rows-2 gap-y-3 gap-x-2'>
          {dataUserRestaurants &&
            dataUserRestaurants?.map((restaurant) => {
              return <Restaurant key={restaurant._id} restaurant={restaurant} />
            })}
        </div>
      </div>
    </>
  )
}
