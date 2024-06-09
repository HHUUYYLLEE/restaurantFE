import { useState, useEffect, useContext, useRef } from 'react'
import useQueryConfig from '../../hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { searchRestaurantsAndFood, findNearbyRestaurants } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
import Restaurant from './Restaurant/Restaurant'
import { displayNum } from '../../utils/utils'
import { PiListLight } from 'react-icons/pi'
import { PiGridFourFill } from 'react-icons/pi'
import { FaCheckCircle } from 'react-icons/fa'
import Checkbox from 'react-custom-checkbox'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import L from 'leaflet'
import markerIconPng from '../../asset/img/red_map_pin.png'
import { useDebounce } from '@uidotdev/usehooks'
import { AppContext } from '../../contexts/app.context'
import { envConfig } from '../../utils/env'
import { getSearchLocation } from '../../api/openstreetmap.api'

import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'

export default function SearchResults() {
  const [option, setOption] = useState(0)
  const [displayType, setDisplayType] = useState(0)
  const [addressValue, setAddressValue] = useState('')
  const [markerPos, setMarkerPos] = useState(['', ''])
  const [latLng, setLatLng] = useState(undefined)
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchQuery2, setSearchQuery2] = useState(null)
  const [searchParams, setSearchParams] = useDebounce([searchQuery], 1000)
  const [searchParams2, setSearchParams2] = useDebounce([searchQuery2], 1000)
  const [redrawMarkers, setRedrawMarkers] = useState(false)
  const [redrawCircles, setRedrawCircles] = useState(false)
  const { mapDraw, setMapDraw, markersGroup, setMarkersGroup } = useContext(AppContext)
  const { leafletMap } = useContext(AppContext)
  const [enableSearchLatLng, setEnableSearchLatLng] = useState(false)
  const [snapMap, setSnapMap] = useState(false)
  const [latLngValueInput, setLatLngValueInput] = useState(['', ''])
  const [enableSearchResults, setEnableSearchResults] = useState(false)
  const [radius, setRadius] = useState('')
  const options = ['km', 'm']
  const [unit, setUnit] = useState('km')
  const [dropDownState, setDropDownState] = useState(false)
  // console.log(params)
  const { status, data, isSuccess, isError, refetch } = useQuery({
    queryKey: ['searchRestaurantsOnMap'],
    queryFn: async () => {
      const data = await findNearbyRestaurants({
        lat: latLngValueInput[0],
        lng: latLngValueInput[1],
        radius: radius,
        unit: unit
      })

      if (!redrawMarkers) {
        const layerGroup = new L.LayerGroup()
        for (const restaurant of data.data.restaurants) {
          const marker = L.marker([restaurant.lat, restaurant.lng])
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
      }
      return data
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: false,
    retry: false
  })

  const {
    status: status2,
    data: data2,
    isLoading
  } = useQuery({
    queryKey: ['search_location', searchParams],
    queryFn: () => {
      return getSearchLocation(searchParams)
    },
    keepPreviousData: true,
    staleTime: 1000,
    enabled: enableSearchResults
  })
  const {
    status: status3,
    data: data3,
    isLoading: isLoading3,
    isSuccess: isSuccess3
  } = useQuery({
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
        setAddressValue(data3.data.results[0].formatted)
        setLatLngValueInput([
          data3.data.results[0].geometry.lat,
          data3.data.results[0].geometry.lng
        ])
      }
    }, [isSuccess3])
  }
  HandleSuccess({ isSuccess3, data3 })
  const searchData = data?.data

  function MyComponent() {
    const map = useMapEvents({
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
  const refDropDown = useRef(null)
  const handleClickOutside = (event) => {
    if (refDropDown.current && !refDropDown.current.contains(event.target)) {
      setDropDownState(false)
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
            value={addressValue}
            // {...register('address')}
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
              // {...register('lat', { readOnly: true })}
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
              // {...register('lng', { readOnly: true })}
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
              // readOnly
              value={radius}
              onInput={(e) => {
                setRadius(e.target.value)
              }}
              // {...register('address')}
              className='w-[32%] sm:w-[11%] mt-[1rem] sm:text-base text-xs
                focus:outline-none priceInput
                border-[#ff822e] focus:placeholder:text-transparent
                placeholder:text-[#777070] placeholder:font-inter-400 border 
                font-inter-500 rounded-xl px-[0.5rem] py-[0.2rem]'
            />
            <div className='relative' ref={refDropDown}>
              <div
                className=' w-[13.5vw] bg-orange-500 h-[3vh] mt-[1.1rem] 
            rounded-lg cursor-pointer sm:w-[5vw] sm:h-[4.8vh] flex items-center
            hover:bg-green-600'
                onClick={() => {
                  setDropDownState(!dropDownState)
                }}
              >
                <div
                  className='mx-[0.2rem] sm:mx-[0.4rem] sm:w-[4vw] w-[13vw] 
                flex items-center justify-between'
                >
                  <div className='text-white'>{unit}</div>
                  {dropDownState ? (
                    <FaAngleUp style={{ color: 'white' }} />
                  ) : (
                    <FaAngleDown style={{ color: 'white' }} />
                  )}
                </div>
              </div>
              {dropDownState && (
                <div className='absolute'>
                  <div className='border-[0.09rem] border-slate-400 rounded'>
                    {options.map((option, id) => {
                      return (
                        <div
                          key={id}
                          className='cursor-pointer'
                          onClick={() => {
                            setUnit(option)
                            setDropDownState(false)
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
              refetch()
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
                          setAddressValue(data.formatted)
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
              icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
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
        {isSuccess && searchData && (
          <div className='flex justify-between mt-[0.5rem]'>
            <div>
              <div>
                <span>Tìm thấy&nbsp;</span>
                <span className='italic font-bold text-orange-500'>
                  {searchData.restaurants.length}&nbsp;
                </span>
                <span>nhà hàng&nbsp;</span>
                <span>trong phạm vi&nbsp;</span>
                <span className='italic font-bold text-orange-500'>
                  {unit === 'km' ? `${radius} km` : `${radius} m`}
                </span>
              </div>
            </div>
            <div className='flex gap-x-2 sm:gap-x-8'>
              <div
                className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md 
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
                className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md 
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
        )}
        {/* <div className='bg-white mt-[1rem]'>
            <div className='grid grid-cols-3'>
              {options.map((data, id) => {
                return (
                  <div
                    key={id}
                    className={`flex items-center justify-center w-[22.49vw] h-[5vh]
               text-xs px-[0.7rem] cursor-pointer sm:h-[6vh] sm:text-xl
               ${option === id ? ' bg-orange-500 text-white ' : ' bg-white'} `}
                    onClick={() => setOption(id)}
                  >
                    {data}
                  </div>
                )
              })}
            </div>
          </div> */}
        <div
          className={`grid ${
            displayType === 0 ? ' gap-y-[0.6rem] ' : ' grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-3  '
          } mt-[1rem]`}
        >
          {isSuccess &&
            searchData &&
            searchData?.restaurants.map((restaurant, id) => {
              return (
                <Restaurant
                  key={restaurant._id}
                  displayType={displayType}
                  restaurant={restaurant}
                />
              )
            })}
        </div>
      </div>
    </>
  )
}
