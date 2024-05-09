import React, { useContext, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { AppContext } from '../../contexts/app.context'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from '../../utils/rules'
import { loginAccount } from '../../api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { TailSpin } from 'react-loader-spinner'
import { getInfoFromLS } from '../../utils/auth'
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

  const onSubmit = handleSubmit((data) => {
    //  console.log(data)
    loginAccontMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data?.data.data.user.roles)
        toast.success('Đăng nhập thành công !') //。(20)
        setInfo(getInfoFromLS())
        setIsAuthenticated(true)
        switch (data?.data.data.user.roles) {
          case 1:
            navigate('/host')
            break
          case 2:
            navigate('/admin/dashboard')
            break
          default:
            break
        }
        closeModalLogin()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
          if (formError) {
            setError('user_name', {
              message: formError.user_name?.msg,
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
        <div className='relative w-[26rem] max-h-full'>
          {/* <div
            onClick={() => closeModalLogin()}
            className='absolute right-0 top-[-0.5rem] rounded-full transition-all duration-300  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 flex justify-center items-center h-8 w-8  dark:text-yellow-400 font-extrabold'
          >
            <AiOutlineClose />
          </div> */}
          <div>
            <div className='w-full justify-between items-center'>
              <div className='font-inter-700 text-3xl'>Đăng nhập</div>
              <div className='font-ibm-plex-serif-400 text-xl mt-[0.7rem]'>Đăng nhập tài khoản để tiếp tục</div>
            </div>
            <form className='w-full' onSubmit={onSubmit} noValidate>
              <div className='mt-[3rem]'>
                <input
                  type='text'
                  id='user_name'
                  name='user_name'
                  placeholder='Username'
                  autoComplete='on'
                  {...register('user_name')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl w-full py-6 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.user_name?.message}</div>
              </div>

              <div className=''>
                <input
                  id='password'
                  type='password'
                  name='password'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl w-full py-6 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.password?.message}</div>
              </div>
              <div className='font-inter-400'>
                <span>Bạn chưa có tài khoản</span>
                <span className='text-[#0038FF] underline cursor-pointer'>? Đăng ký tại đây</span>
              </div>
              <div className='w-full flex justify-center items-center pt-14'>
                <button className='bg-[#0366FF] hover:bg-green-500  mx-5 text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'>
                  Đăng nhập
                </button>
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
    </div>
  )
}
