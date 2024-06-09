import React, { useContext, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { AppContext } from '../../contexts/app.context'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from '../../utils/rules'
import { loginAccount, loginGoogleAccount } from '../../api/user.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { TailSpin } from 'react-loader-spinner'
import { getInfoFromLS } from '../../utils/auth'
import { GoogleLogin } from '@react-oauth/google'

import { isAxiosUnprocessableEntityError } from '../../utils/utils'
export default function LoginModal({ closeModalLogin }) {
  const { setIsAuthenticated, setInfo, isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  console.log(isAuthenticated)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaLogin)
  })
  useEffect(() => {
    Modal.setAppElement('body')
  })
  const loginAccontMutation = useMutation({
    mutationFn: (body) => loginAccount(body)
  })
  const loginGoogleAccontMutation = useMutation({
    mutationFn: (body) => loginGoogleAccount(body)
  })
  function onSubmitGoogle(credential) {
    // console.log(credential)
    loginGoogleAccontMutation.mutate(credential, {
      onSuccess: () => {
        // toast.success('Đăng nhập Google thành công !') //。(20)
        setInfo(getInfoFromLS())
        setIsAuthenticated(true)
        closeModalLogin()
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

  const onSubmit = handleSubmit((data) => {
    //  console.log(data)
    loginAccontMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data?.data.data.user.role)
        // toast.success('Đăng nhập thành công !') //。(20)
        setInfo(getInfoFromLS())
        closeModalLogin()
        setIsAuthenticated(true)
        switch (data?.data.data.user.role) {
          case 0:
            navigate('/')
            break
          // case 1:
          //   navigate('/admin/dashboard')
          //   break
          default:
            break
        }
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
  return (
    <div className='modal'>
      <div className='overlay' onClick={() => closeModalLogin()}></div>
      <div className='modal-content bg-white'>
        <div className='relative sm:w-[26rem] w-[70vw] max-h-full'>
          {/* <div
            onClick={() => closeModalLogin()}
            className='absolute right-0 top-[-0.5rem] rounded-full transition-all duration-300  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 flex justify-center items-center h-8 w-8  dark:text-yellow-400 font-extrabold'
          >
            <AiOutlineClose />
          </div> */}
          <div>
            <div className='w-full justify-between items-center'>
              <div className='font-inter-700 sm:text-3xl text-2xl'>Đăng nhập</div>
              <div className='font-ibm-plex-serif-400 sm:text-xl sm:mt-[0.7rem] text-sm mt-[0.5rem]'>
                Đăng nhập tài khoản để tiếp tục
              </div>
            </div>
            <form className='w-full' onSubmit={onSubmit} noValidate>
              <div className='sm:mt-[3rem] mt-[1.1rem]'>
                <input
                  type='text'
                  id='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='on'
                  {...register('email')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                  placeholder:font-inter-400 border font-inter-500 border-[#ff822e] 
                  text-xl rounded-xl w-full sm:py-6 px-[2rem]
                  focus:placeholder:text-transparent'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.email?.message}
                </div>
              </div>

              <div className=''>
                <input
                  id='password'
                  type='password'
                  name='password'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                  placeholder:font-inter-400 border font-inter-500 border-[#ff822e]
                  text-xl rounded-xl w-full sm:py-6 px-[2rem]
                  focus:placeholder:text-transparent'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.password?.message}
                </div>
              </div>

              <div className='w-full flex justify-center items-center sm:pt-5 pt-3'>
                <button
                  type='submit'
                  className='bg-[#0366FF] hover:bg-green-500 text-white 
                  sm:py-[1.2rem] sm:px-[7rem] px-[2rem] py-[0.5rem] font-ibm-plex-serif-700 rounded-lg'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-10 w-full flex justify-center items-center'>
                <GoogleLogin
                  useOneTap
                  theme='filled_black'
                  text='continue_with'
                  size='large'
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
            </form>
            <Modal
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  zIndex: 28
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
                  borderRadius: '1rem',
                  zIndex: 29
                }
              }}
              isOpen={loginAccontMutation.isPending}
            >
              <>
                <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>
                  Đang đăng nhập...
                </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
