import { displayNum } from '../../../utils/utils'
export default function Restaurant({ food }) {
  return (
    <>
      <div className='w-full pb-8'>
        <img src={food.image_url} alt='' className='w-full cursor-pointer' />
        <div className='bg-white cursor-pointer'>
          <div className='mt-2 ml-3'>{food.name}</div>
          <div className='mt-3 ml-3 text-gray-600'>{displayNum(food.price)}</div>
        </div>
      </div>
    </>
  )
}
