import { keepPreviousData, useQuery } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { getFood } from '../../../api/food.api'
import { displayNum } from '../../../utils/utils'

export default function Food({ food_id, quantity }) {
  const { data, isSuccess } = useQuery({
    queryKey: ['foodDetail', food_id],
    queryFn: () => {
      return getFood(food_id)
    },
    placeholderData: keepPreviousData
  })
  const foodData = data?.data.food
  if (isSuccess) {
    return (
      <>
        <div className='flex justify-between sm:h-[25vh] py-[0.2rem]'>
          <div className='flex items-center gap-x-[0.4rem] w-[100vw] sm:w-[80vw]'>
            <img
              referrerPolicy='no-referrer'
              src={foodData.image_url}
              className='sm:w-[9vw] sm:h-[9vw] w-[14vw] h-[14vw]'
            ></img>
            <div>
              <div className='sm:text-xl sm:w-[60vw] text-sm line-clamp-1 text-ellipsis overlow-hidden'>
                {foodData.name}
              </div>
              <div className='mt-[0.2rem]'>
                <div className='flex items-center sm:gap-x-[0.4rem] gap-x-[0.2rem]'>
                  <div className='text-green-700 sm:text-lg'>{'x' + quantity}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='flex items-center justify-between sm:text-right   w-[29vw] 
           text-orange-400 sm:text-4xl'
          >
            <div></div>
            {displayNum(foodData.price) + 'đ'}
          </div>
        </div>
      </>
    )
  }
}
