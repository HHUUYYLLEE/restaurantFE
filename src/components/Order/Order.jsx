import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUserOrders } from '../../api/order_food.api'
import { orderFood } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Checkbox from 'react-custom-checkbox'
import { FaCheckCircle } from 'react-icons/fa'
import OrderRestaurant from './OrderRestaurant/OrderRestaurant'
import ShoppingCartError from '../../../src/asset/img/broken_shopping_cart.png'
export default function Order() {
  const bottomBar = useRef()
  const [option, setOption] = useState(0)
  const options = ['Tất cả', 'Chưa đặt', 'Đã đặt', 'Đã huỷ', 'Đã hoàn thành']
  const { data, isSuccess, isError } = useQuery({
    queryKey: ['all_order_food'],
    queryFn: () => {
      return getAllUserOrders()
    },
    placeholderData: keepPreviousData,
    retry: false
  })
  console.log(data)
  const orderData = data?.data.orderFood
  // window.addEventListener('scroll', (event) => {
  //   if (window.scrollY > 500) {
  //     bottomBar.current.style.height = 0
  //   } else bottomBar.current.style.visibility = 'hidden'
  // })

  if (isSuccess)
    return (
      <>
        <div className='w-full'>
          <div className=' w-full grid grid-cols-5 mb-[2rem]'>
            {options.map((data, id) => {
              return (
                <div
                  key={id}
                  className={`${
                    option === id ? ' bg-orange-500 text-white ' : ' bg-white '
                  } flex justify-center 
                  items-center text-[0.7rem] h-[7vh] 2x:text-2xl sm:text-xl text-center sm:h-[10vh] cursor-pointer`}
                  onClick={() => setOption(id)}
                >
                  {data}
                </div>
              )
            })}
          </div>
          {data &&
            orderData.map((data, id) => {
              if (data.status + 1 === option || option === 0)
                return (
                  <OrderRestaurant
                    key={id}
                    id={data._id}
                    restaurant_id={data.restaurant_id}
                    status={data.status}
                    total_price={data.total_price}
                  />
                )
            })}
        </div>
        <div
          className='fixed bottom-0 z-[2] w-full sm:h-[20vh] h-[10vh] left-0 bg-white overflow-hidden
                
        '
          ref={bottomBar}
        >
          <div
            className='flex items-center 
            justify-between h-full 2xl:mx-[8rem] 
            sm:mx-[5rem] mx-[1rem] gap-x-4'
          >
            <div className='flex items-center gap-x-4 sm:gap-x-8 justify-between'>
              <Checkbox
                icon={
                  <FaCheckCircle
                    color='#F97316'
                    style={{
                      width: screen.width < 640 ? 20 : 40,
                      height: screen.width < 640 ? 20 : 40
                    }}
                  />
                }
                name='my-input'
                checked={true}
                onChange={(value, event) => {}}
                borderColor='#F97316'
                borderRadius={9999}
                size={screen.width < 640 ? 20 : 40}
              />
              <button
                className='sm:px-[2rem] sm:py-[0.5rem] 2xl:text-3xl sm:text-2xl
                        disabled:bg-gray-200 disabled:text-black 
                        disabled:text-opacity-50 bg-red-600 
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.5rem] py-[0.5rem]'
              >
                Xoá
              </button>
            </div>
            <div className='flex items-center justify-end gap-x-4'>
              {screen.width >= 640 && (
                <div className='text-orange-500 text-xl sm:text-3xl'>Tổng thanh toán</div>
              )}
              <div
                className={`text-emerald-700 text-xl sm:text-4xl 
            // ${orderFood?.total_price >= Math.pow(10, 9) ? ' text-lg ' : ' text-xl'} 
            `}
              >
                {/* {displayNum(orderFood?.total_price) + 'đ'} */}
              </div>
              {screen.width >= 640 && (
                <Link to='/order_food'>
                  <button
                    className='sm:px-[2rem] sm:py-[0.5rem] 2xl:text-3xl sm:text-2xl
                         bg-white 
                        hover:bg-orange-300 text-[0.9rem] text-orange-500 rounded-xl
                        px-[0.9rem] py-[0.8rem]'
                  >
                    Quay lại giỏ hàng
                  </button>
                </Link>
              )}

              <button
                className='sm:px-[2rem] sm:py-[0.5rem]  2xl:text-3xl sm:text-2xl
                        disabled:bg-gray-200 disabled:text-black 
                        disabled:text-opacity-50 bg-orange-600 
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.9rem] py-[0.8rem]'
              >
                Đặt đơn
              </button>
            </div>
          </div>
        </div>
      </>
    )
  if (isError)
    return (
      <div className='w-full mt-[5rem]'>
        <div className='flex justify-center'>
          <img src={ShoppingCartError} />
        </div>
        <div className='flex justify-center text-sm sm:text-xl text-orange-500'>
          Có vẻ như bạn chưa thêm gì vào giỏ hàng cả...
        </div>
      </div>
    )
}
