import { displayNum } from '../../../utils/utils'
import { Link } from 'react-router-dom'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { FaMinusCircle } from 'react-icons/fa'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderInputSchema } from '../../../utils/rules'
import { useForm } from 'react-hook-form'

export default function Restaurant({ food }) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(orderInputSchema)
  })
  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <>
      <div className=''>
        <Link to={`/restaurant/${food.restaurant_id}`}>
          <img
            src={food.image_url}
            alt=''
            className='h-[10vh] md:sm:h-[26vh] w-full'
            referrerPolicy='no-referrer'
          />
        </Link>
        <div className='bg-white h-[9vh] sm:h-[18vh]'>
          <div
            className='sm:mt-[0.2rem] sm:ml-3 mx-[0.2rem] 
            line-clamp-2 text-ellipsis text-[0.56rem] sm:text-[1rem] sm:h-[7vh] sm:leading-5
           '
          >
            <Link to={`/restaurant/${food.restaurant_id}`}>
              <div className='md:sm:mt-[0.3rem] mt-[0.2rem]'>{food.name}</div>
            </Link>
          </div>

          <div
            className={`
            mx-[0.2rem] text-orange-600 text-[0.7rem] flex justify-center sm:text-[1.7rem]
           `}
          >
            {food.price < Math.pow(10, 7) ? displayNum(food.price) + 'đ' : 'Trên 10tr đ'}
          </div>
          <div className='mx-[0.2rem]'>
            <form onSubmit={onSubmit}>
              <div className='flex items-center justify-center gap-x-[0.2rem]'>
                <button type='submit'>
                  <BsFillPlusCircleFill
                    style={{
                      width: screen.width < 640 ? '3.3vw' : '1.6vw',
                      height: screen.width < 640 ? '3.3vw' : '1.6vw',
                      color: '#F97316'
                    }}
                  />
                </button>
                <input
                  type='number'
                  id='quantity'
                  name='quantity'
                  autoComplete='off'
                  {...register('quantity')}
                  className='sm:w-[5vw] w-[9vw] priceInput focus:outline-[#f97416b4] sm:h-full
                   h-[1.9vh]
                  placeholder:text-[#4F4F4F] sm:placeholder:text-sm placeholder:text-[0rem] 
                  sm:border-[0.2rem] sm:rounded-xl sm:py-[0.2rem] border-[0.1rem]
                font-inter-500 border-[#f974162a] rounded-md sm:text-sm text-[0.3rem] pl-[0.15rem] 
                sm:pl-[0.3rem]'
                />
                <button type='submit'>
                  <FaMinusCircle
                    style={{
                      width: screen.width < 640 ? '3.5vw' : '1.6vw',
                      height: screen.width < 640 ? '3.3vw' : '1.6vw',
                      color: '#F97316'
                    }}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
