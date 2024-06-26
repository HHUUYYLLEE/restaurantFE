import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconContext } from 'react-icons'
import { BiCommentEdit, BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { FaAngleDown, FaAngleUp, FaImages, FaRegStar, FaStar } from 'react-icons/fa'
import { FaTrashCan } from 'react-icons/fa6'
import { GrUpload } from 'react-icons/gr'
import { IoIosWarning } from 'react-icons/io'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import {
  deleteReview,
  likeDislikeReview,
  reportReview,
  updateReview
} from '../../../api/review.api'
import { getAccessTokenFromLS, getInfoFromLS } from '../../../utils/auth'
import { reviewSchema } from '../../../utils/rules'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'

export default function Review({ review }) {
  const navigate = useNavigate()
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const info = getInfoFromLS(),
    token = getAccessTokenFromLS()

  const [verifyReport, setVerifyReport] = useState(false)
  const [verifyDelete, setVerifyDelete] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const [dropDownState, setDropDownState] = useState(false)
  const previewImageElements = [useRef(), useRef(), useRef(), useRef(), useRef()]
  const [invalidScore, setInvalidScore] = useState(false)
  const [score, setScore] = useState([
    review.location_score,
    review.price_score,
    review.quality_score,
    review.service_score,
    review.area_score
  ])
  const defaultScores = [
    review.location_score,
    review.price_score,
    review.quality_score,
    review.service_score,
    review.area_score
  ]
  const [showDetailsMobile, setShowDetailsMobile] = useState(false)
  const [likeDislikeCounter, setLikeDislikeCounter] = useState(review.likeCounter)
  const [likeDislike, setLikeDislike] = useState(review.userLikeDislike)
  const scoreNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const scores = ['Vị trí', 'Giá cả', 'Chất lượng', 'Phục vụ', 'Không gian']
  const dataScores = [
    review.location_score,
    review.price_score,
    review.quality_score,
    review.service_score,
    review.area_score
  ]
  const [edit, setEdit] = useState(false)
  const refDropDown = useRef(null)
  const refDropDown2 = useRef(null)
  const average_score =
    Math.round(
      ((review.price_score +
        review.area_score +
        review.location_score +
        review.service_score +
        review.quality_score) /
        5) *
        10
    ) / 10
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
  const handleClickOutside2 = (event) => {
    if (refDropDown2.current && !refDropDown2.current.contains(event.target)) {
      setShowDetailsMobile(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousedown', handleClickOutside2)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('mousedown', handleClickOutside2)
    }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'all',
    resolver: yupResolver(reviewSchema)
  })

  const updateAReview = useMutation({
    mutationFn: (body) => updateReview(body)
  })
  const deleteAReview = useMutation({
    mutationFn: (body) => deleteReview(body)
  })
  const likeDislikeAReview = useMutation({
    mutationFn: (body) => likeDislikeReview(body)
  })
  const reportAReview = useMutation({ mutationFn: (body) => reportReview(body) })

  const submitLike = () => {
    let data = {}
    data.review_id = review._id
    if (likeDislike === 'like') {
      data.vote = 'none'
      setLikeDislikeCounter(likeDislikeCounter - 1)
      setLikeDislike('none')
    } else {
      data.vote = 'like'
      if (likeDislike === 'none' || likeDislike === '')
        setLikeDislikeCounter(likeDislikeCounter + 1)
      else setLikeDislikeCounter(likeDislikeCounter + 2)
      setLikeDislike('like')
    }
    console.log(data)
    likeDislikeAReview.mutate(data, {
      onSuccess: () => {},
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  }
  const submitDislike = () => {
    let data = {}
    data.review_id = review._id
    if (likeDislike === 'dislike') {
      data.vote = 'none'
      setLikeDislikeCounter(likeDislikeCounter + 1)
      setLikeDislike('none')
    } else {
      data.vote = 'dislike'
      if (likeDislike === 'none' || likeDislike === '')
        setLikeDislikeCounter(likeDislikeCounter - 1)
      else setLikeDislikeCounter(likeDislikeCounter - 2)
      setLikeDislike('dislike')
    }
    console.log(data)
    likeDislikeAReview.mutate(data, {
      onSuccess: () => {},
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
  }
  const submitReport = () => {
    let data = {}
    data.review_id = review._id
    reportAReview.mutate(data, {
      onSuccess: () => {
        setReportSuccess(true)
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
  }
  const submitDelete = () => {
    let data = {}
    data.review_id = review._id
    deleteAReview.mutate(data, {
      onSuccess: () => {
        setVerifyDelete(true)
        navigate(0)
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
  }
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
    data.review_id = review._id
    console.log(data)
    updateAReview.mutate(data, {
      onSuccess: () => {
        navigate(0)
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
  const firstDate = new Date(review.updatedAt).getTime()
  const secondDate = Date.now()
  const diffTime = Math.abs(secondDate - firstDate)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  let diffHours, diffMinutes
  if (diffDays === 0) {
    diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      diffMinutes = Math.floor(diffTime / (1000 * 60))
    }
  }

  return (
    <div className=''>
      {edit && (
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
              <div className='flex gap-x-1 sm:gap-x-4'>
                <button
                  type='submit'
                  form='updatereview'
                  className=' bg-green-500 
        rounded-lg text-white px-[0.5rem] sm:px-[0.9rem] italic'
                >
                  Sửa
                </button>
                <button
                  type='button'
                  className=' bg-red-500 
        rounded-lg text-white px-[0.5rem] sm:px-[0.9rem] italic'
                  onClick={() => {
                    setScore(defaultScores)
                    setEdit(false)
                    reset()
                  }}
                >
                  Huỷ
                </button>
              </div>
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
            <form id='updatereview' onSubmit={onSubmit}>
              <div>
                <textarea
                  {...register('comment')}
                  defaultValue={review.comment}
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
                    id='updateImages'
                    name='updateImages'
                    accept='image/*'
                    {...register('images')}
                    className='z-[-1000] left-0 absolute'
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
                    <label htmlFor='updateImages'>
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
                      <div className='flex justify-center text-orange-500'>
                        Up lại các ảnh khác (tối đa 5 ảnh)
                      </div>
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

      {!edit && (
        <div
          className={`pt-[1rem] pb-[1rem] sm:px-[1rem] px-[0.2rem] grid gap-y-2
        ${review.status === 3 ? ' bg-green-100 ' : ''}`}
        >
          <div className='flex sm:gap-x-7 justify-center mt-[1rem]'>
            <div className='sm:w-[8vw] w-[17vw]'>
              {review.status === 3 && (
                <div className='flex items-center gap-x-[0.1rem] sm:gap-x-1'>
                  <div className='italic text-green-700 sm:text-base text-xs'>Blogger đánh giá</div>
                </div>
              )}
            </div>
            <div className='flex w-[65vw] sm:gap-x-[2rem] justify-between'>
              <div>
                <div
                  className='flex sm:gap-x-3 gap-x-1'
                  ref={refDropDown2}
                  onClick={() => {
                    setShowDetailsMobile(!showDetailsMobile)
                  }}
                >
                  <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw] relative rounded-full '>
                    <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  rounded-full  '>
                      <div className='w-[11vw] h-[11vw] sm:w-[5vw] sm:h-[5vw]  inline-block '>
                        <div
                          className={`inline-block text-[1rem] mt-[50%] ml-[50%] 
                    translate-x-[-50%] translate-y-[-50%] sm:text-[1.3rem] 2xl:text-[1.6rem] first-letter:${
                      average_score >= 7
                        ? ' text-green-500 '
                        : average_score >= 5
                        ? ' text-yellow-400 '
                        : ' text-red-500 '
                    }`}
                        >
                          {average_score}
                        </div>
                      </div>
                    </div>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      version='1.1'
                      width={`${screen.width < 640 ? '11vw' : '5vw'}`}
                      height={`${screen.width < 640 ? '11vw' : '5vw'}`}
                      className='absolute top-0 left-0'
                      id='svg_circle'
                      strokeDasharray={screen.width >= 1536 ? 190 : screen.width >= 640 ? 160 : 113}
                      strokeDashoffset={
                        screen.width >= 1536
                          ? 190 * (1 - average_score / 10)
                          : screen.width >= 640
                          ? 160 * (1 - average_score / 10)
                          : 113 * (1 - average_score / 10)
                      }
                      transform='rotate(-90)'
                    >
                      <circle
                        cx={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                        cy={`${screen.width < 640 ? '5.5vw' : '2.5vw'}`}
                        r={`${screen.width < 640 ? '5vw' : '2vw'}`}
                        strokeLinecap='round'
                        className={`fill-none stroke-[0.5vw] ${
                          average_score >= 7
                            ? ' stroke-green-500 '
                            : average_score >= 5
                            ? ' stroke-yellow-400 '
                            : ' stroke-red-500 '
                        }}`}
                      ></circle>
                    </svg>

                    {showDetailsMobile && screen.width < 640 && (
                      <div className='absolute ml-[-2.5rem] w-[70vw] bg-white border-orange-500 border rounded-md'>
                        <div className='grid grid-cols-3 gap-x-3 gap-y-2 mx-[0.5rem] my-[0.4rem]'>
                          {dataScores.map((data, i) => {
                            return (
                              <div key={i} className=''>
                                <div className='text-center'>
                                  <div>
                                    <div
                                      className={`text-[0.8rem] ${
                                        data >= 7
                                          ? ' text-green-500 '
                                          : data >= 5
                                          ? ' text-yellow-400 '
                                          : ' text-red-500 '
                                      }`}
                                    >
                                      {data}
                                    </div>
                                    <div className='text-xs text-slate-500'>{scores[i]}</div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {screen.width < 640 && (
                    <div className='flex items-center'>
                      <div className='flex justify-center rounded-md px-[0.3rem] py-[0.2rem] items-center bg-orange-500'>
                        <div className='text-white text-xs'>Chi tiết điểm đánh giá</div>
                        {showDetailsMobile ? (
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
                  )}
                  <div className='flex items-center'>
                    {screen.width >= 640 &&
                      dataScores.map((data, i) => {
                        return (
                          <div key={i} className='w-[7rem] '>
                            <div className='text-center'>
                              <div>
                                <div
                                  className={`text-[1.5rem] ${
                                    data >= 7
                                      ? ' text-green-500 '
                                      : data >= 5
                                      ? ' text-yellow-400 '
                                      : ' text-red-500 '
                                  }`}
                                >
                                  {data}
                                </div>
                                <div className='text-xs text-slate-500'>{scores[i]}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
              <div className='flex items-center'>
                {info?._id === review.user_id ? (
                  <div className='flex items-center gap-x-3 sm:gap-x-[2rem]'>
                    <div
                      className='hover:bg-slate-200 cursor-pointer'
                      onClick={() => setEdit(true)}
                    >
                      <BiCommentEdit
                        style={{
                          color: 'orange',
                          width: screen.width < 640 ? '4vw' : '2vw',
                          height: screen.width < 640 ? '4vw' : '2vw'
                        }}
                      />
                    </div>
                    <div
                      className='hover:bg-slate-200 cursor-pointer'
                      onClick={() => setVerifyDelete(true)}
                    >
                      <FaTrashCan
                        style={{
                          color: 'red',
                          width: screen.width < 640 ? '4vw' : '2vw',
                          height: screen.width < 640 ? '4vw' : '2vw'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  info &&
                  token && (
                    <div
                      className='flex 
                  hover:bg-slate-100 cursor-pointer items-center justify-center'
                      onClick={() => setVerifyReport(true)}
                    >
                      <div className=''>
                        <IoIosWarning
                          style={{
                            color: '#ff5b05',
                            width: screen.width < 640 ? '4vw' : '2vw',
                            height: screen.width < 640 ? '4vw' : '2vw'
                          }}
                        />
                      </div>
                      <div className='text-[0.5rem] sm:text-base text-[#ff5b05]'>Báo cáo</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className='flex justify-between sm:justify-center sm:gap-x-7'>
            <div>
              <div
                className='sm:max-w-[8vw] sm:max-h-[8vw] 
    rounded-full overflow-hidden flex max-w-[17vw] max-h-[17vw]'
              >
                <img
                  className='sm:w-[8vw] sm:h-[8vw] flex w-[17vw] h-[17vw]'
                  src={review.avatar_url}
                  referrerPolicy='noreferrer'
                />
              </div>
              <div
                className='flex justify-center sm:text-[1.2rem] max-w-[17vw] sm:max-w-[9vw] 
               text-ellipsis line-clamp-1 text-[0.5rem]'
              >
                {review.username}
              </div>
              <div className='flex justify-center italic text-slate-400 sm:text-base text-xs'>
                {diffDays == 0
                  ? diffHours == 0
                    ? diffMinutes + ' phút trước'
                    : diffHours + ' giờ trước'
                  : diffDays + ' ngày trước'}
              </div>
              <div className='flex justify-center items-center gap-x-1 sm:gap-x-2'>
                <div className='cursor-pointer' onClick={submitLike}>
                  <IconContext.Provider
                    value={{
                      color: likeDislike === 'like' ? 'orange' : 'gray',
                      className: 'likeButton'
                    }}
                  >
                    <BiSolidLike
                      style={{
                        width: screen.width < 640 ? '5vw' : '2.5vw',
                        height: screen.width < 640 ? '5vw' : '2.5vw'
                      }}
                    />
                  </IconContext.Provider>
                </div>
                <div
                  className={`sm:text-[1.5rem]
                ${
                  likeDislikeCounter < 0
                    ? ' text-red-500 '
                    : likeDislikeCounter > 0
                    ? ' text-green-500 '
                    : ''
                }`}
                >
                  {likeDislikeCounter}
                </div>
                <div className='cursor-pointer' onClick={submitDislike}>
                  <IconContext.Provider
                    value={{
                      color: likeDislike === 'dislike' ? 'purple' : 'gray',
                      className: 'dislikeButton'
                    }}
                  >
                    <BiSolidDislike
                      style={{
                        width: screen.width < 640 ? '5vw' : '2.5vw',
                        height: screen.width < 640 ? '5vw' : '2.5vw'
                      }}
                    />
                  </IconContext.Provider>
                </div>
              </div>
            </div>

            <div>
              <div className='flex gap-x-2'>
                {review.images.map((data, i) => {
                  return (
                    <div key={i} className='max-w-[11vw] max-h-[11vw]'>
                      <img referrerPolicy='no-referrer' className='w-[11vw] h-[11vw]' src={data} />
                    </div>
                  )
                })}
              </div>
              <textarea
                name='comment'
                id='comment'
                disabled
                defaultValue={review.comment}
                placeholder='Viết đánh giá'
                className='border-[0.1rem] rounded-lg mt-[1rem]
      px-[0.5rem] py-[0.4rem] focus:outline-none
      border-orange-500 w-[65vw] resize-none h-[15vh] sm:h-[20vh]'
              ></textarea>
            </div>
          </div>
        </div>
      )}
      <hr className='h-[0.1rem] border-none bg-gray-400' />
      {updateAReview.isPending && (
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
            backgroundColor: 'rgb(234,88,12)',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={verifyReport}
        onRequestClose={() => setVerifyReport(false)}
      >
        {!reportSuccess ? (
          <div>
            <div className='font-inter-700 sm:text-2xl text-white'>Báo cáo đánh giá này?</div>
            <div className='sm:mt-[8vh] mt-[2vh] flex justify-between'>
              <button
                onClick={submitReport}
                className='flex justify-center items-center 
            bg-green-500 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.6rem] sm:text-lg text-sm
            '
              >
                Có
              </button>
              <button
                onClick={() => setVerifyReport(false)}
                className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className='font-inter-700 sm:text-2xl text-white'>Báo cáo thành công</div>
            <div className='sm:mt-[8vh] mt-[2vh] flex justify-center'>
              <button
                onClick={() => {
                  setReportSuccess(false)
                  setVerifyReport(false)
                }}
                className='flex justify-center items-center bg-green-500 hover:bg-red-900 
          text-white font-inter-700 rounded-lg
          px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
              >
                OK
              </button>
            </div>
          </div>
        )}
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
            zIndex: 20
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            backgroundColor: 'rgb(234,88,12)',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={verifyDelete}
        onRequestClose={() => setVerifyDelete(false)}
      >
        <div>
          <div className='font-inter-700 sm:text-2xl text-white'>Xoá đánh giá này?</div>
          <div className='sm:mt-[8vh] mt-[2vh] flex justify-between'>
            <button
              onClick={submitDelete}
              className='flex justify-center items-center 
            bg-green-500 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.6rem] sm:text-lg text-sm
            '
            >
              Có
            </button>
            <button
              onClick={() => setVerifyDelete(false)}
              className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
            >
              Huỷ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
