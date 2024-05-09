import { useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SubPopUpAddress from '../SubPopUpAddress'

export default function PopUpAddressItem({ district, setAddressMenu }) {
  const [subMenu, setsubMenu] = useState(false)

  const showSubMenu = () => {
    setsubMenu(true)
  }
  const hideSubMenu = () => {
    setsubMenu(false)
  }
  const hideAll = () => {
    setsubMenu(false)
    setAddressMenu(false)
  }

  return (
    <div onMouseEnter={showSubMenu} onMouseLeave={hideSubMenu}>
      <li className='text-black w-full '>
        <div className='block hover:text-blue-500 cursor-pointer border-b-[0.25px] border-black px-2 py-2 transition-all duration-400'>
          <div className='flex justify-between items-center'>
            <div>Khu vực {district.district}</div>
            <div>
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      </li>
      {subMenu ? <SubPopUpAddress id={district.code} hideAll={hideAll} /> : ''}
    </div>
  )
}
