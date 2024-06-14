import { Link } from 'react-router-dom'
import { getStatusRestaurantFromTime } from '../../../utils/utils'
import { FiSunset } from 'react-icons/fi'
import { FiSunrise } from 'react-icons/fi'

export default function Restaurant({ displayType, restaurant }) {
  return (
    <>
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className={displayType === 0 ? ' flex ' : '  '}>
          <img
            referrerPolicy='no-referrer'
            src={restaurant.main_avatar_url}
            className={`h-[18.7vw] sm:h-[26vh] cursor-pointer
              ${displayType === 1 ? ' w-full ' : ' sm:w-[16.4vw] w-[20.3vw]'}`}
          />
          <div
            className={`bg-white cursor-pointer  h-[9.33vh]
          ${displayType === 0 ? ' sm:h-[26vh] w-full ' : ' sm:h-[18vh] '}`}
          >
            <div
              className={` sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis overflow-hidden sm:h-[7vh] sm:leading-5
            ${
              displayType === 0
                ? ' h-[3.4vh] text-[0.5rem] sm:text-[1.2rem] mt-[0.5rem] sm:mt-[1rem]'
                : ' sm:text-[0.9rem] text-[0.5rem] sm:mt-[0.3rem] mt-[0.2rem] h-[3.5vh]'
            }
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
                ${displayType === 0 ? ' sm:text-xl ' : ' sm:text-sm '}`}
              >
                {getStatusRestaurantFromTime(
                  restaurant.morning_open_time,
                  restaurant.morning_closed_time,
                  restaurant.afternoon_open_time,
                  restaurant.afternoon_closed_time
                )}
              </div>
              {displayType === 0 && (
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
              )}
            </div>
            <div
              className={`sm:ml-3 sm:mt-3
            mx-[0.2rem] mt-[0.2rem]  text-ellipsis overflow-hidden text-gray-600 text-[0.41rem]
             line-clamp-2 
            ${displayType === 0 ? ' sm:text-[1rem] ' : ' sm:mx-1 sm:text-[0.7rem] '}
            `}
            >
              {restaurant.address}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
