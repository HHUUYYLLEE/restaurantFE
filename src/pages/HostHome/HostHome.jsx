import { useEffect } from 'react'
import Banner from '../../components/Banner'
import HostNavFilter from '../../components/HostNavFilter'
import HostRoomsList from '../../components/HostRoomsList'
import HostSidebarFilter from '../../components/HostSidebarFilter'

export default function Home() {
  return (
    <>
      <div>
        <Banner />
      </div>
      <div className='mt-[6rem]'>
        <HostNavFilter />
      </div>
      <div className='my-[3rem] mx-[9vw] grid gap-x-[3rem] grid-cols-11'>
        <div className='row-start-1 col-span-2'>
          <HostSidebarFilter />
        </div>
        <div className='row-start-1 col-span-9'>
          <HostRoomsList />
        </div>
      </div>
    </>
  )
}
