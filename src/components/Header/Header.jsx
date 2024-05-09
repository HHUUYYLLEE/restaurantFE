import { Link, NavLink, useLocation, createSearchParams, useNavigate } from 'react-router-dom'
import LoginModal from '../LoginModal'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import Ava from '../../asset/img/ava.png'
import { AppContext } from '../../contexts/app.context'
import { useEffect, useRef, useState, useContext } from 'react'
import { logoutAccount } from '../../api/auth.api'
import { useMutation } from '@tanstack/react-query'
import Modal from 'react-modal'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'

import { TailSpin } from 'react-loader-spinner'

// const headerItems = [
//   { id: 1, name: 'Trang chủ', path: '/' },
//   { id: 2, name: 'Đăng nhập', path: '/login' },
//   { id: 3, name: 'Đăng ký', path: '/signup' }
// ]

export default function Header() {
  const { register, handleSubmit } = useForm({})
  const queryConfig = useQueryConfig()

  const navigate = useNavigate()
  const [modalLogin, setModalLogin] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const { isAuthenticated, setIsAuthenticated, info, setInfo } = useContext(AppContext)

  const openModalLogin = () => {
    setModalLogin(true)
  }
  const closeModalLogin = () => {
    setModalLogin(false)
  }

  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setInfo(null)
      setLogoutModal(false)
    },
    onError: () => {
      setLogoutModal(false)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const path = useLocation()

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
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: '/',
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            ...data
          },
          [
            'address',
            'type',
            'sort',
            'price_min',
            'price_max',
            'area_min',
            'area_max',
            'is_have_parking_lot',
            'is_new',
            'is_high_security',
            'is_have_owner',
            'is_have_bed',
            'is_have_wardrobe',
            'is_have_dinning_table',
            'is_have_refrigerator',
            'is_have_television',
            'is_have_kitchen',
            'is_have_washing_machine',
            'number_or_people'
          ]
        )
      ).toString()
    })
  })
  // const { data, isLoading, isSuccess, refetch } = useQuery({
  //   queryKey: ['randomRoom'],
  //   queryFn: () => {
  //     return getRandomRoom()
  //   },
  //   staleTime: 1000 * 60 * 5
  // })
  return (
    <>
      <header className='fixed flex top-0 w-full h-20 shadow-lg items-center transition duration-300 z-[20] bg-orange-600'>
        <div className='ml-20 text-3xl italic text-white'>
          <Link onClick={() => this.forceUpdate} to='/'>
            vnFood
          </Link>
        </div>
        <form onSubmit={onSubmit}>
          <div className='relative ml-10 w-[50vw]'>
            <div className='absolute mt-3 ml-2 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              {...register('search')}
              className='font-andika focus:outline-none placeholder-white bg-white/30 text-white pl-16 py-3 w-full text-sm border border-gray-300 rounded-[10px]'
              placeholder='Tìm kiếm quận, huyện, vị trí, phòng trọ,...'
            ></input>
            <button
              type='submit'
              className='bg-green-600 absolute right-2.5 bottom-[10px] text-white focus:outline-none italic px-2 rounded-[20px]'
            >
              Tìm kiếm
            </button>
          </div>
        </form>
        <div className='flex ml-10 gap-8 font-poppins-500'>
          <Link onClick={() => this.forceUpdate} to='/' className='group text-lg transition duration-300 text-white'>
            Trang chủ
            <span
              className='max-w-0 group-hover:max-w-[80%] transition-all duration-500
               block rounded-xl mt-[0.5vh] h-[0.1rem] mx-auto bg-white'
            />
          </Link>

          <div className={`flex flex-row gap-8 ${isAuthenticated && 'invisible'}`}>
            <div onClick={openModalLogin} className='group cursor-pointer text-lg transition duration-300 text-white'>
              Đăng nhập
              <span
                className='max-w-0 group-hover:max-w-[80%] transition-all duration-500
                 block rounded-xl mt-[0.5vh] h-[0.1rem] mx-auto bg-white'
              />
            </div>
            <NavLink
              onClick={() => this.forceUpdate}
              to='/signup'
              className={`group text-lg transition duration-300 ${
                path.pathname.includes('/room') ? 'text-black' : 'text-white'
              }`}
            >
              Đăng ký
              <span
                className='max-w-0 group-hover:max-w-[80%] transition-all duration-500
                block rounded-xl mt-[0.5vh] h-[0.1rem] mx-auto bg-white'
              />
            </NavLink>
          </div>
        </div>
        <div
          className={`relative mr-20 cursor-pointer font-poppins-600 ${!isAuthenticated && 'invisible'}`}
          ref={refDropDown}
        >
          <div onClick={toggleMenu} className='flex items-center gap-2'>
            <div className='bg-gray-300 rounded-full w-[3rem] h-[3rem] flex items-center justify-center'>
              <img src={Ava} alt='' className='w-[2rem] h-[2rem]' />
            </div>
            <div className='font-semibold text-white'>{info?.user_name}</div>
          </div>
          {isOpen && (
            <div className='absolute z-10 mt-4 w-[10vw] rounded-lg shadow-lg border-[1px] border-black focus:outline-none bg-white/80'>
              <div className='py-1 divide-y-[1px] divide-gray-400'>
                <button className='inline-flex w-full justify-center px-4 py-3 text-lg -mt-0.5'>Tài khoản</button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setLogoutModal(true)
                  }}
                  className='inline-flex w-full justify-center text-red-600 px-4 py-3 text-lg mt-0.5'
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {modalLogin && <LoginModal closeModalLogin={closeModalLogin} />}
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
        isOpen={logoutModal}
        onRequestClose={() => setLogoutModal(false)}
      >
        {logoutMutation.isPending ? (
          <>
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang đăng xuất...</div>
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
        ) : (
          <>
            <div className='font-inter-700 text-4xl'>Bạn có muốn đăng xuất?</div>
            <div className='mt-[8vh] flex justify-between'>
              <button
                onClick={handleLogout}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#0366FF] hover:bg-green-700 text-white font-inter-700 rounded-lg text-xl'
              >
                Đăng xuất
              </button>
              <button
                onClick={() => setLogoutModal(false)}
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
