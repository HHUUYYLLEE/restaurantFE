import Pepega from '../../asset/img/pepega.png'
import { FaRegBell } from 'react-icons/fa6'
import { FaMoon } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryConfig from '../../hooks/useQueryConfig'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { logoutAccount } from '../../api/auth.api'
import { AppContext } from '../../contexts/app.context'

export default function AdminHeader() {
  const { register, handleSubmit } = useForm({})
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const onSubmit = handleSubmit((data) => {
    console.log(data)
    navigate({
      pathname: '/admin/dashboard',
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

  const { isAuthenticated, setIsAuthenticated, info, setInfo } = useContext(AppContext)

  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setInfo(null)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
    navigate('/')
  }

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
    <header className='flex justify-between flex-row mt-4'>
      <div className='flex flex-col text-[#707EAE] ml-4'>
        <div>
          <span>Pages / </span>
          <Link onClick={() => this.forceUpdate} to='/admin/dashboard'>
            <span>Quản lý phòng trọ</span>
          </Link>
        </div>
        <div className='text-[#2B3674] font-semibold text-3xl'>Main Dashboard</div>
      </div>
      <div className='bg-white p-2.5 rounded-full w-[31rem] flex justify-between items-center'>
        <form onSubmit={onSubmit} className='mr-3'>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-8 pointer-events-none z-10'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-[#2B3674]'
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
              className='h-[48px] font-andika backdrop-blur placeholder:text-[#8F9BBA] block p-4 pl-16 text-sm border border-gray-300 rounded-full outline-none bg-[#F4F7FE]'
              placeholder='Search'
            ></input>
          </div>
        </form>
        <FaRegBell className='text-[#8F9BBA] w-[1.5rem] h-[1.5rem] cursor-pointer' />
        <FaMoon className='text-[#8F9BBA] w-[1.3rem] h-[1.3rem] cursor-pointer' />
        <IoMdInformationCircleOutline className='text-[#8F9BBA] w-[1.7rem] h-[1.7rem] cursor-pointer' />
        <div className={`cursor-pointer font-poppins-600 relative`} ref={refDropDown}>
          <div onClick={toggleMenu} className='flex items-center gap-2'>
            <div className='bg-gray-300 rounded-full w-[3rem] h-[3rem] flex items-center justify-center'>
              <img src={Pepega} alt='' className='w-[2rem] h-[2rem]' />
            </div>
          </div>
          {isOpen && (
            <div className='absolute left-auto right-0 z-10 mt-4 w-[10vw] rounded-lg shadow-lg border-[1px] border-black focus:outline-none bg-white'>
              <div className='py-1 divide-y-[1px] divide-gray-400'>
                <button className='inline-flex w-full justify-center px-4 py-3 text-lg -mt-0.5'>Tài khoản</button>
                <button
                  onClick={handleLogout}
                  className='inline-flex w-full justify-center text-red-600 px-4 py-3 text-lg mt-0.5'
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
