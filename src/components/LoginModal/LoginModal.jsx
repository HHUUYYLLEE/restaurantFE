import { yupResolver } from '@hookform/resolvers/yup'
import { GoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { loginAccount, loginGoogleAccount } from '../../api/user.api'
import { AppContext } from '../../contexts/app.context'
import { getInfoFromLS } from '../../utils/auth'
import { schemaLogin } from '../../utils/rules'

import { isAxiosUnprocessableEntityError } from '../../utils/utils'
export default function LoginModal({ closeModalLogin }) {
  const { setIsAuthenticated, setInfo } = useContext(AppContext)
  const navigate = useNavigate()
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
  }, [])
  const loginAccontMutation = useMutation({
    mutationFn: (body) => loginAccount(body)
  })
  const loginGoogleAccontMutation = useMutation({
    mutationFn: (body) => loginGoogleAccount(body)
  })
  function onSubmitGoogle(credential) {
    loginGoogleAccontMutation.mutate(credential, {
      onSuccess: () => {
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
    loginAccontMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data?.data.data.user.role)
        setInfo(getInfoFromLS())
        closeModalLogin()
        setIsAuthenticated(true)
        switch (data?.data.data.user.role) {
          case 0:
            navigate('/')
            break
          case 1:
            navigate('/admin')
            break
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
          <div>
            <div className='w-full justify-between items-center'>
              <div className='font-inter-700 sm:text-3xl text-2xl text-green-500'>Đăng nhập</div>
              <div className='font-ibm-plex-serif-400 sm:text-xl text-orange-500 sm:mt-[0.7rem] text-sm mt-[0.5rem]'>
                Đăng nhập để quay trở lại vnFood.
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
                  className='bg-orange-500 hover:bg-green-500 text-white 
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
          </div>
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
        isOpen={loginAccontMutation.isPending}
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
