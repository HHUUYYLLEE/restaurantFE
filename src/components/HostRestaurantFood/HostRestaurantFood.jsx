import { keepPreviousData, useQuery } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { useParams } from 'react-router-dom'
import { getAllFoodInRestaurant } from '../../api/food.api'
import AddFoodModal from './AddFoodModal/AddFoodModal'
import Food from './Food/Food'

export default function HostRestaurantFood() {
  const [addFoodModal, setAddFoodModal] = useState(false)

  const openAddFoodModal = () => {
    setAddFoodModal(true)
  }
  const closeAddFoodModal = () => {
    setAddFoodModal(false)
  }

  const { id } = useParams()
  const { data, isSuccess } = useQuery({
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
            className='rounded-lg sm:py-[0.6rem] py-[0.3rem] hover:bg-green-700 sm:px-[0.8rem] 
            px-[1rem]
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
                <Food
                  key={food._id}
                  food_id={food._id}
                  name={food.name}
                  price={food.price}
                  desc={food.desc}
                  image_url={food.image_url}
                ></Food>
              )
            })}
        </div>
        {addFoodModal && <AddFoodModal closeAddFoodModal={closeAddFoodModal} restaurant_id={id} />}
      </div>
    )
}
