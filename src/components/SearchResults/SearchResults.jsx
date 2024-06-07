import { useEffect, useState } from 'react'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { searchRestaurantsAndFood } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
export default function SearchResults() {
  const [mode, setMode] = useState(0)
  const params = useQueryConfig()
  console.log(params)
  const { data } = useQuery({
    queryKey: ['search', params],
    queryFn: () => {
      return searchRestaurantsAndFood(params)
    },
    keepPreviousData: true,
    staleTime: 1000
  })
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
            <div className='flex'>
              <div
                className={`flex items-center justify-center w-[21vw] h-[5vh]
               text-xs px-[0.7rem] bg-red-500
               ${mode} `}
              >
                Tất cả
              </div>
              <div
                className={`flex items-center justify-center w-[21vw] h-[5vh] 
              text-xs px-[0.7rem] bg-red-500`}
              >
                Nhà hàng
              </div>
              <div
                className={`flex items-center justify-center w-[21vw] h-[5vh]
               text-xs px-[0.7rem] bg-red-50`}
              >
                Món ăn
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
