import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import Checkbox from 'react-custom-checkbox'
import { FaAngleDown, FaAngleUp, FaChair, FaCheckCircle } from 'react-icons/fa'
import { IoIosPin } from 'react-icons/io'
import { IoPeopleSharp } from 'react-icons/io5'
import { PiGridFourFill, PiListLight } from 'react-icons/pi'
import { VscTriangleLeft, VscTriangleRight } from 'react-icons/vsc'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { searchRestaurantsAndFood } from '../../api/restaurants.api'
import mapround from '../../asset/img/mapround.png'
import nothingIcon from '../../asset/img/nothing.png'
import spinningload from '../../asset/img/spinning_load.gif'
import { HN, TPHCM, categories } from '../../constants/optionsList'
import useQueryConfig from '../../hooks/useQueryConfig'
import Food from './Food/Food'
import Restaurant from './Restaurant/Restaurant'

export default function SearchResults() {
  const [mode, setMode] = useState(1)
  const params = useQueryConfig()
  const [option, setOption] = useState(0)
  const [displayType, setDisplayType] = useState(0)
  const options = ['Nhà hàng', 'Món ăn']
  const [HNfilter, setHNfilter] = useState(HN)
  const [TPHCMfilter, setTPHCMfilter] = useState(TPHCM)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [chair, setChair] = useState('')
  const [table, setTable] = useState('')
  const options3 = ['Hà Nội', 'TP.HCM']
  const optionsSearch = ['Hà Nội', 'Thành phố Hồ Chí Minh']
  const [addressValue, setAddressValue] = useState('Hà Nội')
  const [category, setCategory] = useState([])
  const [sortByScore, setSortByScore] = useState(0)
  const [sortByPrice, setSortByPrice] = useState('')
  const [borough, setBorough] = useState('Quận/Huyện/Thị xã')
  const [dropDownState, setDropDownState] = useState(false)
  const refDropDown = useRef(null)
  const [dropDown2State, setDropDown2State] = useState(false)
  const refDropDown2 = useRef(null)
  const options2 = ['Tất cả', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10']
  const options4 = ['Không sắp xếp', 'Thấp đến cao', 'Cao đến thấp']

  const [displayOption2, setDisplayOption2] = useState('Tất cả')
  const handleClickOutside = (event) => {
    if (refDropDown.current && !refDropDown.current.contains(event.target)) {
      setDropDownState(false)
    }
    if (refDropDown2.current && !refDropDown2.current.contains(event.target)) {
      setDropDown2State(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  // console.log(params)
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: [
      'searchRestaurantsAndFood',
      params,
      mode,
      addressValue,
      page,
      limit,
      category,
      sortByScore,
      sortByPrice,
      chair,
      table
    ],
    queryFn: () => {
      return searchRestaurantsAndFood({
        ...params,
        mode,
        page: page,
        limit: limit,
        address: addressValue === 'Quận/Huyện/Thị xã' ? '' : addressValue,
        category: category,
        sortByScore: sortByScore,
        sortByPrice: sortByPrice,
        chair: chair,
        table: table
      })
    },
    keepPreviousData: true,
    staleTime: 1000
  })
  const searchData = data?.data

  return (
    <>
      <div className={`w-full flex  gap-x-3 sm:gap-x-8`}>
        <div className='mt-[2.6rem] sm:mt-[3.7rem] 2xl:mt-[4.3rem] w-[22vw] sm:w-[15vw]'>
          {mode === 1 &&
            categories.map((option, id) => {
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
                        <div
                          className='text-[0.5rem] sm:text-[0.8rem] 
                        2xl:text-[0.5rem] sm:w-full sm:flex sm:justify-center'
                        >
                          {option}
                        </div>
                      </div>
                    </button>
                    <hr
                      className='h-[0.06rem] sm:h-[0.15rem] sm:mt-[-0.23rem] 
                  2xl:mt-[-0.1rem] sm:w-[15vw] border-none bg-orange-500'
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
          <Link to='/search_location'>
            <div
              className='bg-orange-500 px-[0.2rem] h-[26.3vh] mt-[2.8rem] 
              sm:mt-0 sm:h-[53.4vh] w-[22vw] sm:w-[15vw]
                '
            >
              <div
                className=' w-[20vw] sm:w-full text-[0.7rem] sm:text-[1.3rem] h-[5vh] 
            flex justify-center'
              >
                <div className='text-center text-white italic'>
                  Không tìm thấy gì ưng ý? Thử tìm kiếm theo phạm vi quanh nhà bạn!
                </div>
              </div>
              <div className='w-[20vw] sm:w-full sm:h-[20vw] flex justify-center'>
                <img className='mt-[4.5rem] sm:mt-[6rem]' src={mapround} />
              </div>
            </div>
          </Link>
        </div>

        <div className='w-full'>
          <div className='flex justify-between'>
            <div className='text-[0.6rem] sm:text-lg '>
              {mode === 1 && (
                <>
                  <span>Tìm thấy&nbsp;</span>
                  <span className='italic font-bold text-orange-500'>
                    {isSuccess && !isError ? searchData?.restaurants?.length : '0'}&nbsp;
                  </span>
                  <span>nhà hàng&nbsp;</span>
                  <span className='italic font-bold text-orange-500'>
                    &quot;{params.search}&quot;:&nbsp;
                  </span>
                </>
              )}
              {mode === 2 && (
                <>
                  <span>Tìm thấy&nbsp;</span>
                  <span className='italic font-bold text-orange-500'>
                    {isSuccess && !isError ? searchData?.allFood?.length : '0'}&nbsp;
                  </span>
                  <span>món ăn&nbsp;</span>
                  <span className='italic font-bold text-orange-500'>
                    &quot;{params.search}&quot;:&nbsp;
                  </span>
                </>
              )}
            </div>
            <div className='flex gap-x-2 sm:gap-x-8'>
              <Link to='/search_location'>
                <div
                  className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md cursor-pointer
                  hover:bg-slate-200
                `}
                  onClick={() => setDisplayType(0)}
                >
                  <IoIosPin
                    style={{
                      width: screen.width < 640 ? '7vw' : '3.5vw',
                      height: screen.width < 640 ? '7vw' : '3.5vw',
                      color: '#F97316'
                    }}
                  />
                </div>
              </Link>
              <div
                className={`h-[3.5vh] sm:h-[7vh] 2xl:h-[7.4vh] rounded-md cursor-pointer
                  hover:bg-slate-200 bg-[#EEE]
                ${displayType === 0 ? ' bg-[#a5909079] ' : '  '}
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
          <div className='bg-white mt-[1rem]'>
            <div className='grid grid-cols-2'>
              {options.map((data, id) => {
                return (
                  <div
                    key={id}
                    className={`flex items-center justify-center  h-[5vh]
               text-xs px-[0.7rem] cursor-pointer sm:h-[6vh] sm:text-xl
               ${mode === id + 1 ? ' bg-orange-500 text-white ' : ' bg-white'} `}
                    onClick={() => {
                      setMode(id + 1)
                    }}
                  >
                    {data}
                  </div>
                )
              })}
            </div>
          </div>
          {mode === 1 && (
            <div className='bg-slate-200 mt-[1rem] py-2'>
              <div className='border-b-[0.05rem] border-black'>
                <div
                  className='mx-2 mb-2 grid grid-cols-[1fr_1fr_2fr] 
              sm:grid-cols-[2fr_2fr_3fr] gap-x-[0.3rem] sm:gap-x-[4rem]'
                >
                  {options3.map((data, id) => {
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
          )}
          {mode === 2 && (
            <div className='w-full bg-slate-200 h-[5vh] sm:h-[10vh] flex items-center'>
              <div className='flex items-center sm:mx-[1.5rem] sm:my-[1.2rem] mx-[0.3rem] my-[0.5rem] gap-x-2 sm:gap-x-3'>
                <div className='text-[0.8rem] sm:text-[1.3rem] italic'>Giá:</div>

                <div className='relative' ref={refDropDown2}>
                  <div
                    onClick={() => {
                      setDropDown2State(!dropDown2State)
                    }}
                  >
                    <div
                      className={`flex items-center justify-between h-[3vh] 
                      rounded-md w-[25vw] sm:w-[15vw] px-[0.3rem] sm:px-[0.8rem]
                    cursor-pointer sm:h-[6vh] bg-orange-500
  `}
                    >
                      <div className='flex justify-center w-full'>
                        <div className={`text-[0.8rem] sm:text-xl text-white`}>
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
                    <div className='absolute w-[25vw] sm:w-[15vw]'>
                      <div
                        className='border-[0.09rem] border-slate-400
       rounded '
                      >
                        {options4.map((option, id) => {
                          return (
                            <div
                              key={id}
                              className='cursor-pointer bg-white text-[0.5rem]'
                              onClick={() => {
                                setPage(1)
                                setSortByPrice(id === 0 ? '' : id === 1 ? 1 : -1)
                                setDropDown2State(false)
                              }}
                            >
                              <div
                                className='text-[0.5rem] sm:text-[0.9rem] 
                                flex items-center h-[2.4vh] 
                  sm:h-[4vh] border-b-[0.11rem] hover:bg-slate-400'
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
          )}
          {isLoading && (
            <div className='flex items-center justify-center'>
              <img className='w-[20vw] sm:w-[11vw]' src={spinningload}></img>
            </div>
          )}
          {isError && (
            <div className='flex items-center justify-center'>
              <img className='w-[20vw] sm:w-[11vw]' src={nothingIcon}></img>
            </div>
          )}
          <div
            className={`grid ${
              displayType === 0
                ? ' gap-y-[0.6rem] '
                : ' grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-3  '
            } mt-[1rem]`}
          >
            {mode === 1 &&
              isSuccess &&
              searchData.restaurants.map((restaurant, id) => {
                return (
                  <Restaurant
                    key={restaurant._id}
                    displayType={displayType}
                    restaurant={restaurant}
                  />
                )
              })}

            {mode === 2 &&
              isSuccess &&
              searchData.allFood.map((food, id) => {
                return <Food key={id} displayType={displayType} food={food} />
              })}
          </div>
          {isSuccess && (
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
                pageCount={searchData?.totalPages}
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
