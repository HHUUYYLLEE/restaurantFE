import { keepPreviousData, useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'lrm-graphhopper'
import { useContext, useEffect } from 'react'
import { FaArrowCircleDown, FaChair } from 'react-icons/fa'
import {
  MdDining,
  MdOutlineComment,
  MdOutlinePinDrop,
  MdOutlineTableRestaurant
} from 'react-icons/md'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { Link, useParams } from 'react-router-dom'
import { getRestaurant } from '../../api/restaurants.api'
import diningIcon from '../../asset/img/dining.png'
import humanIcon from '../../asset/img/human.png'
import spinningload from '../../asset/img/spinning_load.gif'
import { AppContext } from '../../contexts/app.context'
import { envConfig } from '../../utils/env'
import { getStatusRestaurantFromTime } from '../../utils/utils'
export default function RestaurantDetail({ setOption, reviews, setReviews, setGetReviewSuccess }) {
  const { leafletMap } = useContext(AppContext)
  const scores = ['Vị trí', 'Giá cả', 'Chất lượng', 'Phục vụ', 'Không gian']
  const { id } = useParams()
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['restaurantDetail', id, reviews],
    queryFn: async () => {
      const data = await getRestaurant(id)
      setReviews(data?.data.reviews)
      setGetReviewSuccess(true)
      return data
    },
    placeholderData: keepPreviousData
  })
  const restaurantData = data?.data.restaurant
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (e) => {
        const newRoutingMap = L.Routing.control({
          waypoints: [
            L.latLng(e.coords.latitude, e.coords.longitude),
            L.latLng(restaurantData?.lat, restaurantData?.lng)
          ],
          router: L.Routing.graphHopper(envConfig.graphhopperKey),
          createMarker: (i, wp) => {
            if (i !== 0)
              return L.marker(wp.latLng, {
                icon: new L.Icon({
                  iconUrl: diningIcon,
                  iconSize: [41, 41]
                })
              })
            else
              return L.marker(wp.latLng, {
                icon: new L.Icon({
                  iconUrl: humanIcon,
                  iconSize: [60, 80]
                })
              })
          },
          language: 'en',
          fitSelectedRoutes: true
        })
        newRoutingMap.on('routeselected', (e) => {
          console.log(e)
        })
        newRoutingMap.addTo(leafletMap)
      },
      () => {
        L.marker([restaurantData?.lat, restaurantData?.lng], {
          icon: new L.Icon({
            iconUrl: diningIcon,
            iconSize: [41, 41]
          })
        }).addTo(leafletMap)
      }
    )
  }, [leafletMap, restaurantData?.lat, restaurantData?.lng])
  function Routing() {
    const map = useMap()
    const { setLeafletMap } = useContext(AppContext)
    useEffect(() => {
      setLeafletMap(map)
    }, [map, setLeafletMap])

    return null
  }
  const dataScores = [
    data?.data.restaurant.location_score,
    data?.data.restaurant.price_score,
    data?.data.restaurant.quality_score,
    data?.data.restaurant.service_score,
    data?.data.restaurant.area_score
  ]
  const average_score = data?.data.restaurant.average_score
  return (
    <>
      {isSuccess && (
        <div>
          <div className='sm:grid sm:grid-cols-7 sm:gap-x-5 '>
            <div className='sm:col-span-3 flex items-center justify-center'>
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
            <div className='sm:col-start-4 sm:col-span-4 bg-white'>
              <div className='mx-[1rem] py-[1rem]'>
                <div
                  className='italic text-xl bold text-green-600 sm:line-clamp-2 line-clamp-3 
                text-ellipsis overflow-hidden'
                >
                  {restaurantData.name}
                </div>
                <div className='mt-[1rem] flex sm:justify-between gap-x-4 sm:gap-x-[10rem]'>
                  <div>
                    <div className='text-gray-600'>
                      {getStatusRestaurantFromTime(
                        restaurantData.morning_open_time,
                        restaurantData.morning_closed_time,
                        restaurantData.afternoon_open_time,
                        restaurantData.afternoon_closed_time
                      )}
                    </div>
                    <div className='sm:flex gap-x-7'>
                      <div className='flex sm:gap-x-7 gap-x-[0.4rem]'>
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
                  <Link to={`/table_order/${id}`}>
                    <button
                      className={`text-white bg-orange-500 hover:bg-green-500 rounded-lg h-[3vh]
                    sm:h-[6vh]
                    flex items-center px-[0.3rem] sm:px-[1rem]`}
                    >
                      {screen.width < 640 ? (
                        <div className='flex'>
                          <MdOutlineTableRestaurant
                            style={{
                              width: '5vw',
                              height: '5vw'
                            }}
                          />
                          <FaChair />
                        </div>
                      ) : (
                        <div className='flex items-center gap-x-4'>
                          <MdOutlineTableRestaurant
                            style={{
                              width: '2vw',
                              height: '2vw'
                            }}
                          />
                          <div className='italic text-xl'>Đặt chỗ</div>
                          <FaChair
                            style={{
                              width: '1.5vw',
                              height: '1.5vw'
                            }}
                          />
                        </div>
                      )}
                    </button>
                  </Link>
                </div>
                {average_score > 0 ? (
                  <div className='sm:flex'>
                    <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw] relative rounded-full '>
                      <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  rounded-full  '>
                        <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  inline-block '>
                          <div
                            className={`inline-block text-[1rem] mt-[50%] ml-[50%] 
                    translate-x-[-50%] translate-y-[-50%] sm:text-[1.3rem] 2xl:text-[1.6rem] first-letter:${
                      average_score >= 7
                        ? ' text-green-500 '
                        : average_score >= 5
                        ? ' text-yellow-400 '
                        : ' text-red-500 '
                    }`}
                          >
                            {average_score}
                          </div>
                        </div>
                      </div>

                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        version='1.1'
                        width={`${screen.width < 640 ? '11vw' : '5vw'}`}
                        height={`${screen.width < 640 ? '11vw' : '5vw'}`}
                        className='absolute top-0 left-0'
                        id='svg_circle'
                        strokeDasharray={
                          screen.width >= 1536 ? 190 : screen.width >= 640 ? 160 : 113
                        }
                        strokeDashoffset={
                          screen.width >= 1536
                            ? 190 * (1 - average_score / 10)
                            : screen.width >= 640
                            ? 160 * (1 - average_score / 10)
                            : 113 * (1 - average_score / 10)
                        }
                        transform='rotate(-90)'
                      >
                        <circle
                          cx={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                          cy={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                          r={`${screen.width < 640 ? '5vw' : '2vw'}`}
                          strokeLinecap='round'
                          className={`fill-none stroke-[0.5vw] ${
                            average_score >= 7
                              ? ' stroke-green-500 '
                              : average_score >= 5
                              ? ' stroke-yellow-400 '
                              : ' stroke-red-500 '
                          }}`}
                        ></circle>
                      </svg>
                    </div>
                    <div className='flex items-center sm:gap-x-8 gap-x-0'>
                      <div className='flex items-center'>
                        {dataScores.map((data, i) => {
                          return (
                            <div key={i} className='2xl:w-[6rem] sm:w-[4.5rem] w-[3.5rem]'>
                              <div className='text-center'>
                                <div>
                                  <div
                                    className={`sm:text-[1.5rem] ${
                                      data >= 7
                                        ? ' text-green-500 '
                                        : data >= 5
                                        ? ' text-yellow-400 '
                                        : ' text-red-500 '
                                    }`}
                                  >
                                    {data}
                                  </div>
                                  <div className='sm:text-xs text-[0.6rem] text-slate-500'>
                                    {scores[i]}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {screen.width > 640 && (
                        <div
                          className='flex gap-x-3 items-center cursor-pointer'
                          onClick={() => {
                            window.scrollTo({
                              top: 950,
                              behavior: 'smooth'
                            })
                            setOption(1)
                          }}
                        >
                          <div className=''>
                            <div className='flex gap-x-3'>
                              <MdOutlineComment
                                style={{
                                  color: 'orange',
                                  width: '2vw',
                                  height: '2vw'
                                }}
                              />
                              <div className='text-[1.2rem]'>{reviews?.length}</div>
                            </div>
                            <div className=' mt-[0.4rem] text-[0.6rem] text-slate-500'>
                              đánh giá
                            </div>
                          </div>
                          <FaArrowCircleDown
                            style={{
                              color: 'orange',
                              width: '1.5vw',
                              height: '1.5vw'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-x-2'>
                    <MdOutlineComment />
                    <div className='italic text-slate-400'>Chưa có đánh giá</div>
                  </div>
                )}
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
                    <Routing></Routing>

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
          <div className='bg-white mt-[2rem] w-full'>
            <div className='flex gap-x-1 px-[1rem] sm:px-[1.3rem] items-center'>
              <MdDining
                style={{
                  color: 'red',
                  width: screen.width < 640 ? '5vw' : '2.5vw',
                  height: screen.width < 640 ? '5vw' : '2.5vw'
                }}
              />
              <div className=' text-orange-500 italic sm:text-[1.5rem]'>Giới thiệu</div>
            </div>

            <hr className='h-[0.1rem] border-none bg-gray-400' />
            <div className='px-[1rem] py-[1rem] text-xs sm:text-[1rem] sm:leading-6 2xl:leading-5'>
              {restaurantData.desc}
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className='flex items-center justify-center'>
          <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
        </div>
      )}
    </>
  )
}
