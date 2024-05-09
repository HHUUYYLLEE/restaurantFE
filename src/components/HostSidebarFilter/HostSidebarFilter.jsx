import { useContext, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import Switch from 'react-switch'
import { displayNum } from '../../utils/utils'
import { AppContext } from '../../contexts/app.context'
import useQueryConfig from '../../hooks/useQueryConfig'
import {
  minPrice,
  minArea,
  defaultAreaRight,
  defaultPriceRight,
  maxPrice,
  maxArea,
  stepArea,
  stepPrice
} from '../../utils/env'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getServicesCount, getNumberOfPeopleCount } from '../../api/countFilterOptions'
import { PulseLoader } from 'react-spinners'
export default function HostSidebarFilter() {
  const queryConfig = useQueryConfig()

  const [sliderPriceRight, setSliderPriceRight] = useState(
    queryConfig?.price_max !== undefined ? parseInt(queryConfig.price_max) : defaultPriceRight
  )
  const [sliderPriceLeft, setSliderPriceLeft] = useState(
    queryConfig?.price_min !== undefined ? parseInt(queryConfig.price_min) : minPrice
  )
  const [enablePrice, setEnablePrice] = useState(false)
  const [sliderAreaRight, setSliderAreaRight] = useState(
    queryConfig?.area_max !== undefined ? parseInt(queryConfig.area_max) : defaultAreaRight
  )
  const [sliderAreaLeft, setSliderAreaLeft] = useState(
    queryConfig?.area_min !== undefined ? parseInt(queryConfig.area_min) : minArea
  )
  const [enableArea, setEnableArea] = useState(false)
  const [parklingLotToggle, setParkingLotToggle] = useState(
    queryConfig?.is_have_parking_lot !== undefined ? queryConfig.is_have_parking_lot === 'true' : false
  )
  const [newToggle, setNewToggle] = useState(queryConfig?.is_new !== undefined ? queryConfig.is_new === 'true' : false)
  const [highSecurityToggle, setHighSecurityToggle] = useState(
    queryConfig?.is_high_security !== undefined ? queryConfig.is_high_security === 'true' : false
  )
  const [haveOwner, setHaveOwner] = useState(
    queryConfig?.is_have_owner !== undefined ? queryConfig.is_have_owner === 'true' : false
  )
  const [haveBed, setHaveBed] = useState(
    queryConfig?.is_have_bed !== undefined ? queryConfig.is_have_bed === 'true' : false
  )
  const [haveWardrobe, setHaveWardrobe] = useState(
    queryConfig?.is_have_wardrobe !== undefined ? queryConfig.is_have_wardrobe === 'true' : false
  )
  const [haveDiningTable, setHaveDiningTable] = useState(
    queryConfig?.is_have_dinning_table !== undefined ? queryConfig.is_have_dinning_table === 'true' : false
  )
  const [haveRefrigerator, setHaveRefrigerator] = useState(
    queryConfig?.is_have_refrigerator !== undefined ? queryConfig.is_have_refrigerator === 'true' : false
  )
  const [haveTV, setHaveTV] = useState(
    queryConfig?.is_have_television !== undefined ? queryConfig.is_have_television === 'true' : false
  )
  const [haveKitchen, setHaveKitchen] = useState(
    queryConfig?.is_have_kitchen !== undefined ? queryConfig.is_have_kitchen === 'true' : false
  )
  const [haveWashingMachine, setHaveWashingMachine] = useState(
    queryConfig?.is_have_washing_machine !== undefined ? queryConfig.is_have_washing_machine === 'true' : false
  )

  const toggles = [
    {
      id: 1,
      label: 'Khu vực để xe',
      state: parklingLotToggle,
      setState: setParkingLotToggle,
      queryKey: 'is_have_parking_lot'
    },
    {
      id: 2,
      label: 'Mới',
      state: newToggle,
      setState: setNewToggle,
      queryKey: 'is_new'
    },
    {
      id: 3,
      label: 'An ninh cao',
      state: highSecurityToggle,
      setState: setHighSecurityToggle,
      queryKey: 'is_high_security'
    },
    {
      id: 4,
      label: 'Chung chủ',
      state: haveOwner,
      setState: setHaveOwner,
      queryKey: 'is_have_owner'
    }
  ]
  const checks = [
    {
      id: 1,
      label: 'Giường',
      state: haveBed,
      setState: setHaveBed,
      queryKey: 'is_have_bed',
      count: 10
    },
    {
      id: 2,
      label: 'Tủ quần áo',
      state: haveWardrobe,
      setState: setHaveWardrobe,
      queryKey: 'is_have_wardrobe',
      count: 20
    },
    {
      id: 3,
      label: 'Bàn ăn',
      state: haveDiningTable,
      setState: setHaveDiningTable,
      queryKey: 'is_have_dinning_table',
      count: 2
    },
    {
      id: 4,
      label: 'Tủ lạnh',
      state: haveRefrigerator,
      setState: setHaveRefrigerator,
      queryKey: 'is_have_refrigerator',
      count: 5
    },
    {
      id: 5,
      label: 'Tivi',
      state: haveTV,
      setState: setHaveTV,
      queryKey: 'is_have_television',
      count: 8
    },
    {
      id: 6,
      label: 'Bếp núc',
      state: haveKitchen,
      setState: setHaveKitchen,
      queryKey: 'is_have_kitchen',
      count: 6
    },
    {
      id: 7,
      label: 'Máy giặt',
      state: haveWashingMachine,
      setState: setHaveWashingMachine,
      queryKey: 'is_have_washing_machine',
      count: 9
    }
  ]
  const [currentNumOfPeople, setCurrentNumOfPeople] = useState(
    queryConfig?.number_or_people !== undefined ? parseInt(queryConfig?.number_or_people) : 0
  )

  const numOfPeople = [
    {
      label: '1 người',
      value: 1,
      count: 2
    },
    {
      label: '2 người',
      value: 2,
      count: 2
    },
    {
      label: '3 người',
      value: 3,
      count: 4
    },
    {
      label: '4 người',
      value: 4,
      count: 8
    },
    {
      label: '5 người',
      value: 5,
      count: 9
    },
    {
      label: '>5 người',
      value: 6,
      count: 30
    }
  ]
  const keysInResponse = [
    'count_bed',
    'count_wardrobe',
    'count_dining_table',
    'count_refrigerator',
    'count_television',
    'count_kitchen',
    'count_washing_machine',
    'one_people',
    'two_people',
    'three_people',
    'four_people',
    'five_people',
    'six_people'
  ]
  const { setValueQuery } = useContext(AppContext)
  // const {
  //   data: countData,
  //   isSuccess,
  //   isLoading
  // } = useQuery({
  //   queryKey: ['count'],
  //   queryFn: () => {
  //     return Promise.all([getServicesCount(), getNumberOfPeopleCount()])
  //   },
  //   placeholderData: keepPreviousData
  // })
  // // console.log(countData)
  // if (isSuccess) {
  //   checks.forEach((e, index) => {
  //     e.count = countData[0].data[keysInResponse[index]]
  //   })
  //   numOfPeople.forEach((e, index) => {
  //     e.count = countData[1].data[keysInResponse[index + checks.length]]
  //   })
  // }
  return (
    <>
      <div className='border-y-2 mt-[0.5rem]'>
        <div className='flex justify-between my-[0.5rem]'>
          <div className=' text-lg font-andika'>Giá</div>
          <Switch
            name='switch'
            onChange={(value) => {
              setEnablePrice(value)
              if (value === false) setValueQuery((prev) => ({ ...prev, price_min: false, price_max: false }))
              else setValueQuery((prev) => ({ ...prev, price_min: sliderPriceLeft, price_max: sliderPriceRight }))
            }}
            checked={enablePrice}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor='#000000'
          />
        </div>

        <div className='text-[1rem] grid grid-cols-7'>
          <div className='row-start-1 col-span-3 border-2 min-w-[5vw] w-max'>
            <div className={`mx-1 ${enablePrice ? '' : 'opacity-30'}`}>{displayNum(sliderPriceLeft)}</div>
          </div>
          <div className='row-start-1 col-span-1 m-auto'>-</div>
          <div className='row-start-1 col-span-3 border-2 min-w-[5vw] w-max'>
            <div className={`mx-1 ${enablePrice ? '' : 'opacity-30'}`}>{displayNum(sliderPriceRight)}</div>
          </div>
        </div>
        <Slider
          // disabled={!enablePrice}
          range
          allowCross={false}
          className={`mt-[1rem] mb-[1.5rem] ${enablePrice ? '' : 'pointer-events-none'}`}
          value={[sliderPriceLeft, sliderPriceRight]}
          step={stepPrice}
          min={minPrice}
          max={maxPrice}
          defaultValue={[minPrice, defaultPriceRight]}
          onChange={([value1, value2]) => {
            setSliderPriceLeft(value1)
            setSliderPriceRight(value2)
            setValueQuery((prev) => ({ ...prev, price_min: value1, price_max: value2 }))
          }}
          styles={{
            track: { backgroundColor: 'black', height: '0.7rem', opacity: enablePrice ? '100%' : '30%' },
            handle: {
              backgroundColor: 'black',
              height: '1.25rem',
              width: '1.25rem',
              opacity: enablePrice ? '100%' : '30%',
              active: {
                outline: 'none'
              }
            },
            rail: {
              backgroundColor: 'grey',
              height: '0.5rem',
              opacity: enablePrice ? '30%' : '20%',
              borderWidth: '0'
            }
          }}
        ></Slider>
      </div>
      <div className='border-y-2 pb-[1.5rem]'>
        <div className='flex justify-between my-[0.5rem]'>
          <div className='text-lg font-andika'>Diện tích</div>

          <Switch
            name='switch'
            onChange={(value) => {
              setEnableArea(value)
              if (value === false) setValueQuery((prev) => ({ ...prev, area_min: false, area_max: false }))
              else setValueQuery((prev) => ({ ...prev, area_min: sliderAreaLeft, area_max: sliderAreaRight }))
            }}
            checked={enableArea}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor='#000000'
          />
        </div>
      </div>
      <div className='border-b-2 mt-[3rem]'>
        <div className='text-[1rem] grid grid-cols-7 mt-[2rem]'>
          <div className='row-start-1 col-span-3 border-2 min-w-[5vw]  w-max'>
            <div className={`mx-1 ${enableArea ? '' : 'opacity-30'}`}>{displayNum(sliderAreaLeft) + 'm2'}</div>
          </div>
          <div className='row-start-1 col-span-1 m-auto'>-</div>
          <div className='row-start-1 col-span-3 border-2 min-w-[5vw] w-max'>
            <div className={`mx-1 ${enableArea ? '' : 'opacity-30'}`}>{displayNum(sliderAreaRight) + 'm2'}</div>
          </div>
        </div>
        <Slider
          // disabled={!enableArea}
          range
          allowCross={false}
          className={`mt-[1rem] mb-[1.5rem] ${enableArea ? '' : 'pointer-events-none'}`}
          value={[sliderAreaLeft, sliderAreaRight]}
          step={stepArea}
          min={minArea}
          max={maxArea}
          defaultValue={[minArea, defaultAreaRight]}
          onChange={([value1, value2]) => {
            setSliderAreaLeft(value1)
            setSliderAreaRight(value2)
            setValueQuery((prev) => ({ ...prev, area_min: value1, area_max: value2 }))
          }}
          styles={{
            track: { backgroundColor: 'black', height: '0.7rem', opacity: enableArea ? '100%' : '30%' },
            handle: {
              backgroundColor: 'black',
              height: '1.25rem',
              width: '1.25rem',
              opacity: enableArea ? '100%' : '30%'
            },
            rail: {
              backgroundColor: 'grey',
              height: '0.5rem',
              opacity: enableArea ? '30%' : '20%',
              borderWidth: '0'
            }
          }}
        ></Slider>
      </div>

      <div className='border-y-2 mt-[2rem]'>
        {toggles.map((element) => {
          return (
            <div key={element.id} className='flex justify-between my-[1rem]'>
              <div className='font-andika'>{element.label}</div>
              <Switch
                name='switch'
                onChange={(value) => {
                  element.setState(value)
                  setValueQuery((prev) => ({ ...prev, [element.queryKey]: value }))
                }}
                checked={element.state}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor='#000000'
              />
            </div>
          )
        })}
      </div>
      <div className='border-y-2 mt-[2rem]'>
        <div className='my-[0.5rem] text-2xl font-andika'>Nội thất</div>
        {checks.map((element) => {
          return (
            <div key={element.id} className='flex justify-between my-[1rem]'>
              <div className='flex gap-[1rem]'>
                <input
                  type='checkbox'
                  name='checkbox'
                  className='transform scale-150 accent-black'
                  checked={element.state}
                  onChange={(e) => {
                    // console.log(e.target.checked)
                    element.setState(e.target.checked)
                    setValueQuery((prev) => ({ ...prev, [element.queryKey]: e.target.checked }))
                    // console.log(valueQuery)
                  }}
                />
                <div className='font-andika'>{element.label}</div>
              </div>
              {/* {isLoading ? (
                <div>
                  <PulseLoader speedMultiplier={0.7} size={5} color='#36d7b7' />
                </div>
              ) : ( */}
              <div className='opacity-50'>{element.count}</div>
              {/* )} */}
            </div>
          )
        })}
      </div>
      <div className='border-y-2 mt-[2rem]'>
        <div className='my-[0.5rem] text-2xl font-andika'>Số lượng người ở</div>
        {numOfPeople.map((element) => {
          return (
            <div key={element.value} className='flex justify-between my-[1rem]'>
              <div className='flex gap-[1rem]'>
                <input
                  type='radio'
                  name='radio'
                  className='transform scale-150 accent-black'
                  onChange={() => {
                    setCurrentNumOfPeople(element.value)
                    setValueQuery((prev) => ({ ...prev, number_or_people: element.value }))
                  }}
                  checked={currentNumOfPeople === element.value}
                />
                <div className='font-andika'>{element.label}</div>
              </div>
              {/* {isLoading ? (
                <div>
                  <PulseLoader speedMultiplier={0.7} size={5} color='#36d7b7' />
                </div>
              ) : ( */}
              <div className='opacity-50'>{element.count}</div>
              {/* )} */}
            </div>
          )
        })}
      </div>
    </>
  )
}
