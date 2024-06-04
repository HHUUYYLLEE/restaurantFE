import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../api/restaurants.api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { MdOutlinePinDrop } from 'react-icons/md'
import { FaRegClock } from 'react-icons/fa'
import { FaClock } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function RestaurantDetail() {
  const { id } = useParams()
  const { data, status, isLoading, isSuccess } = useQuery({
    queryKey: ['restaurantDetail', id],
    queryFn: () => {
      return getRestaurant(id)
    },
    placeholderData: keepPreviousData
  })
  const restaurantData = data?.data.restaurant
  const date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()
  if (isSuccess)
    return (
      <>
        <div className='grid grid-cols-7 gap-x-5 pb-[2rem]'>
          <div className='col-span-3 flex items-center justify-center'>
            <Carousel showArrows={true}>
              <div>
                <img src={data?.data.restaurant.main_avatar_url} />
              </div>
              {data &&
                restaurantData.images.map((image, key) => {
                  return (
                    <div key={key}>
                      <img src={image} />
                    </div>
                  )
                })}
            </Carousel>
          </div>
          <div className='col-start-4 col-span-4 bg-white'>
            <div className='mx-[2rem] my-[1rem]'>
              <div className='italic text-xl bold text-green-600'>{restaurantData.name}</div>

              <div className='mt-[2rem]'>
                <div className='text-gray-600'>
                  {hour < 12
                    ? hour >= parseInt(restaurantData.morning_open_time.split(':')[0]) &&
                      minute >= parseInt(restaurantData.morning_open_time.split(':')[1]) &&
                      hour <= parseInt(restaurantData.morning_closed_time.split(':')[0]) &&
                      minute < parseInt(restaurantData.morning_closed_time.split(':')[1])
                      ? 'Đang hoạt động'
                      : 'Đã đóng cửa'
                    : hour >= parseInt(restaurantData.afternoon_open_time.split(':')[0]) &&
                      minute >= parseInt(restaurantData.afternoon_open_time.split(':')[1]) &&
                      hour <= parseInt(restaurantData.afternoon_closed_time.split(':')[0]) &&
                      minute < parseInt(restaurantData.afternoon_closed_time.split(':')[1])
                    ? 'Đang hoạt động'
                    : 'Đã đóng cửa'}
                </div>
                <div className='flex gap-x-7'>
                  <div className='flex gap-x-7'>
                    <div>
                      <div className='text-yellow-600'>Sáng</div>
                      <div>
                        {restaurantData.morning_open_time} &#8212; {restaurantData.morning_closed_time}
                      </div>
                    </div>
                    <div>
                      <div className='text-orange-600'>Chiều</div>
                      <div>
                        {restaurantData.afternoon_open_time} &#8212; {restaurantData.afternoon_closed_time}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-x-4'>
                    <div className=''>Số bàn</div>
                    <div>{restaurantData.number_of_tables}</div>
                  </div>
                  <div className='flex gap-x-4'>
                    <div className=''>Số chỗ ngồi</div>
                    <div>{restaurantData.number_of_chairs}</div>
                  </div>
                </div>
              </div>
              <div className='flex gap-x-1 mt-[1rem] font-inter-400'>
                <MdOutlinePinDrop />
                <div>{restaurantData.address}</div>
              </div>
              <div className='w-[50vw]'>
                <MapContainer center={[restaurantData.lat, restaurantData.lng]} zoom={17}>
                  <Marker position={[restaurantData.lat, restaurantData.lng]}></Marker>
                  <TileLayer
                    attribution='Google Maps'
                    url='http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' // regular
                    // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
                    // url='http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}' // terrain
                    maxZoom={20}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
