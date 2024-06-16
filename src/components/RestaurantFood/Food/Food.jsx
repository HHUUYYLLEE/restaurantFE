import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { orderFood } from '../../../api/order_food.api'
import { AppContext } from '../../../contexts/app.context'
import { orderInputSchema } from '../../../utils/rules'
import { displayNum, isAxiosUnprocessableEntityError } from '../../../utils/utils'

export default function Food({ food }) {
  const [inputState, setInputState] = useState(0)
  const { isAuthenticated, setModalLogin } = useContext(AppContext)
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const { register, handleSubmit, reset } = useForm({
    mode: 'all',
    resolver: yupResolver(orderInputSchema)
  })
  const { handleSubmit: handleSubmit2 } = useForm()

  const orderFoodMutation = useMutation({ mutationFn: (body) => orderFood(body) })

  const onSubmit = handleSubmit((data) => {
    if (!isAuthenticated) {
      setModalLogin(true)
      return
    }
    data.food_id = food._id
    data.quantity = inputState
    console.log(data)

    orderFoodMutation.mutate(data, {
      onSuccess: () => {
        reset()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  })
  const onSubmit2 = handleSubmit2((data) => {
    if (!isAuthenticated) {
      setModalLogin(true)
      return
    }
    data.food_id = food._id
    data.quantity = 1
    console.log(data)

    orderFoodMutation.mutate(data, {
      onSuccess: () => {
        reset()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  })

  return (
    <div
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
              <button type='submit' onClick={() => setInputState(1)}>
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
              onInput={(e) => setInputState(e.target.value)}
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
        isOpen={orderFoodMutation.isPending}
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
    </div>
  )
}
