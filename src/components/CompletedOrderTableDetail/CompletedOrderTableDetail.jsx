import { useParams, useNavigate, Link } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrder, cancelOrder } from '../../api/order_food.api'
import 'react-responsive-carousel/lib/styles/carousel.css'
import 'leaflet/dist/leaflet.css'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { MdOutlinePinDrop } from 'react-icons/md'
import { getInfoFromLS } from '../../utils/auth'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import { envConfig } from '../../utils/env'
import { CiShop } from 'react-icons/ci'
import { getRestaurant } from '../../api/restaurants.api'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import L from 'leaflet'
import { useDebounce } from '@uidotdev/usehooks'
import { AppContext } from '../../contexts/app.context'
import { FaPhoneAlt } from 'react-icons/fa'
import Modal from 'react-modal'
import diningIcon from '../../asset/img/dining.png'
import humanIcon from '../../asset/img/human.png'
import { Oval } from 'react-loader-spinner'

export default function CompletedOrderTableDetail() {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const { leafletMap } = useContext(AppContext)
  const phone_number = getInfoFromLS().phone_number
  const username = getInfoFromLS().username
  const { id } = useParams()
  const navigate = useNavigate()
  const [cancelOrderModal, setCancelOrderModal] = useState(false)
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

  const cancelAnOrder = useMutation({
    mutationFn: (body) => cancelOrder(body)
  })

  function drawRoute() {
    const newRoutingMap = L.Routing.control({
      waypoints: [
        L.latLng(orderFood.lat, orderFood.lng),
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
    newRoutingMap.on('routingerror', (e) => {})
    newRoutingMap.addTo(leafletMap)
  }

  function ResetCenterView() {
    const map = useMap()
    const { setLeafletMap } = useContext(AppContext)

    useEffect(() => {
      setLeafletMap(map)
      navigator.geolocation.getCurrentPosition(drawRoute, drawRoute)
    }, [map, setLeafletMap])

    return null
  }

  const submitCancelAnOrder = () => {
    var data = {}
    data.order_food_id = id
    cancelAnOrder.mutate(data, {
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
  }

  if (isSuccess && restaurantSuccess) {
    return (
      <>
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
            {orderFood.address}
          </div>
          <div className='relative w-full'>
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
                  {orderFood.status === 1 ? (
                    <button
                      className='sm:px-[2rem] sm:py-[1rem] sm:text-3xl 
                       bg-red-600 hover:bg-red-800
                        hover:enabled:bg-orange-900 text-[0.9rem] text-white rounded-xl
                        px-[0.5rem] py-[0.5rem]'
                      onClick={() => setCancelOrderModal(true)}
                    >
                      Huỷ
                    </button>
                  ) : orderFood.status === 2 ? (
                    <button
                      disabled
                      className=' px-[2rem] py-[1rem] text-3xl 
                        bg-gray-200 text-black text-opacity-50 rounded-xl'
                    >
                      Đã huỷ
                    </button>
                  ) : (
                    <button
                      disabled
                      className=' px-[2rem] py-[1rem] text-3xl 
                    bg-gray-200 text-black text-opacity-50 rounded-xl'
                    >
                      Đã hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 20
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              paddingLeft: '3vw',
              paddingRight: '3vw',
              paddingTop: '2vw',
              paddingBottom: '4vw',
              borderWidth: '0px',
              borderRadius: '1rem'
            }
          }}
          isOpen={cancelOrderModal}
          onRequestClose={() => setCancelOrderModal(false)}
        >
          <div className='font-inter-700 sm:text-2xl'>Huỷ đơn hàng?</div>
          <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12'>
            <button
              onClick={() => {
                submitCancelAnOrder()
                setCancelOrderModal(false)
              }}
              className='flex justify-center items-center 
            bg-orange-700 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
            >
              Xác nhận
            </button>
            <button
              onClick={() => setCancelOrderModal(false)}
              className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
            >
              Không
            </button>
          </div>
        </Modal>
        <Modal
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 27
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              transform: 'translate(-50%, -50%)',
              paddingLeft: '3vw',
              paddingRight: '3vw',
              paddingTop: '2vw',
              paddingBottom: '4vw',
              borderWidth: '0px',
              borderRadius: '1rem'
            }
          }}
          isOpen={cancelAnOrder.isPending}
        >
          <Oval
            height='150'
            width='150'
            color='rgb(249,115,22)'
            secondaryColor='rgba(249,115,22,0.5)'
            ariaLabel='tail-spin-loading'
            radius='5'
            visible={true}
            wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
          />
        </Modal>
      </>
    )
  }
}
