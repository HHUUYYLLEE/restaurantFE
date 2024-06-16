import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'lrm-graphhopper'
import { useEffect, useState } from 'react'
import { FaCalendarAlt, FaChair, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { MdOutlineTableRestaurant } from 'react-icons/md'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useParams } from 'react-router-dom'
import { getOrderTableHost, updateOrderTableHost } from '../../api/order_table.api'
import { getRestaurant } from '../../api/restaurants.api'
import tableChairIcon from '../../asset/img/table_chair.png'
import { VNDate, isAxiosUnprocessableEntityError } from '../../utils/utils'

export default function HostOrderDetailTableComponent() {
  const { id } = useParams()
  const [cancelOrderTableModal, setCancelOrderTableModal] = useState(false)
  const [completeOrderTableModal, setCompleteOrderTableModal] = useState(false)

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const { data, isSuccess } = useQuery({
    queryKey: ['host_order_table_detail', id],
    queryFn: () => {
      return getOrderTableHost(id)
    },
    placeholderData: keepPreviousData
  })
  const orderTable = data?.data.orderTable
  const restaurant_id = orderTable?.restaurant_id
  const { data: restaurant_data, isSuccess: restaurantSuccess } = useQuery({
    queryKey: ['restaurantOrderDetail', restaurant_id],
    queryFn: () => {
      return getRestaurant(restaurant_id)
    },
    placeholderData: keepPreviousData,
    enabled: !!restaurant_id
  })
  const restaurantData = restaurant_data?.data.restaurant
  const updateOrderTableMutation = useMutation({
    mutationFn: (body) => updateOrderTableHost(body)
  })

  const submitUpdateOrderTable = (status) => {
    var data = {}
    data.order_table_id = id
    data.status = status
    updateOrderTableMutation.mutate(data, {
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
  const firstDate = new Date(orderTable?.updatedAt).getTime()
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
      {isSuccess && restaurantSuccess && (
        <div className=''>
          <div className='flex bg-white gap-x-[2vw] sm:gap-x-0'>
            {screen.width > 640 && (
              <div className='flex w-[15vw] bg-orange-500 sm:w-[10vw] justify-center items-center gap-x-3'>
                <div>
                  <MdOutlineTableRestaurant
                    style={{
                      color: 'white',
                      width: '2vw',
                      height: '2vw'
                    }}
                  />
                </div>
                <div className='text-white 2xl:text-[1.2rem]'>Đặt chỗ</div>
                <div>
                  <FaChair
                    style={{
                      color: 'white',
                      width: '1.5vw',
                      height: '1.5vw'
                    }}
                  />
                </div>
              </div>
            )}
            <div className='flex gap-x-3'>
              <div className='sm:max-w-[30vw] max-w-[30vw] max-h-[15vh] sm:max-h-[20vh]'>
                <img
                  referrerPolicy='no-referrer'
                  className='sm:w-[20vw] w-[30vw] h-[15vh] sm:h-[20vh]'
                  src={restaurantData?.main_avatar_url}
                />
              </div>
              <div
                className='text-[0.6rem] sm:text-base max-w-[58vw] sm:max-w-[55vw] 
               my-[1vh] sm:my-[3vh] grid gap-y-2 mr-[0.4rem]'
              >
                <div className='text-green-500 line-clamp-3 sm:line-clamp-2 text-ellipsis'>
                  {restaurantData?.name}
                </div>
                <div className='flex'>
                  <div>
                    <FaMapMarkerAlt style={{ color: 'red' }} />
                  </div>
                  <div className='line-clamp-3 sm:line-clamp-2 text-ellipsis'>
                    {restaurantData?.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-md mt-[2rem] bg-white px-[1rem] py-[0.5rem]'>
            <div className=' flex justify-between'>
              <div>
                {screen.width > 640 ? 'Khách hàng: ' + orderTable.username : orderTable.username}
              </div>
              <div className='flex gap-x-2 items-center'>
                <FaPhoneAlt
                  style={{
                    color: 'green',
                    width: screen.width >= 640 ? '1.5vw' : '5vw',
                    height: screen.width >= 640 ? '1.5vw' : '5vw'
                  }}
                />
                <div className='text-green-500'>{orderTable.phone_number}</div>
              </div>
            </div>
          </div>
          <div className='mt-[1.2rem] sm:mt-[1.5rem] bg-white'>
            <div className='flex mx-[1rem] sm:mx-[1.3rem] items-center gap-x-2'>
              <div className='max-w-[10vw] max-h-[10vw] sm:max-w-[3vw] sm:max-h-[3vw]'>
                <img className='w-[10vw] h-[10vw] sm:w-[3vw] sm:h-[3vw]' src={tableChairIcon} />
              </div>
              <div className='text-orange-500 sm:text-[1.2rem]'>Loại bàn đặt</div>
            </div>
            <hr className='h-[0.1rem] border-none bg-gray-400' />

            <div className='mx-[0.4rem] sm:mx-[1.3rem] grid grid-cols-3 sm:gap-x-4 sm:grid-cols-5'>
              {orderTable.table_chair.map((data, id) => {
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
          </div>
          <div className='mt-[1.2rem] sm:mt-[1.5rem] bg-white'>
            <div className='flex mx-[1rem] py-[0.4rem] sm:mx-[1.3rem] items-center gap-x-2'>
              <FaCalendarAlt
                style={{
                  color: 'orange',
                  width: screen.width < 640 ? '6vw' : '2vw',
                  height: screen.width < 640 ? '6vw' : '2vw'
                }}
              />
              <div className='text-orange-500 sm:text-[1.2rem]'>Thời điểm</div>
            </div>
            <hr className='h-[0.1rem] border-none bg-gray-400' />
            <div className='px-[1rem] py-[1rem]'>
              <div className='sm:flex sm:justify-between'>
                <div className='flex gap-x-1'>
                  <div>Hẹn đặt:</div>
                  <div className='text-orange-500 italic'>{VNDate(orderTable.date)}</div>
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
            </div>
          </div>
          <div className=''>
            {orderTable.status === 1 ? (
              <div className='flex gap-x-8'>
                <button
                  className='my-[3rem] hover:bg-green-700 
          bg-green-500  text-white py-[0.6rem] px-[0.9rem] font-ibm-plex-serif-700 rounded-lg'
                  onClick={() => setCompleteOrderTableModal(true)}
                >
                  Chấp nhận
                </button>
                <button
                  className='my-[3rem] hover:bg-red-700 
            bg-red-500  text-white py-[0.6rem] px-[0.9rem] font-ibm-plex-serif-700 rounded-lg'
                  onClick={() => setCancelOrderTableModal(true)}
                >
                  Huỷ
                </button>
              </div>
            ) : orderTable.status === 2 ? (
              <button
                disabled
                className='sm:px-[2rem] sm:py-[1rem] mt-[1rem] sm:text-xl 
            bg-gray-200 text-black 
            text-opacity-50 text-[0.9rem] rounded-xl
            px-[0.5rem] py-[0.5rem]'
              >
                Đã huỷ
              </button>
            ) : (
              <button
                disabled
                className='sm:px-[2rem] sm:py-[1rem] mt-[1rem] sm:text-xl 
            bg-gray-200 text-black 
            text-opacity-50 text-[0.9rem] rounded-xl
            px-[0.5rem] py-[0.5rem]'
              >
                Đã chấp nhận
              </button>
            )}
          </div>
        </div>
      )}
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
        isOpen={completeOrderTableModal}
        onRequestClose={() => setCompleteOrderTableModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Chấp nhận yêu cầu đặt chỗ?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitUpdateOrderTable(3)
              setCompleteOrderTableModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setCompleteOrderTableModal(false)}
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
        <div className='font-inter-700 sm:text-2xl'>Xác nhận huỷ đặt chỗ?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitUpdateOrderTable(2)
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
        isOpen={updateOrderTableMutation.isPending}
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
