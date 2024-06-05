import { createARestaurant } from '../../api/restaurants.api'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfoFromLS } from '../../utils/auth'
import { displayNum, isAxiosUnprocessableEntityError } from '../../utils/utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { schemaRestaurantProfile } from '../../utils/rules'
import { useEffect, useRef, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import Modal from 'react-modal'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'
import { createSearchParams, useAsyncError } from 'react-router-dom'
import { envConfig } from '../../utils/env'
import { convertTime } from '../../utils/utils'
export default function OpenRestaurant() {
  const [searchQuery, setSearchQuery] = useState({})
  const [searchQuery2, setSearchQuery2] = useState({})
  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [latLng, setLatLng] = useState(undefined)
  const [lockMarker, setLockMarker] = useState(false)
  const [firstUpdate, setFirstUpdate] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const [addressValue, setAddressValue] = useState('')
  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
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
  useEffect(() => {
    if (!firstUpdate) refetch()
  }, [searchQuery, refetch, firstUpdate])
  useEffect(() => {
    if (!firstUpdate) refetch2()
  }, [searchQuery2, refetch2, firstUpdate])
  const {
    register,
    handleSubmit,
    setError,
    setValue,
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
      toast.error('Hãy nhập địa chỉ')
      return
    }
    data.morning_open_time = convertTime(data.morning_hour_open) + ':' + convertTime(data.morning_minute_open)
    data.morning_closed_time = convertTime(data.morning_hour_close) + ':' + convertTime(data.morning_minute_close)
    data.afternoon_open_time = convertTime(data.afternoon_hour_open) + ':' + convertTime(data.afternoon_minute_open)
    data.afternoon_closed_time = convertTime(data.afternoon_hour_close) + ':' + convertTime(data.afternoon_minute_close)
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
    console.log(data)

    createARestaurantMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Mỏ nhà hàng thành công !') //。(20)
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

      <div className='mt-36 mx-auto grid grid-cols-15 w-[90vw] gap-x-4'>
        <div className='col-span-9'>
          <form onSubmit={onSubmit}>
            <div className='flex items-center gap-x-4'>
              <div className='text-xl w-[10vw]'>Tên nhà hàng</div>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Tên nhà hàng'
                autoComplete='off'
                {...register('name')}
                className='w-full focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
              />
            </div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.name?.message}</div>

            <div className='mt-[3rem] flex items-center gap-x-5'>
              <div className='text-xl w-[10vw]'>Mô tả</div>
              <textarea
                type='text'
                id='desc'
                name='desc'
                placeholder='Mô tả'
                autoComplete='off'
                {...register('desc')}
                className='resize-none h-[18vh] w-full focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-[0.7rem] px-[2rem]'
              />
            </div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.desc?.message}</div>

            <div className='mt-[3rem] flex items-center'>
              <div className='text-xl w-[10vw]'>Khung giờ mở cửa</div>
              <div className=''>
                <div className='flex items-center'>
                  <div className='text-lg italic ml-[1.25rem] w-[3vw]'>Sáng</div>
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
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='text-lg ml-[0.5rem]'>:</div>
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
                        if (parseInt(e.target.value) < 10) e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
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
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='text-lg ml-[0.5rem]'>:</div>
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
                        if (parseInt(e.target.value) < 10) e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='ml-[0.2rem] min-h-[1.75rem] text-lg text-red-600'>
                    {errors.morning_hour_close?.message}
                    {errors.morning_minute_close?.message}
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='text-lg italic ml-[1.25rem] w-[3vw]'>Chiều</div>
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
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='text-lg ml-[0.5rem]'>:</div>
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
                        if (parseInt(e.target.value) < 10) e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
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
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='text-lg ml-[0.5rem]'>:</div>
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
                        if (parseInt(e.target.value) < 10) e.target.value = '0' + parseInt(e.target.value)
                        else if (parseInt(e.target.value) > 59) e.target.value = '00'
                        else e.target.value = parseInt(e.target.value)
                      }
                    }}
                    className='w-[4vw] ml-[0.5rem] focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 pl-[0.7rem] pr-[0.4rem]'
                  />
                  <div className='ml-[0.2rem] min-h-[1.75rem] text-lg text-red-600'>
                    {errors.afternoon_hour_close?.message}
                    {errors.afternoon_minute_close?.message}
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-[3rem] flex items-center'>
              <div className='text-xl w-[8vw]'>Địa chỉ</div>
              <div className='relative'>
                <div className='absolute top-1 left-[50%] translate-x-[-50%] text-center z-10'>
                  <input
                    type='text'
                    id='search'
                    name='search'
                    placeholder='Tìm kiếm hoặc click vào 1 vị trí'
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
                <MapContainer center={[21.028511, 105.804817]} zoom={13}>
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
                className='w-full mt-[1rem] focus:outline-none caret-transparent cursor-default placeholder:text-[#777070] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl px-[0.5rem] py-[0.2rem]'
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
                  className='w-[25vw] focus:outline-none caret-transparent cursor-default border font-inter-500 border-[#E6E6E6] text-lg rounded-xl px-[0.5rem] py-[0.2rem]'
                />
                <input
                  type='text'
                  id='lng'
                  name='lng'
                  autoComplete='off'
                  readOnly
                  {...register('lng', { readOnly: true })}
                  value={latLngValueInput[1]}
                  className='w-[25vw] focus:outline-none caret-transparent cursor-default border font-inter-500 border-[#E6E6E6] text-lg rounded-xl px-[0.5rem] py-[0.2rem]'
                />
              </div>
            </div>
            <div className='flex items-center gap-x-4 mt-[2rem] w-full'>
              <div className='text-xl w-[10vw]'>Nhập số bàn</div>
              <input
                type='number'
                id='number_of_tables'
                name='number_of_tables'
                placeholder='Số bàn'
                autoComplete='off'
                {...register('number_of_tables')}
                onInput={(e) => {
                  e.target.value = displayNum(e.target.value)
                }}
                className='w-full priceInput focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
              />
            </div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.number_of_tables?.message}</div>
            <div className='flex items-center gap-x-4 mt-[2rem] w-full'>
              <div className='text-xl w-[10vw]'>Nhập số chỗ ngồi</div>
              <input
                type='number'
                id='number_of_chairs'
                name='number_of_chairs'
                placeholder='Số chỗ ngồi'
                autoComplete='off'
                {...register('number_of_chairs')}
                onInput={(e) => {
                  e.target.value = displayNum(e.target.value)
                }}
                className='w-full priceInput focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-2 px-[2rem]'
              />
            </div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.number_of_chairs?.message}</div>

            <button className='mt-[3rem] hover:bg-[#0366FF] bg-green-500  text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'>
              Xác nhận
            </button>
          </form>
        </div>
        <div className='col-start-10 col-span-6'>
          <div className='text-lg'>Ảnh nhà hàng (5 ảnh)</div>
          <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.images?.message}</div>
          {previewImageElements.map((element, key) => {
            return (
              <img
                key={key}
                src='#'
                className='w-[30vw] mt-[2rem]'
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
          <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>{errors.images?.message}</div>
        </div>
      </div>
    </>
  )
}
