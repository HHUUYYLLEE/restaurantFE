import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUserOrders } from '../../api/order_food.api'
import { orderFood } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'
import OrderRestaurant from './OrderRestaurant/OrderRestaurant'
import ShoppingCartError from '../../../src/asset/img/broken_shopping_cart.png'
export default function Order() {
  const { data, isSuccess, isError } = useQuery({
    queryKey: ['all_order_food'],
    queryFn: () => {
      return getAllUserOrders()
    },
    placeholderData: keepPreviousData,
    retry: false
  })
  console.log(data)
  const orderData = data?.data.orderFood
  if (isSuccess)
    return (
      <>
        <div className='w-full mt-[5rem]'>
          {data &&
            orderData.map((data) => {
              return (
                <OrderRestaurant
                  key={data._id}
                  id={data._id}
                  restaurant_id={data.restaurant_id}
                  status={data.status}
                  total_price={data.total_price}
                />
              )
            })}
        </div>
      </>
    )
  if (isError)
    return (
      <div className='w-full mt-[5rem]'>
        <div className='flex justify-center'>
          <img src={ShoppingCartError} />
        </div>
        <div className='flex justify-center text-sm sm:text-xl text-orange-500'>
          Có vẻ như bạn chưa thêm gì vào giỏ hàng cả...
        </div>
      </div>
    )
}
