import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFoodInRestaurant } from '../../api/food.api'
import spinningload from '../../asset/img/spinning_load.gif'

import Food from './Food/Food'
export default function RestaurantFood() {
  const { id } = useParams()

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['all_food_in_restaurant', id],
    queryFn: () => {
      return getAllFoodInRestaurant(id)
    },
    placeholderData: keepPreviousData
  })

  const foodData = data?.data.allFood
  if (isSuccess)
    return (
      <div className=''>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
          </div>
        )}
        <div className='grid sm:grid-cols-3 grid-cols-2 gap-x-2 pb-[2rem] sm:mt-0 mt-[1rem]'>
          {data &&
            foodData.map((food, id) => {
              return <Food key={id} food={food} />
            })}
        </div>
      </div>
    )
}
