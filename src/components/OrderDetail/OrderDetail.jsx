import { useParams, useNavigate, Link } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUserOrders, placeAnOrder } from '../../api/order_food.api'
import { getOrder } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { orderInputSchema } from '../../utils/rules'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'
import { MdOutlinePinDrop } from 'react-icons/md'
import { getInfoFromLS } from '../../utils/auth'
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet'
import { envConfig } from '../../utils/env'
import { CiShop } from 'react-icons/ci'
import { getRestaurant } from '../../api/restaurants.api'
import Food from './Food/Food'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import L from 'leaflet'
import { useDebounce } from '@uidotdev/usehooks'
import { AppContext } from '../../contexts/app.context'
import { FaPhoneAlt } from 'react-icons/fa'
import Checkbox from 'react-custom-checkbox'
import { FaCheckCircle } from 'react-icons/fa'

export default function OrderDetail() {
  const { leafletMap } = useContext(AppContext)
  const phone_number = getInfoFromLS().phone_number
  const username = getInfoFromLS().username
  const { id } = useParams()
  const navigate = useNavigate()

  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [latLng, setLatLng] = useState(undefined)

  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [markerPos, setMarkerPos] = useState(['', ''])
  const [addressValue, setAddressValue] = useState('')
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchQuery2, setSearchQuery2] = useState(null)
  const [searchParams, setSearchParams] = useDebounce([searchQuery], 1000)
  const [searchParams2, setSearchParams2] = useDebounce([searchQuery2], 1000)
  const [enableSearchLatLng, setEnableSearchLatLng] = useState(false)
  const [snapMap, setSnapMap] = useState(false)
  const [routingRedraw, setRoutingRedraw] = useState(false)
  const { mapDraw, setMapDraw } = useContext(AppContext)
  const { handleSubmit } = useForm({
    mode: 'all'
  })

  const placeAnOrderMutation = useMutation({
    mutationFn: (body) => placeAnOrder(body)
  })
  const { status, data, isLoading } = useQuery({
    queryKey: ['search_location', searchParams],
    queryFn: () => {
      return getSearchLocation(searchParams)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchResults
  })
  const {
    status: status2,
    data: data2,
    isLoading: isLoading2,
    isSuccess: isSuccess2
  } = useQuery({
    queryKey: ['search_lat_lng', searchParams2],
    queryFn: () => {
      return getSearchLocation(searchParams2)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchLatLng
  })
  function HandleSuccess({ isSuccess2, data }) {
    useEffect(() => {
      if (isSuccess2) {
        setAddressValue(data2.data.results[0].formatted)
        setLatLngValueInput([
          data2.data.results[0].geometry.lat,
          data2.data.results[0].geometry.lng
        ])
      }
    }, [isSuccess2])
  }
  HandleSuccess({ isSuccess2, data })
  const { data: order_detail, isSuccess } = useQuery({
    queryKey: ['order_list', id],
    queryFn: () => {
      return getOrder(id)
    },
    placeholderData: keepPreviousData
  })

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng })
        setMarkerPos([e.latlng.lat, e.latlng.lng])
        setSnapMap(true)
        setEnableSearchLatLng(true)
        setLatLngValueInput([e.latlng.lat, e.latlng.lng])
        setSearchQuery2({ q: e.latlng.lat + ',' + e.latlng.lng, key: envConfig.opencageKey })
        if (!routingRedraw) {
          const newRoutingMap = L.Routing.control({
            waypoints: [
              L.latLng(e.latlng.lat, e.latlng.lng),
              L.latLng(restaurantData.lat, restaurantData.lng)
            ],
            router: L.Routing.graphHopper(envConfig.graphhopperKey),
            fitSelectedRoutes: true
          })
          newRoutingMap.on('routeselected', (e) => {
            console.log(e)
          })
          newRoutingMap.on('routingerror', (e) => {})
          newRoutingMap.addTo(leafletMap)
          setMapDraw(newRoutingMap)
          setRoutingRedraw(true)
        } else {
          leafletMap.removeControl(mapDraw)
          const newRoutingMap = L.Routing.control({
            waypoints: [
              L.latLng(e.latlng.lat, e.latlng.lng),
              L.latLng(restaurantData.lat, restaurantData.lng)
            ],
            router: L.Routing.graphHopper(envConfig.graphhopperKey),
            fitSelectedRoutes: true
          })
          newRoutingMap.on('routeselected', (e) => {})
          newRoutingMap.on('routingerror', (e) => {})
          newRoutingMap.addTo(leafletMap)
          setMapDraw(newRoutingMap)
        }
      }
    })
    return null
  }

  function ResetCenterView({ latLng }) {
    const map = useMap()
    const { setLeafletMap } = useContext(AppContext)

    useEffect(() => {
      setLeafletMap(map)
    }, [map, setLeafletMap])
    useEffect(() => {
      if (snapMap) {
        map.flyTo(latLng, map.getZoom())
        setSnapMap(false)
      }
    }, [map, latLng])

    return null
  }
  const orderFood = order_detail?.data.orderFood
  const restaurant_id = orderFood?.restaurant_id
  const orderFoodList = order_detail?.data.orderFoodList
  const { data: restaurant_data, isSuccess: restaurantSuccess } = useQuery({
    queryKey: ['restaurantDetail', restaurant_id],
    queryFn: () => {
      return getRestaurant(restaurant_id)
    },
    placeholderData: keepPreviousData,
    enabled: !!restaurant_id
  })
  const restaurantData = restaurant_data?.data.restaurant
  const onSubmit = handleSubmit((data) => {
    data.order_food_id = orderFood?._id
    data.address = addressValue
    data.lat = latLngValueInput[0]
    data.lng = latLngValueInput[1]
    data.memo = ''
    console.log(data)
    placeAnOrderMutation.mutate(data, {
      onSuccess: () => {
        // toast.success('Đã đặt hàng thành công!') //。(20)
        navigate('/order_food')
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  })
  const bottomBar = useRef(null)
  window.addEventListener('scroll', (event) => {
    if (bottomBar.current.style)
      if (window.scrollY > 500) bottomBar.current.style.visibility = 'visible'
      else bottomBar.current.style.visibility = 'hidden'
  })

  if (isSuccess && restaurantSuccess) {
    return (
      <>
        <form onSubmit={onSubmit}>
          <div className='w-full bg-white sm:p-[2.5rem] p-[0.5rem]'>
            <div className='flex sm:justify-between items-center sm:gap-x-0 gap-x-[1rem]'>
              <div className='flex gap-x-1 items-center mt-[1rem] font-inter-400'>
                <MdOutlinePinDrop
                  style={{
                    width: screen.width >= 640 ? '1.6vw' : '3.5vw',
                    height: screen.width >= 640 ? '1.6vw' : '3.5vw',
                    color: 'red'
                  }}
                />
                <div
                  className='sm:text-2xl w-[27vw] 
              sm:w-[11vw] 2xl:w-[9.5vw] text-red-700'
                >
                  Địa chỉ nhận
                </div>
              </div>

              <div
                className='flex font-bold sm:text-2xl sm:gap-x-[1rem] 
           sm:w-full w-[45vw] justify-end'
              >
                <div className='sm:flex sm:items-center sm:gap-x-3 sm:justify-end'>
                  <div className='text-orange-500 sm:block flex sm:justify-start justify-end'>
                    {username}
                  </div>
                  <div className='flex gap-x-2 sm:ml-0'>
                    <FaPhoneAlt
                      style={{
                        color: 'green',
                        width: screen.width >= 640 ? '2vw' : '5vw',
                        height: screen.width >= 640 ? '2vw' : '5vw'
                      }}
                    />
                    <div className='text-green-500'>{phone_number}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='sm:text-2xl text-[0.6rem] sm:line-clamp-1 text-ellipsis line-clamp-2 w-[37vw] sm:w-full overflow-hidden  italic h-[2rem]'>
              {addressValue}
            </div>
            <div className='relative w-full'>
              <div className='absolute top-1 left-[50%] translate-x-[-50%] text-center z-10'>
                <div
                  onBlur={() => {
                    setTimeout(() => {
                      setEnableSearchResults(false)
                    }, '200')
                  }}
                >
                  <input
                    type='text'
                    id='search'
                    name='search'
                    autoComplete='off'
                    onInput={(e) => {
                      if (e.target.value) setEnableSearchResults(true)
                      else setEnableSearchResults(false)
                      setSearchQuery({ q: e.target.value, key: envConfig.opencageKey })
                    }}
                    className='focus:outline-[#8AC0FF] sm:w-[53vw] w-[50vw]
                  border font-inter-500 border-[#E6E6E6] sm:text-lg rounded-xl 
                  sm:opacity-40 sm:hover:opacity-100 duration-500
                  px-[0.5rem] py-[0.2rem]'
                  />
                  {data &&
                    enableSearchResults &&
                    data.data?.results.map((data, key) => {
                      return (
                        <div key={key}>
                          <div
                            className='sm:w-[53vw] w-[50vw] cursor-pointer 
                          
                          hover:bg-slate-200 bg-white'
                            onClick={() => {
                              setLatLng([data.geometry.lat, data.geometry.lng])
                              setEnableSearchResults(false)
                              setSnapMap(true)
                              setAddressValue(data.formatted)
                              setMarkerPos([data.geometry.lat, data.geometry.lng])
                              setLatLngValueInput([data.geometry.lat, data.geometry.lng])
                              if (!routingRedraw) {
                                const newRoutingMap = L.Routing.control({
                                  waypoints: [
                                    L.latLng(data.geometry.lat, data.geometry.lng),
                                    L.latLng(restaurantData.lat, restaurantData.lng)
                                  ],
                                  router: L.Routing.graphHopper(envConfig.graphhopperKey),
                                  fitSelectedRoutes: true
                                })
                                newRoutingMap.on('routesfound', (e) => {})
                                newRoutingMap.on('routingerror', (e) => {})
                                newRoutingMap.addTo(leafletMap)
                                setMapDraw(newRoutingMap)
                                setRoutingRedraw(true)
                              } else {
                                leafletMap.removeControl(mapDraw)
                                const newRoutingMap = L.Routing.control({
                                  waypoints: [
                                    L.latLng(data.geometry.lat, data.geometry.lng),
                                    L.latLng(restaurantData.lat, restaurantData.lng)
                                  ],
                                  router: L.Routing.graphHopper(envConfig.graphhopperKey),
                                  fitSelectedRoutes: true
                                })
                                newRoutingMap.on('routeselected', (e) => {})
                                newRoutingMap.on('routingerror', (e) => {})
                                newRoutingMap.addTo(leafletMap)
                                setMapDraw(newRoutingMap)
                              }
                            }}
                          >
                            {data.formatted}
                          </div>
                          <hr></hr>
                        </div>
                      )
                    })}
                </div>
              </div>
              <MapContainer
                center={[21.028511, 105.804817]}
                zoom={13}
                style={{
                  height: screen.width <= 640 ? '30vh' : 'full',
                  width: screen.width >= 1536 ? '80vw' : screen.width >= 640 ? '80vw' : '78vw'
                }}
                zoomSnap='0.1'
              >
                <ResetCenterView latLng={latLng}></ResetCenterView>
                <MyComponent></MyComponent>

                <Marker
                  position={markerPos}
                  icon={
                    new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
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
          <div className='w-full sm:mt-[3rem] mt-[1rem]'>
            <div className='bg-white mb-[2rem]'>
              <div className='py-[1.2rem] sm:px-[1.2rem] px-[0.3rem]'>
                <div className='flex justify-between'>
                  <Link to={`/restaurant/${restaurantData?._id}`}>
                    <div className='flex items-center sm:gap-x-[1.2rem]'>
                      <CiShop
                        style={{
                          width: screen.width >= 640 ? '2vw' : '11vw',
                          height: screen.width >= 640 ? '2vw' : '11vw'
                        }}
                      />
                      <div className='sm:text-2xl'>{restaurantData?.name}</div>
                    </div>
                  </Link>
                </div>
                <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
                {order_detail &&
                  orderFoodList.map((data) => {
                    return <Food key={data._id} food_id={data.food_id} quantity={data.quantity} />
                  })}
                <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
                <div>
                  <div className='text-right mt-[1rem] sm:text-3xl flex items-center mx-[0.5rem] sm:gap-x-[3rem] gap-x-[1rem]'>
                    <div className='text-orange-500'>
                      {screen.width < 640 ? 'Tổng' : 'Tổng thanh toán'}
                    </div>
                    <div
                      className={`mr-0 ml-auto sm:text-4xl w-[37vw]
                  ${orderFood?.total_price >= Math.pow(10, 9) ? ' text-lg ' : ' text-xl '} 
                  text-emerald-600`}
                    >
                      {displayNum(orderFood?.total_price) + 'đ'}
                    </div>
                    {orderFood.status === 0 ? (
                      <button
                        type='submit'
                        disabled={addressValue === '' ? true : false}
                        className='sm:px-[2rem] sm:py-[1rem] sm:text-3xl 
                        disabled:bg-gray-200 disabled:text-black 
                        disabled:text-opacity-50 bg-orange-600 
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.5rem] py-[0.5rem]'
                      >
                        Đặt đơn
                      </button>
                    ) : (
                      <button
                        type='submit'
                        disabled
                        className=' px-[2rem] py-[1rem] text-3xl bg-gray-200 text-black text-opacity-50 rounded-xl'
                      >
                        Đã đặt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className='sticky bottom-0 z-[2] w-full sm:h-[20vh] h-[10vh] left-0 bg-white
                
        '
            ref={bottomBar}
          >
            <div
              className='flex items-center 
            justify-between h-full 2xl:mx-[8rem] 
            sm:mx-[5rem] mx-[1rem] gap-x-4'
            >
              <div className='flex items-center gap-x-4 sm:gap-x-8 justify-between'>
                <Checkbox
                  icon={
                    <FaCheckCircle
                      color='#F97316'
                      style={{
                        width: screen.width < 640 ? 20 : 40,
                        height: screen.width < 640 ? 20 : 40
                      }}
                    />
                  }
                  name='my-input'
                  checked={true}
                  onChange={(value, event) => {}}
                  borderColor='#F97316'
                  borderRadius={9999}
                  size={screen.width < 640 ? 20 : 40}
                />
                <button
                  className='sm:px-[2rem] sm:py-[0.5rem] 2xl:text-3xl sm:text-2xl
                        disabled:bg-gray-200 disabled:text-black 
                        disabled:text-opacity-50 bg-red-600 
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.5rem] py-[0.5rem]'
                >
                  Xoá
                </button>
              </div>
              <div className='flex items-center justify-end gap-x-4'>
                {screen.width >= 640 && (
                  <div className='text-orange-500 text-xl sm:text-3xl'>Tổng thanh toán</div>
                )}
                <div
                  className={`text-emerald-700 text-xl sm:text-4xl 
            ${orderFood?.total_price >= Math.pow(10, 9) ? ' text-lg ' : ' text-xl'} `}
                >
                  {displayNum(orderFood?.total_price) + 'đ'}
                </div>
                {screen.width >= 640 && (
                  <Link to='/order_food'>
                    <button
                      className='sm:px-[2rem] sm:py-[0.5rem] 2xl:text-3xl sm:text-2xl
                         bg-white 
                        hover:bg-orange-300 text-[0.9rem] text-orange-500 rounded-xl
                        px-[0.9rem] py-[0.8rem]'
                    >
                      Quay lại giỏ hàng
                    </button>
                  </Link>
                )}

                <button
                  disabled={addressValue === '' ? true : false}
                  className='sm:px-[2rem] sm:py-[0.5rem]  2xl:text-3xl sm:text-2xl
                        disabled:bg-gray-200 disabled:text-black 
                        disabled:text-opacity-50 bg-orange-600 
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.9rem] py-[0.8rem]'
                >
                  Đặt đơn
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}
