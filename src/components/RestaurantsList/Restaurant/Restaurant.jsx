export default function Restaurant({ restaurant }) {
  return (
    <>
      <div className='w-full pb-8'>
        <img src={restaurant.main_avatar_url} alt='' className='w-full cursor-pointer' />
        <div className='bg-white cursor-pointer'>
          <div className='mt-2 ml-3'>{restaurant.name}</div>
          <div className='mt-3 ml-3 text-gray-600'>{restaurant.address}</div>
        </div>
      </div>
    </>
  )
}
