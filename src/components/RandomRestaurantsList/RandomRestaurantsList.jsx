import Restaurant from './Restaurant'
import useQueryConfig from '../../hooks/useQueryConfig'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRandomRestaurants } from '../../api/restaurants.api'
import spinningload from '../../asset/img/spinning_load.gif'
export default function RandomRestaurantsList() {
  const { status, data, isLoading, isSuccess, isFetching, refetch } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
      return getRandomRestaurants()
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })

  const dataRestaurants = data?.data?.restaurants.restaurants
  console.log(dataRestaurants)

  return (
    <>
      <div className='m-auto sm:w-[85%] w-[90%] mb-[2rem] h-full grid gap-y-2'>
        <div className='w-full bg-white rounded-md border-slate-200 border-[0.2rem] px-[1rem] flex items-center justify-between py-[0.5rem]'>
          <div className='text-orange-500 italic'>Phong phú, đa dạng</div>
          <button
            onClick={refetch}
            className='bg-orange-500 hover:bg-green-500 text-white rounded-lg px-[0.8rem] sm:px-[1.5rem] py-[0.4rem]'
          >
            Làm mới
          </button>
        </div>
        <div className='border-slate-200 border-[0.2rem] bg-orange-100'>
          <div className='mx-[0.6rem] my-[0.5rem]'>
            {isLoading ||
              (isFetching && (
                <div className='flex items-center justify-center'>
                  <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
                </div>
              ))}
            <div className='grid grid-cols-3 md:sm:grid-cols-5 grid-rows-2 gap-y-3 gap-x-2'>
              {isSuccess &&
                !isFetching &&
                dataRestaurants &&
                dataRestaurants?.map((restaurant, id) => {
                  if (id < 6 || screen.width >= 640)
                    return <Restaurant key={restaurant._id} restaurant={restaurant} />
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
