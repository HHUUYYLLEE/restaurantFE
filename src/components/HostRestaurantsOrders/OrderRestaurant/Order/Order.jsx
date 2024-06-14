import { getOrderHost } from '../../../../api/order_food.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { displayNum } from '../../../../utils/utils'
import Food from './Food/Food'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FaWpforms } from 'react-icons/fa6'

export default function Order({ order }) {
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['order_list_host', order._id],
    queryFn: () => {
      return getOrderHost(order._id)
    },
    placeholderData: keepPreviousData
  })
  //   console.log(order._id)
  console.log(data)
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
        <div className='text-right mt-[1rem] flex items-center sm:gap-x-[3rem] gap-x-[1rem]'>
          <div className='mr-0 ml-auto sm:text-3xl text-xl text-emerald-600'>
            <div className='flex sm:gap-x-3 items-center gap-x-6'>
              <div>{displayNum(order.total_price) + 'đ'}</div>
            </div>
          </div>

          {order.status === 1 ? (
            <>
              <button
                className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
          bg-orange-500 hover:bg-green-500 sm:rounded-xl'
              >
                Hoàn thành
              </button>
              <button
                className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
        bg-red-500 hover:bg-red-700 sm:rounded-xl'
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
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
    </>
  )
}
