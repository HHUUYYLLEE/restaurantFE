import { useMutation } from '@tanstack/react-query'
import { deleteReview } from '../../../../api/admin.api'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Oval } from 'react-loader-spinner'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { FaTrashAlt } from 'react-icons/fa'
import { IoRestaurant } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { BiDetail } from 'react-icons/bi'
import { FaImages } from 'react-icons/fa6'

export default function Restaurant({ data, setRefetchState }) {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])
  const [showScores, setShowScores] = useState(-1)
  const [showExtraImages, setShowExtraImages] = useState(-1)
  const [reviewId, setReviewId] = useState('')
  const [deleteReviewModal, setDeleteReviewModal] = useState(false)
  const deleteReviewMutation = useMutation({
    mutationFn: (body) => deleteReview(body)
  })
  const submitDeleteReview = () => {
    let formData = {}
    formData.review_id = reviewId
    deleteReviewMutation.mutate(formData, {
      onSuccess: () => {
        setRefetchState((prev) => !prev)
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
  const scoreLabels = ['Chất lượng', 'Giá cả', 'Không gian', 'Vị trí', 'Phục vụ']

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => (
        <div className='rounded-full w-[3rem] h-[3rem] flex items-center overflow-hidden justify-center'>
          <img referrerPolicy='no-referrer' src={url} className='' />
        </div>
      )
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    {
      title: 'Điểm',
      dataIndex: 'average_score',
      key: 'average_score',
      render: (average_score, row) => {
        let scores = [
          row.quality_score,
          row.price_score,
          row.area_score,
          row.location_score,
          row.service_score
        ]
        return (
          <div className=''>
            <div
              onMouseEnter={() => setShowScores(row._id)}
              onMouseLeave={() => setShowScores(-1)}
              className='flex items-center gap-x-1'
            >
              <div
                className={`text-[1.3rem]
            ${
              average_score >= 7
                ? ' text-green-500 '
                : average_score >= 5
                ? ' text-yellow-400 '
                : ' text-red-500 '
            }`}
              >
                {average_score}
              </div>
              <BiDetail style={{ color: 'orange', width: '1.5vw', height: '1.5vw' }} />
            </div>
            {showScores === row._id && (
              <div className='absolute flex gap-x-2 bottom-[7rem] z-[10] bg-white border-orange-500 border-2 rounded-md'>
                {scoreLabels.map((label, id) => {
                  return (
                    <div key={id}>
                      <div
                        className={`flex justify-center
                    ${
                      scores[id] >= 7
                        ? ' text-green-500 '
                        : scores[id] >= 5
                        ? ' text-yellow-400 '
                        : ' text-red-500 '
                    }`}
                      >
                        {scores[id]}
                      </div>
                      <div className='flex justify-center w-[7vw]'>{label}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      }
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images, row) => (
        <>
          {images[0] && (
            <div className=''>
              <div className='flex items-center gap-x-4'>
                <div className='max-w-[10vw] max-h-[10vw]'>
                  <img referrerPolicy='no-referrer' className='w-[10vw] h-[10vw]' src={images[0]} />
                </div>
                {images.length > 1 && (
                  <div className='relative'>
                    <div className='flex items-center gap-x-2'>
                      <div className='text-orange-500 text-[1rem]'>{'+' + (images.length - 1)}</div>

                      <div
                        onMouseEnter={() => setShowExtraImages(row._id)}
                        onMouseLeave={() => setShowExtraImages(-1)}
                      >
                        <FaImages
                          style={{
                            color: 'orange',
                            width: '2vw',
                            height: '2vw'
                          }}
                        />
                      </div>
                    </div>
                    {showExtraImages === row._id && (
                      <div
                        className='absolute flex px-[2rem] bottom-8 left-[-7rem] justify-center items-center  z-[10] gap-x-2 bg-white rounded-md border-2 
            h-[12vw] border-orange-500'
                      >
                        {images.map((url, id) => {
                          if (id > 0 && images.length > 1)
                            return (
                              <div
                                key={id}
                                className='max-w-[10vw] max-h-[10vw] min-w-[10vw] min-h-[10vw]'
                              >
                                <img
                                  referrerPolicy='no-referrer'
                                  className='w-[10vw] h-[10vw]'
                                  src={url}
                                />
                              </div>
                            )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )
    },
    { title: 'Nội dung', dataIndex: 'comment', key: 'comment' },
    {
      title: 'Xử lý',
      render: () => (
        <>
          <button
            onClick={() => setDeleteReviewModal(true)}
            className='flex items-center  justify-center gap-x-2 bg-red-500 hover:bg-red-700 rounded-md px-[0.5rem]'
          >
            <FaTrashAlt style={{ color: 'white' }} />
            <div className='text-white'>Xoá</div>
          </button>
        </>
      )
    }
  ]
  const dataSource = data.reviews.map((review) => {
    review.average_score =
      Math.floor(
        ((review.area_score +
          review.location_score +
          review.price_score +
          review.quality_score +
          review.service_score) /
          5) *
          10
      ) / 10
    return review
  })
  return (
    <>
      <div className='bg-white rounded-md'>
        <Link to={`/restaurant/${data._id}`}>
          <div className='flex items-center gap-x-3 mx-[1rem]'>
            <IoRestaurant
              style={{
                color: 'orange'
              }}
            />
            <div>{data.name}</div>
          </div>
        </Link>
        <hr className='mt-[0.2rem] h-[0.1rem] border-none bg-slate-500' />
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                setReviewId(record._id)
              }
            }
          }}
          columns={columns}
          dataSource={dataSource}
        />
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
        isOpen={deleteReviewModal}
        onRequestClose={() => setDeleteReviewModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Xoá đánh giá?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitDeleteReview()
              setDeleteReviewModal(false)
            }}
            className='flex justify-center items-center 
          bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
          px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
          '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setDeleteReviewModal(false)}
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
        isOpen={deleteReviewMutation.isPending}
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
