import { Link, useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../api/restaurants.api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { MdOutlinePinDrop } from 'react-icons/md'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { FaRegEdit } from 'react-icons/fa'
import diningIcon from '../../asset/img/dining.png'
import { Icon } from 'leaflet'
export default function RestaurantDetail() {
  const { id } = useParams()
  const { data, status, isLoading, isSuccess } = useQuery({
    queryKey: ['restaurantDetailHost', id],
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
        <div className='md:sm:grid md:sm:grid-cols-7 md:sm:gap-x-5 pb-[2rem]'>
          <div className='md:sm:col-span-3 flex items-center justify-center'>
            <Carousel
              showArrows={true}
              width={screen.width >= 1536 ? 500 : screen.width >= 640 ? 450 : 300}
              thumbWidth={screen.width < 640 ? 46 : 80}
            >
              <div>
                <img referrerPolicy='no-referrer' src={data?.data.restaurant.main_avatar_url} />
              </div>
              {data &&
                restaurantData.images.map((image, key) => {
                  return (
                    <div key={key}>
                      <img referrerPolicy='no-referrer' src={image} />
                    </div>
                  )
                })}
            </Carousel>
          </div>
          <div className='md:sm:col-start-4 md:sm:col-span-4 bg-white'>
            <div className='mx-[1rem] py-[1rem]'>
              <div className='italic text-xl bold text-green-600'>{restaurantData.name}</div>
              <div className='mt-[1rem]'>
                <div className='flex items-center justify-between'>
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
                  <div className='relative '>
                    <Link to={`../../update_restaurant/${id}`}>
                      <div className='absolute right-1 sm:w-[15vw] hover:bg-slate-100'>
                        <div className='sm:flex sm:items-center'>
                          <FaRegEdit
                            style={{
                              width: screen.width < 640 ? '8vw' : '3vw',
                              height: screen.width < 640 ? '8vw' : '3vw',
                              color: 'orange'
                            }}
                          />
                          {screen.width > 640 && (
                            <div className='text-green-500'>Cập nhật thông tin</div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='md:sm:flex gap-x-7'>
                  <div className='flex gap-x-7'>
                    <div>
                      <div className='text-yellow-600'>Sáng</div>
                      <div>
                        {restaurantData.morning_open_time} &#8212;
                        {restaurantData.morning_closed_time}
                      </div>
                    </div>
                    <div>
                      <div className='text-orange-600'>Chiều</div>
                      <div>
                        {restaurantData.afternoon_open_time} &#8212;
                        {restaurantData.afternoon_closed_time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex gap-x-1 mt-[1rem] font-inter-400'>
                <MdOutlinePinDrop />
                <div>{restaurantData.address}</div>
              </div>
              <div className=''>
                <MapContainer
                  zoomSnap='0.1'
                  center={[restaurantData.lat, restaurantData.lng]}
                  zoom={17}
                  style={{
                    height: screen.width <= 640 ? '30vh' : 'full',
                    width: screen.width >= 1536 ? '45vw' : screen.width >= 640 ? '45vw' : '75vw'
                  }}
                >
                  <Marker
                    position={[restaurantData.lat, restaurantData.lng]}
                    icon={
                      new Icon({
                        iconUrl: diningIcon,
                        iconSize: [80, 80],
                        iconAnchor: [12, 41]
                      })
                    }
                  ></Marker>
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
