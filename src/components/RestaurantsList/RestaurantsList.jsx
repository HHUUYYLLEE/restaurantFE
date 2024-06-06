import Restaurant from './Restaurant'
import useQueryConfig from '../../hooks/useQueryConfig'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllRestaurants } from '../../api/restaurants.api'

export default function RestaurantsList() {
  const queryConfig = useQueryConfig()
  const { status, data, isLoading } = useQuery({
    queryKey: ['restaurants', queryConfig],
    queryFn: () => {
      return getAllRestaurants(queryConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })
  const dataRestaurants = data?.data?.restaurants
  console.log(dataRestaurants)
  return (
    <>
      <div className='m-auto md:sm:w-[75%] w-[90%] mb-[2rem] h-full grid grid-cols-3 md:sm:grid-cols-5 grid-rows-2 gap-y-3 gap-x-2'>
        {dataRestaurants &&
          dataRestaurants?.map((restaurant) => {
            return <Restaurant key={restaurant._id} restaurant={restaurant} />
          })}
      </div>
    </>
  )
}
