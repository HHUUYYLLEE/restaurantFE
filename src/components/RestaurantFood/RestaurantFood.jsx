import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFoodInRestaurant } from '../../api/food.api'
import { orderFood } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { FaMinusCircle } from 'react-icons/fa'
import Modal from 'react-modal'
import { Oval } from 'react-loader-spinner'

export default function RestaurantFood() {
  const { id } = useParams()
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
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
  const {
    handleSubmit: handleSubmit2,
    formState: { errors2 }
  } = useForm()
  const orderFoodMutation = useMutation({ mutationFn: (body) => orderFood(body) })
  const [inputState, setInputState] = useState(null)
  const [foodId, setFoodId] = useState('')
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
  const onSubmit2 = handleSubmit2((data) => {
    data.food_id = foodId
    data.quantity = 1
    console.log(data)

    orderFoodMutation.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
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
      <div className=''>
        <div className='grid sm:grid-cols-3 grid-cols-2 gap-x-2 pb-[2rem] sm:mt-0 mt-[1rem]'>
          {data &&
            foodData.map((food) => {
              return (
                <div
                  key={food._id}
                  className='flex sm:mx-[1rem] sm:h-[28vh] h-[8.3vh] 
                  sm:my-[1rem] mx-[0.3rem] my-[0.1rem] sm:w-[25vw] w-[38vw] relative gap-x-2
                  border rounded-md sm:border-4'
                >
                  <img
                    referrerPolicy='no-referrer'
                    src={food.image_url}
                    className='sm:w-[12vw] w-[18vw] sm:h-full h-[8vh]'
                  />
                  <div className=''>
                    <div>
                      <div
                        className='2xl:text-[1.1rem] sm:text-[1rem] sm:w-full 
                      sm:mt-[1rem] sm:h-[10.2vh] 2xl:h-[3rem] h-[3vh] sm:leading-[1.4rem] 
                      2xl:leading-[1.6rem] leading-[0.6rem] w-[15vw] text-[0.44rem] 
                      overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-3 mt-[0.2rem]'
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
                    <div className='flex 2xl:mt-[2rem] sm:gap-x-2 items-center'>
                      <form onSubmit={onSubmit2}>
                        <div className='flex items-center'>
                          <button
                            type='submit'
                            onClick={() => {
                              setInputState(1)
                              setFoodId(food._id)
                            }}
                          >
                            <BsFillPlusCircleFill
                              style={{
                                width: screen.width < 640 ? '3.3vw' : '1.6vw',
                                height: screen.width < 640 ? '3.3vw' : '1.6vw',
                                color: '#F97316'
                              }}
                            />
                          </button>
                        </div>
                      </form>
                      <form onSubmit={onSubmit} className='flex items-center'>
                        <input
                          type='number'
                          id={'quantity' + food._id}
                          name='quantity'
                          autoComplete='off'
                          {...register('quantity')}
                          onChange={(e) => setInputState(e.target.value)}
                          className={` priceInput focus:outline-[#f97416b4] sm:h-full
                   
                  placeholder:text-[#4F4F4F] sm:placeholder:text-sm placeholder:text-[0rem] 
                  sm:border-[0.2rem] sm:rounded-xl sm:py-[0.2rem] border-[0.1rem]
                font-inter-500 border-[#ff822e] rounded-md sm:text-sm text-[0.3rem] pl-[0.1rem] 
                sm:pl-[0.2rem]
                
                    w-[7vw] sm:w-[5vw] h-[3.3vw] 
                }`}
                        />
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        {orderFoodMutation.isPending && (
          <>
            <Modal
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 20
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  transform: 'translate(-50%, -50%)',
                  paddingLeft: '3vw',
                  paddingRight: '3vw',
                  paddingTop: '2vw',
                  paddingBottom: '4vw',
                  borderWidth: '0px',
                  borderRadius: '1rem'
                }
              }}
              isOpen={true}
            >
              <Oval
                height='150'
                width='150'
                color='rgb(249,115,22)'
                secondaryColor='rgba(249,115,22,0.5)'
                ariaLabel='tail-spin-loading'
                radius='5'
                visible={true}
                wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
              />
            </Modal>
          </>
        )}
      </div>
    )
}
