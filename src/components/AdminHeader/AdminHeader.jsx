import { useContext, useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
import { clearAccessTokenFromLS } from '../../utils/auth'

import { FaAngleRight } from 'react-icons/fa6'
import { HiOutlineViewList } from 'react-icons/hi'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
export default function AdminHeader({ collapsedSidebar, setCollapsedSidebar, setOption }) {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const { info, setInfo, setIsAuthenticated } = useContext(AppContext)
  const [logoutModal, setLogoutModal] = useState(false)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const refDropDown = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refDropDown.current && !refDropDown.current.contains(event.target)) {
        setIsOpen(false)
      }
      if (refSidebar.current && !refSidebar.current.contains(event.target)) {
        setCollapsedSidebar(true)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setCollapsedSidebar])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const refSidebar = useRef(null)
  return (
    <>
      <header className='fixed flex top-0 w-full h-20 shadow-lg items-center justify-between transition duration-300 z-[20] bg-orange-600'>
        <div className='flex'>
          <div ref={refSidebar} className='cursor-pointer relative'>
            <div
              className='ml-[0.7rem] '
              onClick={() => {
                setCollapsedSidebar((prev) => !prev)
              }}
            >
              <HiOutlineViewList
                style={{
                  color: 'white',
                  width: screen.width < 640 ? '10vw' : '2vw',
                  height: screen.width < 640 ? '10vw' : '2vw'
                }}
              />
            </div>
            <div ref={refSidebar} className='absolute top-[3.6rem]'>
              <Sidebar
                width={screen.width < 640 ? '35vw' : '10vw'}
                collapsed={collapsedSidebar}
                rootStyles={{ height: '100vh' }}
                collapsedWidth='0px'
                backgroundColor='rgb(234,88,12)'
              >
                <Menu
                  menuItemStyles={{
                    button: {
                      backgroundColor: 'rgb(234,88,12)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgb(254,88,12)'
                      }
                    }
                  }}
                >
                  <MenuItem>
                    <div
                      className='flex items-center justify-between'
                      onClick={() => {
                        setOption(0)
                        setCollapsedSidebar(true)
                      }}
                    >
                      <div>User</div>
                      <FaAngleRight />
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div
                      className='flex items-center justify-between'
                      onClick={() => {
                        setOption(1)
                        setCollapsedSidebar(true)
                      }}
                    >
                      <div>Đánh giá</div>
                      <FaAngleRight />
                    </div>
                  </MenuItem>
                </Menu>
              </Sidebar>
            </div>
          </div>
          <div className='ml-[0.7rem] sm:text-3xl text-xl italic text-white'>
            <Link to='/admin' className='focus:outline-none'>
              vnFood
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-x-[1rem] mr-[3rem]'>
          <div className={`relative cursor-pointer font-poppins-600 `} ref={refDropDown}>
            <div onClick={toggleMenu} className='flex items-center'>
              <div className='bg-white rounded-full w-[3rem] h-[3rem] flex items-center overflow-hidden justify-center'>
                <img referrerPolicy='no-referrer' src={info?.avatar_url} className='' />
              </div>
              {screen.width > 640 && (
                <div className='font-semibold ml-2 text-white'>{info?.username}</div>
              )}
            </div>
            {isOpen && (
              <div
                className='absolute z-10 mt-4 sm:ml-0 ml-[-1rem] sm:w-[10vw] left-[-1rem] 
              w-[35vw] rounded-lg shadow-lg border-[1px] border-black focus:outline-none 
              bg-white/80'
              >
                <div className='py-1 divide-y-[1px] divide-gray-400'>
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
              clearAccessTokenFromLS()
              setInfo(null)
              navigate('/')
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
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
