import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaWpforms } from 'react-icons/fa6'
import { MdOutlineTableRestaurant } from 'react-icons/md'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { updateOrderTableHost } from '../../../../api/order_table.api'
import { VNDate, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
export default function Order({ order, refetch }) {
  const [cancelOrderTableModal, setCancelOrderTableModal] = useState(false)
  const [completeOrderTableModal, setCompleteOrderTableModal] = useState(false)
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const updateOrderTableMutation = useMutation({
    mutationFn: (body) => updateOrderTableHost(body)
  })

  const submitUpdateOrderTable = (status) => {
    var data = {}
    data.order_table_id = order._id
    data.status = status
    updateOrderTableMutation.mutate(data, {
      onSuccess: () => {
        refetch()
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
  const firstDate = new Date(order.updatedAt).getTime()
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
      <div className='flex justify-between items-center'>
        <div className='italic text-slate-500'>
          {diffDays == 0
            ? diffHours == 0
              ? diffMinutes + ' phút trước'
              : diffHours + ' giờ trước'
            : diffDays + ' ngày trước'}
        </div>
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

        <Link to={`/host_order_table_detail/${order._id}`}>
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
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
      <div className='grid sm:grid-cols-5 grid-cols-3'>
        {order.table_chair.map((data, id) => {
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
      <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
      <div>
        <div className='mt-[1rem] flex items-center justify-between sm:gap-x-[3rem] gap-x-[1rem]'>
          <div className='flex gap-x-1'>
            <div>Hẹn đặt:</div>
            <div className='text-orange-500 italic'>{VNDate(order.date)}</div>
          </div>
          <div className='text-right flex items-center justify-between sm:gap-x-[3rem] gap-x-[1rem]'>
            {order.status === 1 ? (
              <>
                <button
                  className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
          bg-orange-500 hover:bg-green-500 sm:rounded-xl'
                  onClick={() => setCompleteOrderTableModal(true)}
                >
                  Hoàn thành
                </button>
                <button
                  className=' sm:px-[1rem] sm:py-[0.5rem] sm:text-xl px-[0.3rem] rounded-lg text-white 
        bg-red-500 hover:bg-red-700 sm:rounded-xl'
                  onClick={() => setCancelOrderTableModal(true)}
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
