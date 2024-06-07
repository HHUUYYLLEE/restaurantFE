import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFood } from '../../../../api/food.api'
import { orderFood } from '../../../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { toast } from 'react-toastify'
import { CiShop } from 'react-icons/ci'
import { HiOutlinePencilSquare } from 'react-icons/hi2'

export default function Food({ food_id, quantity, refetch, status }) {
  const [editQuantity, setEditQuantity] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(orderInputSchema)
  })
  const updateOrderFood = useMutation({
    mutationFn: (body) => orderFood(body)
  })
  const { data, isSuccess } = useQuery({
    queryKey: ['foodDetail', food_id],
    queryFn: () => {
      return getFood(food_id)
    },
    placeholderData: keepPreviousData
  })
  const onSubmit = handleSubmit((data) => {
    data.food_id = food_id
    // console.log(data)
    updateOrderFood.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
        setEditQuantity(false)
        refetch()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
          // if (formError) {
          //   setError('username', {
          //     message: formError.username?.msg,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })
  // console.log(data)
  const foodData = data?.data.food
  if (isSuccess) {
    return (
      <>
        <div className='flex justify-between sm:h-[25vh] py-[0.2rem]'>
          <div className='flex items-center gap-x-[0.4rem] w-[100vw] sm:w-[80vw]'>
            <img
              src={foodData.image_url}
              className='sm:w-[9vw] sm:h-[9vw] w-[14vw] h-[14vw]'
              referrerPolicy='no-referrer'
            ></img>
            <div>
              <div className='sm:text-xl sm:w-[60vw] text-sm line-clamp-1 text-ellipsis overlow-hidden'>
                {foodData.name}
              </div>
              <div className='mt-[0.2rem]'>
                {editQuantity ? (
                  <form onSubmit={onSubmit}>
                    <div className='flex gap-x-[0.6rem] items-center'>
                      <input
                        type='number'
                        id='quantity'
                        name='quantity'
                        defaultValue={quantity}
                        autoComplete='off'
                        {...register('quantity')}
                        className='sm:w-[6vw] w-[10vw] text-right priceInput focus:outline-[#8AC0FF] 
                        placeholder:text-[#4F4F4F] 
                         border font-inter-500 border-[#E6E6E6] text-xs sm:text-lg px-[0.3rem]'
                      />
                      <button type='submit' className='hover:bg-slate-200'>
                        <IoCheckmarkCircleSharp
                          style={{
                            width: screen.width >= 640 ? '1.9vw' : '4vw',
                            height: screen.width >= 640 ? '1.9vw' : '4vw',
                            color: 'green'
                          }}
                        />
                      </button>
                      <button
                        className='hover:bg-slate-200'
                        onClick={() => {
                          reset()
                          setEditQuantity(false)
                        }}
                      >
                        <FaRegTimesCircle
                          style={{
                            width: screen.width >= 640 ? '1.6vw' : '3.7vw',
                            height: screen.width >= 640 ? '1.6vw' : '3.7vw',
                            color: 'red'
                          }}
                        />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className='flex items-center sm:gap-x-[0.4rem] gap-x-[0.2rem]'>
                    <div className='text-green-700 sm:text-lg'>{'x' + quantity}</div>
                    {status === 0 && (
                      <div className='cursor-pointer' onClick={() => setEditQuantity(true)}>
                        <HiOutlinePencilSquare
                          style={{
                            width: screen.width >= 640 ? '1.6vw' : '3.7vw',
                            height: screen.width >= 640 ? '1.6vw' : '3.7vw'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
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
