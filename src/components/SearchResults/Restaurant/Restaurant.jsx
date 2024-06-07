import { Link } from 'react-router-dom'

export default function Restaurant({ restaurant }) {
  return (
    <>
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className=''>
          <img
            src={restaurant.main_avatar_url}
            alt=''
            className='h-[10vh] sm:h-[26vh] w-full cursor-pointer'
            referrerPolicy='no-referrer'
          />
          <div className='bg-white cursor-pointer h-[9vh] sm:h-[18vh]'>
            <div
              className='sm:mt-[0.2rem] sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis text-[0.56rem] sm:text-[1rem] sm:h-[7vh] sm:leading-5
           '
            >
              <div className='md:sm:mt-[0.3rem] mt-[0.2rem]'>{restaurant.name}</div>
            </div>
            <div
              className='sm:ml-3 sm:mt-3
            mx-[0.2rem] mt-[0.2rem] line-clamp-3 text-ellipsis text-gray-600 text-[0.41rem]
            sm::line-clamp-2 sm:text-[0.7rem]'
            >
              {restaurant.address}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
