import { Link, useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../../api/restaurants.api'
import { getOrder } from '../../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import { CiShop } from 'react-icons/ci'
import Food from './Food/Food'

export default function OrderRestaurant({ id, restaurant_id, status, total_price }) {
  const { data: restaurant_data, isSuccess: restaurantSuccess } = useQuery({
    queryKey: ['restaurantDetail', restaurant_id],
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
    refetch
  } = useQuery({
    queryKey: ['order_list', id],
    queryFn: () => {
      return getOrder(id)
    },
    placeholderData: keepPreviousData
  })
  const orderListData = order_list_data?.data.orderFoodList
  if (restaurantSuccess && orderListSuccess)
    return (
      <>
        <div className='bg-white mb-[2rem]'>
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
                {status === 0 ? 'CHỜ XÁC NHẬN ĐẶT' : 'ĐÃ ĐẶT'}
              </div>
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
            {order_list_data &&
              orderListData.map((data) => {
                return (
                  <Food
                    key={data._id}
                    food_id={data.food_id}
                    quantity={data.quantity}
                    refetch={refetch}
                    status={status}
                  />
                )
              })}
            <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
            <div>
              <div className='text-right mt-[1rem] flex items-center sm:gap-x-[3rem] gap-x-[1rem]'>
                <div className='mr-0 ml-auto sm:text-3xl text-xltext-emerald-600'>
                  <div className='flex sm:gap-x-3 items-center gap-x-6'>
                    <div>{displayNum(total_price) + 'đ'}</div>
                  </div>
                </div>

                {status === 0 ? (
                  <Link to={`/place_order/${id}`}>
                    <button
                      className=' px-[2rem] py-[1rem] sm:text-3xl 
                    bg-orange-600 hover:bg-orange-900 text-white rounded-xl'
                    >
                      Đặt đơn
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className=' px-[2rem] py-[1rem] text-3xl bg-gray-200 text-black text-opacity-50 rounded-xl'
                  >
                    Đã đặt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
