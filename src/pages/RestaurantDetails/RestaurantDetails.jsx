import RestaurantDetail from '../../components/RestaurantDetail/RestaurantDetail'
import RestaurantFood from '../../components/RestaurantFood/RestaurantFood'
import { useState } from 'react'
import ReviewList from '../../components/ReviewList/ReviewList'
export default function RestaurantDetails() {
  const [option, setOption] = useState(0)
  const [reviews, setReviews] = useState()
  const [restaurantId, setRestaurantId] = useState()
  const [getReviewSuccess, setGetReviewSuccess] = useState(false)
  return (
    <>
      <div className='w-full mt-[10rem]'>
        <div className='mx-auto w-[85%] pb-[2rem]'>
          <RestaurantDetail
            reviews={reviews}
            setReviews={setReviews}
            setGetReviewSuccess={setGetReviewSuccess}
            setRestaurantId={setRestaurantId}
          />
          {getReviewSuccess && (
            <div className='bg-white mt-[2rem]'>
              <div className='flex ml-[1rem] py-[0.3rem] gap-x-[3rem]'>
                <div
                  className={`sm:text-[1.5rem] px-[1rem] italic cursor-pointer
              ${option === 0 ? ' bg-orange-500 text-white ' : ' bg-white text-orange-500 '}`}
                  onClick={() => setOption(0)}
                >
                  Các món ăn
                </div>
                <div
                  className={` sm:text-[1.5rem] px-[1rem] italic cursor-pointer
              ${option === 1 ? ' bg-orange-500 text-white ' : ' bg-white text-orange-500 '}`}
                  onClick={() => setOption(1)}
                >
                  Đánh giá
                </div>
              </div>
              <hr className='h-[0.1rem] border-none bg-gray-400' />
              {option === 0 && <RestaurantFood />}
              {option === 1 && (
                <ReviewList
                  reviews={reviews}
                  setReviews={setReviews}
                  getReviewSuccess={getReviewSuccess}
                  restaurantId={restaurantId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
