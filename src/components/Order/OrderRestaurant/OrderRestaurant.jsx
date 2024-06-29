import { Link } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../../api/restaurants.api'
import { getOrder } from '../../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import spinningload from '../../../asset/img/spinning_load.gif'

import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt, FaWpforms } from 'react-icons/fa'

import { displayNum } from '../../../utils/utils'
import { CiShop } from 'react-icons/ci'
import Food from './Food/Food'

export default function OrderRestaurant({
  id,
  restaurant_id,
  status,
  total_price,
  address,
  refetch
}) {
  const {
    data: restaurant_data,
    isSuccess: restaurantSuccess,
    isLoading
  } = useQuery({
    queryKey: ['restaurantDetailOrder', restaurant_id],
    queryFn: () => {
      return getRestaurant(restaurant_id)
    },
    placeholderData: keepPreviousData
  })
  // console.log(data)
  const restaurantData = restaurant_data?.data.restaurant
  const {
    data: order_list_data,
    isSuccess: orderListSuccess,
    refetch: refetch2
  } = useQuery({
    queryKey: ['order_list', id],
    queryFn: () => {
      return getOrder(id)
    },
    placeholderData: keepPreviousData
  })
  const orderListData = order_list_data?.data.orderFoodList
  const orderFoodData = order_list_data?.data.orderFood
  const firstDate = new Date(orderFoodData?.updatedAt).getTime()
  const secondDate = Date.now()
  const diffTime = Math.abs(secondDate - firstDate)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  let diffHours, diffMinutes
  if (diffDays === 0) {
    diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      diffMinutes = Math.floor(diffTime / (1000 * 60))
    }
  }
  return (
    <>
      <div className='bg-white mb-[2rem]'>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
          </div>
        )}
        {restaurantSuccess && (
          <div className='py-[1.2rem] sm:px-[1.2rem] px-[0.5rem]'>
            <div className='flex justify-between items-center'>
              <Link to={`/restaurant/${restaurant_id}`}>
                <div className='flex items-center sm:gap-x-[1.2rem]'>
                  <CiShop
                    style={{
                      width: screen.width >= 640 ? '2vw' : '11vw',
                      height: screen.width >= 640 ? '2vw' : '11vw'
                    }}
                  />
                  <div className='sm:text-2xl text-xs'>{restaurantData.name}</div>
                </div>
              </Link>
              <div className='text-red-500 sm:text-2xl text-xs'>
                {
                  {
                    0: 'CHỜ XÁC NHẬN ĐẶT',
                    1: 'ĐÃ ĐẶT',
                    2: 'ĐÃ BỊ HUỶ',
                    3: 'ĐÃ HOÀN THÀNH',
                    4: 'ĐÃ BỊ HUỶ'
                  }[status]
                }
              </div>
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
            {status > 0 && (
              <div>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center mt-[0.2rem]'>
                    <FaMapMarkerAlt
                      style={{
                        color: 'red',
                        width: screen.width >= 640 ? '2vw' : '5vw',
                        height: screen.width >= 640 ? '2vw' : '5vw'
                      }}
                    />
                    <div
                      className='text-xs line-clamp-2 text-ellipsis overflow-hidden sm:overflow-visible 
                     sm:text-[1.1rem] text-slate-500'
                    >
                      {address}
                    </div>
                  </div>
                  <div className='italic text-slate-500'>
                    {diffDays == 0
                      ? diffHours == 0
                        ? diffMinutes + ' phút trước'
                        : diffHours + ' giờ trước'
                      : diffDays + ' ngày trước'}
                  </div>
                </div>
                <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
              </div>
            )}
            {orderListSuccess &&
              order_list_data &&
              orderListData.map((data) => {
                return (
                  <Food
                    key={data._id}
                    food_id={data.food_id}
                    quantity={data.quantity}
                    refetch={refetch}
                    refetch2={refetch2}
                    status={status}
                  />
                )
              })}
            <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
            <div>
              <div className='text-right mt-[1rem] flex items-center sm:gap-x-[3rem] gap-x-[1rem]'>
                {status !== 0 && (
                  <Link to={`/completed_order/${id}`}>
                    <button
                      className=' sm:px-[2rem] sm:py-[1rem] rounded-lg px-[0.6rem] py-[0.4rem]
                    bg-green-500 hover:bg-green-700'
                    >
                      {screen.width < 640 ? (
                        <FaWpforms style={{ color: 'white' }} />
                      ) : (
                        <div className='text-white text-[1.2rem]'>Xem chi tiết</div>
                      )}
                    </button>
                  </Link>
                )}
                <div className='mr-0 ml-auto sm:text-3xl text-xl text-emerald-600'>
                  <div className='flex sm:gap-x-3 items-center gap-x-6'>
                    <div>{displayNum(total_price) + 'đ'}</div>
                  </div>
                </div>

                {status === 0 ? (
                  <Link to={`/place_order/${id}`}>
                    <button
                      className=' px-[2rem] py-[1rem] sm:text-xl 
                    bg-orange-600 hover:bg-orange-900 text-white rounded-xl'
                    >
                      Xác nhận
                    </button>
                  </Link>
                ) : status === 1 ? (
                  <button
                    disabled
                    className=' px-[2rem] py-[1rem] sm:text-xl 
                    bg-gray-200 text-black text-opacity-50 rounded-xl'
                  >
                    Đã đặt
                  </button>
                ) : status === 2 || status === 4 ? (
                  <button
                    disabled
                    className=' px-[2rem] py-[1rem] sm:text-3xl 
                bg-gray-200 text-black text-opacity-50 rounded-xl'
                  >
                    Đã bị huỷ
                  </button>
                ) : (
                  <button
                    disabled
                    className=' px-[1rem] py-[1rem] sm:text-3xl 
            bg-gray-200 text-black text-opacity-50 text-sm rounded-xl'
                  >
                    Đã hoàn thành
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
