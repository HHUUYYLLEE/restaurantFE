import { useState } from 'react'
import AllUsersManager from './AllUsersManager/AllUsersManager'
import BloggerRequestsUserManager from './BloggerRequestsUserManager/BloggerRequestsUserManager'
import { FaUserAlt } from 'react-icons/fa'
import { ImBlogger2 } from 'react-icons/im'

export default function AdminUsersManager() {
  const [refetchState, setRefetchState] = useState(false)
  return (
    <div className='w-[90vw] mx-auto mt-[2rem]'>
      <div className='bg-white  w-full rounded-md'>
        <div className='mx-[1rem] flex items-center gap-x-2'>
          <ImBlogger2
            style={{
              color: 'orange'
            }}
          />
          <div className='text-orange-500 italic text-[1.4rem]'>Các yêu cầu blogger user</div>
        </div>
      </div>
      <BloggerRequestsUserManager refetchState={refetchState} setRefetchState={setRefetchState} />
      <div className='bg-white mt-[2rem] w-full rounded-md'>
        <div className='mx-[1rem] flex items-center gap-x-2'>
          <FaUserAlt
            style={{
              color: 'orange'
            }}
          />
          <div className='text-orange-500 italic text-[1.4rem]'>Tất cả user</div>
        </div>
      </div>
      <AllUsersManager refetchState={refetchState} setRefetchState={setRefetchState} />
    </div>
  )
}
