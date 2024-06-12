import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFood } from '../../../../api/food.api'
import { orderFood } from '../../../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { CiShop } from 'react-icons/ci'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { FaMinusCircle } from 'react-icons/fa'
import { Oval } from 'react-loader-spinner'

export default function Food({ food_id, quantity, refetch, status }) {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const [inputValue, setInputValue] = useState(quantity)
  const {
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'all'
  })
  const {
    handleSubmit: handleSubmit2,
    formState: { errors2 }
  } = useForm()
  const {
    handleSubmit: handleSubmit3,
    formState: { errors3 }
  } = useForm()
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
    data.quantity = inputValue - quantity
    console.log(data)
    updateOrderFood.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
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
  const onSubmit2 = handleSubmit2((data) => {
    data.food_id = food_id
    data.quantity = 1
    console.log(data)

    updateOrderFood.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
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
  const onSubmit3 = handleSubmit3((data) => {
    data.food_id = food_id
    data.quantity = -1
    console.log(data)

    updateOrderFood.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã cập nhật giỏ hàng!') //。(20)
        // window.location.reload()
        reset()
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
              referrerPolicy='no-referrer'
              src={foodData.image_url}
              className='sm:w-[9vw] sm:h-[9vw] w-[14vw] h-[14vw]'
            ></img>
            <div>
              <div className='sm:text-xl sm:w-[60vw] text-sm line-clamp-1 text-ellipsis overlow-hidden'>
                {foodData.name}
              </div>
              {status === 0 ? (
                <div className='flex 2xl:mt-[2rem] sm:gap-x-2 items-center'>
                  <form onSubmit={onSubmit2}>
                    <div className='flex items-center'>
                      <button type='submit'>
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
                      id={'quantity' + food_id}
                      name='quantity'
                      defaultValue={inputValue}
                      onInput={(e) => {
                        setInputValue(e.target.value)
                      }}
                      className={` priceInput focus:outline-[#f97416b4] sm:h-full
                   
                  placeholder:text-[#4F4F4F] sm:placeholder:text-sm placeholder:text-[0rem] 
                  sm:border-[0.2rem] sm:rounded-xl sm:py-[0.2rem] border-[0.1rem]
                font-inter-500 border-[#ff822e] rounded-md sm:text-sm text-[0.3rem] pl-[0.1rem] 
                sm:pl-[0.2rem]
                
                    w-[7vw] sm:w-[5vw] h-[3.3vw] 
                }`}
                    />
                  </form>
                  <form onSubmit={onSubmit3}>
                    <div className='flex items-center'>
                      <button type='submit'>
                        <FaMinusCircle
                          style={{
                            width: screen.width < 640 ? '3.3vw' : '1.6vw',
                            height: screen.width < 640 ? '3.3vw' : '1.6vw',
                            color: '#F97316'
                          }}
                        />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className='text-green-500 text-xs sm:text-[1.3rem] sm:mt-[1rem]'>
                  {'x' + quantity}
                </div>
              )}
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
        {updateOrderFood.isPending && (
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
      </>
    )
  }
}
