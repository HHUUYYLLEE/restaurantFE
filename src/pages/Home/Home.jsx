import { useEffect } from 'react'
import Banner from '../../components/Banner'
import RandomRestaurantsList from '../../components/RandomRestaurantsList/RandomRestaurantsList'
import { webName } from '../../utils/env'
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
    </>
  )
}
