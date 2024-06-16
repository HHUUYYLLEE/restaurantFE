import { getAllReviews } from '../../../api/admin.api'
import { useQuery } from '@tanstack/react-query'
import Restaurant from './Restaurant/Restaurant'
export default function ReportedReviewsManager({ refetchState, setRefetchState }) {
  const {
    data: requests_data,
    isSuccess,
    isError
  } = useQuery({
    queryKey: ['all_reported_reviews', refetchState],
    queryFn: () => {
      return getAllReviews({ report_status: 1 })
    }
  })
  console.log(requests_data)

  return (
    <div className='w-[90vw] mx-auto'>
      <div className='mt-5'>
        {isError && <div className='flex justify-center'>Chưa có đánh giá bị báo cáo</div>}
        {isSuccess &&
          requests_data?.data.responseData.map((data, id) => {
            return <Restaurant key={id} data={data} setRefetchState={setRefetchState} />
          })}
      </div>
    </div>
  )
}
