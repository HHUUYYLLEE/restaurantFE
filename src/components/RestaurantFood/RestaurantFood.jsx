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
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
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
          <div className='sm:text-4xl'>Các món ăn</div>
        </div>
        <hr className='h-[0.1rem] border-none bg-gray-400' />
        <div className='grid sm:grid-cols-3 grid-cols-2 gap-x-2 pb-[2rem] sm:mt-0 mt-[1rem]'>
          {data &&
            foodData.map((food) => {
              return (
                <div
                  key={food._id}
                  className='flex sm:mx-[1rem] sm:h-[28vh] h-[9vh] 
                  sm:my-[1rem] mx-[0.3rem] my-[0.1rem] sm:w-[25vw] w-[38vw] relative gap-x-2
                  border rounded-md sm:border-4'
                >
                  <img
                    src={food.image_url}
                    referrerPolicy='no-referrer'
                    className='sm:w-[12vw] w-[18vw] sm:h-full h-[8vh]'
                  />
                  <div className='frelative'>
                    <form onSubmit={onSubmit}>
                      <div className='absolute cursor-pointer bottom-[0.2rem] right-[0.2rem] sm:bottom-[0.6rem] sm:right-[0.5rem]'>
                        {inputState === food._id ? (
                          <div className='flex sm:gap-x-[1.1rem] gap-x-[0.45rem] items-center left-0'>
                            <input
                              type='number'
                              id='quantity'
                              name='quantity'
                              placeholder='Số lượng'
                              autoComplete='off'
                              {...register('quantity')}
                              className='sm:w-[5vw] w-[6vw] priceInput focus:outline-[#8AC0FF] sm:h-full h-[1.2vh]
                            placeholder:text-[#4F4F4F] sm:placeholder:text-sm placeholder:text-[0rem] border 
                            font-inter-500 border-[#E6E6E6] sm:text-lg text-[0.3rem] pl-[0.15rem] sm:pl-[0.3rem]'
                            />
                            <button type='submit' className='hover:bg-slate-200'>
                              <IoCheckmarkCircleSharp
                                style={{
                                  width: screen.width >= 640 ? '1.6vw' : '3.4vw',
                                  height: screen.width >= 640 ? '1.6vw' : '3.4vw',
                                  color: 'green'
                                }}
                              />
                            </button>
                            <div className='hover:bg-slate-200 cursor-pointer'>
                              <FaRegTimesCircle
                                style={{
                                  width: screen.width >= 640 ? '1.4vw' : '3.2vw',
                                  height: screen.width >= 640 ? '1.4vw' : '3.2vw',
                                  color: 'red'
                                }}
                                onClick={() => {
                                  reset()
                                  setInputState(null)
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='bg-red-700  sm:p-[0.2rem] p-[0.1rem]'>
                            <BsCart4
                              onClick={() => setInputState(food._id)}
                              style={{
                                width: screen.width >= 640 ? '1.5vw' : '3.2vw',
                                height: screen.width >= 640 ? '1.5vw' : '3.2vw',
                                color: 'white'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </form>
                    <div>
                      <div
                        className='2xl:text-[1.1rem] sm:text-[1rem] sm:w-full 
                      sm:mt-[1rem] sm:h-[10.2vh] 2xl:h-[3rem] h-[4vh] sm:leading-[1.4rem] 
                      2xl:leading-[1.6rem] leading-[0.6rem] w-[15vw] text-[0.44rem] 
                      overflow-hidden text-ellipsis line-clamp-3 mt-[0.2rem]'
                      >
                        {food.name}
                      </div>
                      <div
                        className='sm:text-2xl 2xl:text-3xl sm:mt-[1rem] text-yellow-600
                      text-[0.6rem] font-poppins-400'
                      >
                        {displayNum(food.price)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
}
