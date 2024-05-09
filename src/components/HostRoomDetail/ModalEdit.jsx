import { MdOutlineRestaurant } from 'react-icons/md'
import { VscSparkle } from 'react-icons/vsc'
import { MdRoomService } from 'react-icons/md'
import { PiAlignLeft } from 'react-icons/pi'
import { PiDeviceTabletSpeakerLight } from 'react-icons/pi'
import { FiHardDrive } from 'react-icons/fi'
import { LiaSwimmingPoolSolid } from 'react-icons/lia'
import { PiDesktopLight } from 'react-icons/pi'
import Modal from 'react-modal'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { TailSpin } from 'react-loader-spinner'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { schemaEditRoom } from '../../utils/rules'
import { carIcon, lockIcon } from './svgs'
import { displayNum } from '../../utils/utils'
import { useRef } from 'react'
import { updateARoom } from '../../api/rooms.api'

export default function ModalEdit({ room, toggle, checked, refetch }) {
  const mutationEdit = useMutation({
    mutationFn: (data) => {
      return updateARoom(data)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaEditRoom)
  })
  const onSubmit = handleSubmit((data) => {
    toggle(2)
    data.price = data.price.replaceAll('.', '')
    data.number_or_people = data.number_or_people.replaceAll('.', '')
    data.area = data.area.replaceAll('.', '')
    data._id = room._id
    // console.log(data)
    mutationEdit.mutate(data, {
      onSuccess: () => {
        toast.success('Chỉnh sửa thành công!')
        refetch()
        toggle(0)
      },
      onError: () => {
        toast.error('Chỉnh sửa thất bại!')
        toggle(0)
      }
    })
  })

  const checks1 = [
    {
      id: 1,
      label: 'Máy giặt',
      queryKey: 'is_have_washing_machine',
      icon: <LiaSwimmingPoolSolid className='w-[22px] h-[22px]' />
    },
    {
      id: 2,
      label: 'Nhà bếp riêng',
      queryKey: 'is_have_kitchen',
      icon: <MdOutlineRestaurant className='w-[22px] h-[22px]' />
    },
    {
      id: 3,
      label: 'Bàn ăn',
      queryKey: 'is_have_dinning_table',
      icon: <MdRoomService className='w-[22px] h-[22px]' />
    },
    {
      id: 4,
      label: 'Có chỗ để xe',
      queryKey: 'is_have_parking_lot',
      icon: carIcon
    },
    {
      id: 5,
      label: 'Tivi',
      queryKey: 'is_have_television',
      icon: <PiDesktopLight className='w-[1.5rem] h-[1.5rem]' />
    }
  ]
  const checks2 = [
    {
      id: 6,
      label: 'Giường ngủ',
      queryKey: 'is_have_bed',
      icon: <FiHardDrive className='w-[1.5rem] h-[1.5rem] scale-x-[-1]' />
    },
    {
      id: 7,
      label: 'Bảo mật cao',
      queryKey: 'is_high_security',
      icon: lockIcon
    },
    {
      id: 8,
      label: 'Tủ quần áo',
      queryKey: 'is_have_wardrobe',
      icon: <PiAlignLeft className='w-[1.5rem] h-[1.5rem]' />
    },
    {
      id: 9,
      label: 'Phòng mới',
      queryKey: 'is_new',
      icon: <VscSparkle className='w-[1.5rem] h-[1.5rem] scale-x-[-1] scale-y-[-1]' />
    },

    // ,
    // {
    //   id: 4,
    //   label: 'Chung chủ',
    //   state: haveOwner,
    //   setState: setHaveOwner,
    //   queryKey: 'is_have_owner'
    // }
    {
      id: 10,
      label: 'Tủ lạnh',
      queryKey: 'is_have_refrigerator',
      icon: <PiDeviceTabletSpeakerLight className='w-[1.5rem] h-[1.5rem]' />
    }
  ]
  const refForm = useRef()
  return (
    <>
      <Modal
        style={{
          overlay: {
            position: 'absolute',
            height: document.body.scrollHeight,
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
          },
          content: {
            position: 'absolute',
            top: '39%',
            left: '57%',
            right: 'auto',
            height: 'min-content',
            // bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            paddingTop: '0px',
            paddingBottom: '2rem',
            paddingRight: '0px',
            paddingLeft: '0px',
            borderWidth: '0px',
            borderRadius: '0.5rem',
            zIndex: '25'
          }
        }}
        isOpen={checked === 1}
        onRequestClose={() => {
          if (!mutationEdit.isPending) toggle(0)
        }}
        onAfterOpen={() => refForm.current.reset()}
      >
        <>
          <form ref={refForm}>
            <div className='w-full pb-[2rem] border-b-8 border-gray-400'>
              <div className='flex ml-[1.8rem] mr-[0.5rem]'>
                <div className='w-[34rem] mt-[2rem] text-[#434343]'>
                  <div className='text-3xl font-inter-700'>Thông tin bài viết</div>
                  <div className='text-lg mt-[2rem]'>
                    <span className='font-inter-700'>Tên phòng </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.name?.message}</span>
                  </div>
                  <div
                    className={`rounded-lg h-[4rem] ${
                      errors.name ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                    } focus-within:border-[#8AC0FF] border-2 py-[1rem] mt-[0.5rem]`}
                  >
                    <textarea
                      placeholder='VD: Phòng trọ 71b giếng mứt'
                      className='resize-none placeholder:text-[#C6C6C6C6] placeholder:font-inter-400 w-full h-full outline-none px-[2rem]'
                      name=''
                      id=''
                      defaultValue={room?.name}
                      {...register('name')}
                    ></textarea>
                  </div>
                  <div className='text-lg mt-[1.1rem]'>
                    <span className='font-inter-700'>Mô tả </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.describe?.message}</span>
                  </div>
                  <div
                    className={`rounded-lg h-[15rem] ${
                      errors.describe ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                    } focus-within:border-[#8AC0FF] border-2 py-[1rem] mt-[0.5rem]`}
                  >
                    <textarea
                      placeholder='VD: Phòng trọ 71b giếng mứt ở đường Bạch Mai, gần các khu trung tâm thương mại, các trường đại học, ....'
                      className='resize-none whitespace-pre-wrapplaceholder:text-[#C6C6C6C6] placeholder:font-inter-400 w-full h-full outline-none  px-[2rem]'
                      name=''
                      id=''
                      defaultValue={room?.describe}
                      {...register('describe')}
                    ></textarea>
                  </div>
                  <div className='text-lg mt-[1.1rem]'>
                    <span className='font-inter-700'>Số lượng người </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.number_or_people?.message}</span>
                  </div>
                  <div
                    className={`rounded-lg h-[4rem] ${
                      errors.number_or_people ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                    } focus-within:border-[#8AC0FF] border-2 py-[0.5rem] mt-[0.5rem]`}
                  >
                    <textarea
                      placeholder='VD: 3, 3-4, 1-2, 3-5, ...'
                      className='resize-none placeholder:text-[#C6C6C6C6] placeholder:font-inter-400 outline-none w-full px-[2rem]'
                      name=''
                      id=''
                      defaultValue={displayNum(room?.number_or_people)}
                      {...register('number_or_people')}
                      onChange={(e) => (e.target.value = displayNum(e.target.value.replaceAll('.', '')))}
                    ></textarea>
                  </div>
                </div>

                <div
                  className='cursor-pointer w-[2rem] flex justify-end font-inter-700 text-[#656565] text-3xl'
                  onClick={() => toggle(0)}
                >
                  x
                </div>
              </div>
            </div>
            <div className='w-full pb-[2rem] border-b-8 border-gray-400'>
              <div className='flex ml-[1.8rem] mr-[0.5rem]'>
                <div className='w-[34rem] mt-[2rem] text-[#434343]'>
                  <div className='text-3xl font-inter-700'>Thông tin bất động sản</div>
                  <div className='text-lg mt-[2rem]'>
                    <span className='font-inter-700'>Diện tích </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.area?.message}</span>
                  </div>
                  <div
                    className={`relative rounded-lg h-[3rem] ${
                      errors.area ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                    } focus-within:border-[#8AC0FF] border-2 py-[0.5rem] mt-[0.5rem]`}
                  >
                    <textarea
                      placeholder='VD: 50'
                      className='resize-none placeholder:text-[#C6C6C6C6] h-full placeholder:font-inter-400 outline-none w-full pl-[2rem] pr-[3.5rem]'
                      name=''
                      id=''
                      defaultValue={displayNum(room?.area)}
                      {...register('area')}
                      onChange={(e) => (e.target.value = displayNum(e.target.value.replaceAll('.', '')))}
                    ></textarea>
                    <div className='absolute top-[50%] right-[5%] translate-y-[-50%]'>m2</div>
                  </div>
                  <div className='text-lg mt-[1.1rem]'>
                    <span className='font-inter-700'>Mức giá </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.price?.message}</span>
                  </div>
                  <div className='flex justify-between gap-6 mt-[0.5rem]'>
                    <div
                      className={`rounded-lg h-[2.5rem] ${
                        errors.price ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                      } focus-within:border-[#8AC0FF] border-2 py-[0.3rem] w-[50rem]`}
                    >
                      <textarea
                        placeholder='VD: 1200000000 ....'
                        className='resize-none placeholder:text-[#C6C6C6C6] placeholder:font-inter-400 w-full h-full rounded-lg outline-none px-[2rem]'
                        name=''
                        id=''
                        defaultValue={displayNum(room?.price)}
                        {...register('price')}
                        onChange={(e) => (e.target.value = displayNum(e.target.value.replaceAll('.', '')))}
                      ></textarea>
                    </div>

                    <div className='w-full h-[2.5rem] rounded-lg border-2 border-[#BCBCBC] relative'>
                      <div className='text-inter-400 ml-[0.5rem] absolute top-[50%] translate-y-[-50%]'>VNĐ</div>
                    </div>
                  </div>
                  <div className='text-lg mt-[1.1rem]'>
                    <span className='font-inter-700'>Khu vực </span>
                    <span className='text-[#D83B3B]'>* </span>
                    <span className='text-[#D83B3B] text-sm'>{errors.address?.message}</span>
                  </div>
                  <div
                    className={`rounded-lg h-[4rem] ${
                      errors.address ? 'border-[#FF0000]' : 'border-[#E6E6E6]'
                    } focus-within:border-[#8AC0FF] border-2 py-[1rem] mt-[0.5rem]`}
                  >
                    <textarea
                      placeholder='VD: 3, 3-4, 1-2, 3-5, ...'
                      className='resize-none placeholder:text-[#C6C6C6C6] placeholder:font-inter-400 w-full h-full outline-none px-[2rem]'
                      name=''
                      id=''
                      defaultValue={room?.address}
                      {...register('address')}
                    ></textarea>
                  </div>
                </div>

                <div
                  className='cursor-pointer w-[2rem] flex justify-end font-inter-700 text-[#656565] text-3xl'
                  onClick={() => toggle(0)}
                >
                  x
                </div>
              </div>
            </div>
            <div className='w-full pb-[2rem]'>
              <div className='flex ml-[1.8rem] mr-[0.5rem]'>
                <div className='w-[34rem] mt-[2rem] text-[#434343]'>
                  <div className='text-3xl'>
                    <span className='font-inter-700'>Tiện ích </span>
                    <span className='text-[#D83B3B]'>*</span>
                  </div>
                  <div className='grid grid-cols-2 w-full gap-x-6'>
                    <div className='col-start-1 col-span-1 row-span-1 w-[12rem]'>
                      {checks1.map((element) => {
                        return (
                          <div key={element.id} className='mt-[1.2rem] flex justify-between'>
                            <div className='flex'>
                              {element.icon}
                              <div className='font-poppins-500 text-[#4F4F4F] ml-[1rem]'>{element.label}</div>
                            </div>
                            <input
                              type='checkbox'
                              name='checkbox'
                              className='transform scale-150 accent-black'
                              defaultChecked={room[element.queryKey]}
                              {...register(element.queryKey)}
                            />
                          </div>
                        )
                      })}
                    </div>
                    <div className='col-start-2 col-span-1 row-span-1 w-[14rem]'>
                      {checks2.map((element) => {
                        return (
                          <div key={element.id} className='mt-[1.2rem] flex justify-between'>
                            <div className='flex'>
                              {element.icon}
                              <div className='font-poppins-500 text-[#4F4F4F] ml-[1rem]'>{element.label}</div>
                            </div>
                            <input
                              type='checkbox'
                              name='checkbox'
                              className='transform scale-150 accent-black'
                              defaultChecked={room[element.queryKey]}
                              {...register(element.queryKey)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className='mt-[2rem] flex justify-end w-full'>
                    <div className='flex justify-between gap-4'>
                      <button
                        type='submit'
                        onClick={onSubmit}
                        className='px-[1.1rem] py-[0.5rem] flex justify-center items-center bg-[#236CFC] hover:bg-green-700 text-white font-inter-700 rounded-md text-sm'
                      >
                        Lưu
                      </button>
                      <button
                        type='button'
                        onClick={() => toggle(0)}
                        className='px-[1.1rem] py-[0.5rem] flex justify-center items-center bg-[#C62D2D] hover:bg-red-900 text-white font-inter-700 rounded-md text-sm'
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className='cursor-pointer w-[2rem] flex justify-end font-inter-700 text-[#656565] text-3xl'
                  onClick={() => toggle(0)}
                >
                  x
                </div>
              </div>
            </div>
          </form>
        </>
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
        isOpen={checked === 2}
      >
        <>
          <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang gửi yêu cầu chỉnh sửa...</div>
          <TailSpin
            height='200'
            width='200'
            color='#4fa94d'
            ariaLabel='tail-spin-loading'
            radius='5'
            visible={true}
            wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
          />
        </>
      </Modal>
    </>
  )
}
