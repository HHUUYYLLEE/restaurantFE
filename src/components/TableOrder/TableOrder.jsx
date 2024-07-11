import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'lrm-graphhopper'
import { useContext, useEffect, useState } from 'react'
import Checkbox from 'react-custom-checkbox'
import { FaCalendarAlt, FaChair, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa'
import { MdOutlineTableRestaurant } from 'react-icons/md'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useNavigate, useParams } from 'react-router-dom'
import { placeAnOrderTable } from '../../api/order_table.api'
import { getRestaurant } from '../../api/restaurants.api'
import diningIcon from '../../asset/img/dining.png'
import humanIcon from '../../asset/img/human.png'
import tableChairIcon from '../../asset/img/table_chair.png'
import { AppContext } from '../../contexts/app.context'
import { envConfig } from '../../utils/env'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ImCross } from 'react-icons/im'

export default function TableOrder() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { leafletMap } = useContext(AppContext)
  const [inputDate, setInputDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  )
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const [orderTableModal, setOrderTableModal] = useState(false)
  const [selectTable, setSelectTable] = useState([])
  const [querySuccess, setQuerySuccess] = useState(false)
  const { data, isSuccess } = useQuery({
    queryKey: ['restaurantDetail', id],
    queryFn: async () => {
      const data = await getRestaurant(id)

      // window.scrollTo(0, 0)
      return data
    },
    placeholderData: keepPreviousData
  })
  useEffect(() => {
    setSelectTable(
      data?.data.restaurant.table_chair.map((temp) => {
        temp = { ...temp, checked: false }
        return temp
      })
    )
    if (isSuccess) setQuerySuccess(true)
  }, [data?.data.restaurant.table_chair, isSuccess])
  const restaurantData = data?.data.restaurant
  function Routing() {
    const map = useMap()
    const { setLeafletMap } = useContext(AppContext)
    useEffect(() => {
      setLeafletMap(map)
    }, [map, setLeafletMap])

    return null
  }
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
  const orderTableMutation = useMutation({
    mutationFn: (body) => placeAnOrderTable(body)
  })

  const submitOrderTable = () => {
    data.restaurant_id = id
    data.date = inputDate
    data.table_chair = []
    for (var table of selectTable) {
      delete table._id
      if (table.checked) data.table_chair.push(table)
    }
    // console.log(selectTable)
    orderTableMutation.mutate(data, {
      onSuccess: () => {
        navigate('/table_order')
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

  return (
    <>
      {querySuccess && (
        <div className=''>
          <div className='flex bg-white gap-x-[2vw] sm:gap-x-0'>
            {screen.width > 640 && (
              <div className='flex w-[15vw] bg-orange-500 sm:w-[10vw] justify-center items-center gap-x-3'>
                <div>
                  <MdOutlineTableRestaurant
                    style={{
                      color: 'white',
                      width: '2vw',
                      height: '2vw'
                    }}
                  />
                </div>
                <div className='text-white 2xl:text-[1.2rem]'>Đặt chỗ</div>
                <div>
                  <FaChair
                    style={{
                      color: 'white',
                      width: '1.5vw',
                      height: '1.5vw'
                    }}
                  />
                </div>
              </div>
            )}
            <div className='flex gap-x-3'>
              <div className='sm:max-w-[30vw] max-w-[30vw] max-h-[15vh] sm:max-h-[20vh]'>
                <img
                  referrerPolicy='no-referrer'
                  className='sm:w-[20vw] w-[30vw] h-[15vh] sm:h-[20vh]'
                  src={restaurantData.main_avatar_url}
                />
              </div>
              <div
                className='text-[0.6rem] sm:text-base max-w-[58vw] sm:max-w-[55vw] 
               my-[1vh] sm:my-[3vh] grid gap-y-2 mr-[0.4rem]'
              >
                <div className='text-green-500 line-clamp-3 sm:line-clamp-2 text-ellipsis'>
                  {restaurantData.name}
                </div>
                <div className='flex'>
                  <div>
                    <FaMapMarkerAlt style={{ color: 'red' }} />
                  </div>
                  <div className='line-clamp-3 sm:line-clamp-2 text-ellipsis'>
                    {restaurantData.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-[3rem] flex justify-center'>
            <MapContainer
              zoomSnap='0.1'
              center={[restaurantData.lat, restaurantData.lng]}
              zoom={17}
              style={{
                height: screen.width < 640 ? '30vh' : '80vh',
                width: '90vw'
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
          <div className='mt-[1.2rem] sm:mt-[1.5rem] bg-white'>
            <div className='flex mx-[1rem] sm:mx-[1.3rem] items-center gap-x-2'>
              <div className='max-w-[10vw] max-h-[10vw] sm:max-w-[3vw] sm:max-h-[3vw]'>
                <img className='w-[10vw] h-[10vw] sm:w-[3vw] sm:h-[3vw]' src={tableChairIcon} />
              </div>
              <div className='text-orange-500 sm:text-[1.2rem]'>Lựa chọn loại bàn đặt</div>
            </div>
            <hr className='h-[0.1rem] border-none bg-gray-400' />

            {restaurantData.table_chair.length > 0 ? (
              <div className='mx-[0.4rem] sm:mx-[1.3rem] grid grid-cols-3 sm:gap-x-4 sm:grid-cols-5'>
                {restaurantData.table_chair.map((data, id) => {
                  return (
                    <div
                      key={id}
                      className={`sm:flex sm:items-center sm:gap-x-10 rounded-md border-[0.2rem] sm:border-[0.3rem] 
                    ${selectTable[id].checked ? ' border-orange-500 ' : ' border-slate-200 '}`}
                    >
                      <div className='mx-[0.2rem]'>
                        <div className='flex items-center gap-x-2'>
                          <MdOutlineTableRestaurant
                            style={{
                              color: selectTable[id].checked ? 'orange' : 'black',
                              width: screen.width < 640 ? '10vw' : '4vw',
                              height: screen.width < 640 ? '10vw' : '4vw'
                            }}
                          />
                          <div className={``}>{data.chair + ' chỗ'}</div>
                        </div>
                        <div className='flex gap-x-2 sm:mb-[0.2rem]'>
                          <input
                            type='number'
                            className={`priceInput w-[7vw]  border-orange-500 rounded-md flex text-right sm:px-[1rem] px-[0.2rem]
                          ${
                            selectTable[id].checked
                              ? ' border border-orange-500 '
                              : ' border-[0.1rem] border-slate-200 '
                          }`}
                            defaultValue={selectTable[id].table}
                            onInput={(e) => {
                              if (parseInt(e.target.value) <= 0) {
                                e.target.value = 1
                              }
                              setSelectTable(
                                selectTable.map((tempdata, index) => {
                                  if (index === id) tempdata.table = e.target.value
                                  return tempdata
                                })
                              )
                            }}
                          />
                          <div>bàn</div>
                          {screen.width < 640 && (
                            <Checkbox
                              icon={
                                <FaCheckCircle
                                  color='#F97316'
                                  style={{
                                    width: 20,
                                    height: 20
                                  }}
                                />
                              }
                              name='my-input'
                              checked={selectTable[id].checked}
                              borderColor='#F97316'
                              onChange={(value) => {
                                setSelectTable(
                                  selectTable.map((tempdata, index) => {
                                    if (index === id) tempdata.checked = value
                                    return tempdata
                                  })
                                )
                              }}
                              borderRadius={9999}
                              size={20}
                            />
                          )}
                        </div>
                      </div>
                      {screen.width > 640 && (
                        <Checkbox
                          icon={
                            <FaCheckCircle
                              color='#F97316'
                              style={{
                                width: 30,
                                height: 30
                              }}
                            />
                          }
                          name='my-input'
                          checked={data.checked}
                          borderColor='#F97316'
                          onChange={(value) => {
                            setSelectTable(
                              selectTable.map((tempdata, index) => {
                                if (index === id) tempdata.checked = value
                                return tempdata
                              })
                            )
                          }}
                          borderRadius={9999}
                          size={30}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className='mx-[0.4rem] sm:mx-[1.3rem] py-[0.2rem] flex sm:py-[1rem] items-center gap-x-1'>
                <ImCross style={{ color: 'red' }} />
                <div className='text-sm italic'>
                  Rất tiếc, nhà hàng này chưa có thông tin bàn ghế.
                </div>
              </div>
            )}
          </div>
          <div className='mt-[1.2rem] sm:mt-[1.5rem] bg-white'>
            <div className='flex mx-[1rem] py-[0.4rem] sm:mx-[1.3rem] items-center gap-x-2'>
              <FaCalendarAlt
                style={{
                  color: 'orange',
                  width: screen.width < 640 ? '6vw' : '2vw',
                  height: screen.width < 640 ? '6vw' : '2vw'
                }}
              />
              <div className='text-orange-500 sm:text-[1.2rem]'>Thời điểm</div>
            </div>
            <hr className='h-[0.1rem] border-none bg-gray-400' />
            <div className='px-[1rem] py-[1rem] flex'>
              <input
                type='datetime-local'
                id='datetimelocal'
                defaultValue={inputDate}
                className='border border-orange-500 rounded-md'
                onInput={(e) => {
                  setInputDate(e.target.value)
                }}
              />
            </div>
          </div>
          <div className=''>
            <button
              className={`my-[3rem]  py-[1.2rem] px-[1rem] font-ibm-plex-serif-700 rounded-lg
            ${
              restaurantData.table_chair.length === 0
                ? ' hover:bg-red-700 bg-red-500 text-white '
                : selectTable.findIndex((element) => element.checked) === -1
                ? ' bg-gray-200 text-black text-opacity-50 '
                : ' hover:bg-orange-500 bg-green-500 text-white '
            }`}
              onClick={() => {
                setOrderTableModal(true)
              }}
              disabled={
                restaurantData.table_chair.length === 0
                  ? false
                  : selectTable.findIndex((element) => element.checked) === -1
              }
            >
              {restaurantData.table_chair.length === 0 ? 'Quay lại' : 'Xác nhận'}
            </button>
          </div>
        </div>
      )}
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
        isOpen={orderTableModal}
        onRequestClose={() => setOrderTableModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Xác nhận đặt chỗ?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitOrderTable()
              setOrderTableModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setOrderTableModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Huỷ
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
        isOpen={orderTableMutation.isPending}
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
