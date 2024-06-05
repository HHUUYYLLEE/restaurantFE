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

export default function Order() {
  const { data, isSuccess } = useQuery({
    queryKey: ['all_order_food'],
    queryFn: () => {
      return getAllUserOrders()
    },
    placeholderData: keepPreviousData
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
}
