import { useEffect } from 'react'
import Banner from '../../components/Banner'
import { webName } from '../../utils/env'
import RandomRestaurantsList from '../../components/RandomRestaurantsList/RandomRestaurantsList'
import FoodList from '../../components/FoodList/FoodList'
import AllRestaurantsList from '../AllRestaurantsList/AllRestaurantsList'
export default function Home() {
  useEffect(() => {
    document.getElementsByTagName('title')[0].textContent = webName
  }, [])
  return (
    <>
      <div>
        <Banner />
      </div>
      <div className='w-[100%] md:sm:h-full mt-10'>
        <RandomRestaurantsList />
      </div>
      <div className='w-[100%] md:sm:h-full mt-10'>
        <AllRestaurantsList />
      </div>
      {/* <div className='md:sm:my-[3rem] md:sm:mx-[9vw] grid gap-x-[3rem] grid-cols-11'>
        <div className='row-start-1 col-span-2'></div> *
        <div className='row-start-1 col-span-9'>
          <FoodList />
        </div>
      </div> */}
    </>
  )
}
