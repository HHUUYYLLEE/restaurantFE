import { useParams, useNavigate, Link } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUserOrders, placeAnOrder } from '../../api/order_food.api'
import { getOrder } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import { BsCart4 } from 'react-icons/bs'
import { FaRegTimesCircle } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { useState, useEffect } from 'react'
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

export default function OrderDetail() {
  const phone_number = getInfoFromLS().phone_number
  const username = getInfoFromLS().username
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState({})
  const [searchQuery2, setSearchQuery2] = useState({})
  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [latLng, setLatLng] = useState(undefined)
  const [lockMarker, setLockMarker] = useState(false)
  const [firstUpdate, setFirstUpdate] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [markerPos, setMarkerPos] = useState([0, 0])
  const [addressValue, setAddressValue] = useState('')

  const { handleSubmit } = useForm({
    mode: 'all'
  })

  const placeAnOrderMutation = useMutation({
    mutationFn: (body) => placeAnOrder(body)
  })
  const { status, data, isLoading, refetch } = useQuery({
    queryKey: ['search_location', searchQuery],
    queryFn: () => {
      return getSearchLocation(searchQuery)
    },
    enabled: false
  })
  const {
    status: status2,
    data: data2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    refetch: refetch2
  } = useQuery({
    queryKey: ['search_lat_lng', searchQuery2],
    queryFn: () => {
      return getSearchLocation(searchQuery2)
    },
    enabled: false
  })
  function HandleSuccess({ isSuccess2, data }) {
    useEffect(() => {
      if (isSuccess2) {
        setAddressValue(data2.data.results[0].formatted)
        setLatLngValueInput([data2.data.results[0].geometry.lat, data2.data.results[0].geometry.lng])
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

  useEffect(() => {
    if (!firstUpdate) refetch()
  }, [searchQuery, refetch, firstUpdate])
  useEffect(() => {
    if (!firstUpdate) refetch2()
  }, [searchQuery2, refetch2, firstUpdate])
  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        if (firstRender) {
          setFirstUpdate(false)
          setFirstRender(false)
        }
        setLockMarker(false)
        setMarkerPos([e.latlng.lat, e.latlng.lng])
        setSearchQuery2({ q: e.latlng.lat + ',' + e.latlng.lng, key: envConfig.opencageKey })
      }
    })
    return null
  }
  function ResetCenterView() {
    const map = useMap()
    useEffect(() => {
      if (latLng && lockMarker) {
        // console.log('active')
        map.setView(latLng, map.getZoom() + 15, {
          animate: true
        })
        setMarkerPos(latLng)
      }
    }, [map])

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
        toast.success('Đã đặt hàng thành công!') //。(20)
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
        <div className='w-full bg-white p-[2.5rem]'>
          <div className='flex justify-between'>
            <div className='flex gap-x-1 items-center mt-[1rem] font-inter-400'>
              <MdOutlinePinDrop style={{ width: '1.6vw', height: '1.6vw', color: 'red' }} />
              <div className='text-2xl text-red-700'>Địa chỉ nhận</div>
            </div>
            <div className='flex items-center font-bold text-2xl gap-x-[1rem]'>
              <div>{username}</div>
              <div>{phone_number}</div>
            </div>
          </div>
          <div className='text-2xl italic h-[2rem]'>{addressValue}</div>
          <div className='relative w-full'>
            <div className='absolute top-1 left-[50%] translate-x-[-50%] text-center z-10'>
              <input
                type='text'
                id='search'
                name='search'
                placeholder='Tìm kiếm hoặc click vào 1 vị trí trong bản đồ'
                autoComplete='off'
                onInput={(e) => {
                  setLockMarker(true)
                  if (firstRender) {
                    setFirstUpdate(false)
                    setFirstRender(false)
                  }
                  setEnableSearchResults(true)
                  setSearchQuery({ q: e.target.value, key: envConfig.opencageKey })
                }}
                className='focus:outline-[#8AC0FF] w-[35vw] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl px-[0.5rem] py-[0.2rem]'
              />
              {data &&
                enableSearchResults &&
                data.data?.results.map((data, key) => {
                  return (
                    <div key={key}>
                      <div
                        className='w-[35vw] cursor-pointer hover:bg-slate-200 bg-white'
                        onClick={() => {
                          setLatLng([data.geometry.lat, data.geometry.lng])
                          setEnableSearchResults(false)
                          setAddressValue(data.formatted)
                          setLatLngValueInput([data.geometry.lat, data.geometry.lng])
                        }}
                      >
                        {data.formatted}
                      </div>
                      <hr></hr>
                    </div>
                  )
                })}
            </div>
            <MapContainer center={[21.028511, 105.804817]} zoom={13} style={{ width: '100%', height: '85vh' }}>
              <ResetCenterView></ResetCenterView>
              <MyComponent></MyComponent>
              <Marker position={markerPos}></Marker>
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
        <div className='w-full mt-[5rem]'>
          <div className='bg-white mb-[2rem]'>
            <div className='py-[1.2rem] px-[1.2rem]'>
              <div className='flex justify-between'>
                <Link to={`/restaurant/${restaurantData?._id}`}>
                  <div className='flex gap-x-[1.2rem]'>
                    <CiShop style={{ width: '2vw', height: '2vw' }} />
                    <div className='text-2xl'>{restaurantData?.name}</div>
                  </div>
                </Link>
              </div>
              <hr className='h-[0.1rem] mt-[0.4rem] border-none bg-gray-400' />
              {order_detail &&
                orderFoodList.map((data) => {
                  return <Food key={data._id} food_id={data.food_id} quantity={data.quantity} />
                })}
              <hr className='h-[0.2rem] mt-[0.4rem] z-10 border-none bg-gray-400' />
              <div>
                <div className='text-right mt-[1rem] flex items-center gap-x-[3rem]'>
                  <div className='mr-0 ml-auto text-3xl text-emerald-600'>
                    {displayNum(orderFood?.total_price) + 'đ'}
                  </div>
                  {orderFood.status === 0 ? (
                    <form onSubmit={onSubmit}>
                      <button
                        disabled={addressValue === '' ? true : false}
                        className=' px-[2rem] py-[1rem] text-3xl disabled:bg-gray-200 disabled:text-black disabled:text-opacity-50 bg-orange-600 hover:enabled:bg-orange-900 text-white rounded-xl'
                      >
                        Xác nhận
                      </button>
                    </form>
                  ) : (
                    <button
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
      </>
    )
  }
}
