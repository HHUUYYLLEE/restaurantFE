import { useState } from 'react'
import AllReviewsManager from './AllReviewsManager/AllReviewsManager'
import ReportedReviewsManager from './ReportedReviewsManager/ReportedReviewsManager'
import { IoMdWarning } from 'react-icons/io'
import { MdOutlineInsertComment } from 'react-icons/md'

export default function AdminReviewsManager() {
  const [refetchState, setRefetchState] = useState(false)
  return (
    <div className='w-[90vw] mx-auto mt-[2rem]'>
      <div className='bg-white  w-full rounded-md'>
        <div className='mx-[1rem] flex items-center gap-x-2'>
          <IoMdWarning
            style={{
              color: 'orange'
            }}
          />
          <div className='text-orange-500 italic text-[1.4rem]'>Các đánh giá bị báo cáo</div>
        </div>
      </div>
      <ReportedReviewsManager refetchState={refetchState} setRefetchState={setRefetchState} />
      <div className='bg-white mt-[2rem] w-full rounded-md'>
        <div className='mx-[1rem] flex items-center gap-x-2'>
          <MdOutlineInsertComment
            style={{
              color: 'orange'
            }}
          />
          <div className='text-orange-500 italic text-[1.4rem]'>Tất cả đánh giá</div>
        </div>
      </div>
      <AllReviewsManager refetchState={refetchState} setRefetchState={setRefetchState} />
    </div>
  )
}
