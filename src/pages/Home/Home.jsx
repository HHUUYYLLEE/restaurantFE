import { useEffect } from 'react'
import Banner from '../../components/Banner'
import RoomsList from '../../components/RoomsList'
import SidebarFilter from '../../components/SidebarFilter/SidebarFilter'
import { webName } from '../../utils/env'
import RestaurantsList from '../../components/RestaurantsList/RestaurantsList'
export default function Home() {
  useEffect(() => {
    document.getElementsByTagName('title')[0].textContent = webName
  }, [])
  return (
    <>
      <div>
        <Banner />
      </div>
      <div className='w-[100%] h-[35rem] mt-10'>
        <RestaurantsList />
      </div>

      {/* <div className='my-[3rem] mx-[9vw] grid gap-x-[3rem] grid-cols-11'>
        <div className='row-start-1 col-span-2'>
          <SidebarFilter />
        </div>
        <div className='row-start-1 col-span-9'>
          <RoomsList />
        </div>
      </div> */}
    </>
  )
}
