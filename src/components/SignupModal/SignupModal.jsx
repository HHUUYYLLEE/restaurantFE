import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { AppContext } from '../../contexts/app.context'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaSignup } from '../../utils/rules'
import { signUpAccount, loginGoogleAccount } from '../../api/user.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { TailSpin } from 'react-loader-spinner'
import { getInfoFromLS } from '../../utils/auth'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { GoogleLogin } from '@react-oauth/google'

export default function SignupModal({ closeModalSignup }) {
  const { setIsAuthenticated, setInfo, isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  console.log(isAuthenticated)
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
  })
  const signUpAccontMutation = useMutation({
    mutationFn: (body) => signUpAccount(body)
  })
  const loginGoogleAccontMutation = useMutation({
    mutationFn: (body) => loginGoogleAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    data.avatar = data.avatar[0]
    console.log(data)
    signUpAccontMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Đăng ký thành công !') //。(20)
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
    // console.log(credential)
    loginGoogleAccontMutation.mutate(credential, {
      onSuccess: () => {
        toast.success('Đăng nhập Google thành công !') //。(20)
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
      <div className='modal-content bg-white flex justify-center'>
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

          <div className='w-full justify-between items-center'>
            <div className='font-inter-700 text-3xl'>Đăng ký</div>
            <div className='font-ibm-plex-serif-400 text-xl mt-[0.7rem]'>Đăng ký tài khoản để tiếp tục</div>
          </div>
          <form className='w-full' onSubmit={onSubmit} noValidate>
            <div className='mt-[3rem] flex gap-10'>
              <div>
                <input
                  type='text'
                  id='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='on'
                  {...register('email')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl  py-2 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.email?.message}</div>
              </div>
              <div>
                <input
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Username (không bắt buộc)'
                  autoComplete='on'
                  {...register('usernmae')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl  py-2 px-[2rem]'
                />
              </div>
            </div>
            <div>
              <input
                id='password'
                type='password'
                name='password'
                placeholder='Password'
                autoComplete='on'
                {...register('password')}
                className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl w-full rounded-xl py-2 px-[2rem]'
              />
              <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.password?.message}</div>
            </div>

            <div className='mt-[3rem] flex'>
              <div>
                <div>Ảnh đại diện</div>
                <input
                  type='file'
                  id='avatar'
                  name='avatar'
                  accept='image/*'
                  {...register('avatar')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400  font-inter-500 border-[#E6E6E6] w-full py-6'
                  onChange={(e) => {
                    const [file] = e.target.files
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file))
                      previewImageElement.current.style.visibility = 'visible'
                    }
                  }}
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.avatar?.message}</div>
              </div>
              <img
                src={previewImage}
                className='w-[10rem] h-[10rem]'
                onError={(e) => {
                  e.target.style.visibility = 'hidden'
                }}
                ref={previewImageElement}
              />
            </div>

            <div className='font-inter-400 mt-[3rem]'>
              <span>Bạn chưa có tài khoản? Đăng ký </span>
              <span className='text-[#0038FF] underline cursor-pointer'>tại đây</span>
            </div>
            <div className='w-full flex justify-between items-center mt-14'>
              <button
                type='submit'
                className='bg-[#0366FF] hover:bg-green-500  text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'
              >
                Đăng ký
              </button>
              <GoogleLogin
                theme='filled_black'
                text='signup_with'
                size='large'
                width='300'
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
            isOpen={signUpAccontMutation.isPending}
          >
            <>
              <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang đăng nhập...</div>
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
  )
}
