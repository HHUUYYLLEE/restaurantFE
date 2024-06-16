import 'leaflet/dist/leaflet.css'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { Link } from 'react-router-dom'
import Order from './Order/Order'

import { useEffect, useState } from 'react'
import { CiShop } from 'react-icons/ci'

export default function OrderRestaurant({ option, restaurant, refetch }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    for (const order of restaurant.orders) {
      if (order.status === option || option === 0) {
        setShow(true)
        return
      }
      setShow(false)
    }
  }, [option, restaurant.orders])
  return (
    <>
      {show && (
        <div className='bg-white mb-[2rem]'>
          <div className='py-[1.2rem] sm:px-[1.2rem] px-[0.5rem]'>
            <div className='flex items-center justify-between'>
              <Link to={`/restaurant/${restaurant._id}`}>
                <div className='flex items-center sm:gap-x-[1.2rem]'>
                  <CiShop
                    style={{
                      width: screen.width >= 640 ? '2vw' : '11vw',
                      height: screen.width >= 640 ? '2vw' : '11vw'
                    }}
                  />
                  <div
                    className='sm:text-2xl text-xs line-clamp-2 text-ellipsis 
                  max-w-[50vw] sm:max-w-[60vw] overflow-hidden'
                  >
                    {restaurant.name}
                  </div>
                </div>
              </Link>
            </div>
            <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
            {restaurant.orders.map((data, id) => {
              if (option === 0 || option === data.status)
                return (
                  <div key={id}>
                    <Order order={data} refetch={refetch} />
                  </div>
                )
            })}
          </div>
        </div>
      )}
    </>
  )
}
