import { useEffect, useState } from 'react'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { searchRestaurantsAndFood } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
import Restaurant from './Restaurant/Restaurant'
import Food from './Food/Food'
import { displayNum } from '../../utils/utils'
import { PiListLight } from 'react-icons/pi'
import { PiGridFourFill } from 'react-icons/pi'

export default function SearchResults() {
  const [option, setOption] = useState(0)
  const [displayType, setDisplayType] = useState(0)
  const cityOptions = ['Hà Nộ', 'Thành phố Hồ Chí Mình']
  const options = ['Tất cả', 'Nhà hàng', 'Món ăn']
  const params = useQueryConfig()
  // console.log(params)
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
        <div className={`w-full flex  gap-x-3`}>
          <div>
            <div
              className='bg-orange-500 px-[0.2rem] h-[26.3vh] mt-[2.8rem] 
          sm:mt-[4.5rem] sm:h-[53.4vh]
          2xl:mt-[4.1rem]'
            >
              <div
                className=' w-[20vw] text-[0.7rem] sm:text-[1.3rem] h-[5vh] 
            flex justify-center'
              >
                <div className='text-center text-white italic'>
                  Không tìm thấy gì ưng ý? Thử tìm kiếm theo phạm vi quanh nhà bạn!
                </div>
              </div>
              <div className='w-[20vw] h-[20vw] flex justify-center'>
                <img className='mt-[5rem] sm:mt-[5rem]' src={mapround} />
              </div>
            </div>
            <div className='w-[20vw] bg-red flex items-center justify-center'>Hà Nội</div>
            <div className='w-[20vw] bg-red flex items-center justify-center'>TP.HCM</div>
          </div>

          <div className='w-full'>
            <div className='flex justify-between'>
              <div className='text-[0.6rem] sm:text-lg '>
                {option === 0 && (
                  <>
                    <div>
                      <span>Tìm thấy&nbsp;</span>
                      <span className='italic font-bold text-orange-500'>
                        {searchData.restaurants.length + searchData.allFood.length}&nbsp;
                      </span>
                      <span>kết quả&nbsp;</span>
                      <span className='italic font-bold text-orange-500'>
                        &quot;{params.search}&quot;:&nbsp;
                      </span>
                    </div>
                    <div>
                      <span className='italic font-bold text-orange-500'>
                        {searchData.restaurants.length}&nbsp;
                      </span>
                      <span>nhà hàng và&nbsp;</span>
                      <span className='italic font-bold text-orange-500'>
                        {searchData.allFood.length}&nbsp;
                      </span>
                      <span>món ăn</span>
                    </div>
                  </>
                )}
                {option === 1 && (
                  <>
                    <span>Tìm thấy&nbsp;</span>
                    <span className='italic font-bold text-orange-500'>
                      {searchData.restaurants.length}&nbsp;
                    </span>
                    <span>nhà hàng&nbsp;</span>
                    <span className='italic font-bold text-orange-500'>
                      &quot;{params.search}&quot;:&nbsp;
                    </span>
                  </>
                )}
                {option === 2 && (
                  <>
                    <span>Tìm thấy&nbsp;</span>
                    <span className='italic font-bold text-orange-500'>
                      {searchData.allFood.length}&nbsp;
                    </span>
                    <span>món ăn&nbsp;</span>
                    <span className='italic font-bold text-orange-500'>
                      &quot;{params.search}&quot;:&nbsp;
                    </span>
                  </>
                )}
              </div>
              <div className='flex gap-x-2 sm:gap-x-8'>
                <div
                  className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md 
                ${displayType === 0 ? ' bg-[#a5909079] ' : ' bg-[#EEE] '}
                `}
                  onClick={() => setDisplayType(0)}
                >
                  <PiListLight
                    style={{
                      width: screen.width < 640 ? '7vw' : '3.5vw',
                      height: screen.width < 640 ? '7vw' : '3.5vw',
                      color: '#F97316'
                    }}
                  />
                </div>
                <div
                  className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md 
                ${displayType === 1 ? ' bg-[#a5909079] ' : ' bg-[#EEE] '}
                `}
                  onClick={() => setDisplayType(1)}
                >
                  <PiGridFourFill
                    style={{
                      width: screen.width < 640 ? '7vw' : '3.5vw',
                      height: screen.width < 640 ? '7vw' : '3.5vw',
                      color: '#F97316'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='bg-white mt-[1rem]'>
              <div className='grid grid-cols-3'>
                {options.map((data, id) => {
                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-center w-[22.49vw] h-[5vh]
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
            <div
              className={`grid ${
                displayType === 0
                  ? ' gap-y-[0.6rem] '
                  : ' grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-3  '
              } mt-[1rem]`}
            >
              {option === 0 &&
                searchData &&
                searchData.restaurants.map((restaurant, id) => {
                  return (
                    <Restaurant
                      key={restaurant._id}
                      displayType={displayType}
                      restaurant={restaurant}
                    />
                  )
                })}
              {option === 0 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} displayType={displayType} food={food} />
                })}
              {option === 1 &&
                searchData &&
                searchData.restaurants.map((restaurant, id) => {
                  return (
                    <Restaurant
                      key={restaurant._id}
                      displayType={displayType}
                      restaurant={restaurant}
                    />
                  )
                })}
              {option === 2 &&
                searchData &&
                searchData.allFood.map((food, id) => {
                  return <Food key={id} displayType={displayType} food={food} />
                })}
            </div>
          </div>
        </div>
      </>
    )
}
