import { displayNum } from '../../../utils/utils'
export default function Restaurant({ food }) {
  return (
    <>
      <div className='w-full pb-8 cursor-pointer'>
        <img src={food.image_url} alt='' className='w-full' />
        <div className='bg-white'>
          <div className='mt-2 ml-3'>{food.name}</div>
          <div className='mt-3 ml-3 text-gray-600'>{displayNum(food.price)}</div>
        </div>
      </div>
    </>
  )
}
