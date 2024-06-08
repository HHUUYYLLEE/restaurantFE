import Restaurant from './Restaurant'
import useQueryConfig from '../../hooks/useQueryConfig'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRandomRestaurants } from '../../api/restaurants.api'

export default function RandomRestaurantsList() {
  const { status, data, isLoading, isSuccess } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
      return getRandomRestaurants()
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })

  const dataRestaurants = data?.data?.restaurants.restaurants
  console.log(dataRestaurants)
  if (isSuccess)
    return (
      <>
        <div className='m-auto md:sm:w-[75%] w-[90%] mb-[2rem] h-full grid grid-cols-3 md:sm:grid-cols-5 grid-rows-2 gap-y-3 gap-x-2'>
          {dataRestaurants &&
            dataRestaurants?.map((restaurant, id) => {
              if (id < 6 || screen.width >= 640)
                return <Restaurant key={restaurant._id} restaurant={restaurant} />
            })}
        </div>
      </>
    )
}
