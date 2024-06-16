import { useState } from 'react'
import RestaurantsList from '../../components/Profile/RestaurantsList/Restaurantslist'
import UserProfile from '../../components/Profile/UserProfile/UserProfile'
import HostRestaurantsOrders from '../../components/HostRestaurantsOrders/HostRestaurantsOrders'
import { FaAngleRight } from 'react-icons/fa6'
import HostRestaurantsOrdersTable from '../../components/HostRestaurantsOrdersTable/HostRestaurantsOrdersTable'
export default function Profile() {
  const [option, setOption] = useState(0)
  const options = ['Cá nhân', 'Nhà hàng', 'Đơn hàng', 'Đơn đặt chỗ']
  return (
    <>
      <div>
        {screen.width > 640 && (
          <div className='fixed top-[4.9rem] bg-orange-600 w-[10vw] h-[100vh]'>
            {options.map((data, id) => {
              return (
                <div
                  key={id}
                  className={`flex cursor-pointer 
              justify-between  py-[0.7rem] items-center border-white border-t-[0.1rem]  px-[1rem] 
              ${id === options.length - 1 && ' border-b-[0.1rem] '}`}
                  onClick={() => {
                    if (id === 1)
                      window.scrollTo({
                        top: 400,
                        behavior: 'smooth'
                      })
                    else
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      })
                    setOption(id)
                  }}
                >
                  <div
                    className='w-full text-white 
                text-[0.9rem] '
                  >
                    {data}
                  </div>
                  <FaAngleRight
                    style={{
                      color: 'white'
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
        {screen.width < 640 && (
          <div className='flex mt-[6rem] justify-between'>
            <button
              className=' hover:bg-green-500 bg-orange-500  text-white py-[0.3rem] text-[0.9rem] px-[0.4rem]
               font-ibm-plex-serif-700 rounded-lg
               italic '
              onClick={() => {
                setOption(1)
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
            >
              Cá nhân & Nhà hàng
            </button>

            <button
              className=' hover:bg-green-500 bg-orange-500  text-white py-[0.3rem] text-[0.9rem] px-[0.4rem]
               font-ibm-plex-serif-700 rounded-lg
                italic '
              onClick={() => {
                setOption(2)
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
            >
              Đơn hàng
            </button>

            <button
              className=' hover:bg-green-500 bg-orange-500 text-white py-[0.3rem] text-[0.9rem] px-[0.4rem]
               font-ibm-plex-serif-700 rounded-lg
               italic '
              onClick={() => {
                setOption(3)
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
            >
              Đơn đặt chỗ
            </button>
          </div>
        )}
        <div className='sm:mt-24 mt-[1rem]  pb-10 sm:flex'>
          {(option === 0 || option === 1) && (
            <div>
              <UserProfile />
              <RestaurantsList />
            </div>
          )}

          {option === 2 && (
            <div className='sm:ml-[15vw] sm:my-0 sm:mr-0 mx-auto sm:w-[80%] w-[90%]'>
              <HostRestaurantsOrders />
            </div>
          )}
          {option === 3 && (
            <div className='sm:ml-[15vw] sm:my-0 sm:mr-0 mx-auto sm:w-[80%] w-[90%]'>
              <HostRestaurantsOrdersTable />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
