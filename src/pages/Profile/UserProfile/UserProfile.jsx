import { editUserProfile, getUserProfile, editUserAvatar } from '../../../api/user.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfoFromLS } from '../../../utils/auth'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { schemaEditUserProfile } from '../../../utils/rules'
import { useRef } from 'react'
import { TailSpin } from 'react-loader-spinner'
import Modal from 'react-modal'

export default function UserProfile() {
  const user_id = getInfoFromLS()._id
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaEditUserProfile)
  })
  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    setError: setErrorAvatar,
    formState: { errors: errorsAvatar }
  } = useForm({
    mode: 'all'
  })
  const editUserProfileMutation = useMutation({
    mutationFn: (body) => editUserProfile(body)
  })
  const editUserAvatarMutation = useMutation({
    mutationFn: (body) => editUserAvatar(body)
  })

  const { status, data, isLoading } = useQuery({
    queryKey: ['userProfile', user_id],
    queryFn: () => {
      return getUserProfile(user_id)
    }
  })

  const dataUser = data?.data?.user
  console.log(dataUser)
  const previewImageElement = useRef()
  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    editUserProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Cập nhật profile thành công !') //。(20)
        window.location.reload()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
          if (formError) {
            setError('username', {
              message: formError.username?.msg,
              type: 'Server'
            })
          }
        }
      }
    })
  })
  const onSubmitAvatar = handleSubmitAvatar((data) => {
    // console.log(data)
    data.avatar = data.avatar[0]
    editUserAvatarMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Cập nhật avatar thành công !') //。(20)
        window.location.reload()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errorsAvatar
          console.log(formError)
          if (formError) {
            setErrorAvatar('avatar', {
              message: formError.avatar?.msg,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <>
      {editUserProfileMutation.isPending || editUserAvatarMutation.isPending ? (
        <>
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
            isOpen={true}
          >
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang cập nhật</div>
            <TailSpin
              height='200'
              width='200'
              color='#4fa94d'
              ariaLabel='tail-spin-loading'
              radius='5'
              visible={true}
              wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
            />
          </Modal>
        </>
      ) : (
        <></>
      )}
      {dataUser && (
        <div className='m-auto grid grid-cols-[15] w-[70vw] gap-14'>
          <div className='col-span-10'>
            <form key={1} onSubmit={onSubmit}>
              <div className='flex items-center gap-x-4'>
                <div className='text-xl w-[10vw]'>Username</div>
                <input
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Username (nếu bỏ trống thì "newUser")'
                  autoComplete='off'
                  defaultValue={dataUser.username}
                  {...register('username')}
                  className='w-[35vw] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
                />
              </div>
              <div className='mt-[3rem] flex items-center gap-x-5'>
                <div className='text-xl w-[10vw]'>Số điện thoại</div>
                <input
                  type='text'
                  id='phone_number'
                  name='phone_number'
                  placeholder='Số điện thoại'
                  autoComplete='off'
                  defaultValue={dataUser.phone_number}
                  {...register('phone_number')}
                  className='w-[35vw] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.phone_number?.message}</div>
              </div>
              <div className='mt-[3rem] flex items-center gap-x-5'>
                <div className='text-xl w-[10vw]'>Địa chỉ</div>
                <input
                  type='text'
                  id='address'
                  name='address'
                  placeholder='Địa chỉ'
                  autoComplete='off'
                  defaultValue={dataUser.address}
                  {...register('address')}
                  className='w-[35vw] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
                />
              </div>
              <button className='mt-[3rem] hover:bg-[#0366FF] bg-green-500  text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'>
                Cập nhật thông tin
              </button>
            </form>
          </div>
          <div className='col-start-11 col-span-5'>
            <div className='flex justify-center'>
              <div>
                <div className='text-lg'>Ảnh đại diện</div>

                <img
                  src={dataUser?.avatar_url}
                  className='w-[10rem] h-[10rem] mt-4'
                  onError={(e) => {
                    e.target.style.visibility = 'hidden'
                  }}
                  ref={previewImageElement}
                />
                <form key={2} onSubmit={onSubmitAvatar}>
                  <input
                    type='file'
                    id='avatar'
                    name='avatar'
                    accept='image/*'
                    {...registerAvatar('avatar')}
                    className='bg-transparent'
                    onChange={(e) => {
                      const [file] = e.target.files
                      if (file) {
                        // console.log(file)

                        previewImageElement.current.src = URL.createObjectURL(file)
                        previewImageElement.current.style.visibility = 'visible'
                      }
                    }}
                  />
                  <button className='mt-[3rem] hover:bg-[#0366FF] bg-green-500  text-white py-[1rem] px-[1rem] font-ibm-plex-serif-700 rounded-lg'>
                    Cập nhật avatar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
