import { yupResolver } from '@hookform/resolvers/yup'
import { GoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { GrUpload } from 'react-icons/gr'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { loginGoogleAccount, signUpAccount } from '../../api/user.api'
import { AppContext } from '../../contexts/app.context'
import { getInfoFromLS } from '../../utils/auth'
import { schemaSignup } from '../../utils/rules'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
export default function SignupModal({ closeModalSignup }) {
  const { setIsAuthenticated, setInfo } = useContext(AppContext)
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState('#')
  const previewImageElement = useRef()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaSignup)
  })

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const signUpAccontMutation = useMutation({
    mutationFn: (body) => signUpAccount(body)
  })
  const loginGoogleAccontMutation = useMutation({
    mutationFn: (body) => loginGoogleAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    data.avatar = data.avatar[0]
    signUpAccontMutation.mutate(data, {
      onSuccess: () => {
        setInfo(getInfoFromLS())
        setIsAuthenticated(true)
        closeModalSignup()
        navigate('/')
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
  function onSubmitGoogle(credential) {
    loginGoogleAccontMutation.mutate(credential, {
      onSuccess: () => {
        setInfo(getInfoFromLS())
        setIsAuthenticated(true)
        closeModalSignup()
        navigate('/')
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
  return (
    <div className='modal'>
      <div
        className='overlay'
        onClick={() => {
          closeModalSignup()
          setPreviewImage('#')
        }}
      ></div>
      <div className='modal-content bg-white sm:w-[52vw] w-[80vw] sm:h-[90vh] h-[75vh]'>
        <div className='relative'>
          <div
            onClick={() => {
              closeModalSignup()
              setPreviewImage('#')
            }}
            className='absolute right-0 top-[-0.5rem] rounded-full transition-all duration-300  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 flex justify-center items-center h-8 w-8  dark:text-yellow-400 font-extrabold'
          >
            <AiOutlineClose />
          </div>

          <div className=''>
            <div className='font-inter-700 sm:text-3xl text-green-700'>Đăng ký</div>
            <div className='font-ibm-plex-serif-400 sm:text-xl text-orange-500 sm:mt-[0.7rem]'>
              Chào mừng đến với vnFood!
            </div>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <div className='sm:mt-[1rem] mt-[1rem] sm:flex sm:gap-x-10'>
              <div>
                <input
                  type='text'
                  id='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='on'
                  {...register('email')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F]
                  sm:w-full w-[69vw] focus:placeholder:text-transparent
                  placeholder:font-inter-400 border font-inter-500 border-[#ff822e]
                  sm:text-xl rounded-xl sm:py-1 sm:px-[2rem] px-[1rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.email?.message}
                </div>
              </div>
              <div>
                <input
                  type='text'
                  id='phone_number'
                  name='phone_number'
                  placeholder='SĐT'
                  autoComplete='on'
                  {...register('phone_number')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F]
                  sm:w-full w-[69vw] focus:placeholder:text-transparent
                  placeholder:font-inter-400 border font-inter-500 border-[#ff822e]
                  sm:text-xl rounded-xl sm:py-1 sm:px-[2rem] px-[1rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.phone_number?.message}
                </div>
              </div>
            </div>
            <div>
              <input
                id='password'
                type='password'
                name='password'
                placeholder='Mật khẩu'
                autoComplete='on'
                {...register('password')}
                className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F]
                sm:w-full w-[69vw] focus:placeholder:text-transparent
                placeholder:font-inter-400 border font-inter-500 sm:mt-0 border-[#ff822e] 
                sm:text-xl rounded-xl sm:py-1 sm:px-[2rem] px-[1rem]'
              />
              <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                {errors.password?.message}
              </div>
            </div>
            <div>
              <input
                id='confirm_password'
                type='confirm_password'
                name='confirm_password'
                placeholder='Xác nhận mật khẩu'
                autoComplete='on'
                {...register('confirm_password')}
                className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F]
                sm:w-full w-[69vw] focus:placeholder:text-transparent
                placeholder:font-inter-400 border font-inter-500 sm:mt-0 border-[#ff822e]
                sm:text-xl rounded-xl sm:py-1 sm:px-[2rem] px-[1rem]'
              />
              <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                {errors.confirm_password?.message}
              </div>
            </div>
            <div className='flex'>
              <div>
                <div>Ảnh đại diện</div>
                <input
                  type='file'
                  id='avatar'
                  name='avatar'
                  accept='.png, .jpg'
                  {...register('avatar')}
                  className='absolute z-[-1000] text-transparent left-0'
                  onChange={(e) => {
                    const [file] = e.target.files
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file))
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
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.avatar?.message}
                </div>
              </div>
              <img
                src={previewImage}
                className='sm:w-[10rem] sm:h-[10rem] w-[30vw] h-[30vw]'
                onError={(e) => {
                  e.target.style.visibility = 'hidden'
                }}
                ref={previewImageElement}
              />
            </div>
            <div
              className='w-full sm:flex sm:justify-between items-center 
            sm:mt-[1.5rem] mt-[1rem]'
            >
              <div className='sm:block sm:justify-start flex justify-center'>
                <button
                  type='submit'
                  className='bg-orange-600 hover:bg-green-500
                text-white 2xl:py-[1.2rem] 2xl:px-[7rem] px-[3rem] py-[0.4rem] font-ibm-plex-serif-700 rounded-lg'
                >
                  Đăng ký
                </button>
              </div>
              <div className='sm:block sm:justify-start flex justify-center sm:mt-0 mt-[0.5rem]'>
                <GoogleLogin
                  theme='filled_black'
                  text='signup_with'
                  size='large'
                  width={screen.width >= 640 ? '300' : '30'}
                  useOneTap
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse)
                    const credential = { credential: credentialResponse?.credential }
                    onSubmitGoogle(credential)
                  }}
                  onError={() => {
                    console.log('Login Failed')
                  }}
                />
              </div>
            </div>
          </form>
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
        isOpen={signUpAccontMutation.isPending}
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
    </div>
  )
}
