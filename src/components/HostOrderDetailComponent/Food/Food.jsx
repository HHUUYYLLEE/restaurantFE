import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFood } from '../../../api/food.api'
import { orderFood } from '../../../api/order_food.api'
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
import { HiOutlinePencilSquare } from 'react-icons/hi2'

export default function Food({ food_id, quantity }) {
  const { data, isSuccess } = useQuery({
    queryKey: ['foodDetail', food_id],
    queryFn: () => {
      return getFood(food_id)
    },
    placeholderData: keepPreviousData
  })
  const foodData = data?.data.food
  if (isSuccess) {
    return (
      <>
        <div className='flex justify-between sm:h-[25vh] py-[0.2rem]'>
          <div className='flex items-center gap-x-[0.4rem] w-[100vw] sm:w-[80vw]'>
            <img
              referrerPolicy='no-referrer'
              src={foodData.image_url}
              className='sm:w-[9vw] sm:h-[9vw] w-[14vw] h-[14vw]'
            ></img>
            <div>
              <div className='sm:text-xl sm:w-[60vw] text-sm line-clamp-1 text-ellipsis overlow-hidden'>
                {foodData.name}
              </div>
              <div className='mt-[0.2rem]'>
                <div className='flex items-center sm:gap-x-[0.4rem] gap-x-[0.2rem]'>
                  <div className='text-green-700 sm:text-lg'>{'x' + quantity}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='flex items-center justify-between sm:text-right   w-[29vw] 
           text-orange-400 sm:text-4xl'
          >
            <div></div>
            {displayNum(foodData.price) + 'đ'}
          </div>
        </div>
      </>
    )
  }
}
