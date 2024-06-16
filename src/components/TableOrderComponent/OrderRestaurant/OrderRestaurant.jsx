import { Link } from 'react-router-dom'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../../api/restaurants.api'
import { cancelOrderTable } from '../../../api/order_table.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import spinningload from '../../../asset/img/spinning_load.gif'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt, FaWpforms } from 'react-icons/fa'
import { MdOutlineTableRestaurant } from 'react-icons/md'
import { CiShop } from 'react-icons/ci'
import { useState } from 'react'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { isAxiosUnprocessableEntityError, VNDate } from '../../../utils/utils'

export default function OrderRestaurant({
  id,
  restaurant_id,
  table_chair,
  status,
  date,
  updatedAt
}) {
  const [cancelOrderTableModal, setCancelOrderTableModal] = useState(false)
  const {
    data: restaurant_data,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['restaurantDetailOrder', restaurant_id],
    queryFn: () => {
      return getRestaurant(restaurant_id)
    },
    placeholderData: keepPreviousData
  })
  const restaurantData = restaurant_data?.data.restaurant
  const cancelOrderTableMutation = useMutation({ mutationFn: (body) => cancelOrderTable(body) })
  const submitCancelOrderTable = () => {
    let data = {}
    data.order_table_id = id
    cancelOrderTableMutation.mutate(data, {
      onSuccess: () => {
        window.location.reload()
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
  const firstDate = new Date(updatedAt).getTime()
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
  return (
    <>
      <div className='bg-white mb-[2rem]'>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
          </div>
        )}

        {isSuccess && (
          <div className='py-[1.2rem] sm:px-[1.2rem] px-[0.5rem]'>
            <div className='flex justify-between items-center'>
              <Link to={`/restaurant/${restaurant_id}`}>
                <div className='flex items-center sm:gap-x-[1.2rem]'>
                  <CiShop
                    style={{
                      width: screen.width >= 640 ? '2vw' : '11vw',
                      height: screen.width >= 640 ? '2vw' : '11vw'
                    }}
                  />
                  <div className='sm:text-2xl text-xs'>{restaurantData.name}</div>
                </div>
              </Link>
              <div className='text-red-500 sm:text-2xl text-xs'>
                {
                  {
                    1: 'ĐÃ ĐẶT / CHỜ XÁC NHẬN',
                    2: 'ĐÃ BỊ HUỶ',
                    3: 'ĐÃ CHẤP NHẬN'
                  }[status]
                }
              </div>
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />

            <div>
              <div className='flex items-center mt-[0.2rem]'>
                <FaMapMarkerAlt
                  style={{
                    color: 'red',
                    width: screen.width >= 640 ? '2vw' : '5vw',
                    height: screen.width >= 640 ? '2vw' : '5vw'
                  }}
                />
                <div
                  className='text-xs line-clamp-2 text-ellipsis overflow-hidden sm:overflow-visible 
                     sm:text-[1.1rem] text-slate-500'
                >
                  {restaurantData.address}
                </div>
              </div>
              <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-6'>
              {table_chair.map((data, id) => {
                return (
                  <div
                    key={id}
                    className={`sm:flex sm:items-center sm:gap-x-10 rounded-md border-[0.1rem] 
                sm:border-[0.1rem]  border-slate-200`}
                  >
                    <div className='mx-[0.2rem]'>
                      <div className='flex items-center gap-x-2'>
                        <MdOutlineTableRestaurant
                          style={{
                            color: 'orange',
                            width: screen.width < 640 ? '8vw' : '4vw',
                            height: screen.width < 640 ? '8vw' : '4vw'
                          }}
                        />
                        <div className={``}>{data.chair + ' chỗ'}</div>
                        {screen.width > 640 && (
                          <div className='flex gap-x-2'>
                            <div className='text-green-500'>{'x' + data.table}</div>
                            <div>bàn</div>
                          </div>
                        )}
                      </div>
                      {screen.width <= 640 && (
                        <div className='flex gap-x-2 justify-center'>
                          <div className='text-green-500'>{'x' + data.table}</div>
                          <div>bàn</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
            <div className='sm:flex sm:justify-between'>
              <div className='flex gap-x-1'>
                <div>Hẹn đặt:</div>
                <div className='text-orange-500 italic'>{VNDate(date)}</div>
              </div>
              <div className='flex gap-x-1'>
                <div className='italic text-slate-500'>
                  {diffDays == 0
                    ? diffHours == 0
                      ? diffMinutes + ' phút trước'
                      : diffHours + ' giờ trước'
                    : diffDays + ' ngày trước'}
                </div>
              </div>
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
            <div>
              <div
                className='text-right mt-[1rem] flex items-center justify-between 
              sm:gap-x-[3rem] gap-x-[1rem]'
              >
                <Link to={`/completed_table_order/${id}`}>
                  <button
                    className=' sm:px-[2rem] sm:py-[1rem] rounded-lg px-[0.6rem] py-[0.4rem]
                    bg-green-500 hover:bg-green-700'
                  >
                    {screen.width < 640 ? (
                      <FaWpforms style={{ color: 'white' }} />
                    ) : (
                      <div className='text-white text-[1.2rem]'>Xem chi tiết</div>
                    )}
                  </button>
                </Link>
                {status === 1 ? (
                  <button
                    className=' sm:px-[2rem] sm:py-[1rem] rounded-lg px-[0.6rem] py-[0.4rem]
                bg-red-500 hover:bg-orange-900 sm:text-[1.2rem] text-white'
                    onClick={() => setCancelOrderTableModal(true)}
                  >
                    Huỷ
                  </button>
                ) : status === 2 ? (
                  <button
                    disabled
                    className='sm:px-[2rem] sm:py-[1rem] sm:text-xl 
                    bg-gray-200 text-black 
                    text-opacity-50 text-[0.9rem] rounded-xl
                    px-[0.5rem] py-[0.5rem]'
                  >
                    Đã huỷ
                  </button>
                ) : (
                  <button
                    disabled
                    className='sm:px-[2rem] sm:py-[1rem] sm:text-3xl 
                    bg-gray-200 text-black 
                    text-opacity-50 text-[0.9rem] rounded-xl
                    px-[0.5rem] py-[0.5rem]'
                  >
                    Đã chấp nhận
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
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
        isOpen={cancelOrderTableModal}
        onRequestClose={() => setCancelOrderTableModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Huỷ đơn đặt chỗ?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitCancelOrderTable()
              setCancelOrderTableModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setCancelOrderTableModal(false)}
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
        isOpen={cancelOrderTableMutation.isPending}
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
