import { createARestaurant } from '../../api/restaurants.api'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfoFromLS } from '../../utils/auth'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { FaPlusCircle } from 'react-icons/fa'
import { schemaRestaurantProfile } from '../../utils/rules'
import { FiMinusCircle } from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import Modal from 'react-modal'
import 'leaflet/dist/leaflet.css'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import { useDebounce } from '@uidotdev/usehooks'

import { Icon } from 'leaflet'
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet'
import { createSearchParams, useAsyncError } from 'react-router-dom'
import { envConfig } from '../../utils/env'
import { convertTime } from '../../utils/utils'
export default function OpenRestaurant() {
  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [latLng, setLatLng] = useState(null)

  const [addressValue, setAddressValue] = useState(1)
  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [tableChair, setTableChair] = useState([{ chair: 0, table: 0 }])
  const [enableSearchLatLng, setEnableSearchLatLng] = useState(false)
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchQuery2, setSearchQuery2] = useState(null)
  const [searchParams] = useDebounce([searchQuery], 1000)
  const [searchParams2] = useDebounce([searchQuery2], 1000)
  const { status, data, isLoading } = useQuery({
    queryKey: ['search_location', searchParams],
    queryFn: () => {
      return getSearchLocation(searchParams)
    },
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

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaRestaurantProfile)
  })
  const [markerPos, setMarkerPos] = useState([0, 0])
  const createARestaurantMutation = useMutation({
    mutationFn: (body) => createARestaurant(body)
  })
  useEffect(() => {
    Modal.setAppElement('body')
  })
  const previewImageElements = [useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    setValue('address', addressValue)
    setValue('lat', latLngValueInput[0])
    setValue('lng', latLngValueInput[1])
  }, [addressValue, setValue, latLngValueInput])
  const onSubmit = handleSubmit((data) => {
    console.log(data)
    if (data.address === '' || data.lat === '' || data.lng === '') {
      // toast.error('Hãy nhập địa chỉ')
      return
    }
    data.morning_open_time =
      convertTime(data.morning_hour_open) + ':' + convertTime(data.morning_minute_open)
    data.morning_closed_time =
      convertTime(data.morning_hour_close) + ':' + convertTime(data.morning_minute_close)
    data.afternoon_open_time =
      convertTime(data.afternoon_hour_open) + ':' + convertTime(data.afternoon_minute_open)
    data.afternoon_closed_time =
      convertTime(data.afternoon_hour_close) + ':' + convertTime(data.afternoon_minute_close)
    data.image = data.images[0]
    data.image2 = data.images[1]
    data.image3 = data.images[2]
    data.image4 = data.images[3]
    data.image5 = data.images[4]
    delete data.images
    delete data.morning_hour_open
    delete data.morning_hour_close
    delete data.morning_minute_open
    delete data.morning_minute_close
    delete data.afternoon_hour_open
    delete data.afternoon_hour_close
    delete data.afternoon_minute_open
    delete data.afternoon_minute_close
    data.status = 1
    const newTableChair = tableChair.filter((obj) => obj.chair !== 0 && obj.table !== 0)
    let table_chair = []
    let deleteIndex = []
    while (newTableChair.length !== 0) {
      let table = 0
      if (newTableChair.length === 0) break
      deleteIndex.push(0)
      for (var j = 0; j < newTableChair.length; ++j) {
        if (newTableChair[0].chair === newTableChair[j].chair) {
          if (j === 0) table = newTableChair[j].table
          else {
            table += newTableChair[j].table
            deleteIndex.push(j)
          }
        }
      }
      table_chair.push({ chair: newTableChair[0].chair, table: table })
      for (var int = deleteIndex.length - 1; int >= 0; --int)
        newTableChair.splice(deleteIndex[int], 1)
      deleteIndex = []
    }

    data.table_chair = table_chair
    console.log(data)

    createARestaurantMutation.mutate(data, {
      onSuccess: () => {
        // toast.success('Mỏ nhà hàng thành công !') //。(20)
        window.location.reload()
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
          // if (formError) {
          //   setError('username', {
          //     message: formError.username?.msg,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })
  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        setMarkerPos([e.latlng.lat, e.latlng.lng])
        setLatLngValueInput([e.latlng.lat, e.latlng.lng])
        setEnableSearchLatLng(true)
        setSearchQuery2({ q: e.latlng.lat + ',' + e.latlng.lng, key: envConfig.opencageKey })
      }
    })
    return null
  }

  function ResetCenterView({ latLng }) {
    const map = useMap()
    useEffect(() => {
      if (latLng) {
        map.flyTo(latLng, map.getZoom())
      }
    }, [map, latLng])

    return null
  }
  return (
    <>
      {createARestaurantMutation.isPending ? (
        <>
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
            isOpen={true}
          >
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang cập nhật</div>
            <TailSpin
              height='200'
              width='200'
              color='#4fa94d'
              ariaLabel='tail-spin-loading'
              radius='5'
              visible={true}
              wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
            />
          </Modal>
        </>
      ) : (
        <></>
      )}
      <form onSubmit={onSubmit}>
        <div className='mt-36 mx-auto sm:grid sm:grid-cols-15 w-[90vw] gap-x-4'>
          <div className='sm:col-span-9'>
            <div className='flex items-center gap-x-4'>
              <div className='sm:text-xl sm:w-[10vw] text-xs w-[16vw] text-orange-500'>
                Tên nhà hàng
              </div>
              <div className='w-full'>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Tên nhà hàng'
                  autoComplete='off'
                  {...register('name')}
                  className='w-full focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] 
                text-lg rounded-xl sm:py-2 sm:px-[2rem] px-[1rem] py-[0.3rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.name?.message}
                </div>
              </div>
            </div>
            <div className='mt-[1rem] flex items-center gap-x-4'>
              <div className='sm:text-xl text-xs sm:w-[10vw] text-orange-500 w-[16vw]'>Mô tả</div>
              <div className='w-full '>
                <textarea
                  type='text'
                  id='desc'
                  name='desc'
                  placeholder='Mô tả'
                  autoComplete='off'
                  {...register('desc')}
                  className=' h-[18vh]  w-full focus:outline-[#8AC0FF] 
                placeholder:text-[#6666667e] placeholder:font-inter-400 border 
                font-inter-500 border-[#E6E6E6] text-lg rounded-xl sm:py-[0.7rem] sm:px-[2rem]
                py-[0.3rem] px-[1rem]'
                />
                <div className='mt-1 min-h-[1.75rem] text-lg text-red-600'>
                  {errors.desc?.message}
                </div>
              </div>
            </div>
            <div className=' flex items-center'>
              <div className='sm:text-xl text-xs sm:w-[10vw] w-[16vw] text-orange-500'>
                Khung giờ mở cửa
              </div>
              <div className=''>
                <div className='flex items-center'>
                  <div className='sm:text-lg italic ml-[1.25rem] sm:w-[3.3vw] w-[8vw] text-yellow-500 '>
                    Sáng
                  </div>
                  <input
                    type='number'
                    id='morning_hour_open'
                    name='morning_hour_open'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('morning_hour_open')}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '12'

                      if (parseInt(e.target.value) > 12) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[1rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg sm:ml-[0.5rem] ml-[0.2rem]'>:</div>
                  <input
                    type='number'
                    id='morning_minute_open'
                    name='morning_minute_open'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('morning_minute_open')}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '59'

                      if (parseInt(e.target.value) > 59) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                      if (e.target.value.length > 2) {
                        if (parseInt(e.target.value) < 10)
                          e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg italic ml-[0.5rem]'>&#8212;</div>
                  <input
                    type='number'
                    id='morning_hour_close'
                    name='morning_hour_close'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('morning_hour_close')}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '12'

                      if (parseInt(e.target.value) > 12) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg sm:ml-[0.5rem] ml-[0.2rem]'>:</div>
                  <input
                    type='number'
                    id='morning_minute_close'
                    name='morning_minute_close'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('morning_minute_close')}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '59'

                      if (parseInt(e.target.value) > 59) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                      if (e.target.value.length > 2) {
                        if (parseInt(e.target.value) < 10)
                          e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                </div>

                <div className='flex items-center'>
                  <div className='sm:text-lg italic ml-[1.25rem] sm:w-[3.3vw] text-orange-600 w-[8vw]'>
                    Chiều
                  </div>
                  <input
                    type='number'
                    id='afternoon_hour_open'
                    name='afternoon_hour_open'
                    defaultValue='12'
                    autoComplete='off'
                    {...register('afternoon_hour_open')}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 12) e.target.value = '23'

                      if (parseInt(e.target.value) > 23) e.target.value = '12'
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[1rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg sm:ml-[0.5rem] ml-[0.2rem]'>:</div>
                  <input
                    type='number'
                    id='afternoon_minute_open'
                    name='afternoon_minute_open'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('afternoon_minute_open')}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '59'

                      if (parseInt(e.target.value) > 59) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                      if (e.target.value.length > 2) {
                        if (parseInt(e.target.value) < 10)
                          e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg italic ml-[0.5rem]'>&#8212;</div>
                  <input
                    type='number'
                    id='afternoon_hour_close'
                    name='afternoon_hour_close'
                    defaultValue='12'
                    autoComplete='off'
                    {...register('afternoon_hour_close')}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 12) e.target.value = '23'

                      if (parseInt(e.target.value) > 23) e.target.value = '12'
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                  <div className='text-lg sm:ml-[0.5rem] ml-[0.2rem]'>:</div>
                  <input
                    type='number'
                    id='afternoon_minute_close'
                    name='afternoon_minute_close'
                    defaultValue='00'
                    autoComplete='off'
                    {...register('afternoon_minute_close')}
                    onInput={(e) => {
                      if (parseInt(e.target.value) < 0) e.target.value = '59'

                      if (parseInt(e.target.value) > 59) e.target.value = '00'

                      if (e.target.value.length === 1) e.target.value = '0' + e.target.value
                      if (e.target.value.length > 2) {
                        if (parseInt(e.target.value) < 10)
                          e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='2xl:w-[4vw] sm:w-[4.7vw] w-[12vw] sm:ml-[0.5rem] ml-[0.2rem]
                    focus:outline-[#8AC0FF] placeholder:text-[#6666667e] 
                    placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg 
                    rounded-xl sm:py-2 sm:pl-[0.7rem] pl-[0.4rem] pr-[0.4rem]'
                  />
                </div>
              </div>
            </div>
            <div className='ml-[16vw] sm:ml-[9vw] 2xl:ml-[9.5vw] min-h-[1.75rem] text-lg text-red-600'>
              {errors.morning_hour_close?.message ||
                errors.morning_minute_close?.message ||
                errors.afternoon_hour_close?.message ||
                errors.afternoon_minute_close?.message}
            </div>
            <div className='mt-[3rem] flex items-center'>
              <div className='sm:text-xl text-xs sm:w-[10vw] w-[16vw] text-orange-500'>Địa chỉ</div>
              <div className='relative'>
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
                      placeholder='Tìm kiếm hoặc click vào 1 vị trí'
                      autoComplete='off'
                      onInput={(e) => {
                        setEnableSearchResults(true)
                        setSearchQuery({ q: e.target.value, key: envConfig.opencageKey })
                      }}
                      className='focus:outline-[#8AC0FF] sm:w-[35vw] w-[50vw]
                    sm:placeholder:text-base placeholder:text-[0.7rem]
                    placeholder:text-[#4F4F4F] placeholder:font-inter-400 
                    border font-inter-500 border-[#E6E6E6] text-lg rounded-xl 
                    px-[0.5rem] py-[0.2rem]'
                    />
                    {data &&
                      enableSearchResults &&
                      data.data?.results.map((data, key) => {
                        return (
                          <div key={key}>
                            <div
                              className='sm:w-[35vw] w-[49vw] cursor-pointer hover:bg-slate-200 bg-white'
                              onClick={() => {
                                setLatLng({ lat: data.geometry.lat, lng: data.geometry.lng })
                                setMarkerPos([data.geometry.lat, data.geometry.lng])
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
                </div>
                <MapContainer
                  zoomSnap='0.1'
                  center={[21.028511, 105.804817]}
                  zoom={13}
                  style={{
                    height: screen.width <= 640 ? '30vh' : 'full',
                    width: screen.width >= 1536 ? '45vw' : screen.width >= 640 ? '45vw' : '75vw'
                  }}
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
            <div>
              <input
                type='text'
                id='address'
                name='address'
                placeholder='Địa chỉ được nhập từ trên'
                autoComplete='off'
                // readOnly
                value={addressValue}
                {...register('address')}
                className='w-full mt-[1rem] sm:text-base text-xs
                focus:outline-none caret-transparent cursor-default 
                placeholder:text-[#777070] placeholder:font-inter-400 border 
                font-inter-500 border-[#E6E6E6] rounded-xl px-[0.5rem] py-[0.2rem]'
              />
              <div className='flex justify-between mt-[1rem] gap-x-2'>
                <input
                  type='text'
                  id='lat'
                  name='lat'
                  autoComplete='off'
                  readOnly
                  {...register('lat', { readOnly: true })}
                  value={latLngValueInput[0]}
                  className='sm:w-[25vw] w-[39vw] sm:text-base text-xs focus:outline-none 
                  caret-transparent cursor-default border font-inter-500
                   border-[#E6E6E6] rounded-xl px-[0.5rem] sm:py-[0.2rem]'
                />
                <input
                  type='text'
                  id='lng'
                  name='lng'
                  autoComplete='off'
                  readOnly
                  {...register('lng', { readOnly: true })}
                  value={latLngValueInput[1]}
                  className='sm:w-[25vw] w-[39vw] sm:text-base text-xs focus:outline-none 
                  caret-transparent cursor-default border font-inter-500 
                  border-[#E6E6E6] rounded-xl px-[0.5rem] sm:py-[0.2rem]'
                />
              </div>
            </div>
            <div
              className='flex justify-between mt-[2rem] text-orange-500 
            text-[0.7rem]  ml-[25vw] w-[50vw]
            sm:text-[1rem]  sm:ml-[12.5vw] sm:w-[21vw]
            2xl:w-[18vw]'
            >
              <div>Số ghế</div>
              <div>Số bàn có từng này ghế</div>
            </div>
            <div className='flex items-center gap-x-4 w-full sm:mb-[2rem]'>
              <div className='sm:text-xl text-xs sm:w-[10vw] w-[16vw] text-orange-500'>Bàn ghế</div>
              <div>
                {tableChair &&
                  tableChair.map((obj, index) => {
                    return (
                      <div
                        key={index}
                        className='flex ml-[0.5rem] gap-x-5 sm:gap-x-[4.3rem] items-center'
                      >
                        <div className='flex gap-x-[3.2rem] sm:gap-x-[5rem]'>
                          <input
                            type='number'
                            id={'chair' + index}
                            name='chair'
                            autoComplete='off'
                            className='w-[13vw] chair sm:w-[5vw] priceInput focus:outline-[#8AC0FF] 
                placeholder:text-[#4F4F4F] placeholder:font-inter-400 border 
                font-inter-500 border-[#E6E6E6] sm:text-lg text-xs rounded-xl 
                py-2 px-[0.7rem] 2xl:px-[1rem]'
                            defaultValue={tableChair[index].chair}
                            onInput={(e) => {
                              setTableChair([
                                ...tableChair.slice(0, index),
                                {
                                  chair: parseInt(e.target.value),
                                  table: tableChair[index].table
                                },
                                ...tableChair.slice(index + 1)
                              ])
                            }}
                          />
                          <input
                            type='number'
                            id={'table_' + index}
                            name='table'
                            autoComplete='off'
                            defaultValue={tableChair[index].table}
                            className='w-[13vw] table sm:w-[5vw] priceInput focus:outline-[#8AC0FF] 
              placeholder:text-[#4F4F4F] placeholder:font-inter-400 border 
              font-inter-500 border-[#E6E6E6] sm:text-lg text-xs rounded-xl
               py-2 px-[0.7rem] 2xl:px-[1rem]'
                            onInput={(e) => {
                              setTableChair([
                                ...tableChair.slice(0, index),
                                {
                                  table: parseInt(e.target.value),
                                  chair: tableChair[index].chair
                                },
                                ...tableChair.slice(index + 1)
                              ])
                            }}
                          />
                        </div>
                        {index === tableChair.length - 1 ? (
                          tableChair.length === 1 ? (
                            <FaPlusCircle
                              onClick={() => {
                                setTableChair([...tableChair, { table: 0, chair: 0 }])
                              }}
                              style={{
                                width:
                                  screen.width >= 1536
                                    ? '2vw'
                                    : screen.width >= 640
                                    ? '3vw'
                                    : '10vw',
                                height:
                                  screen.width >= 1536
                                    ? '2vw'
                                    : screen.width >= 640
                                    ? '3vw'
                                    : '10vw',
                                color: 'orange'
                              }}
                            />
                          ) : (
                            <div className='flex'>
                              <FiMinusCircle
                                onClick={() => {
                                  setTableChair([
                                    ...tableChair.slice(0, index),
                                    ...tableChair.slice(index + 1)
                                  ])
                                  reset()
                                }}
                                style={{
                                  width:
                                    screen.width >= 1536
                                      ? '2vw'
                                      : screen.width >= 640
                                      ? '3vw'
                                      : '10vw',
                                  height:
                                    screen.width >= 1536
                                      ? '2vw'
                                      : screen.width >= 640
                                      ? '3vw'
                                      : '10vw',
                                  color: 'red'
                                }}
                              />
                              <FaPlusCircle
                                onClick={() => {
                                  setTableChair([...tableChair, { table: 0, chair: 0 }])
                                }}
                                style={{
                                  width:
                                    screen.width >= 1536
                                      ? '2vw'
                                      : screen.width >= 640
                                      ? '3vw'
                                      : '10vw',
                                  height:
                                    screen.width >= 1536
                                      ? '2vw'
                                      : screen.width >= 640
                                      ? '3vw'
                                      : '10vw',
                                  color: 'orange'
                                }}
                              />
                            </div>
                          )
                        ) : (
                          <FiMinusCircle
                            onClick={() => {
                              setTableChair([
                                ...tableChair.slice(0, index),
                                ...tableChair.slice(index + 1)
                              ])
                              reset()
                            }}
                            style={{
                              width:
                                screen.width >= 1536 ? '2vw' : screen.width >= 640 ? '3vw' : '10vw',
                              height:
                                screen.width >= 1536 ? '2vw' : screen.width >= 640 ? '3vw' : '10vw',
                              color: 'red'
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
          <div className='sm:col-start-10 sm:col-span-6'>
            <div className='text-lg sm:mt-0 mt-5'>Ảnh nhà hàng (5 ảnh)</div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
              {errors.images?.message}
            </div>
            {previewImageElements.map((element, key) => {
              return (
                <img
                  key={key}
                  src='#'
                  className='sm:w-[25vw] w-[60vw] h-[60vw] sm:h-[25vw] sm:mt-[2rem] mt-[0.5rem]'
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                  ref={element}
                />
              )
            })}
            <input
              type='file'
              id='images'
              name='images'
              accept='image/*'
              {...register('images')}
              className='bg-transparent'
              multiple
              onChange={(e) => {
                for (const element of previewImageElements) {
                  element.current.src = '#'
                  element.current.style.display = 'none'
                }
                if (e.target.files) {
                  if (e.target.files.length === 5) {
                    let i = 0
                    for (const file of e.target.files) {
                      previewImageElements[i].current.src = URL.createObjectURL(file)
                      previewImageElements[i].current.style.display = 'block'
                      i++
                    }
                  }
                }
              }}
            />
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
              {errors.images?.message}
            </div>
            <button className='my-[3rem] hover:bg-[#0366FF] bg-green-500  text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'>
              Xác nhận
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
