import { useState } from 'react'
import { TiPencil } from 'react-icons/ti'
import { displayNum } from '../../../utils/utils'

import EditFoodModal from '../EditFoodModal/EditFoodModal'

export default function Food({ food_id, name, price, desc, image_url }) {
  const [editFoodModal, setEditFoodModal] = useState(false)
  const openEditFoodModal = () => {
    setEditFoodModal(true)
  }
  const closeEditFoodModal = () => {
    setEditFoodModal(false)
  }
  return (
    <>
      {editFoodModal && (
        <EditFoodModal
          closeEditFoodModal={closeEditFoodModal}
          food_id={food_id}
          name={name}
          price={price}
          desc={desc}
          image_url={image_url}
        />
      )}
      <div
        className='flex sm:mx-[1rem] sm:h-[28vh] h-[9vh] 
      sm:my-[1rem] mx-[0.3rem] my-[0.1rem] sm:w-[25vw] w-[38vw] relative gap-x-2
      border rounded-md sm:border-4'
      >
        <img
          referrerPolicy='no-referrer'
          src={image_url}
          className='sm:w-[12vw] w-[18vw] sm:h-full h-[8vh]'
        />
        <div className='relative w-full'>
          <div
            className='absolute flex cursor-pointer bottom-[0.2rem] right-[0.2rem] 
        sm:bottom-[0.6rem] sm:right-[0.5rem] gap-x-1 sm:gap-x-3'
          >
            <div className='cursor-pointer rounded-full' onClick={openEditFoodModal}>
              <TiPencil
                style={{
                  width: screen.width >= 640 ? '1.6vw' : '3.4vw',
                  height: screen.width >= 640 ? '1.6vw' : '3.4vw',
                  color: 'green'
                }}
              />
            </div>
          </div>

          <div>
            <div
              className='2xl:text-[1.1rem] sm:text-[1rem] sm:w-full 
          sm:mt-[1rem] sm:h-[10.2vh] 2xl:h-[3rem] h-[4vh] sm:leading-[1.4rem] 
          2xl:leading-[1.6rem] leading-[0.6rem] w-[15vw] text-[0.44rem] 
          overflow-hidden text-ellipsis line-clamp-3 mt-[0.2rem]'
            >
              {name}
            </div>
            <div
              className='sm:text-2xl 2xl:text-3xl sm:mt-[1rem] text-yellow-600
          text-[0.6rem] font-poppins-400'
            >
              {displayNum(price)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
