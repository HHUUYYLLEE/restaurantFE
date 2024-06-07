import { useEffect, useState } from 'react'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { searchRestaurantsAndFood } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
import Restaurant from './Restaurant/Restaurant'
import Food from './Food/Food'
import { displayNum } from '../../utils/utils'
export default function SearchResults() {
  const [option, setOption] = useState(0)
  const options = ['Tất cả', 'Nhà hàng', 'Món ăn']
  const params = useQueryConfig()
  console.log(params)
  const { data, isSuccess } = useQuery({
    queryKey: ['search', params],
    queryFn: () => {
      return searchRestaurantsAndFood(params)
    },
    keepPreviousData: true,
    staleTime: 1000
  })
  const searchData = data?.data

  console.log(searchData)
  if (isSuccess)
    return (
      <>
        <div className='w-full flex gap-x-7'>
          <div className=''>
            <div className='text-orange-500 w-[20vw] text-[0.7rem]'>
              <div className='table h-[5vh]'>
                <div className='text-center align-middle'>Tìm kiếm các nhà hàng gần bạn!</div>
              </div>
            </div>
            <img className='w-[20vw] h-[20vw] mt-[1rem]' src={mapround} />
          </div>
          <div className=''>
            <div className='bg-white'>
              <div className='grid grid-cols-3'>
                {options.map((data, id) => {
                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-center w-[21vw] h-[5vh]
               text-xs px-[0.7rem] cursor-pointer sm:h-[6vh] sm:text-xl
               ${option === id ? ' bg-orange-500 text-white ' : ' bg-white'} `}
                      onClick={() => setOption(id)}
                    >
                      {data}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 mt-[1rem]'>
              {option === 0 &&
                searchData &&
                searchData.restaurants.map((restaurant, id) => {
                  return <Restaurant key={restaurant._id} restaurant={restaurant} />
                })}
              {option === 0 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} food={food} />
                })}
              {option === 1 &&
                searchData &&
                searchData.restaurants.map((restaurant, id) => {
                  return <Restaurant key={restaurant._id} restaurant={restaurant} />
                })}
              {option === 2 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} food={food} />
                })}
              {option === 2 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} food={food} />
                })}
              {option === 2 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} food={food} />
                })}
              {option === 2 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} food={food} />
                })}
            </div>
          </div>
        </div>
      </>
    )
}
