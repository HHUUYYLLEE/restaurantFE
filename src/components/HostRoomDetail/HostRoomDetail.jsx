import { FaLocationDot } from 'react-icons/fa6'
import { LiaSwimmingPoolSolid } from 'react-icons/lia'
import { PiDesktopLight } from 'react-icons/pi'
import { PiDeviceTabletSpeakerLight } from 'react-icons/pi'
import { FiHardDrive } from 'react-icons/fi'
import { PiAlignLeft } from 'react-icons/pi'
import { FiPhoneCall } from 'react-icons/fi'
import map from '../../asset/img/map.png'
import { displayNum } from '../../utils/utils'
import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRoom } from '../../api/rooms.api'
import { useEffect, useState } from 'react'
import { webName } from '../../utils/env'
import { FadeLoader } from 'react-spinners'
import EditIcon from './EditIcon'
import ModalEdit from './ModalEdit'
import Modal from 'react-modal'
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { ColorRing } from 'react-loader-spinner'
export default function HostRoomDetail() {
  const { id } = useParams()
  const [loadingVideo, setLoadingVideo] = useState(true)
  const [modalEdit, toggleModalEdit] = useState(0)
  const { data, status, refetch, isLoading } = useQuery({
    queryKey: ['roomDetailHost', id],
    queryFn: () => {
      return getRoom(id)
    },
    placeholderData: keepPreviousData
  })
  useEffect(() => {
    if (status === 'success') {
      document.getElementsByTagName('title')[0].textContent = data?.data?.room?.name + ' | ' + webName
    }
  }, [data?.data?.room?.name, status])
  useEffect(() => {
    Modal.setAppElement('body')
  })

  const room = data?.data?.room
  console.log(room)
  if (isLoading)
    return (
      <div className='w-full h-[100vh] relative'>
        <div className='left-[50%] translate-x-[-50%] z-[19] top-[50%] translate-y-[-50%] absolute'>
          <ColorRing
            visible={true}
            width='40vw'
            height='40vw'
            colors={['#02d8fa', '#222222', '#02d8fa', '#222222', '#02d8fa']}
          />
        </div>
      </div>
    )
  return (
    <>
      <div className='w-full flex flex-col justify-center items-center'>
        {room && (
          <>
            <div className='w-5/6 flex flex-col justify-between'>
              <div className='flex flex-row justify-between font-bold text-2xl'>
                <div className='max-w-[60vw]'>
                  {room?.name} | Phòng {room?.number_or_people} người | {room?.district_id.district}
                </div>
                <div>{displayNum(room?.price)} VNĐ</div>
              </div>
              <div className='flex flex-row justify-between mt-4'>
                <div className=''>
                  <div className='flex'>
                    <div className='self-center mr-1'>
                      <FaLocationDot />
                    </div>
                    <div className='underline'>{room?.address}</div>
                  </div>
                  <div className='text-sm mt-3'>Diện tích: {room?.area}m2</div>
                </div>
                <div>
                  <div className='flex items-center justify-center'>
                    <div className='flex items-center bg-[#CECECE] min-w-[8rem] text-black cursor-pointer border border-[#01B7F2] rounded-sm px-4 py-1.5 mr-3'>
                      <div className='flex text-lg font-bold justify-center items-center w-full'>
                        {room?.is_checked_information === true ? 'Đã xác minh' : 'Chưa xác minh'}
                      </div>
                    </div>
                    <div className='flex items-center bg-[#01B7F2] min-w-[8rem] text-white cursor-pointer hover:bg-sky-600 font-semibold rounded-sm px-4 py-1.5'>
                      <div className='flex text-lg font-bold justify-center items-center w-full'>Liên Hệ</div>
                    </div>
                  </div>
                  <div className='flex justify-end mt-[2.2rem]'>
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        toggleModalEdit(1)
                        window.scrollTo(0, document.body.scrollHeight * 0.05)
                      }}
                    >
                      <EditIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-5/6 mb-4'>
              <div className='mt-[2.2rem] mb-3'>
                <div className='relative w-full'>
                  {loadingVideo && (
                    <div className='absolute top-[50%] left-[50%]'>
                      <div className='translate-x-[-50%] translate-y-[-50%]'>
                        <FadeLoader color='#36d7b7' />
                      </div>
                      <div className='translate-x-[-80%] translate-y-[-50%] text-3xl'>Loading video...</div>
                    </div>
                  )}
                  <iframe
                    width='100%'
                    height='600'
                    src={room?.video_url}
                    title='YouTube video player'
                    // frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                    onLoad={() => setLoadingVideo(false)}
                  />
                </div>
              </div>
              <div className='grid grid-cols-5 gap-3'>
                <Gallery
                  options={{
                    showHideAnimationType: 'none',
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0,
                    clickToCloseNonZoomable: false,
                    secondaryZoomLevel: 4,
                    maxZoomLevel: 10,
                    counter: false
                  }}
                >
                  <div className='grid col-span-3 row-span-2 gap-3'>
                    <div className='overflow-hidden h-[30.75rem] rounded-lg'>
                      <Item
                        original={room.images[0].url}
                        width={document.documentElement.clientWidth}
                        height={document.documentElement.clientHeight}
                      >
                        {({ ref, open }) => (
                          <img
                            className='rounded-lg object-cover w-full h-full'
                            src={room?.images[0].url}
                            alt=''
                            referrerPolicy='no-referrer'
                            ref={ref}
                            onClick={open}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <div className='overflow-hidden rounded-lg w-[14.25rem] h-[15rem]'>
                      <Item
                        original={room.images[1].url}
                        width={document.documentElement.clientWidth}
                        height={document.documentElement.clientHeight}
                      >
                        {({ ref, open }) => (
                          <img
                            className='rounded-lg object-cover w-full h-full'
                            src={room?.images[1].url}
                            alt=''
                            referrerPolicy='no-referrer'
                            ref={ref}
                            onClick={open}
                          />
                        )}
                      </Item>
                    </div>
                    <div className='overflow-hidden rounded-lg w-[14.25rem] h-[15rem]'>
                      <Item
                        original={room.images[2].url}
                        width={document.documentElement.clientWidth}
                        height={document.documentElement.clientHeight}
                      >
                        {({ ref, open }) => (
                          <img
                            className='rounded-lg object-cover w-full h-full'
                            src={room?.images[2].url}
                            alt=''
                            referrerPolicy='no-referrer'
                            ref={ref}
                            onClick={open}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <div className='overflow-hidden rounded-lg w-[14.25rem] h-[15rem]'>
                      <Item
                        original={room.images[3].url}
                        width={document.documentElement.clientWidth}
                        height={document.documentElement.clientHeight}
                      >
                        {({ ref, open }) => (
                          <img
                            className='rounded-lg object-cover w-full h-full'
                            src={room?.images[3].url}
                            alt=''
                            referrerPolicy='no-referrer'
                            ref={ref}
                            onClick={open}
                          />
                        )}
                      </Item>
                    </div>
                    <div className='overflow-hidden rounded-lg w-[14.25rem] h-[15rem]'>
                      <Item
                        original={room.images[4].url}
                        width={document.documentElement.clientWidth}
                        height={document.documentElement.clientHeight}
                      >
                        {({ ref, open }) => (
                          <img
                            className='rounded-lg object-cover w-full h-full'
                            src={room?.images[4].url}
                            alt=''
                            referrerPolicy='no-referrer'
                            ref={ref}
                            onClick={open}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                </Gallery>
              </div>
            </div>
            <div className='my-16 w-5/6'>
              <div className='mb-5'>
                <p className='mb-2 font-medium ml-2'>Giới thiệu</p>
                <div className='w-full bg-[#CECECE] h-[1px] '>
                  <div className='h-[3px] w-[87px] bg-[#01B7F2]'></div>
                </div>
              </div>
              <div className='whitespace-pre-line'>
                {/* <ul className='list-disc list-inside [&>*]:ml-4'>
                CHO THUÊ CĂN HỘ STUDIO ĐẦY ĐỦ ĐỒ ĐIỀU HÒA GIƯỜNG TỦ PHỐ HÀM LONG CÁCH HỒ GƯƠM 350M
                <li>Tòa nhà 8 tầng tại số 25 Ngõ Hàm Long 2</li>
                <li>
                  Tòa nhà cách mặt phố Hàm Long 30m đường vào rộng, rất thuận tiện cho việc đi lại, sinh hoạt, vui chơi,
                  giải trí, Ngay trung tâm phố cổ, chỉ 350m là ra tới Hồ Gươm.
                </li>
                <li>
                  Căn hộ rộng được lát sàn gỗ, căn nào cũng có cửa sổ rộng, thoáng mát. Các phòng được thiết kế hết sức
                  hợp lý: kiểu căn hộ Studio, được lắp đầy đủ nội thất.
                </li>
                <li>Nội quy:</li>
                <ul className='list-disc list-inside [&>*]:ml-4'>
                  <li>
                    Sáng mở cửa lúc 5h30, tối đóng cửa lúc 23h30. Ai vi phạm ngoài giờ sẽ không được vào hoặc ra khỏi
                    trọ.
                  </li>
                  <li>Không gây tiếng ồn ảnh hưởng các phòng xung quanh, không tiệc tùng, không hút chất cấm,...</li>
                </ul>
                <li>
                  Tòa nhà trang bị thang máy cao cấp, máy giặt, truyền hình cáp, mỗi căn hộ được cấp thẻ từ thang máy
                  riêng.
                </li>
                <li>
                  Tòa nhà có bảo vệ 24/24 nên an ninh cực ổn,khóa cửa vân tay ra vào thoải mái, nhà để xe rộng rãi.
                  -Riêng sàn văn phòng tầng 1 diện tích rộng 40m2 giá 6 000.000 đ/ tháng.
                </li>
                <li>Liên hệ chủ nhà Chị Hương</li>
              </ul> */}
                {room?.describe}
              </div>
            </div>
            <div className='w-5/6 flex flex-col md:flex-row justify-between'>
              <div className=''>
                <div className='flex'>
                  <div className='self-center mr-3'>
                    <FiPhoneCall className='w-[1.5rem] h-[1.5rem]' />
                  </div>
                  <div className=' font-normal text-lg'>SĐT: {room?.host_id.phone_number}</div>
                </div>
                <div className='font-semibold my-3'>Tiện ích</div>
                <div className='grid grid-cols-2 gap-y-0 gap-x-16'>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <LiaSwimmingPoolSolid className='w-[1/5rem] h-[1.5rem]' />
                      </div>
                      <div className='font-andika text-sm'>Máy giặt</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_washing_machine}
                    />
                  </div>

                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <FiHardDrive className='w-[1.5rem] h-[1.5rem] scale-x-[-1]' />
                      </div>
                      <div className='font-andika text-sm'>Giường ngủ</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_bed}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='20' viewBox='0 0 18 20' fill='none'>
                          <path
                            d='M13 4V10C13 11.1 13.9 12 15 12H16V19C16 19.55 16.45 20 17 20C17.55 20 18 19.55 18 19V1.13C18 0.48 17.39 8.9407e-08 16.76 0.15C14.6 0.68 13 2.51 13 4ZM8 7H6V1C6 0.45 5.55 0 5 0C4.45 0 4 0.45 4 1V7H2V1C2 0.45 1.55 0 1 0C0.45 0 0 0.45 0 1V7C0 9.21 1.79 11 4 11V19C4 19.55 4.45 20 5 20C5.55 20 6 19.55 6 19V11C8.21 11 10 9.21 10 7V1C10 0.45 9.55 0 9 0C8.45 0 8 0.45 8 1V7Z'
                            fill='#181818'
                          />
                        </svg>
                      </div>
                      <div className='font-andika text-sm'>Nhà bếp riêng</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_kitchen}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          stroke='currentColor'
                        >
                          <path d='M8 10V8c0-2.761 1.239-5 4-5s4 2.239 4 5v2M3.5 17.8v-4.6c0-1.12 0-1.68.218-2.107a2 2 0 0 1 .874-.875c.428-.217.988-.217 2.108-.217h10.6c1.12 0 1.68 0 2.108.217a2 2 0 0 1 .874.874c.218.428.218.988.218 2.108v4.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C18.98 21 18.42 21 17.3 21H6.7c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3.5 19.481 3.5 18.921 3.5 17.8ZM16 14v3' />
                        </svg>
                      </div>
                      <div className='font-andika text-sm'>Bảo mật cao</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_high_security}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='15' viewBox='0 0 20 15' fill='none'>
                          <path
                            d='M1 15C0.716667 15 0.479333 14.904 0.288 14.712C0.0960001 14.5207 0 14.2833 0 14C0 13.7167 0.0960001 13.4793 0.288 13.288C0.479333 13.096 0.716667 13 1 13H19C19.2833 13 19.5207 13.096 19.712 13.288C19.904 13.4793 20 13.7167 20 14C20 14.2833 19.904 14.5207 19.712 14.712C19.5207 14.904 19.2833 15 19 15H1ZM1 12V11C1 8.86667 1.65433 6.98333 2.963 5.35C4.271 3.71667 5.95 2.68333 8 2.25V2C8 1.45 8.196 0.979333 8.588 0.588C8.97933 0.196 9.45 0 10 0C10.55 0 11.021 0.196 11.413 0.588C11.8043 0.979333 12 1.45 12 2V2.25C14.0667 2.68333 15.75 3.71667 17.05 5.35C18.35 6.98333 19 8.86667 19 11V12H1Z'
                            fill='#181818'
                          />
                        </svg>
                      </div>
                      <div className='font-andika text-sm'>Bàn ăn</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_dinning_table}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <PiAlignLeft className='w-[1.5rem] h-[1.5rem]' />
                      </div>
                      <div className='font-andika text-sm'>Tủ quần áo</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_wardrobe}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <svg width={22} height={22} viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M14.2168 2.59424H7.78185C5.49935 2.59424 4.99518 3.73091 4.70185 5.12424L3.66602 10.0834H18.3327L17.2969 5.12424C17.0035 3.73091 16.4993 2.59424 14.2168 2.59424V2.59424Z'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M20.157 18.1685C20.2578 19.241 19.3962 20.1668 18.2962 20.1668H16.5728C15.5828 20.1668 15.4453 19.7452 15.2712 19.2227L15.0878 18.6727C14.8312 17.921 14.6662 17.4168 13.3462 17.4168H8.65285C7.33285 17.4168 7.14035 17.9852 6.91118 18.6727L6.72785 19.2227C6.55368 19.7452 6.41618 20.1668 5.42618 20.1668H3.70285C2.60285 20.1668 1.74118 19.241 1.84201 18.1685L2.35535 12.586C2.48368 11.211 2.74951 10.0835 5.15118 10.0835H16.8478C19.2495 10.0835 19.5153 11.211 19.6437 12.586L20.157 18.1685Z'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M3.66667 7.3335H2.75'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M19.2497 7.3335H18.333'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M11 2.75V4.58333'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M9.625 4.5835H12.375'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M5.5 13.75H8.25'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M13.75 13.75H16.5'
                            stroke='#181818'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                      <div className='font-andika text-sm'>Có chỗ để xe</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      checked={room?.is_have_parking_lot}
                      className='transform scale-150 accent-black pointer-events-none'
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M14.7692 21C15.8929 16.3512 17.2565 14.9013 21 13.6364C17.0664 12.3084 15.8396 10.6969 14.7692 6.27273C13.6455 10.9216 12.282 12.3714 8.53846 13.6364C12.4674 14.9628 13.7012 16.5852 14.7692 21ZM6.46154 11.1818C6.9739 8.76207 7.96386 7.66977 9.92308 7.09091C7.96386 6.51205 6.9739 5.41975 6.46154 3C5.97132 5.31517 5.04749 6.48539 3 7.09091C4.95899 7.67026 5.94917 8.76206 6.46154 11.1818Z'
                            stroke='black'
                            strokeWidth={1.5}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                      <div className='font-andika text-sm'>Phòng mới</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_new}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <PiDesktopLight className='w-[1.5rem] h-[1.5rem]' />
                      </div>
                      <div className='font-andika text-sm'>Tivi</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_television}
                    />
                  </div>
                  <div className='flex justify-between my-[14px] min-w-[180px]'>
                    <div className='flex gap-[0.5rem]'>
                      <div className='self-center'>
                        <PiDeviceTabletSpeakerLight className='w-[1.5rem] h-[1.5rem]' />
                      </div>
                      <div className='font-andika text-sm'>Tủ lạnh</div>
                    </div>

                    <input
                      type='checkbox'
                      name='feature'
                      aria-disabled='true'
                      className='transform scale-150 accent-black pointer-events-none'
                      checked={room?.is_have_refrigerator}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className='mb-5 flex'>
                  <div className='text-sm self-center'>Map</div>
                  <div className='self-center mx-2'>
                    <svg width={24} height={24} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M12.0001 21.5999C12.0001 21.5999 19.5131 14.9216 19.5131 9.91294C19.5131 5.76361 16.1494 2.3999 12.0001 2.3999C7.85076 2.3999 4.48706 5.76361 4.48706 9.91294C4.48706 14.9216 12.0001 21.5999 12.0001 21.5999Z'
                        fill='#FF0000'
                      />
                      <path
                        d='M14.4004 9.60005C14.4004 10.9255 13.3259 12.0001 12.0004 12.0001C10.6749 12.0001 9.60041 10.9255 9.60041 9.60005C9.60041 8.27457 10.6749 7.20005 12.0004 7.20005C13.3259 7.20005 14.4004 8.27457 14.4004 9.60005Z'
                        fill='#FF0000'
                      />
                      <path
                        d='M12.0001 21.5999C12.0001 21.5999 19.5131 14.9216 19.5131 9.91294C19.5131 5.76361 16.1494 2.3999 12.0001 2.3999C7.85076 2.3999 4.48706 5.76361 4.48706 9.91294C4.48706 14.9216 12.0001 21.5999 12.0001 21.5999Z'
                        stroke='#272727'
                      />
                      <path
                        d='M14.4004 9.60005C14.4004 10.9255 13.3259 12.0001 12.0004 12.0001C10.6749 12.0001 9.60041 10.9255 9.60041 9.60005C9.60041 8.27457 10.6749 7.20005 12.0004 7.20005C13.3259 7.20005 14.4004 8.27457 14.4004 9.60005Z'
                        stroke='#272727'
                      />
                    </svg>
                  </div>
                  <div className='underline'>{room?.address}</div>
                </div>
                <div>
                  <img style={{ maxWidth: '650px' }} src={map} alt='' className='pointer-events-none' />
                </div>
              </div>
            </div>
            <ModalEdit room={room} toggle={toggleModalEdit} checked={modalEdit} refetch={refetch} />
          </>
        )}
      </div>
    </>
  )
}
