import { Link } from 'react-router-dom'
import { getStatusRestaurantFromTime } from '../../../utils/utils'
import { FiSunset } from 'react-icons/fi'
import { FiSunrise } from 'react-icons/fi'

export default function Restaurant({ restaurant, bloggerReviews }) {
  return (
    <>
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className='bg-white'>
          <div className={` flex `}>
            <div
              className={`cursor-pointer
              sm:max-h-[26vh] sm:max-w-[20.3vw] max-w-[29vw] max-h-[9.4vh]
    `}
            >
              <img
                referrerPolicy='no-referrer'
                className={`
                   sm:w-[20.3vw] sm:h-[26vh] w-[29vw] h-[9.4vh] 
              `}
                src={restaurant.main_avatar_url}
              />
            </div>
            <div
              className={`bg-white cursor-pointer  h-[9.33vh]
           sm:h-[26vh] w-full`}
            >
              <div
                className={` sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis overflow-hidden  sm:h-[7vh] sm:leading-5
             h-[3.4vh] text-[0.5rem] sm:text-[1.2rem] sm:mt-[1rem]
           `}
              >
                {restaurant.name}
              </div>
              <div className='flex items-center gap-x-1 sm:gap-x-5'>
                <div
                  className={`${
                    getStatusRestaurantFromTime(
                      restaurant.morning_open_time,
                      restaurant.morning_closed_time,
                      restaurant.afternoon_open_time,
                      restaurant.afternoon_closed_time
                    ) === 'Đang hoạt động'
                      ? ' text-orange-500 '
                      : ' text-slate-300 '
                  } italic text-[0.43rem] sm:ml-[0.6rem] ml-[0.2rem]
                 sm:text-xl`}
                >
                  {getStatusRestaurantFromTime(
                    restaurant.morning_open_time,
                    restaurant.morning_closed_time,
                    restaurant.afternoon_open_time,
                    restaurant.afternoon_closed_time
                  )}
                </div>

                <div className='flex items-center sm:gap-x-9 gap-x-1'>
                  <div className='flex items-center sm:gap-x-2 gap-x-[0.1rem]'>
                    <FiSunrise
                      style={{
                        width: screen.width < 640 ? '3vw' : '3vw',
                        height: screen.width < 640 ? '3vw' : '3vw',
                        color: 'orange'
                      }}
                    />
                    <div className='italic text-yellow-600 sm:text-xl text-[0.4rem]'>
                      {restaurant.morning_open_time} &#8212;
                      {restaurant.morning_closed_time}
                    </div>
                  </div>
                  <div className='flex items-center sm:gap-x-2 gap-x-[0.1rem]'>
                    <FiSunset
                      style={{
                        width: screen.width < 640 ? '3vw' : '3vw',
                        height: screen.width < 640 ? '3vw' : '3vw',
                        color: 'gray'
                      }}
                    />
                    <div className='italic text-yellow-600 sm:text-xl text-[0.4rem]'>
                      {restaurant.afternoon_open_time} &#8212;
                      {restaurant.afternoon_closed_time}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`sm:ml-3 sm:mt-3
            mx-[0.2rem] mt-[0.2rem]  text-ellipsis overflow-hidden text-gray-600 text-[0.41rem]
             line-clamp-2 
            sm:text-[1rem] '}
            `}
              >
                {restaurant.address}
              </div>
            </div>
          </div>
          <hr className='mt-[0.2rem] h-[0.1rem] border-none bg-slate-500' />
          <div className=''>
            <div
              className='flex items-center sm:py-[0.4rem] 
             py-[0.2rem] sm:gap-x-4'
            >
              <div className='sm:w-[16vw] flex justify-center w-[21.5vw]'>
                <div>
                  <div
                    className='max-w-[9vw] max-h-[9vw] sm:max-w-[5vw] 
                  sm:max-h-[5vw] overflow-hidden rounded-full'
                  >
                    <img
                      referrerPolicy='no-referrer'
                      className='w-[9vw] h-[9vw] sm:w-[5vw] sm:h-[5vw]'
                      src={bloggerReviews[0].avatar_url}
                    />
                  </div>
                  <div
                    className='flex justify-center sm:text-base text-[0.6rem] line-clamp-1 text-ellipsis
                  '
                  >
                    {bloggerReviews[0].username}
                  </div>
                </div>
              </div>
              <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw] relative rounded-full '>
                <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  rounded-full  '>
                  <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  inline-block '>
                    <div
                      className={`inline-block text-[1rem] mt-[50%] ml-[50%] 
                    translate-x-[-50%] translate-y-[-50%] sm:text-[1.3rem] 2xl:text-[1.6rem] first-letter:${
                      bloggerReviews[0].average_score >= 7
                        ? ' text-green-500 '
                        : bloggerReviews[0].average_score >= 5
                        ? ' text-yellow-400 '
                        : ' text-red-500 '
                    }`}
                    >
                      {bloggerReviews[0].average_score}
                    </div>
                  </div>
                </div>

                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  version='1.1'
                  width={`${screen.width < 640 ? '11vw' : '5vw'}`}
                  height={`${screen.width < 640 ? '11vw' : '5vw'}`}
                  className='absolute top-0 left-0'
                  id='svg_circle'
                  strokeDasharray={screen.width >= 1536 ? 190 : screen.width >= 640 ? 160 : 113}
                  strokeDashoffset={
                    screen.width >= 1536
                      ? 190 * (1 - bloggerReviews[0].average_score / 10)
                      : screen.width >= 640
                      ? 160 * (1 - bloggerReviews[0].average_score / 10)
                      : 113 * (1 - bloggerReviews[0].average_score / 10)
                  }
                  transform='rotate(-90)'
                >
                  <circle
                    cx={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                    cy={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                    r={`${screen.width < 640 ? '5vw' : '2vw'}`}
                    strokeLinecap='round'
                    className={`fill-none stroke-[0.5vw] ${
                      bloggerReviews[0].average_score >= 7
                        ? ' stroke-green-500 '
                        : bloggerReviews[0].average_score >= 5
                        ? ' stroke-yellow-400 '
                        : ' stroke-red-500 '
                    }}`}
                  ></circle>
                </svg>
              </div>
              <div className='line-clamp-2 sm:w-[50vw] w-[33vw] text-ellipsis sm:text-base text-[0.6rem]'>
                {bloggerReviews[0].comment}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
