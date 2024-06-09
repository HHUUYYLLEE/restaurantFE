import { displayNum, isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { Link } from 'react-router-dom'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { FaMinusCircle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { orderFood } from '../../../api/order_food.api'

export default function Food({ displayType, food }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const {
    handleSubmit: handleSubmit2,
    formState: { errors2 }
  } = useForm()

  const orderFoodMutation = useMutation({ mutationFn: (body) => orderFood(body) })

  const [inputState, setInputState] = useState(0)

  const onSubmit = handleSubmit((data) => {
    data.food_id = food._id
    data.quantity = inputState
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
  const onSubmit2 = handleSubmit2((data) => {
    data.food_id = food._id
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

  return (
    <>
      <div className={displayType === 0 ? ' flex w-full ' : ' w-[20vw] sm:w-[16.3vw]'}>
        <Link to={`/restaurant/${food.restaurant_id}`}>
          <img
            src={food.image_url}
            alt=''
            className={`h-[18.7vw] sm:h-[26vh] cursor-pointer
            ${displayType === 1 ? ' w-full ' : ' sm:w-[21.6vw] w-[29.5vw] '}`}
            referrerPolicy='no-referrer'
          />
        </Link>
        <div
          className={`bg-white cursor-pointer w-full h-[9.35vh] 
          ${displayType === 0 ? ' sm:h-[26vh] ' : ' sm:h-[18vh] '}
        `}
        >
          <Link to={`/restaurant/${food.restaurant_id}`}>
            <div
              className={` sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis  sm:h-[7vh] sm:leading-5 text-[0.5rem] overflow-hidden
            ${
              displayType === 0
                ? ' h-[3.5vh] sm:text-[1.2rem] sm:mt-[1rem] '
                : ' sm:text-[0.9rem] sm:mt-[0.3rem] mt-[0.2rem]'
            }
           `}
            >
              {food.name}
            </div>
          </Link>
          <div
            className={`mx-[0.2rem] mt-[0.2rem] flex justify-between items-center
          ${displayType === 0 ? 'sm:ml-[0.45rem]' : ''}`}
          >
            {displayType === 0 && (
              <div
                className={`text-[0.34rem] italic text-yellow-600 
              line-clamp-3 text-ellipsis w-[20vw] overflow-hidden
              ${displayType === 0 ? ' sm:text-[1rem] sm:w-[30vw] sm:line-clamp-3' : ''}`}
              >
                {food.desc}
              </div>
            )}
            <div
              className={`${
                displayType === 0 ? ' sm:grid sm:gap-y-3 ' : ' mt-[0.3rem] sm:mt-0  sm:w-full '
              }`}
            >
              <div
                className={`
             text-orange-600 text-[0.7rem] h-[0.8rem] 
            sm:h-[2.1rem] 2xl:h-[2.2rem] flex 
            ${
              displayType === 0
                ? ' justify-end mx-[0.4rem] sm:text-[1.9rem] '
                : ' sm:text-[1.5rem] justify-center mx-[0.2rem] '
            }
           `}
              >
                {food.price < Math.pow(10, 7) ? displayNum(food.price) + 'đ' : 'Trên 10tr đ'}
              </div>
              <div>
                <div
                  className={`flex items-center  gap-x-[0.2rem]
            ${displayType === 0 ? ' w-[20vw] justify-end ' : ' justify-center '}`}
                >
                  <form onSubmit={onSubmit2} key={food._id}>
                    <button type='submit' onClick={() => setInputState(1)}>
                      <BsFillPlusCircleFill
                        style={{
                          width: screen.width < 640 ? '3.3vw' : '1.6vw',
                          height: screen.width < 640 ? '3.3vw' : '1.6vw',
                          color: '#F97316'
                        }}
                      />
                    </button>
                  </form>
                  <form onSubmit={onSubmit} className='flex items-center'>
                    <input
                      type='text'
                      id={'quantity' + food._id}
                      name='quantity'
                      autoComplete='off'
                      {...register('quantity')}
                      onChange={(e) => setInputState(e.target.value)}
                      className={` priceInput focus:outline-[#f97416b4] sm:h-full
                   h-[3.3vw]
                  placeholder:text-[#4F4F4F] sm:placeholder:text-sm placeholder:text-[0rem] 
                  sm:border-[0.2rem] sm:rounded-xl sm:py-[0.2rem] border-[0.1rem]
                font-inter-500 border-[#ff822e] rounded-md sm:text-sm text-[0.3rem] pl-[0.15rem] 
                sm:pl-[0.3rem]
                ${
                  displayType === 0
                    ? ' w-[15vw] sm:w-[12vw] '
                    : ' w-[9vw] sm:w-[8vw] h-[3.3vw] sm:h-[1.6vw]'
                }`}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
