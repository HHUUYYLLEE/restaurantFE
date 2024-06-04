import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFoodInRestaurant } from '../../api/food.api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { MdOutlinePinDrop } from 'react-icons/md'
import { BsCart4 } from 'react-icons/bs'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { displayNum } from '../../utils/utils'

export default function RestaurantFood() {
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
        <div className='flex ml-[1rem] py-[0.3rem] gap-x-[3rem]'>
          <div className='text-4xl'>Các món ăn</div>
        </div>
        <hr className='h-[0.1rem] border-none bg-gray-400' />
        <div className='grid grid-cols-3 gap-x-2 pb-[2rem] '>
          {data &&
            foodData.map((food) => {
              return (
                <div key={food._id} className='flex mx-[1rem] my-[1rem] relative gap-x-2'>
                  <div className='absolute cursor-pointer right-0 bottom-0 bg-red-700 rounded-full p-[0.2rem]'>
                    <BsCart4 style={{ width: '1.5vw', height: '1.5vw', color: 'white' }} />
                  </div>
                  <img src={food.image_url} />
                  <div>
                    <div className='text-xl mt-[1rem] h-[4.9rem] text-ellipsis'>{food.name}</div>
                    <div className='text-3xl mt-[1rem] text-yellow-600 font-poppins-400'>{displayNum(food.price)}</div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
}
