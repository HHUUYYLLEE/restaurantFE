import { getAllReviews } from '../../../api/admin.api'
import { useQuery } from '@tanstack/react-query'
import Restaurant from './Restaurant/Restaurant'
export default function ReportedReviewsManager({ refetchState, setRefetchState }) {
  const { data: requests_data, isSuccess } = useQuery({
    queryKey: ['all_reviews_web', refetchState],
    queryFn: () => {
      return getAllReviews()
    }
  })
  console.log(requests_data)

  return (
    <div className='w-[90vw] mx-auto'>
      <div className='mt-5'>
        {isSuccess &&
          requests_data?.data.responseData.map((data, id) => {
            return <Restaurant key={id} data={data} setRefetchState={setRefetchState} />
          })}
      </div>
    </div>
  )
}
