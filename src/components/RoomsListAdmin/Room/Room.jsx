import { FaLocationDot } from 'react-icons/fa6'
import { IoMdCafe } from 'react-icons/io'
import { displayNum } from '../../../utils/utils'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { LiaWrenchSolid } from 'react-icons/lia'
import { useMutation } from '@tanstack/react-query'
import { checkARoom } from '../../../api/rooms.api'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { TailSpin } from 'react-loader-spinner'
export default function Room({ room, refetch }) {
  const mutation = useMutation({
    mutationFn: (data) => {
      return checkARoom(data)
    }
  })

  const [modal, toggleModal] = useState(0)
  let numOfFeatures = () => {
    let count = 0
    if (room.is_have_parking_lot) count++
    if (room.is_new) count++
    if (room.is_high_security) count++
    if (room.is_have_bed) count++
    if (room.is_have_wardrobe) count++
    if (room.is_have_dinning_table) count++
    if (room.is_have_refrigerator) count++
    if (room.is_have_television) count++
    if (room.is_have_kitchen) count++
    if (room.is_have_washing_machine) count++
    return count
  }

  const [isOpen, setIsOpen] = useState(false)
  const refDropDown = useRef()

  const handleClickOutside = (event) => {
    if (refDropDown.current && !refDropDown.current.contains(event.target)) {
      setIsOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const updateRoomCheck = (checkData) => {
    mutation.mutate(checkData, {
      onSuccess: (data) => {
        if (data.data.message === 'Room is checked') {
          if (modal == 1) toast.success('Xác minh thành công')
          else toast.success('Huỷ xác minh thành công')
          refetch()
          toggleModal(0)
        } else {
          if (modal == 1) toast.error('Xác minh thất bại')
          else toast.error('Huỷ xác minh thất bại')
          toggleModal(0)
        }
      }
    })
  }
  return (
    <>
      <div className='ml-[2vw] flex justify-center'>
        <div className='flex justify-between items-center my-[1rem] border-2 rounded-md w-[57vw]'>
          <div className='flex'>
            <div className='max-w-[16vw] min-w-[16vw] w-[100%] overflow-hidden max-h-[22vh] min-h-[22vh]'>
              <Link to={`/room/${room._id}`}>
                <img
                  onMouseLeave={(e) => {
                    let randomIndex = Math.floor(Math.random() * 5)
                    while (room.images[randomIndex].url === e.target.src) randomIndex = Math.floor(Math.random() * 5)
                    e.target.src = room.images[randomIndex].url
                  }}
                  src={room.images[0].url}
                  className='w-[100%] cursor-pointer hover:scale-125 transition duration-300 ease-in-out h-full object-cover'
                  alt=''
                />
              </Link>
            </div>
            <div className='ml-[1rem] flex-col flex justify-center max-h-[12rem]'>
              <Link to={`/room/${room._id}`}>
                <div className='font-bold cursor-pointer font-lato text-2xl max-w-[16vw] line-clamp-1'>{room.name}</div>
              </Link>
              <div className='flex text-1xl text-[#01B7F2]'>
                <FaLocationDot />
                <div className='font-lato text-xs mt-1 ml-[0.4rem] max-w-[16vw] line-clamp-1'>{room.address}</div>
              </div>
              <div className='font-montserrat-700 text-sm mt-1'>{'Diện tích: ' + room.area + 'm2'}</div>
              <div className='flex mt-[1.2rem]'>
                <IoMdCafe />
                <div className='ml-[0.4rem] font-montserrat-700'>{numOfFeatures()}</div>
                <div className='ml-[0.4rem] font-montserrat-500'>Tiện ích</div>
              </div>
            </div>
          </div>
          <div className='mt-[1.5rem] mr-[2vw]'>
            <div className='text-[#353535] font-poppins-700 text-4xl'>{displayNum(room.price) + 'VNĐ/tháng'}</div>
            <div className='flex justify-end font-poppins-500 text-[#112211]'>excl. tax</div>
            <div className='flex justify-end mt-[1vh]'>
              <Link to={`/room/${room._id}`}>
                <button className='font-poppins-600 hover:bg-blue-500 bg-[#4318FF] px-[2rem] py-[0.5rem] rounded-md text-white'>
                  Xem phòng
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-between py-8 pl-8'>
          <div ref={refDropDown} className='relative inline-block'>
            <button
              type='button'
              onClick={toggleMenu}
              className='inline-flex w-[10vw] text-xl justify-center gap-x-1.5 rounded-md bg-white py-2 font-poppins-500 text-gray-900 shadow-sm border-[1px] border-black hover:bg-gray-50'
              id='menu-button'
              aria-expanded={isOpen}
              aria-haspopup='true'
            >
              Lựa chọn
              <svg
                className={`mt-0.5 -mr-1 h-5 w-5 duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            {isOpen && (
              <div
                className='absolute right-0 z-10 mt-2 w-[10vw] rounded-lg bg-white shadow-lg border-[1px] border-black focus:outline-none'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='menu-button'
                tabIndex='-1'
              >
                <div className='py-1 divide-y divide-gray-500' role='none'>
                  <button
                    className='inline-flex w-full justify-between px-4 py-2 font-poppins-600 text-xl -mt-0.5'
                    role='menuitem'
                    tabIndex='-1'
                    id='menu-item-0'
                  >
                    Sửa
                    <LiaWrenchSolid size='1.5vw' className='scale-x-[-1]' />
                  </button>
                  <button
                    className='inline-flex w-full justify-between font-poppins-600 px-4 py-2 text-xl mt-0.5'
                    role='menuitem'
                    tabIndex='-1'
                    id='menu-item-1'
                  >
                    Xóa
                    <svg className='mt-1' fill='currentColor' viewBox='0 0 16 16' height='1.2vw' width='1.2vw'>
                      <path d='M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z' />
                      <path
                        fillRule='evenodd'
                        d='M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          {room?.is_checked_information ? (
            <button
              onClick={() => toggleModal(2)}
              className='group bg-[#5C5C5C] inline-flex justify-center text-white font-poppins-600 py-2 rounded w-[10vw]'
            >
              Đã xác minh
              <svg
                className='text-white mt-1 ml-2'
                viewBox='0 0 1024 1024'
                fill='currentColor'
                height='1em'
                width='1em'
              >
                <path d='M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z' />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => toggleModal(1)}
              className='bg-[#20AD2E] hover:bg-green-900 text-white font-poppins-600  py-2 px-4 rounded w-[10vw]'
            >
              Xác minh
            </button>
          )}
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
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
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
        isOpen={modal === 1}
        onRequestClose={() => {
          if (!mutation.isPending) toggleModal(0)
        }}
      >
        {mutation.isPending ? (
          <>
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang gửi yêu cầu xác minh...</div>
            <TailSpin
              height='200'
              width='200'
              color='#4fa94d'
              ariaLabel='tail-spin-loading'
              radius='5'
              visible={true}
              wrapperStyle={{ display: 'flex', 'justify-content': 'center' }}
            />
          </>
        ) : (
          <>
            <div className='font-inter-700 text-4xl'>Xác minh cho phòng trọ?</div>
            <div className='mt-[8vh] flex justify-between'>
              <button
                onClick={() => updateRoomCheck({ _id: room?._id, is_checked_information: true })}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#0366FF] hover:bg-green-700 text-white font-inter-700 rounded-lg text-xl'
              >
                Xác minh
              </button>
              <button
                onClick={() => toggleModal(0)}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 text-white font-inter-700 rounded-lg text-xl'
              >
                Huỷ
              </button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
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
        isOpen={modal === 2}
        onRequestClose={() => {
          if (!mutation.isPending) toggleModal(0)
        }}
      >
        {mutation.isPending ? (
          <>
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang gửi yêu cầu huỷ xác minh...</div>
            <TailSpin
              height='200'
              width='200'
              color='#4fa94d'
              ariaLabel='tail-spin-loading'
              radius='5'
              visible={true}
              wrapperStyle={{ display: 'flex', 'justify-content': 'center' }}
            />
          </>
        ) : (
          <>
            <div className='font-inter-700 text-4xl'>Huỷ xác minh phòng trọ?</div>
            <div className='mt-[8vh] flex justify-between'>
              <button
                onClick={() => updateRoomCheck({ _id: room?._id, is_checked_information: false })}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#0366FF] hover:bg-green-700 text-white font-inter-700 rounded-lg text-xl'
              >
                Huỷ xác minh
              </button>
              <button
                onClick={() => toggleModal(0)}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 text-white font-inter-700 rounded-lg text-xl'
              >
                Huỷ
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
