import { Link } from 'react-router-dom'

export default function Restaurant({ restaurant }) {
  return (
    <>
      <Link to={`/host_restaurant/${restaurant._id}`}>
        <div className='w-full pb-8 h-[39vh]'>
          <img
            referrerPolicy='no-referrer'
            src={restaurant.main_avatar_url}
            alt=''
            className='w-full h-[20vh] '
          />
          <div className='bg-white h-[18vh]'>
            <div className='py-2'>
              <div className='mx-3 sm:text-base text-xs line-clamp-2 h-[4vh] sm:h-[7vh] text-ellipsis'>
                {restaurant.name}
              </div>
            </div>
            <div
              className=' mx-3 sm:text-xs 2xl:text-sm text-xs text-ellipsis 2xl:line-clamp-2 sm:line-clamp-3 
              text-gray-600'
            >
              {restaurant.address}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
