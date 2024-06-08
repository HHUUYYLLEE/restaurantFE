import { useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRestaurant } from '../../api/restaurants.api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { MdOutlinePinDrop } from 'react-icons/md'
import { FaRegClock } from 'react-icons/fa'
import { FaClock } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import { Icon } from 'leaflet'
import { getStatusRestaurantFromTime } from '../../utils/utils'
export default function RestaurantDetail() {
  const { id } = useParams()
  const { data, status, isLoading, isSuccess } = useQuery({
    queryKey: ['restaurantDetail', id],
    queryFn: () => {
      return getRestaurant(id)
    },
    placeholderData: keepPreviousData
  })
  function DisableZoom() {
    const map = useMap()
    map.scrollWheelZoom.disable()
    return null
  }
  const restaurantData = data?.data.restaurant

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
                <img src={data?.data.restaurant.main_avatar_url} referrerPolicy='no-referrer' />
              </div>
              {data &&
                restaurantData.images.map((image, key) => {
                  return (
                    <div key={key}>
                      <img src={image} referrerPolicy='no-referrer' />
                    </div>
                  )
                })}
            </Carousel>
          </div>
          <div className='md:sm:col-start-4 md:sm:col-span-4 bg-white'>
            <div className='mx-[1rem] py-[1rem]'>
              <div className='italic text-xl bold text-green-600'>{restaurantData.name}</div>
              <div className='mt-[1rem]'>
                <div className='text-gray-600'>
                  {getStatusRestaurantFromTime(
                    restaurantData.morning_open_time,
                    restaurantData.morning_closed_time,
                    restaurantData.afternoon_open_time,
                    restaurantData.afternoon_closed_time
                  )}
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
                <MdOutlinePinDrop
                  style={{
                    width: screen.width >= 640 ? '1vw' : '10vw',
                    height: screen.width >= 640 ? '1vw' : '10vw'
                  }}
                />
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
                  <DisableZoom></DisableZoom>
                  <Marker
                    position={[restaurantData.lat, restaurantData.lng]}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
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
