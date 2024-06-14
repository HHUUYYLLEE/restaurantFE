import { editUserProfile, getUserProfile, editUserAvatar } from '../../../api/user.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfoFromLS } from '../../../utils/auth'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { schemaEditUserProfile } from '../../../utils/rules'
import { useRef } from 'react'
import Modal from 'react-modal'
import { Oval } from 'react-loader-spinner'
import { GrUpload } from 'react-icons/gr'

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
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })

  const dataUser = data?.data?.user
  console.log(dataUser)
  const previewImageElement = useRef()
  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    editUserProfileMutation.mutate(data, {
      onSuccess: () => {
        // toast.success('Cập nhật profile thành công !') //。(20)
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
        // toast.success('Cập nhật avatar thành công !') //。(20)
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
      {dataUser && (
        <div className='sm:m-auto m-auto sm:grid sm:grid-cols-[15] sm:w-[72vw] w-[92vw] p-2 gap-12'>
          <div className='sm:col-span-5'>
            <div className=''>
              <div>
                <div className='text-lg text-orange-600'>Ảnh đại diện</div>
                <img
                  referrerPolicy='no-referrer'
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
                    className='absolute z-[-1000] left-0'
                    onChange={(e) => {
                      const [file] = e.target.files
                      if (file) {
                        // console.log(file)

                        previewImageElement.current.src = URL.createObjectURL(file)
                        previewImageElement.current.style.visibility = 'visible'
                      }
                    }}
                  />
                  <label htmlFor='avatar'>
                    <div
                      className=' hover:bg-green-800 cursor-pointer justify-center
                     sm:py-[0.3rem] 
                     py-[0.4rem] w-[10rem] flex items-center  rounded-lg bg-green-500'
                    >
                      <GrUpload
                        style={{
                          color: 'white',
                          width: screen.width < 640 ? '5vw' : '2vw',
                          height: screen.width < 640 ? '5vw' : '2vw'
                        }}
                      />
                    </div>
                  </label>
                  <button
                    className=' hover:bg-green-500 bg-orange-500 w-[10rem]
                  text-white py-[0.3rem] px-[0.5rem] font-ibm-plex-serif-700 rounded-lg
                  mt-[2rem] sm:px-[0.8rem] sm:py-[0.4rem] italic'
                  >
                    Cập nhật ảnh
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className='sm:col-start-6 sm:col-span-10 sm:mt-0 mt-[3rem]'>
            <form key={1} onSubmit={onSubmit}>
              <div className='flex items-center gap-x-4'>
                <div className='sm:text-xl text-orange-600 sm:w-[9vw] w-[19vw]'>Email</div>
                <input
                  type='text'
                  defaultValue={dataUser.email}
                  disabled
                  className='sm:w-[35vw] 
                  w-[55vw] focus:outline-none placeholder:text-[0.7rem] placeholder:text-[#ee4c0c7e]
                  placeholder:font-inter-400 border font-inter-500 border-[#ff822e]
                  text-lg rounded-xl py-2 px-[1rem]'
                />
              </div>
              <div className='sm:mt-[3rem] mt-[1rem] flex items-center gap-x-4'>
                <div className='sm:text-xl sm:w-[9vw] text-orange-600 w-[19vw]'>Username</div>
                <input
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Tên mặc định là "newUser"'
                  defaultValue={dataUser.username}
                  {...register('username')}
                  className='sm:w-[35vw] w-[55vw] focus:outline-none  placeholder:text-[#ee4c0c7e] 
                   placeholder:font-inter-400 border font-inter-500 border-[#ff822e] text-lg 
                   focus:placeholder:text-transparent
                   rounded-xl py-2 px-[1rem] placeholder:text-[0.7rem]'
                />
              </div>

              <div className='sm:mt-[3rem] mt-[1rem] flex items-center gap-x-4'>
                <div className='sm:text-xl sm:w-[9vw] w-[19vw] text-orange-600'>SĐT</div>
                <input
                  type='text'
                  id='phone_number'
                  name='phone_number'
                  defaultValue={dataUser.phone_number}
                  {...register('phone_number')}
                  className='sm:w-[35vw] w-[55vw] focus:outline-none placeholder:text-[0.7rem]
                  placeholder:text-[#ee4c0c7e] focus:placeholder:text-transparent placeholder:font-inter-400 border font-inter-500
                  border-[#ff822e] text-lg  rounded-xl py-2 px-[1rem]'
                />
              </div>
              <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                {errors.phone_number?.message}
              </div>
              <div className='flex sm:gap-x-[5rem] gap-x-[1rem] sm:mt-[0.7rem]'>
                <button
                  type='submit'
                  className=' hover:bg-green-500 bg-orange-500  
                  text-white py-[0.3rem] px-[0.5rem] sm:px-[0.8rem] sm:py-[0.4rem] 
                  font-ibm-plex-serif-700 rounded-lg italic
                   '
                >
                  Cập nhật thông tin
                </button>
                <button
                  type='button'
                  className=' hover:bg-red-700 bg-red-500  
                  text-white py-[0.3rem] px-[0.5rem] sm:px-[0.8rem] sm:py-[0.4rem] 
                  font-ibm-plex-serif-700 rounded-lg italic'
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
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
        isOpen={editUserProfileMutation.isPending || editUserAvatarMutation.isPending}
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
