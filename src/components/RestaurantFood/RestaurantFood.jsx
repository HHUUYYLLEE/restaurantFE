import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFoodInRestaurant } from '../../api/food.api'
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

export default function RestaurantFood() {
  const { id } = useParams()
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
  const orderFoodMutation = useMutation({ mutationFn: (body) => orderFood(body) })
  const [inputState, setInputState] = useState(null)
  const { data, status, isLoading, isSuccess } = useQuery({
    queryKey: ['all_food_in_restaurant', id],
    queryFn: () => {
      return getAllFoodInRestaurant(id)
    },
    placeholderData: keepPreviousData
  })
  const onSubmit = handleSubmit((data) => {
    data.food_id = inputState
    // console.log(data)
    orderFoodMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
        setInputState(null)
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
  const foodData = data?.data.allFood
  if (isSuccess)
    return (
      <div className='bg-white'>
        <div className='flex ml-[1rem] py-[0.3rem] gap-x-[3rem]'>
          <div className='text-4xl'>Các món ăn</div>
        </div>
        <hr className='h-[0.1rem] border-none bg-gray-400' />
        <div className='grid grid-cols-3 gap-x-2 pb-[2rem] '>
          {data &&
            foodData.map((food) => {
              return (
                <div key={food._id} className='flex mx-[1rem] my-[1rem] relative gap-x-2'>
                  <form onSubmit={onSubmit}>
                    <div className='absolute cursor-pointer right-0 bottom-0'>
                      {inputState === food._id ? (
                        <div className='flex gap-x-[0.2rem] items-center'>
                          <input
                            type='number'
                            id='quantity'
                            name='quantity'
                            placeholder='Số lượng'
                            autoComplete='off'
                            {...register('quantity')}
                            className='w-[5vw] priceInput focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:text-sm border font-inter-500 border-[#E6E6E6] text-lg pl-[0.3rem]'
                          />
                          <button type='submit' className='hover:bg-slate-200'>
                            <IoCheckmarkCircleSharp style={{ width: '1.6vw', height: '1.6vw', color: 'green' }} />
                          </button>
                          <div className='hover:bg-slate-200 cursor-pointer'>
                            <FaRegTimesCircle
                              style={{ width: '1.3vw', height: '1.3vw', color: 'red' }}
                              onClick={() => {
                                reset()
                                setInputState(null)
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='bg-red-700  p-[0.2rem]'>
                          <BsCart4
                            onClick={() => setInputState(food._id)}
                            style={{ width: '1.5vw', height: '1.5vw', color: 'white' }}
                          />
                        </div>
                      )}
                    </div>
                  </form>
                  <img src={food.image_url} referrerPolicy='no-referrer' />
                  <div>
                    <div className='text-xl mt-[1rem] h-[4.9rem] text-ellipsis'>{food.name}</div>
                    <div className='text-3xl mt-[1rem] text-yellow-600 font-poppins-400'>{displayNum(food.price)}</div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
}
