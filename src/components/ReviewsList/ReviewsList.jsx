import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaAngleDown, FaAngleUp, FaImages, FaRegStar, FaStar } from 'react-icons/fa'
import { GrUpload } from 'react-icons/gr'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useNavigate, useParams } from 'react-router-dom'
import { createReview } from '../../api/review.api'
import { getAccessTokenFromLS, getInfoFromLS } from '../../utils/auth'
import { reviewSchema } from '../../utils/rules'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import Review from './Review/Review'
export default function ReviewList({ reviews, getReviewSuccess }) {
  const navigate = useNavigate()
  const info = getInfoFromLS()
  const token = getAccessTokenFromLS()
  const { id: restaurant_id } = useParams()
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const [dropDownState, setDropDownState] = useState(false)
  const previewImageElements = [useRef(), useRef(), useRef(), useRef(), useRef()]
  const [invalidScore, setInvalidScore] = useState(false)
  const [score, setScore] = useState([0, 0, 0, 0, 0])
  const scoreNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const scores = ['Vị trí', 'Giá cả', 'Chất lượng', 'Phục vụ', 'Không gian']
  const refDropDown = useRef(null)
  const handleClickOutside = (event) => {
    if (refDropDown.current && !refDropDown.current.contains(event.target)) {
      let i = 0
      if (dropDownState)
        for (const temp of score)
          if (temp === 0) {
            i++
            setInvalidScore(true)
          }
      if (i === 0) setInvalidScore(false)
      setDropDownState(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(reviewSchema)
  })
  const createAReview = useMutation({
    mutationFn: (body) => createReview(body)
  })

  const onSubmit = handleSubmit((data) => {
    for (const temp of score)
      if (temp === 0) {
        setInvalidScore(true)
        return
      }
    data.quality_score = score[2]
    data.service_score = score[3]
    data.location_score = score[0]
    data.price_score = score[1]
    data.area_score = score[4]
    data.restaurant_id = restaurant_id
    console.log(data)
    createAReview.mutate(data, {
      onSuccess: () => {
        navigate(0)
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
  if (getReviewSuccess)
    return (
      <div className=''>
        <div className='bg-white'>
          <div className='flex justify-center items-center '>
            {reviews?.length === 0 && (
              <div className='flex justify-center items-center'>
                <div className='py-[1rem]'>Chưa có đánh giá</div>
              </div>
            )}
          </div>
          {info && token && (
            <div className='mt-[1rem] sm:mx-[1rem] mx-[0.2rem] grid gap-y-2'>
              <div className='flex sm:gap-x-7 justify-center'>
                <div className='sm:w-[8vw] w-[17vw]'></div>
                <div className='flex justify-between w-[65vw]'>
                  <div className='sm:flex sm:gap-x-1 sm:items-center'>
                    <div className='relative' ref={refDropDown}>
                      <div
                        onClick={() => {
                          setInvalidScore(false)
                          if (dropDownState)
                            for (const temp of score)
                              if (temp === 0) {
                                setInvalidScore(true)
                              }
                          setDropDownState(!dropDownState)
                        }}
                        className='bg-orange-500 flex justify-center items-center 
                  italic px-[0.3rem] rounded-md sm:px-[3rem] cursor-pointer sm:py-[0.5rem]'
                      >
                        <div className='text-white sm:text-lg'>Điểm đánh giá</div>
                        <div className='flex justify-end'>
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
                        <div className='absolute w-[93vw] sm:w-[35vw] ml-[-5rem] sm:ml-0'>
                          <div
                            className='border-[0.09rem] border-slate-400 bg-white
                         rounded'
                          >
                            <div className='flex gap-x-1'>
                              <div className='grid gap-y-2 sm:gap-y-3'>
                                {scores.map((data, id) => {
                                  return (
                                    <div key={id}>
                                      <div className='flex gap-x-1 sm:text-[1.2rem]'>
                                        <div className=''>{data}:</div>
                                        <div></div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className='grid gap-y-3 sm:gap-y-4'>
                                {scores.map((data, id) => {
                                  return (
                                    <div key={id} className='flex gap-x-1'>
                                      {scoreNumbers.map((data, i) => {
                                        return (
                                          <div key={i}>
                                            {parseInt(score[id]) >= i + 1 ? (
                                              <div
                                                className='cursor-pointer'
                                                onClick={() => {
                                                  setScore(
                                                    score.map((data, index) => {
                                                      if (index === id) data = i + 1
                                                      return data
                                                    })
                                                  )
                                                }}
                                              >
                                                <FaStar
                                                  style={{
                                                    color: 'orange',
                                                    width: screen.width < 640 ? '' : '2vw',
                                                    height: screen.width < 640 ? '' : '2vw'
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <div
                                                className='cursor-pointer'
                                                onClick={() => {
                                                  setScore(
                                                    score.map((data, index) => {
                                                      if (index === id) data = i + 1
                                                      return data
                                                    })
                                                  )
                                                }}
                                              >
                                                <FaRegStar
                                                  style={{
                                                    color: 'orange',
                                                    width: screen.width < 640 ? '' : '2vw',
                                                    height: screen.width < 640 ? '' : '2vw'
                                                  }}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                      <div className='flex sm:mt-[0.2rem]'>
                                        <span
                                          className={` text-sm sm:text-[1.4rem]
                                  ${
                                    score[id] === 10
                                      ? ' text-green-500 '
                                      : score[id] === 1
                                      ? ' text-red-500 '
                                      : ' text-orange-500 '
                                  }`}
                                        >
                                          {score[id] === 0 ? `\u00A0\u00A0\u00A0\u00A0` : score[id]}
                                        </span>
                                        <span className='text-sm sm:text-[1.4rem]'>/</span>
                                        <span className='text-green-500 text-sm sm:text-[1.4rem]'>
                                          10
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {invalidScore && <div className='text-red-500'>Hãy đánh giá</div>}
                  </div>
                  <button
                    type='submit'
                    form='review'
                    className=' bg-green-500 
                rounded-lg text-white px-[0.5rem] sm:px-[0.9rem] italic'
                  >
                    Đăng
                  </button>
                </div>
              </div>
              <div className='flex justify-between sm:justify-center sm:gap-x-7'>
                <div
                  className='sm:max-w-[8vw] sm:max-h-[8vw] 
            rounded-full overflow-hidden flex max-w-[17vw] max-h-[17vw]'
                >
                  <img
                    referrerPolicy='no-referrer'
                    className='sm:w-[8vw] sm:h-[8vw] flex w-[17vw] h-[17vw]'
                    src={info?.avatar_url}
                  />
                </div>
                <form id='review' onSubmit={onSubmit}>
                  <div>
                    <textarea
                      {...register('comment')}
                      name='comment'
                      id='comment'
                      placeholder='Viết đánh giá'
                      className='border-[0.2rem] rounded-lg 
              px-[0.5rem] py-[0.4rem] focus:outline-none
              border-slate-200 w-[65vw] resize-none h-[15vh] sm:h-[20vh]'
                    ></textarea>
                    <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600 mb-1'>
                      {errors.comment?.message}
                    </div>
                    <div>
                      <input
                        type='file'
                        id='images'
                        name='images'
                        accept='image/*'
                        {...register('images')}
                        className='z-[-1000] absolute left-0'
                        multiple
                        onChange={(e) => {
                          for (const element of previewImageElements) {
                            element.current.src = '#'
                            element.current.style.display = 'none'
                          }
                          if (e.target.files) {
                            if (e.target.files.length <= 5) {
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
                      <div className='mb-[1rem]'>
                        <label htmlFor='images'>
                          <div
                            className='flex hover:bg-green-500 cursor-pointer justify-center
                    gap-x-2 sm:gap-x-4 sm:px-[1rem] sm:py-[0.6rem] items-center
                     px-[0.4rem] py-[0.3rem] rounded-lg bg-orange-500'
                          >
                            <FaImages
                              style={{
                                color: 'white',
                                width: screen.width < 640 ? '5vw' : '2vw',
                                height: screen.width < 640 ? '5vw' : '2vw'
                              }}
                            />
                            <GrUpload
                              style={{
                                color: 'white',
                                width: screen.width < 640 ? '5vw' : '2vw',
                                height: screen.width < 640 ? '5vw' : '2vw'
                              }}
                            />
                          </div>
                          <div className='flex justify-center text-orange-500'>Tối đa 5 ảnh</div>
                        </label>
                        <div className='flex justify-between gap-x-[0.1rem] sm:gap-x-0'>
                          {previewImageElements.map((element, key) => {
                            return (
                              <div key={key}>
                                <img
                                  src='#'
                                  className='w-[11vw] h-[11vw]'
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                  ref={element}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className='mt-[2rem] bg-white'>
          {reviews?.map((data, id) => {
            return <Review key={id} review={data} />
          })}
        </div>
        {createAReview.isPending && (
          <>
            <Modal
              style={{
                overlay: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 20
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
              isOpen={true}
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
        )}
      </div>
    )
}
