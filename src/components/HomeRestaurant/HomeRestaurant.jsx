import { useEffect, useState } from 'react'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { getAllRestaurants, searchRestaurantsAndFood } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
import Restaurant from './Restaurant/Restaurant'
import { displayNum } from '../../utils/utils'
import { PiListLight } from 'react-icons/pi'
import { PiGridFourFill } from 'react-icons/pi'
import { FaCheckCircle } from 'react-icons/fa'
import Checkbox from 'react-custom-checkbox'
import { createSearchParams, useNavigate } from 'react-router-dom'
import Food from './Food/Food'

export default function HomeRestaurant() {
  const navigate = useNavigate()
  const params = useQueryConfig()

  const [option, setOption] = useState(0)
  const [displayType, setDisplayType] = useState(0)
  const [cityOption, setCityOption] = useState(params.address || '')
  const options = ['Tất cả', 'Nhà hàng', 'Món ăn']
  const [addressValue, setAddressValue] = useState(null)

  // console.log(params)
  const { data, isSuccess } = useQuery({
    queryKey: ['searchAllRestaurants', 0],
    queryFn: () => {
      return getAllRestaurants()
    },
    keepPreviousData: true,
    staleTime: 1000
  })
  const searchData = data?.data
  const { data: data2, isSuccess: isSuccess2 } = useQuery({
    queryKey: ['searchByAddress', cityOption],
    queryFn: () => {
      return searchRestaurantsAndFood({ address: cityOption, mode: 2 })
    },
    keepPreviousData: true,
    staleTime: 1000
  })
  const searchData2 = data2?.data
  console.log(searchData)
  if (isSuccess && isSuccess2)
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
              <div className='w-[20vw] sm:h-[20vw] flex justify-center'>
                <img className='mt-[4.5rem] sm:mt-[5rem]' src={mapround} />
              </div>
            </div>
            <button
              type='button'
              className={`rounded-sm mt-[2rem] h-[4vh] sm:h-[6vh] w-full
             bg-white border sm:border-[0.13rem] sm:border-b-0 border-b-0 border-orange-500 
             ${cityOption === 'Hà Nội' ? ' bg-slate-300 ' : ' bg-white '}
            `}
              onClick={() => {
                if (cityOption === 'Thành phố Hồ Chí Minh' || cityOption === '')
                  setCityOption('Hà Nội')
                else setCityOption('')
              }}
            >
              <div className='flex items-center gap-x-2 mx-[0.2rem] '>
                <Checkbox
                  icon={
                    <FaCheckCircle
                      color='#F97316'
                      style={{
                        width: screen.width < 640 ? 14 : 30,
                        height: screen.width < 640 ? 14 : 30
                      }}
                    />
                  }
                  name='my-input'
                  checked={cityOption === 'Hà Nội'}
                  borderColor='#F97316'
                  borderRadius={9999}
                  size={screen.width < 640 ? 14 : 30}
                />
                <div className='text-sm sm:w-full sm:flex sm:justify-center'>Hà Nội</div>
              </div>
            </button>
            <hr className='h-[0.06rem] sm:h-[0.15rem] sm:mt-[-0.23rem] 2xl:mt-[-0.1rem] border-none bg-orange-500' />
            <button
              type='button'
              className={`rounded-sm h-[4vh] sm:h-[6vh] w-full
              border sm:border-[0.13rem] sm:border-t-0 border-t-0 border-orange-500 
             ${cityOption === 'Thành phố Hồ Chí Minh' ? ' bg-slate-300 ' : ' bg-white '}
             `}
              onClick={() => {
                if (cityOption === 'Hà Nội' || cityOption === '')
                  setCityOption('Thành phố Hồ Chí Minh')
                else setCityOption('')
              }}
            >
              <div className='flex items-center gap-x-2 mx-[0.2rem]'>
                <Checkbox
                  icon={
                    <FaCheckCircle
                      color='#F97316'
                      style={{
                        width: screen.width < 640 ? 14 : 30,
                        height: screen.width < 640 ? 14 : 30
                      }}
                    />
                  }
                  name='my-input'
                  checked={cityOption === 'Thành phố Hồ Chí Minh'}
                  borderColor='#F97316'
                  borderRadius={9999}
                  size={screen.width < 640 ? 14 : 30}
                />
                <div className='text-sm sm:w-full sm:flex sm:justify-center'>TP.HCM</div>
              </div>
            </button>
          </div>

          <div className='w-full'>
            <div className='flex justify-between'>
              <div className='text-[0.6rem] sm:text-lg '></div>
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
                searchData2 &&
                searchData2.restaurants.map((restaurant, id) => {
                  return (
                    <Restaurant
                      key={restaurant._id}
                      displayType={displayType}
                      restaurant={restaurant}
                    />
                  )
                })}
              {option === 0 &&
                searchData2 &&
                searchData2.allFood.map((food, id) => {
                  return <Food key={id} displayType={displayType} food={food} />
                })}
              {option === 1 &&
                searchData2 &&
                searchData2.restaurants.map((restaurant, id) => {
                  return (
                    <Restaurant
                      key={restaurant._id}
                      displayType={displayType}
                      restaurant={restaurant}
                    />
                  )
                })}
              {option === 2 &&
                searchData2 &&
                searchData2.allFood.map((food, id) => {
                  return <Food key={id} displayType={displayType} food={food} />
                })}
            </div>
          </div>
        </div>
      </>
    )
}
