import { Link } from 'react-router-dom'

export default function Restaurant({ restaurant }) {
  return (
    <>
      <Link to={`/host_restaurant/${restaurant._id}`}>
        <div className='w-full pb-8'>
          <img src={restaurant.main_avatar_url} alt='' className='w-full h-[20vh] cursor-pointer' />
          <div className='bg-white cursor-pointer h-[18vh]'>
            <div className='mt-2 ml-3'>{restaurant.name}</div>
            <div className='mt-3 ml-3 text-gray-600'>{restaurant.address}</div>
          </div>
        </div>
      </Link>
    </>
  )
}
