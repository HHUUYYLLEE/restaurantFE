import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'lrm-graphhopper'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiShop } from 'react-icons/ci'
import { FaPhoneAlt } from 'react-icons/fa'
import { MdOutlinePinDrop } from 'react-icons/md'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { getOrder, placeAnOrder } from '../../api/order_food.api'
import { getRestaurant } from '../../api/restaurants.api'
import diningIcon from '../../asset/img/dining.png'
import humanIcon from '../../asset/img/human.png'
import { AppContext } from '../../contexts/app.context'
import { getInfoFromLS } from '../../utils/auth'
import { envConfig } from '../../utils/env'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import Food from './Food/Food'
export default function OrderDetail() {
  const { leafletMap } = useContext(AppContext)
  const phone_number = getInfoFromLS().phone_number
  const username = getInfoFromLS().username
  const { id } = useParams()
  const navigate = useNavigate()

  const [enableSearchResults, setEnableSearchResults] = useState(false)

  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [addressValue, setAddressValue] = useState('')
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchQuery2, setSearchQuery2] = useState(null)
  const [searchParams] = useDebounce([searchQuery], 1000)
  const [searchParams2] = useDebounce([searchQuery2], 1000)
  const [enableSearchLatLng, setEnableSearchLatLng] = useState(false)
  const [routingRedraw, setRoutingRedraw] = useState(false)
  const { mapDraw, setMapDraw } = useContext(AppContext)
  const { data: order_detail, isSuccess } = useQuery({
    queryKey: ['order_list', id],
    queryFn: () => {
      return getOrder(id)
    },
    placeholderData: keepPreviousData
  })
  const orderFood = order_detail?.data.orderFood
  const restaurant_id = orderFood?.restaurant_id
  const orderFoodList = order_detail?.data.orderFoodList
  const { data: restaurant_data, isSuccess: restaurantSuccess } = useQuery({
    queryKey: ['restaurantOrderDetail', restaurant_id],
    queryFn: () => {
      return getRestaurant(restaurant_id)
    },
    placeholderData: keepPreviousData,
    enabled: !!restaurant_id
  })
  const restaurantData = restaurant_data?.data.restaurant
  const { handleSubmit } = useForm({
    mode: 'all'
  })

  const placeAnOrderMutation = useMutation({
    mutationFn: (body) => placeAnOrder(body)
  })
  const { data } = useQuery({
    queryKey: ['search_location', searchParams],
    queryFn: () => {
      return getSearchLocation(searchParams)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchResults
  })
  const { data: data2, isSuccess: isSuccess2 } = useQuery({
    queryKey: ['search_lat_lng', searchParams2],
    queryFn: () => {
      return getSearchLocation(searchParams2)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchLatLng
  })
  function HandleSuccess({ isSuccess2, data2 }) {
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
  HandleSuccess({ isSuccess2, data2 })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      const newRoutingMap = L.Routing.control({
        waypoints: [
          L.latLng(e.coords.latitude, e.coords.longitude),
          L.latLng(restaurantData?.lat, restaurantData?.lng)
        ],
        router: L.Routing.graphHopper(envConfig.graphhopperKey),
        createMarker: (i, wp) => {
          if (i === 0)
            return L.marker(wp.latLng, {
              icon: new L.Icon({
                iconUrl: humanIcon,
                iconSize: [60, 80]
              })
            })
          else
            return L.marker(wp.latLng, {
              icon: new L.Icon({
                iconUrl: diningIcon,
                iconSize: [41, 41]
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
      setRoutingRedraw(true)
      setMapDraw(newRoutingMap)
      setLatLngValueInput([e.coords.latitude, e.coords.longitude])
      setSearchQuery2({
        q: e.coords.latitude + ',' + e.coords.longitude,
        key: envConfig.opencageKey
      })
      setEnableSearchLatLng(true)
    })
  }, [leafletMap, restaurantData?.lat, restaurantData?.lng, setMapDraw])

  function MyComponent() {
    useMapEvents({
      click: (e) => {
        setEnableSearchLatLng(true)
        setLatLngValueInput([e.latlng.lat, e.latlng.lng])
        setSearchQuery2({ q: e.latlng.lat + ',' + e.latlng.lng, key: envConfig.opencageKey })
        if (!routingRedraw) {
          const newRoutingMap = L.Routing.control({
            waypoints: [
              L.latLng(e.latlng.lat, e.latlng.lng),
              L.latLng(restaurantData.lat, restaurantData.lng)
            ],
            createMarker: (i, wp) => {
              if (i === 0)
                return L.marker(wp.latLng, {
                  icon: new L.Icon({
                    iconUrl: humanIcon,
                    iconSize: [60, 80]
                  })
                })
              else
                return L.marker(wp.latLng, {
                  icon: new L.Icon({
                    iconUrl: diningIcon,
                    iconSize: [41, 41]
                  })
                })
            },
            router: L.Routing.graphHopper(envConfig.graphhopperKey),
            fitSelectedRoutes: true
          })
          newRoutingMap.on('routeselected', (e) => {
            console.log(e)
          })
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
            createMarker: (i, wp) => {
              if (i === 0)
                return L.marker(wp.latLng, {
                  icon: new L.Icon({
                    iconUrl: humanIcon,
                    iconSize: [60, 80]
                  })
                })
              else
                return L.marker(wp.latLng, {
                  icon: new L.Icon({
                    iconUrl: diningIcon,
                    iconSize: [41, 41]
                  })
                })
            },
            router: L.Routing.graphHopper(envConfig.graphhopperKey),
            fitSelectedRoutes: true
          })
          newRoutingMap.addTo(leafletMap)
          setMapDraw(newRoutingMap)
        }
      }
    })
    return null
  }

  function ResetCenterView() {
    const map = useMap()
    const { setLeafletMap } = useContext(AppContext)

    useEffect(() => {
      setLeafletMap(map)
    }, [map, setLeafletMap])

    return null
  }

  const onSubmit = handleSubmit((data) => {
    data.order_food_id = orderFood?._id
    data.address = addressValue
    data.lat = latLngValueInput[0]
    data.lng = latLngValueInput[1]
    data.memo = ''
    console.log(data)
    placeAnOrderMutation.mutate(data, {
      onSuccess: () => {
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
                  <div className='flex gap-x-2'>
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
                  border font-inter-500 border-[#ff822e] sm:text-lg rounded-xl 
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
                              setEnableSearchResults(false)
                              setAddressValue(data.formatted)
                              setLatLngValueInput([data.geometry.lat, data.geometry.lng])
                              if (!routingRedraw) {
                                const newRoutingMap = L.Routing.control({
                                  waypoints: [
                                    L.latLng(data.geometry.lat, data.geometry.lng),
                                    L.latLng(restaurantData.lat, restaurantData.lng)
                                  ],
                                  createMarker: (i, wp) => {
                                    if (i === 0)
                                      return L.marker(wp.latLng, {
                                        icon: new L.Icon({
                                          iconUrl: humanIcon,
                                          iconSize: [60, 80]
                                        })
                                      })
                                    else
                                      return L.marker(wp.latLng, {
                                        icon: new L.Icon({
                                          iconUrl: diningIcon,
                                          iconSize: [41, 41]
                                        })
                                      })
                                  },
                                  router: L.Routing.graphHopper(envConfig.graphhopperKey),
                                  fitSelectedRoutes: true
                                })

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
                                  createMarker: (i, wp) => {
                                    if (i === 0)
                                      return L.marker(wp.latLng, {
                                        icon: new L.Icon({
                                          iconUrl: humanIcon,
                                          iconSize: [60, 80]
                                        })
                                      })
                                    else
                                      return L.marker(wp.latLng, {
                                        icon: new L.Icon({
                                          iconUrl: diningIcon,
                                          iconSize: [41, 41]
                                        })
                                      })
                                  },
                                  router: L.Routing.graphHopper(envConfig.graphhopperKey),
                                  fitSelectedRoutes: true
                                })
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
                center={[restaurantData.lat, restaurantData.lng]}
                zoom={13}
                style={{
                  height: screen.width <= 640 ? '30vh' : 'full',
                  width: screen.width >= 1536 ? '80vw' : screen.width >= 640 ? '80vw' : '78vw'
                }}
                zoomSnap='0.1'
              >
                <ResetCenterView></ResetCenterView>
                <MyComponent></MyComponent>

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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}
