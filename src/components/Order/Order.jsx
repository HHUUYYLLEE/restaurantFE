import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUserOrders } from '../../api/order_food.api'

import 'react-responsive-carousel/lib/styles/carousel.css'

import 'leaflet/dist/leaflet.css'
import { useState, useRef } from 'react'

import OrderRestaurant from './OrderRestaurant/OrderRestaurant'
import ShoppingCartError from '../../../src/asset/img/broken_shopping_cart.png'
import spinningload from '../../asset/img/spinning_load.gif'
export default function Order() {
  const bottomBar = useRef()
  const [option, setOption] = useState(0)
  const options = ['Tất cả', 'Chưa đặt', 'Đã đặt', 'Đã huỷ', 'Đã hoàn thành']
  const { data, isSuccess, isError, isLoading, refetch } = useQuery({
    queryKey: ['all_order_food'],
    queryFn: () => {
      return getAllUserOrders()
    },
    placeholderData: keepPreviousData,
    retry: false
  })
  console.log(data)
  const orderData = data?.data.orderFood

  return (
    <>
      <div className='w-full'>
        <div className=' w-full grid grid-cols-5 mb-[2rem]'>
          {options.map((data, id) => {
            return (
              <div
                key={id}
                className={`${
                  option === id ? ' bg-orange-500 text-white ' : ' bg-white '
                } flex justify-center 
                  items-center text-[0.7rem] h-[7vh] 2x:text-2xl sm:text-xl text-center sm:h-[10vh] cursor-pointer`}
                onClick={() => setOption(id)}
              >
                {data}
              </div>
            )
          })}
        </div>
        {isError && (
          <div className='w-full mt-[5rem]'>
            <div className='flex justify-center'>
              <img src={ShoppingCartError} />
            </div>
            <div className='flex justify-center text-sm sm:text-xl text-orange-500'>
              Có vẻ như bạn chưa thêm gì vào giỏ hàng cả...
            </div>
          </div>
        )}
        {isLoading && (
          <div className='flex items-center justify-center'>
            <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
          </div>
        )}
        {isSuccess &&
          data &&
          orderData.map((data, id) => {
            if (data.status + 1 === option || option === 0)
              return (
                <OrderRestaurant
                  key={id}
                  id={data._id}
                  restaurant_id={data.restaurant_id}
                  status={data.status}
                  total_price={data.total_price}
                  address={data.address}
                  refetch={refetch}
                />
              )
          })}
      </div>
    </>
  )
}
