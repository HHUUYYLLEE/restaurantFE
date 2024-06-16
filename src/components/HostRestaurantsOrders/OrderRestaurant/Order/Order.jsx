import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { displayNum, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import Food from './Food/Food'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FaWpforms } from 'react-icons/fa6'
import { getOrderHost, updateOrderHost } from '../../../../api/order_food.api'
import { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useMutation } from '@tanstack/react-query'
export default function Order({ order, refetch }) {
  const {
    data,
    isSuccess,
    refetch: refetch2
  } = useQuery({
    queryKey: ['order_list_host', order._id],
    queryFn: () => {
      return getOrderHost(order._id)
    },
    placeholderData: keepPreviousData
  })
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const [completeOrderModal, setCompleteOrderModal] = useState(false)
  const [cancelOrderModal, setCancelOrderModal] = useState(false)
  const updateOrderHostMutation = useMutation({
    mutationFn: (body) => updateOrderHost(body)
  })

  const firstDate = new Date(data?.data.orderFood.updatedAt).getTime()
  const secondDate = Date.now()
  const diffTime = Math.abs(secondDate - firstDate)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  let diffHours, diffMinutes
  if (diffDays === 0) {
    diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      diffMinutes = Math.floor(diffTime / (1000 * 60))
    }
  }
  const submitUpdateOrderHost = (status) => {
    const data = {}
    data.order_food_id = order._id
    data.status = status
    updateOrderHostMutation.mutate(data, {
      onSuccess: () => {
        refetch()
        refetch2()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  }
  return (
    <>
      <div className='flex justify-between items-center'>
        <div>
          <div className='flex justify-center w-[30vw] sm:w-[15vw] sm:text-[1.3rem]'>
            {order.username}
          </div>
          <div className='flex items-center sm:justify-center'>
            <FaPhoneAlt
              style={{
                color: 'green',
                width: screen.width >= 640 ? '1.5vw' : '5vw',
                height: screen.width >= 640 ? '1.5vw' : '5vw'
              }}
            />
            <div className='text-green-500 sm:text-[1.3rem]'>{order.phone_number}</div>
          </div>
        </div>
        <div className='flex items-center'>
          <FaMapMarkerAlt
            style={{
              color: 'red',
              width: screen.width >= 640 ? '2vw' : '5vw',
              height: screen.width >= 640 ? '2vw' : '5vw'
            }}
          />
          <div
            className='text-xs line-clamp-2 text-ellipsis overflow-hidden sm:overflow-visible 
            w-[41vw]
          sm:max-w-[41vw] sm:text-[1.1rem] text-slate-500'
          >
            {order.address}
          </div>
          <Link to={`/host_order_detail/${order._id}`}>
            <button
              className='bg-green-500 hover:bg-orange-700 rounded-lg
               px-[0.5rem] py-[0.3rem]
              sm:px-[0.8rem] sm:py-[0.5rem]'
            >
              {screen.width < 640 ? (
                <FaWpforms style={{ color: 'white' }} />
              ) : (
                <div className='text-white text-[1.2rem]'>Xem chi tiết</div>
              )}
            </button>
          </Link>
        </div>
      </div>
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
      {isSuccess &&
        data &&
        data?.data.orderFoodList.map((data, id) => {
          return (
            <div key={id}>
              <Food food_id={data.food_id} quantity={data.quantity} />
            </div>
          )
        })}
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
      <div>
        <div className='mt-[1rem] flex items-center justify-between sm:gap-x-[3rem] gap-x-[1rem]'>
          <div className='italic text-slate-500'>
            {diffDays == 0
              ? diffHours == 0
                ? diffMinutes + ' phút trước'
                : diffHours + ' giờ trước'
              : diffDays + ' ngày trước'}
          </div>
          <div className='text-right flex items-center justify-between sm:gap-x-[3rem] gap-x-[1rem]'>
            <div className='mr-0 sm:text-3xl text-xl text-emerald-600'>
              <div className='flex sm:gap-x-3 items-center gap-x-6'>
                <div>{displayNum(order.total_price) + 'đ'}</div>
              </div>
            </div>

            {order.status === 1 ? (
              <>
                <button
                  className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
          bg-orange-500 hover:bg-green-500 sm:rounded-xl'
                  onClick={() => setCompleteOrderModal(true)}
                >
                  Hoàn thành
                </button>
                <button
                  className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
        bg-red-500 hover:bg-red-700 sm:rounded-xl'
                  onClick={() => setCancelOrderModal(true)}
                >
                  Huỷ
                </button>
              </>
            ) : order.status === 2 ? (
              <button
                disabled
                className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg 
      bg-gray-200 text-black text-opacity-50 sm:rounded-xl'
              >
                Đã bị huỷ
              </button>
            ) : (
              <button
                disabled
                className='sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg
  bg-gray-200 text-black text-opacity-50 text-sm sm:rounded-xl'
              >
                Đã hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 20
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={completeOrderModal}
        onRequestClose={() => setCompleteOrderModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Cập nhật hoàn thành đơn hàng?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitUpdateOrderHost(3)
              setCompleteOrderModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setCompleteOrderModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Huỷ
          </button>
        </div>
      </Modal>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 20
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={cancelOrderModal}
        onRequestClose={() => setCancelOrderModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Huỷ đơn hàng?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12'>
          <button
            onClick={() => {
              submitUpdateOrderHost(2)
              setCancelOrderModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setCancelOrderModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Không
          </button>
        </div>
      </Modal>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 27
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
        isOpen={updateOrderHostMutation.isPending}
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
  )
}
