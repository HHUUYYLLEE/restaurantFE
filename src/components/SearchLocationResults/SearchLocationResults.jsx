import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'lrm-graphhopper'
import { useContext, useEffect, useRef, useState } from 'react'
import Checkbox from 'react-custom-checkbox'
import { FaAngleDown, FaAngleUp, FaChair, FaCheckCircle, FaSearch } from 'react-icons/fa'
import { IoPeopleSharp } from 'react-icons/io5'
import { PiGridFourFill, PiListLight } from 'react-icons/pi'
import { VscTriangleLeft, VscTriangleRight } from 'react-icons/vsc'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import ReactPaginate from 'react-paginate'
import { getSearchLocation } from '../../api/openstreetmap.api'
import { findNearbyRestaurants } from '../../api/restaurants.api'
import diningIcon from '../../asset/img/dining.png'
import humanIcon from '../../asset/img/human.png'
import nothingIcon from '../../asset/img/nothing.png'
import spinningload from '../../asset/img/spinning_load.gif'
import { HN, TPHCM, categories } from '../../constants/optionsList'
import { AppContext } from '../../contexts/app.context'
import { envConfig } from '../../utils/env'
import Restaurant from './Restaurant/Restaurant'

export default function SearchLocationResults() {
  const [displayType, setDisplayType] = useState(0)
  const [addressValue, setAddressValue] = useState('Hà Nội')
  const [markerPos, setMarkerPos] = useState(['', ''])
  const [latLng, setLatLng] = useState(undefined)
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchQuery2, setSearchQuery2] = useState(null)
  const [searchParams] = useDebounce([searchQuery], 1000)
  const [searchParams2] = useDebounce([searchQuery2], 1000)
  const [redrawMarkers, setRedrawMarkers] = useState(false)
  const [redrawCircles, setRedrawCircles] = useState(false)
  const { mapDraw, setMapDraw, markersGroup, setMarkersGroup } = useContext(AppContext)
  const { leafletMap } = useContext(AppContext)
  const [enableSearchLatLng, setEnableSearchLatLng] = useState(false)
  const [snapMap, setSnapMap] = useState(false)
  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [radius, setRadius] = useState('')
  const [displayRadius, setDisplayRadius] = useState(0)
  const [displayUnit, setDisplayUnit] = useState(0)
  const unitOptions = ['km', 'm']
  const [unit, setUnit] = useState('km')
  const [dropDownState, setDropDownState] = useState(false)
  const [HNfilter, setHNfilter] = useState(HN)
  const [TPHCMfilter, setTPHCMfilter] = useState(TPHCM)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [option, setOption] = useState(0)
  const [chair, setChair] = useState('')
  const [table, setTable] = useState('')
  const options = ['Hà Nội', 'TP.HCM']
  const optionsSearch = ['Hà Nội', 'Thành phố Hồ Chí Minh']
  const [category, setCategory] = useState([])
  const [sortByScore, setSortByScore] = useState(0)
  const [borough, setBorough] = useState('Quận/Huyện/Thị xã')
  const [dropDown2State, setDropDown2State] = useState(false)
  const [dropDown3State, setDropDown3State] = useState(false)
  const refDropDown = useRef(null)
  const refDropDown2 = useRef(null)
  const refDropDown3 = useRef(null)
  const options2 = ['Tất cả', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10']
  const [displayOption2, setDisplayOption2] = useState('Tất cả')
  const [displayAddressValue, setDisplayAddressValue] = useState('')
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['searchRestaurantsOnMap'],
    queryFn: async () => {
      window.scrollTo({
        top: screen.width < 640 ? 520 : 950,
        behavior: 'smooth'
      })
      const data = await findNearbyRestaurants({
        lat: latLngValueInput[0],
        lng: latLngValueInput[1],
        radius: radius,
        unit: unit,
        address: addressValue === 'Quận/Huyện/Thị xã' ? '' : addressValue,
        page,
        limit,
        category,
        sortByScore,
        chair,
        table
      })

      if (!redrawMarkers) {
        const layerGroup = new L.LayerGroup()
        for (const restaurant of data.data.restaurants) {
          const marker = L.marker([restaurant.lat, restaurant.lng], {
            icon: new L.Icon({
              iconUrl: diningIcon,
              iconSize: [80, 80]
            })
          })
          marker.addTo(layerGroup).bindPopup(
            `<a href="./restaurant/${restaurant._id}">
              <img src='${restaurant.main_avatar_url}'>
              </img></a><div>${restaurant.name}</div>
              <div>${
                restaurant.distance < 1000
                  ? Math.trunc(restaurant.distance).toString().replace('.', ',') + ' m'
                  : (Math.trunc(restaurant.distance) / 1000).toString().replace('.', ',') + ' km'
              }</div></a>
              `
          )
        }
        layerGroup.addTo(leafletMap)
        setMarkersGroup(layerGroup)
        setRedrawMarkers(true)
      } else {
        leafletMap.removeLayer(markersGroup)
        const layerGroup = new L.LayerGroup()
        for (const restaurant of data.data.restaurants) {
          const marker = L.marker([restaurant.lat, restaurant.lng])
          marker.addTo(layerGroup).bindPopup(
            `<div>
            <a href="./restaurant/${restaurant._id}">
              <img src='${restaurant.main_avatar_url}'>
              </img><div>${restaurant.name}</div>
              <div>${
                restaurant.distance < 1000
                  ? Math.trunc(restaurant.distance).toString().replace('.', ',') + ' m'
                  : (Math.trunc(restaurant.distance) / 1000).toString().replace('.', ',') + ' km'
              }</div></a></div>
              `
          )
        }
        layerGroup.addTo(leafletMap)
        setMarkersGroup(layerGroup)
      }
      return data
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: false,
    retry: false
  })

  const { data: data2 } = useQuery({
    queryKey: ['search_location', searchParams],
    queryFn: () => {
      return getSearchLocation(searchParams)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchResults
  })
  const { data: data3, isSuccess: isSuccess3 } = useQuery({
    queryKey: ['search_lat_lng', searchParams2],
    queryFn: () => {
      return getSearchLocation(searchParams2)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchLatLng
  })
  function HandleSuccess({ isSuccess3, data3 }) {
    useEffect(() => {
      if (isSuccess3) {
        setDisplayAddressValue(data3?.data.results[0].formatted)
        setLatLngValueInput([
          data3?.data.results[0].geometry.lat,
          data3?.data.results[0].geometry.lng
        ])
      }
    }, [isSuccess3, data3?.data.results])
  }
  HandleSuccess({ isSuccess3, data3 })
  const searchData = data?.data
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      setLatLng({ lat: e.coords.latitude, lng: e.coords.longitude })
      setMarkerPos([e.coords.latitude, e.coords.longitude])
      setSnapMap(true)
      setEnableSearchLatLng(true)
      setLatLngValueInput([e.coords.latitude, e.coords.longitude])
      setSearchQuery2({
        q: e.coords.latitude + ',' + e.coords.longitude,
        key: envConfig.opencageKey
      })
    })
  }, [])
  function MyComponent() {
    useMapEvents({
      click: (e) => {
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng })
        setMarkerPos([e.latlng.lat, e.latlng.lng])
        setSnapMap(true)
        setEnableSearchLatLng(true)
        setLatLngValueInput([e.latlng.lat, e.latlng.lng])
        setSearchQuery2({ q: e.latlng.lat + ',' + e.latlng.lng, key: envConfig.opencageKey })
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
  const handleClickOutside = (event) => {
    if (refDropDown.current && !refDropDown.current.contains(event.target)) {
      setDropDownState(false)
    }
    if (refDropDown2.current && !refDropDown2.current.contains(event.target)) {
      setDropDown2State(false)
    }
    if (refDropDown3.current && !refDropDown3.current.contains(event.target)) {
      setDropDown3State(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <>
      <div className={`mt-[7rem] w-[90%] mx-auto`}>
        <div className='text-orange-500 italic text-[1.3rem] sm:text-[1.6rem] flex justify-center'>
          Chọn điểm xuất phát trên bản đồ
        </div>
        <div>
          <input
            type='text'
            id='address'
            name='address'
            placeholder='Địa chỉ được nhập tự động'
            autoComplete='off'
            readOnly
            value={displayAddressValue}
            className='w-full mt-[1rem] sm:text-base text-xs
                focus:outline-none caret-transparent cursor-default bg-[#c7bbbb]
                placeholder:text-[#777070] placeholder:font-inter-400 border 
                font-inter-500  rounded-xl px-[0.5rem] py-[0.2rem]'
          />
          <div className='flex justify-between mt-[1rem] gap-x-2'>
            <input
              type='text'
              id='lat'
              name='lat'
              autoComplete='off'
              readOnly
              value={latLngValueInput[0]}
              className='sm:w-[25vw] w-[39vw] sm:text-base text-xs focus:outline-none 
                  caret-transparent cursor-default border font-inter-500 bg-[#c7bbbb]
                   border-[#E6E6E6] rounded-xl px-[0.5rem] sm:py-[0.2rem]'
            />
            <input
              type='text'
              id='lng'
              name='lng'
              autoComplete='off'
              readOnly
              value={latLngValueInput[1]}
              className='sm:w-[25vw] w-[39vw] sm:text-base text-xs focus:outline-none 
                  caret-transparent cursor-default border font-inter-500 bg-[#c7bbbb]
                  border-[#E6E6E6] rounded-xl px-[0.5rem] sm:py-[0.2rem]'
            />
          </div>
          <div className='flex justify-center gap-x-2'>
            <input
              type='number'
              id='radius'
              name='radius'
              placeholder='Nhập bán kính'
              autoComplete='off'
              value={radius}
              onInput={(e) => {
                setRadius(e.target.value)
              }}
              className='w-[32%] sm:w-[11%] mt-[1rem] sm:text-base text-xs
                focus:outline-none priceInput
                border-[#ff822e] focus:placeholder:text-transparent
                placeholder:text-[#777070] placeholder:font-inter-400 border 
                font-inter-500 rounded-xl px-[0.5rem] py-[0.2rem]'
            />
            <div className='relative' ref={refDropDown3}>
              <div
                className=' w-[13.5vw] bg-orange-500 h-[3vh] mt-[1.1rem] 
            rounded-lg cursor-pointer sm:w-[5vw] sm:h-[4.8vh] flex items-center
            hover:bg-green-600'
                onClick={() => {
                  setDropDown3State(!dropDown3State)
                }}
              >
                <div
                  className='mx-[0.2rem] sm:mx-[0.4rem] sm:w-[4vw] w-[13vw] 
                flex items-center justify-between'
                >
                  <div className='text-white'>{unit}</div>
                  {dropDown3State ? (
                    <FaAngleUp style={{ color: 'white' }} />
                  ) : (
                    <FaAngleDown style={{ color: 'white' }} />
                  )}
                </div>
              </div>
              {dropDown3State && (
                <div className='absolute'>
                  <div className='border-[0.09rem] border-slate-400 rounded'>
                    {unitOptions.map((option, id) => {
                      return (
                        <div
                          key={id}
                          className='cursor-pointer'
                          onClick={() => {
                            setUnit(option)
                            setDropDown3State(false)
                          }}
                        >
                          <div className='w-[12.4vw] sm:w-[5vw] border-b-[0.11rem] hover:bg-slate-400'>
                            <div className='ml-[0.19rem]'>{option}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-center mt-[1rem]'>
          <button
            className=' py-[0.3rem] sm:py-[0.5rem] sm:px-[1.2rem] 
            bg-orange-500 rounded-md px-[0.5rem] text-white
            hover:bg-green-600'
            onClick={() => {
              if (latLngValueInput[0] === '' || radius === '') return
              refetch()
              setDisplayRadius(radius)
              setDisplayUnit(unit)
              if (!redrawCircles) {
                const clickCircle = L.circle(
                  { lat: latLngValueInput[0], lng: latLngValueInput[1] },
                  {
                    color: 'orange',
                    fillColor: 'orange',
                    fillOpacity: 0.3,
                    radius: unit === 'km' ? radius * 1000 : radius
                  }
                ).addTo(leafletMap)
                clickCircle.addTo(leafletMap)
                setMapDraw(clickCircle)
                setRedrawCircles(true)
              } else {
                leafletMap.removeControl(mapDraw)
                const clickCircle = L.circle(
                  { lat: latLngValueInput[0], lng: latLngValueInput[1] },
                  {
                    color: 'orange',
                    fillColor: 'orange',
                    fillOpacity: 0.3,
                    radius: unit === 'km' ? radius * 1000 : radius
                  }
                ).addTo(leafletMap)
                clickCircle.addTo(leafletMap)
                setMapDraw(clickCircle)
              }
            }}
          >
            Tìm
          </button>
        </div>
        <div className='relative w-full mt-[2rem]'>
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
              {data2 &&
                enableSearchResults &&
                data2.data?.results.map((data, key) => {
                  return (
                    <div key={key}>
                      <div
                        className='sm:w-[53vw] w-[50vw] cursor-pointer 
                          
                          hover:bg-slate-200 bg-white'
                        onClick={() => {
                          setLatLng([data.geometry.lat, data.geometry.lng])
                          setEnableSearchResults(false)
                          setSnapMap(true)
                          setDisplayAddressValue(data.formatted)
                          setMarkerPos([data.geometry.lat, data.geometry.lng])
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
            center={[21.028511, 105.804817]}
            zoom={13}
            style={{
              height: screen.width <= 640 ? '30vh' : '85vh',
              width: screen.width >= 1536 ? '89vw' : screen.width >= 640 ? '89vw' : '90vw'
            }}
            zoomSnap='0.1'
          >
            <ResetCenterView latLng={latLng}></ResetCenterView>
            <MyComponent></MyComponent>

            <Marker
              position={markerPos}
              icon={
                new L.Icon({
                  iconUrl: humanIcon,
                  iconSize: [60, 80]
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

        <div className={`w-full flex gap-x-3 sm:gap-x-8`}>
          <div className='mt-[2.6rem] sm:mt-[3.7rem] 2xl:mt-[4.3rem]'>
            {categories.map((option, id) => {
              if (id !== categories.length - 1)
                return (
                  <div key={id}>
                    <button
                      type='button'
                      className={` rounded-sm h-[4vh] sm:h-[6vh] w-[22vw] sm:w-[15vw]
             bg-white border sm:border-[0.13rem] sm:border-b-0 border-b-0 border-orange-500 
            `}
                      onClick={() => {
                        setPage(1)
                        if (!category.includes(option)) setCategory([...category, option])
                        else setCategory((category) => category.filter((data) => data !== option))
                      }}
                    >
                      <div className='flex items-center gap-x-1 mx-[0.2rem] '>
                        <Checkbox
                          icon={
                            <FaCheckCircle
                              color='#F97316'
                              style={{
                                width: screen.width < 640 ? 10 : 30,
                                height: screen.width < 640 ? 10 : 30
                              }}
                            />
                          }
                          name='my-input'
                          checked={category.includes(option)}
                          borderColor='#F97316'
                          borderRadius={9999}
                          size={screen.width < 640 ? 10 : 30}
                        />
                        <div className='text-[0.5rem] sm:text-[0.8rem] 2xl:text-[0.5rem] sm:w-full sm:flex sm:justify-center'>
                          {option}
                        </div>
                      </div>
                    </button>
                    <hr
                      className='h-[0.06rem] sm:h-[0.15rem] sm:mt-[-0.23rem] 
                  2xl:mt-[-0.1rem] border-none bg-orange-500'
                    />
                  </div>
                )
              else
                return (
                  <div key={id}>
                    <button
                      type='button'
                      className={` rounded-sm h-[4vh] sm:h-[6vh] w-[22vw] sm:w-[15vw] bg-white
                border sm:border-[0.13rem] sm:border-t-2 border-t-0 border-orange-500 
               `}
                      onClick={() => {
                        setPage(1)
                        if (!category.includes(option)) setCategory([...category, option])
                        else setCategory((category) => category.filter((data) => data !== option))
                      }}
                    >
                      <div className='flex items-center gap-x-1 mx-[0.2rem]'>
                        <Checkbox
                          icon={
                            <FaCheckCircle
                              color='#F97316'
                              style={{
                                width: screen.width < 640 ? 10 : 30,
                                height: screen.width < 640 ? 10 : 30
                              }}
                            />
                          }
                          name='my-input'
                          checked={category.includes(option)}
                          borderColor='#F97316'
                          borderRadius={9999}
                          size={screen.width < 640 ? 10 : 30}
                        />
                        <div className='text-[0.5rem] sm:text-[0.8rem] 2xl:text-[0.5rem] sm:w-full sm:flex sm:justify-center'>
                          {option}
                        </div>
                      </div>
                    </button>
                  </div>
                )
            })}
          </div>
          <div className='w-full'>
            <div className='flex justify-end'>
              <div className='flex gap-x-2 sm:gap-x-8'>
                <div
                  className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] 
                  rounded-md cursor-pointer hover:bg-slate-200
                ${displayType === 0 ? ' bg-[#a5909079] ' : ' bg-[#EEE] '}
                `}
                  onClick={() => setDisplayType(0)}
                >
                  <PiListLight
                    style={{
                      width: screen.width < 640 ? '7vw' : '3.5vw',
                      height: screen.width < 640 ? '7vw' : '3.5vw',
                      color: '#F97316'
                    }}
                  />
                </div>
                <div
                  className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md cursor-pointer
                  hover:bg-slate-200
                ${displayType === 1 ? ' bg-[#a5909079] ' : ' bg-[#EEE] '}
                `}
                  onClick={() => setDisplayType(1)}
                >
                  <PiGridFourFill
                    style={{
                      width: screen.width < 640 ? '7vw' : '3.5vw',
                      height: screen.width < 640 ? '7vw' : '3.5vw',
                      color: '#F97316'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='bg-slate-200 mt-[1rem] py-2'>
              <div className='border-b-[0.05rem] border-black'>
                <div
                  className='mx-2 mb-2 grid grid-cols-[1fr_1fr_2fr] 
              sm:grid-cols-[2fr_2fr_3fr] gap-x-[0.3rem] sm:gap-x-[4rem]'
                >
                  {options.map((data, id) => {
                    return (
                      <div
                        key={id}
                        className={`flex items-center justify-center h-[3vh] rounded-md
               text-[0.5rem] px-[0.3rem] cursor-pointer sm:h-[6vh] sm:text-xl hover:bg-green-400
               ${option === id ? ' bg-orange-500 text-white ' : ' bg-white'} `}
                        onClick={() => {
                          setPage(1)
                          setAddressValue(optionsSearch[id])
                          setOption(id)
                          setBorough('Quận/Huyện/Thị xã')
                        }}
                      >
                        {data}
                      </div>
                    )
                  })}
                  <div className='relative' ref={refDropDown}>
                    <div
                      onClick={() => {
                        setDropDownState(!dropDownState)
                      }}
                    >
                      <div
                        className={`flex items-center justify-between h-[3vh] rounded-md
                     ${
                       dropDownState ? ' pr-[0.7rem] pl-[0.3rem] sm:pl-[0.9rem] ' : ' px-[0.7rem] '
                     } cursor-pointer sm:h-[6vh]  bg-orange-500
                          `}
                      >
                        {dropDownState ? (
                          <input
                            type='text'
                            className='w-[20vw] h-[0.9rem] px-[0.2rem]
                            border-0 bg-white rounded-md sm:h-[2rem] sm:px-[0.8rem]
                          placeholder:italic 
                          placeholder:text-[0.43rem] text-[0.5rem]
                          focus:outline-none'
                            placeholder='Tìm kiếm hoặc chọn'
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            onInput={(e) => {
                              if (option === 0)
                                setHNfilter(
                                  HN.filter((str) => str.toLowerCase().includes(e.target.value))
                                )
                              else
                                setTPHCMfilter(
                                  TPHCM.filter((str) => str.toLowerCase().includes(e.target.value))
                                )
                            }}
                          ></input>
                        ) : (
                          <div className='flex justify-center w-full'>
                            <div className={`text-[0.5rem] sm:text-xl text-white`}>{borough}</div>
                          </div>
                        )}

                        {dropDownState ? (
                          <FaAngleUp
                            style={{
                              color: 'white',
                              width: screen.width < 640 ? '3vw' : '1vw',
                              height: screen.width < 640 ? '3vw' : '1vw'
                            }}
                          />
                        ) : (
                          <FaAngleDown
                            style={{
                              color: 'white',
                              width: screen.width < 640 ? '3vw' : '1vw',
                              height: screen.width < 640 ? '3vw' : '1vw'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {dropDownState && (
                      <div className='absolute w-[29vw] sm:w-[28vw] z-10'>
                        <div
                          className='border-[0.09rem] border-slate-400
                         rounded max-h-[20vh] sm:max-h-[32vh] overflow-scroll'
                        >
                          {option === 0
                            ? HNfilter.map((option, id) => {
                                return (
                                  <div
                                    key={id}
                                    className='cursor-pointer bg-white'
                                    onClick={() => {
                                      setPage(1)
                                      setBorough(option)
                                      setAddressValue(option)
                                      setDropDownState(false)
                                    }}
                                  >
                                    <div
                                      className='text-[0.5rem] sm:text-[1.2rem] 
                                    flex items-center h-[2.4vh] sm:h-[4vh]
                                    sm:w-full border-b-[0.11rem] hover:bg-slate-400'
                                    >
                                      <div className='ml-[0.19rem] sm:ml-[1rem]'>{option}</div>
                                    </div>
                                  </div>
                                )
                              })
                            : TPHCMfilter.map((option, id) => {
                                return (
                                  <div
                                    key={id}
                                    className='cursor-pointer bg-white'
                                    onClick={() => {
                                      setPage(1)
                                      setBorough(option)
                                      setAddressValue(option)
                                      setDropDownState(false)
                                    }}
                                  >
                                    <div
                                      className='text-[0.5rem] sm:text-[1.2rem] flex items-center h-[2.4vh] 
                                    sm:w-[5vw] border-b-[0.11rem] sm:h-[4vh] hover:bg-slate-400'
                                    >
                                      <div className='ml-[0.19rem]'>{option}</div>
                                    </div>
                                  </div>
                                )
                              })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='mx-2 flex mt-[0.5rem] items-center justify-between'>
                <div className='flex items-center'>
                  <FaChair
                    style={{
                      width: screen.width < 640 ? '5vw' : '3.5vw',
                      height: screen.width < 640 ? '5vw' : '3.5vw',
                      color: 'orange'
                    }}
                  />
                  <div className='italic text-[0.4rem] sm:text-[1.3rem]'>Tìm đặt chỗ:&nbsp;</div>
                  <input
                    type='number'
                    onInput={(e) => {
                      setPage(1)
                      setTable(e.target.value)
                    }}
                    className='w-[2.5vw] sm:h-[4vh] text-center priceInput 
                  text-[0.4rem] 2xl:text-[0.4rem] sm:text-[1.1rem] focus:outline-none 
                  px-[0.2rem] h-[1.5vh] rounded-sm'
                  ></input>
                  <div className='italic text-[0.4rem] sm:text-[1.3rem]'>&nbsp;bàn&nbsp;</div>
                  <input
                    type='number'
                    onInput={(e) => {
                      setPage(1)
                      setChair(e.target.value)
                    }}
                    className='w-[2.5vw] sm:h-[4vh] text-center priceInput 
                  text-[0.4rem] 2xl:text-[0.4rem] sm:text-[1.1rem] focus:outline-none 
                  px-[0.2rem] h-[1.5vh] rounded-sm'
                  ></input>
                  <div className='italic text-[0.4rem] sm:text-[1.3rem]'>&nbsp;chỗ</div>
                  {screen.width > 640 && (
                    <FaChair
                      style={{
                        width: screen.width < 640 ? '5vw' : '3.5vw',
                        height: screen.width < 640 ? '5vw' : '3.5vw',
                        color: 'orange'
                      }}
                    />
                  )}
                </div>
                <div className='flex items-center gap-x-1'>
                  <IoPeopleSharp
                    style={{
                      width: screen.width < 640 ? '5vw' : '3.5vw',
                      height: screen.width < 640 ? '5vw' : '3.5vw',
                      color: 'orange'
                    }}
                  />
                  <div className='text-[0.4rem] sm:text-[1.3rem] italic'>Điểm đánh giá:</div>

                  <div className='relative' ref={refDropDown2}>
                    <div
                      onClick={() => {
                        setDropDown2State(!dropDown2State)
                      }}
                    >
                      <div
                        className={`flex items-center justify-between h-[2vh] rounded-md px-[0.3rem] 
                    cursor-pointer sm:h-[6vh] bg-orange-500
                    `}
                      >
                        <div className='flex justify-center w-full'>
                          <div className={`text-[0.5rem] sm:text-xl text-white`}>
                            {displayOption2}
                          </div>
                        </div>

                        {dropDown2State ? (
                          <FaAngleUp
                            style={{
                              color: 'white',
                              width: screen.width < 640 ? '3vw' : '1vw',
                              height: screen.width < 640 ? '3vw' : '1vw'
                            }}
                          />
                        ) : (
                          <FaAngleDown
                            style={{
                              color: 'white',
                              width: screen.width < 640 ? '3vw' : '1vw',
                              height: screen.width < 640 ? '3vw' : '1vw'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {dropDown2State && (
                      <div className='absolute w-[12vw] sm:w-[8vw]'>
                        <div
                          className='border-[0.09rem] border-slate-400
                         rounded max-h-[20vh] sm:max-h-[32vh] overflow-scroll'
                        >
                          {options2.map((option, id) => {
                            return (
                              <div
                                key={id}
                                className='cursor-pointer bg-white text-[0.5rem]'
                                onClick={() => {
                                  setPage(1)
                                  setSortByScore(id)
                                  setDisplayOption2(option)
                                  setDropDown2State(false)
                                }}
                              >
                                <div
                                  className='text-[0.5rem] sm:text-[1.2rem] flex items-center h-[2.4vh] 
                                    sm:w-[5vw] sm:h-[4vh] border-b-[0.11rem] hover:bg-slate-400'
                                >
                                  <div className='ml-[0.19rem]'>{option}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {screen.width > 640 && (
                    <IoPeopleSharp
                      style={{
                        width: screen.width < 640 ? '5vw' : '3.5vw',
                        height: screen.width < 640 ? '5vw' : '3.5vw',
                        color: 'orange'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              className='flex justify-center items-center py-[0.6rem] hover:bg-orange-500
               bg-green-500 w-full sm:py-[1rem]
              rounded-lg '
              onClick={refetch}
            >
              <FaSearch
                style={{
                  color: 'white',
                  width: screen.width < 640 ? '4vw' : '2vw',
                  height: screen.width < 640 ? '4vw' : '2vw'
                }}
              />
              <div className='text-white text-[0.8rem] sm:text-[1.5rem]'>Tìm lại</div>
            </button>

            {(isError || searchData?.restaurants.length === 0) && (
              <div className='flex justify-center items-center mt-[0.5rem]'>
                <div className=''>
                  <div className='flex justify-center'>
                    <img className='w-[20vw] sm:w-[11vw]' src={nothingIcon}></img>
                  </div>
                  <div>
                    <span>Không tìm thấy nhà hàng nào trong phạm vi&nbsp;</span>

                    <span className='italic font-bold text-orange-500'>
                      {displayUnit === 'km' ? `${displayRadius} km` : `${displayRadius} m`}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`grid ${
                displayType === 0
                  ? ' gap-y-[0.6rem] '
                  : ' grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-3  '
              } mt-[1rem]`}
            >
              {(isLoading || isFetching) && (
                <div className='flex items-center justify-center'>
                  <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
                </div>
              )}
              {searchData &&
                !isLoading &&
                !isFetching &&
                searchData.restaurants.map((restaurant, id) => {
                  return <Restaurant key={id} displayType={displayType} restaurant={restaurant} />
                })}
            </div>
            {searchData && (
              <div className='w-full'>
                <ReactPaginate
                  className='flex justify-center gap-x-2 mt-[1rem] sm:gap-x-[1rem] sm:mt-[3rem]'
                  activeClassName='text-white bg-orange-500 rounded-md'
                  breakClassName=''
                  pageClassName='px-[2vw] sm:px-[1vw] py-[1vw] sm:py-[0.5vw] hover:bg-green-500 
                hover:text-white cursor-pointer'
                  previousClassName='mt-[1vh] sm:mt-[1.5vh] cursor-pointer'
                  nextClassName='mt-[1vh] sm:mt-[1.5vh] cursor-pointer'
                  breakLabel='...'
                  nextLabel={<VscTriangleRight style={{ color: 'orange' }} />}
                  previousLabel={<VscTriangleLeft style={{ color: 'orange' }} />}
                  onPageChange={(e) => {
                    setPage(e.selected + 1)
                  }}
                  onClick={(e) => {
                    console.log(e)
                  }}
                  forcePage={page - 1}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={searchData.totalPages}
                  renderOnZeroPageCount={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
