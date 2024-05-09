import { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'
import PopUpAddress from '../PopUpAddress'
import { AppContext } from '../../contexts/app.context'
import useQueryConfig from '../../hooks/useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
export default function HostNavFilter() {
  const [addressMenu, setAddressMenu] = useState(false)
  const { valueAddress, valueQuery, setValueQuery, setValueAddress } = useContext(AppContext)
  const roomTypes = [
    { label: 'Nhà trọ', type: 0 },
    { label: 'Phòng trọ', type: 1 },
    { label: 'Chung cư mini', type: 2 }
  ]
  const queryConfig = useQueryConfig()
  const [roomType, setRoomType] = useState(
    queryConfig?.type !== undefined
      ? roomTypes[
          roomTypes.findIndex((type) => {
            return type.type === parseInt(queryConfig?.type)
          })
        ]?.label
      : 'Loại phòng'
  )
  const [roomTypeMenu, setRoomTypeMenu] = useState(false)

  // console.log(queryConfig)
  const navigate = useNavigate()

  const openAddressMenu = () => {
    setAddressMenu(!addressMenu)
  }
  const openRoomTypeMenu = () => {
    setRoomTypeMenu(!roomTypeMenu)
  }
  // console.log(valueQuery)
  const refAddress = useRef(),
    refRoomType = useRef()
  const handleClickOutside = (event) => {
    if (refAddress.current && !refAddress.current.contains(event.target)) {
      setAddressMenu(false)
    }
    if (refRoomType.current && !refRoomType.current.contains(event.target)) {
      setRoomTypeMenu(false)
    }
  }

  // const onSumitQuery = () => {
  //   const searchParam = { ...queryConfig, ...valueQuery }
  //   Object.keys(searchParam).forEach(function (key) {
  //     if (searchParam[key] === false) {
  //       delete searchParam[key]
  //     }
  //   })
  //   navigate({
  //     pathname: '/',
  //     search: createSearchParams(searchParam).toString()
  //   })
  // }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // useEffect(() => {
  //   if (queryConfig?.address !== undefined) {
  //     setValueAddress(localStorage.getItem(queryConfig?.address))
  //   }
  // }, [queryConfig?.address, setValueAddress])
  return (
    <div className='w-full flex justify-center items-center border border-slate-400 px-7 pb-6 pt-8 mb-8'>
      <div className='w-[86%] flex justify-between'>
        <div className='font-poppins-700 text-[#353535] text-3xl mt-[0.5rem]'>Bộ lọc tìm kiếm</div>
        <div ref={refAddress} className='relative text-lg font-medium py-1'>
          <div
            onClick={openAddressMenu}
            className='flex  hover:text-blue-400 justify-between items-center cursor-pointer border border-black min-w-[20vw] rounded-lg  py-2 px-3'
          >
            <div></div>
            <div className=''>
              <p className='line-clamp-1 max-w-[8rem]'>{valueAddress}</p>
            </div>
            <div>
              <AiOutlineDown />
            </div>
          </div>
          {addressMenu && <PopUpAddress setAddressMenu={setAddressMenu} />}
        </div>

        <div ref={refRoomType} className='relative text-lg font-medium py-1'>
          <div
            onClick={openRoomTypeMenu}
            className='flex text-lg font-medium hover:text-blue-400 justify-between items-center border cursor-pointer border-black min-w-[20vw] rounded-lg py-2 px-10'
          >
            <div></div>

            <p className='line-clamp-1 max-w-[8rem]'>{roomType}</p>

            <div className='mr-[-2vw]'>
              <AiOutlineDown />
            </div>
          </div>
          {roomTypeMenu && (
            <div className='absolute top-[3.5rem] right-2 z-50'>
              <div className='z-50 bg-white divide-y overflow-y-auto example divide-gray-100 border border-black shadow min-w-[19vw] '>
                <ul className=''>
                  {roomTypes &&
                    roomTypes.map((element) => {
                      return (
                        <li
                          onClick={() => {
                            setValueQuery((prev) => ({ ...prev, type: element.type }))
                            setRoomType(element.label)
                            setRoomTypeMenu(false)
                          }}
                          key={element.type}
                          className='text-black w-full '
                        >
                          <div className='block hover:text-blue-500 cursor-pointer border-b-[0.25px] border-black px-2 py-2 transition-all duration-400'>
                            <div className='flex justify-between items-center'>
                              <div>{element.label}</div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className='relative font-medium py-1 pl-[2vw]'>
          <button
            // onClick={onSumitQuery}
            className='flex items-center bg-[#0153F2] min-w-[18vw] text-white cursor-pointer hover:bg-sky-600 font-poppins-600 rounded-md py-[0.8rem] mr-3'
          >
            <div className='flex justify-center items-center w-full'>
              <div className='mr-3 text-sm'>Tìm kiếm theo bộ lọc</div>
              <div className='text-lg'>
                <FiFilter />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
