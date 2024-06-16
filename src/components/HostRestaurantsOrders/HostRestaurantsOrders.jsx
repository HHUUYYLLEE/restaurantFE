import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllRestaurantsPlacedOrderFood } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import ShoppingCartError from '../../../src/asset/img/broken_shopping_cart.png'
import spinningload from '../../asset/img/spinning_load.gif'
import OrderRestaurant from './OrderRestaurant/OrderRestaurant'
export default function HostRestaurantsOrders() {
  const [option, setOption] = useState(0)
  const options = ['Tất cả', 'Chờ giao', 'Đã huỷ', 'Đã hoàn thành']
  const { data, isSuccess, isError, isLoading, refetch } = useQuery({
    queryKey: ['all_restaurants_placed_order_food'],
    queryFn: () => {
      return getAllRestaurantsPlacedOrderFood()
    },
    placeholderData: keepPreviousData,
    retry: false
  })
  const restaurants = data?.data.restaurants

  return (
    <>
      <div className=''>
        <div className=' grid grid-cols-4 mb-[2rem]'>
          {options.map((data, id) => {
            return (
              <div
                key={id}
                className={`${
                  option === id ? ' bg-orange-500 text-white ' : ' bg-white '
                } flex justify-center 
                  items-center text-[0.7rem] h-[7vh] 2x:text-2xl sm:text-xl 
                  text-center sm:h-[10vh] cursor-pointer`}
                onClick={() => setOption(id)}
              >
                {data}
              </div>
            )
          })}
        </div>
        {isError ||
          (restaurants?.length === 0 && (
            <div className='mt-[5rem]'>
              <div className='flex justify-center'>
                <img src={ShoppingCartError} />
              </div>
              <div className='flex justify-center text-sm sm:text-xl text-orange-500'>
                Chưa có đơn hàng
              </div>
            </div>
          ))}
        {isLoading && (
          <div className='flex items-center justify-center'>
            <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
          </div>
        )}
        {isSuccess &&
          data &&
          restaurants.map((data, id) => {
            return <OrderRestaurant key={id} option={option} restaurant={data} refetch={refetch} />
          })}
      </div>
    </>
  )
}
