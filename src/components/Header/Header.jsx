import { Link, createSearchParams, useNavigate, NavLink } from 'react-router-dom'
import LoginModal from '../LoginModal'
import useQueryConfig from '../../hooks/useQueryConfig'
import { AppContext } from '../../contexts/app.context'
import { useEffect, useRef, useState, useContext } from 'react'
import Modal from 'react-modal'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { clearAccessTokenFromLS } from '../../utils/auth'
import { toast } from 'react-toastify'
import { BsCart4 } from 'react-icons/bs'
import SignupModal from '../SignupModal/SignupModal'
import { simpleSearchRestaurantsAndFood } from '../../api/restaurants.api'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
export default function Header() {
  const { register } = useForm({ mode: 'all' })
  const navigate = useNavigate()
  const [modalLogin, setModalLogin] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const [signupModal, setSignupModal] = useState(false)
  const { isAuthenticated, setIsAuthenticated, info, setInfo } = useContext(AppContext)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useDebounce([search], 1000)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [allResultsToggle, setAllResultsToggle] = useState(false)
  const { data } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => {
      return simpleSearchRestaurantsAndFood({ search: searchParams })
    },
    keepPreviousData: true,
    enabled: allResultsToggle
  })

  const openModalLogin = () => {
    setModalLogin(true)
  }
  const closeModalLogin = () => {
    setModalLogin(false)
  }
  const openModalSignup = () => {
    setSignupModal(true)
  }
  const closeModalSignup = () => {
    setSignupModal(false)
  }
  const [expandingSearchBar, setExpandingSearchBar] = useState(false)
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

  return (
    <>
      <header className='fixed flex top-0 w-full h-20 shadow-lg items-center transition duration-300 z-[20] bg-orange-600'>
        <div className='ml-[0.7rem] sm:text-3xl text-xl italic text-white'>
          <Link to='/' className='focus:outline-none'>
            vnFood
          </Link>
        </div>
        <form>
          <div className='relative sm:ml-10 ml-5 sm:w-[50vw]'>
            <div
              className={`${
                expandingSearchBar && screen.width < 640
                  ? 'fixed left-3 top-8 z-[2]  '
                  : 'absolute mt-3 ml-2 '
              }  pointer-events-none`}
            >
              <svg
                aria-hidden='true'
                className={`${
                  expandingSearchBar && screen.width < 640 ? 'text-black ' : 'text-white '
                } w-5 h-5`}
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
            <div
              onBlur={() => {
                setTimeout(() => {
                  setShowSearchResults(false)
                  setExpandingSearchBar(false)
                  setAllResultsToggle(false)
                }, '200')
              }}
            >
              <input
                type='search'
                id='default-search'
                autoComplete='off'
                {...register('search')}
                className={`${
                  expandingSearchBar && screen.width < 640
                    ? 'w-[94vw] fixed top-4 left-2 z-[1] bg-white '
                    : 'w-[20vw] bg-white/30 text-white '
                }
              font-andika focus:outline-none placeholder-white  transition-colors duration-300
              pl-10 py-3 sm:w-full text-sm border border-gray-300 rounded-[10px] `}
                placeholder={screen.width >= 640 ? 'Tìm kiếm,...' : ''}
                onInput={(e) => {
                  if (e.target.value) {
                    setSearch(e.target.value)
                    setAllResultsToggle(true)
                  } else setAllResultsToggle(false)
                }}
                onFocus={() => {
                  setShowSearchResults(true)
                  setExpandingSearchBar(true)
                }}
              ></input>
              <div className='absolute sm:ml-0 ml-[-5.4rem] w-[93vw] mt-[1.3rem] sm:mt-0 max-h-[50vh] overflow-y-scroll'>
                {showSearchResults &&
                  data &&
                  data?.data?.data?.map((data) => {
                    return (
                      <div key={data._id}>
                        <div
                          className=' sm:w-[50vw] h-[7.5vh] sm:h-[10vh] hover:bg-[#fff5f1]
                         bg-white  sm:mr-0'
                        >
                          <Link to={`/restaurant/${data.restaurant_id || data._id}`}>
                            <div
                              onClick={() => {
                                setShowSearchResults(false)
                                setExpandingSearchBar(false)
                              }}
                              className='flex items-center sm:h-[9.5vh] h-[5vh] gap-x-2 px-[0.3rem] pt-[0.6rem] sm:p-[0.5rem]'
                            >
                              <img
                                className='w-[5vh] h-[5vh] sm:h-[7vh] sm:w-[7vh]'
                                src={data.image_url || data.main_avatar_url}
                              ></img>
                              <div className='sm:text-base text-sm'>{data.name}</div>
                            </div>
                          </Link>
                          <hr className='h-[0.1rem] mt-[1rem] sm:mt-[0.06rem] border-none bg-black' />
                        </div>
                      </div>
                    )
                  })}

                {allResultsToggle && (
                  <Link to={`/search?search=${search}`}>
                    <div
                      className='flex justify-center items-center sm:w-[50vw] h-[4.3vh] sm:h-[5vh] bg-white 
                  sm:ml-0 text-orange-500 hover:bg-[#fff5f1]'
                    >
                      Xem tất cả kết quả
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </form>
        <div className='flex items-center sm:ml-10 gap-x-8 font-poppins-500'>
          {screen.width >= 640 && (
            <Link
              onClick={() => this.forceUpdate}
              to='/'
              className='group text-lg sm:w-[5.7rem] 2xl:full transition duration-300 text-white'
            >
              Trang chủ
            </Link>
          )}
          <div className={`flex items-center ${isAuthenticated && 'hidden'}`}>
            <div
              onClick={openModalLogin}
              className='group cursor-pointer sm:text-lg ml-3 sm:w-[6.3rem] w-[6.5rem]
              text-[1rem] sm:ml-0 transition duration-300 text-white'
            >
              Đăng nhập
            </div>
            <div className={`flex items-center ${isAuthenticated && 'hidden'}`}>
              <div
                onClick={openModalSignup}
                className='group cursor-pointer sm:text-lg sm:w-[6.3rem] w-[4.2rem]
                text-[1rem] sm:ml-7 transition duration-300 text-white'
              >
                Đăng ký
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center sm:ml-[8vw] ml-[3vw] gap-x-[1rem]'>
          <div className={`${!isAuthenticated && 'hidden'}`}>
            <Link to='/order_food'>
              <BsCart4
                style={{
                  width: screen.width >= 640 ? '2.6vw' : '8vw',
                  height: screen.width >= 640 ? '2.6vw' : '8vw',
                  color: 'white'
                }}
              />
            </Link>
          </div>
          <div
            className={`relative cursor-pointer font-poppins-600 ${!isAuthenticated && 'hidden'}`}
            ref={refDropDown}
          >
            <div onClick={toggleMenu} className='flex items-center'>
              <div className='bg-gray-300 rounded-full w-[3rem] h-[3rem] flex items-center overflow-hidden justify-center'>
                <img src={info?.avatar_url} referrerPolicy='no-referrer' alt='' className='' />
              </div>
              <div className='font-semibold ml-2 text-white'>{info?.username}</div>
            </div>
            {isOpen && (
              <div
                className='absolute z-10 mt-4 sm:left-[-3rem] sm:w-[10vw] left-[-1rem] 
              w-[25vw] rounded-lg shadow-lg border-[1px] border-black focus:outline-none 
              bg-white/80'
              >
                <div className='py-1 divide-y-[1px] divide-gray-400'>
                  <NavLink to='/profile'>
                    <button
                      onClick={() => setIsOpen(false)}
                      className='inline-flex w-full justify-center sm:px-4 sm:py-3 
                      px-[0.2rem] py-[0.6rem]
                      sm:text-lg -mt-0.5'
                    >
                      Tài khoản
                    </button>
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setLogoutModal(true)
                    }}
                    className='inline-flex w-full justify-center sm:px-4 sm:py-3 px-[0.1rem]
                    sm:text-lg -mt-0.5 text-red-600 py-[0.6rem]'
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {modalLogin && <LoginModal closeModalLogin={closeModalLogin} />}
      {signupModal && <SignupModal closeModalSignup={closeModalSignup} />}

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
        <div className='font-inter-700 sm:text-2xl'>Bạn có muốn đăng xuất?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex justify-between'>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              setInfo(null)
              setLogoutModal(false)
              clearAccessTokenFromLS()
              // toast.success('Đăng xuất thành công !')
              navigate('/')
            }}
            className='flex justify-center items-center 
            bg-orange-700 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.6rem] sm:text-lg text-sm
            '
          >
            Đăng xuất
          </button>
          <button
            onClick={() => setLogoutModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Huỷ
          </button>
        </div>
      </Modal>
    </>
  )
}
