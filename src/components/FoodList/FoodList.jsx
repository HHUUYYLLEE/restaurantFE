import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllFood } from '../../api/food.api'
import useQueryConfig from '../../hooks/useQueryConfig'
import Food from './Food'

export default function FoodList() {
  const queryConfig = useQueryConfig()
  const { data } = useQuery({
    queryKey: ['food', queryConfig],
    queryFn: () => {
      return getAllFood(queryConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })
  const dataFood = data?.data?.allFood
  console.log(dataFood)
  return (
    <>
      <div className='grid grid-cols-4 grid-rows-2 gap-y-3 gap-x-2'>
        {dataFood &&
          dataFood?.map((food) => {
            return (
              <Food
                key={food._id}
                food={food}
              />
            )
          })}
      </div>
    </>
  )
}
