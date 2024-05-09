import googleDriveURL from '../../../constants/googledriveURL'
export default function Restaurant({ restaurant }) {
  return (
    <>
      <div className='w-full pb-8 cursor-pointer'>
        <img src={googleDriveURL(restaurant.main_avatar_url)} alt='' className='w-full' />
        <div className='mt-2 ml-3'>{restaurant.name}</div>
        <div className='mt-3 ml-3 text-gray-600'>{restaurant.address}</div>
      </div>
    </>
  )
}
