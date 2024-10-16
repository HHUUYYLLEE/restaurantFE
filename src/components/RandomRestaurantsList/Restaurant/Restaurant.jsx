import { Link } from 'react-router-dom'

export default function Restaurant({ restaurant }) {
  return (
    <>
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className=''>
          <img
            referrerPolicy='no-referrer'
            src={restaurant.main_avatar_url}
            alt=''
            className='h-[15vh] sm:h-[20vh] w-full cursor-pointer'
          />
          <div className='bg-white cursor-pointer h-[10vh] md:sm:h-[13vh]'>
            <div
              className='md:sm:mt-[0.2rem] md:sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis text-[0.7rem] leading-[0.8rem]
            md:2xl:leading-[1rem]'
            >
              <div className='sm:mt-[0.3rem] mt-[0.2rem] 2xl:text-[0.9rem] 2xl:line-clamp-2 2xl:h-[2rem]'>{restaurant.name}</div>
            </div>
            <div
              className='sm:ml-3 sm:mt-3
            mx-[0.2rem] mt-[0.2rem] line-clamp-3 text-ellipsis text-gray-600 text-[0.6rem]
            sm:line-clamp-2 2xl:text-[0.8rem]'
            >
              {restaurant.address}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
