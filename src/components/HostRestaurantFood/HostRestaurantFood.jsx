import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFoodInRestaurant } from '../../api/food.api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { MdOutlinePinDrop } from 'react-icons/md'
import { TiPencil } from 'react-icons/ti'
import { FaRegTrashAlt } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { displayNum } from '../../utils/utils'
import { useState } from 'react'
import AddFoodModal from './AddFoodModal/AddFoodModal'

export default function HostRestaurantFood() {
  const [addFoodModal, setAddFoodModal] = useState(false)
  const openAddFoodModal = () => {
    setAddFoodModal(true)
  }
  const closeAddFoodModal = () => {
    setAddFoodModal(false)
  }
  const { id } = useParams()
  const { data, status, isLoading, isSuccess } = useQuery({
    queryKey: ['all_food_in_restaurant', id],
    queryFn: () => {
      return getAllFoodInRestaurant(id)
    },
    placeholderData: keepPreviousData
  })
  // console.log(data)
  const foodData = data?.data.allFood
  if (isSuccess)
    return (
      <div className='bg-white'>
        <div className='flex items-center ml-[1rem] py-[0.3rem] sm:gap-x-[3rem]  gap-x-[1rem]'>
          <div className='sm:text-4xl text-orange-500 italic'>Các món ăn</div>
          <button
            onClick={() => openAddFoodModal()}
            className='rounded-lg sm:py-[1rem] py-[0.5rem] hover:bg-green-700 sm:px-[2rem] px-[1rem]
             bg-orange-600 text-white'
          >
            Thêm món ăn
          </button>
        </div>
        <hr className='h-[0.1rem] border-none bg-gray-400' />
        <div className='grid sm:grid-cols-3 grid-cols-2 gap-x-2 pb-[2rem] sm:mt-0 mt-[1rem]'>
          {data &&
            foodData.map((food) => {
              return (
                <div
                  key={food._id}
                  className='flex sm:mx-[1rem] sm:h-[28vh] h-[9vh] 
                  sm:my-[1rem] mx-[0.3rem] my-[0.1rem] sm:w-[25vw] w-[38vw] relative gap-x-2
                  border rounded-md sm:border-4'
                >
                  <img
                    src={food.image_url}
                    referrerPolicy='no-referrer'
                    className='sm:w-[12vw] w-[18vw] sm:h-full h-[8vh]'
                  />
                  <div className='relative'>
                    <div
                      className='absolute flex cursor-pointer bottom-[0.2rem] right-[0.2rem] 
                    sm:bottom-[0.6rem] sm:right-[0.5rem] gap-x-1 sm:gap-x-3'
                    >
                      <div className='cursor-pointer rounded-full'>
                        <TiPencil
                          style={{
                            width: screen.width >= 640 ? '1.6vw' : '3.4vw',
                            height: screen.width >= 640 ? '1.6vw' : '3.4vw',
                            color: 'green'
                          }}
                        />
                      </div>
                      <div className='cursor-pointer rounded-full'>
                        <FaRegTrashAlt
                          style={{
                            width: screen.width >= 640 ? '1.4vw' : '3.0vw',
                            height: screen.width >= 640 ? '1.4vw' : '3.0vw',
                            color: 'red'
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
                        {food.name}
                      </div>
                      <div
                        className='sm:text-2xl 2xl:text-3xl sm:mt-[1rem] text-yellow-600
                      text-[0.6rem] font-poppins-400'
                      >
                        {displayNum(food.price)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        {addFoodModal && <AddFoodModal closeAddFoodModal={closeAddFoodModal} restaurant_id={id} />}
      </div>
    )
}