import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaFood } from '../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { displayNum } from '../../../utils/utils'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { addFood } from '../../../api/food.api'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { AiOutlineClose } from 'react-icons/ai'
import { TailSpin } from 'react-loader-spinner'

export default function AddFoodModal({ closeAddFoodModal, restaurant_id }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaFood)
  })
  const [previewImage, setPreviewImage] = useState('#')
  const previewImageElement = useRef()
  useEffect(() => {
    Modal.setAppElement('body')
  })
  const addFoodMutation = useMutation({
    mutationFn: (body) => addFood(body)
  })

  const onSubmit = handleSubmit((data) => {
    data.restaurant_id = restaurant_id
    data.quantity = parseInt(data.quantity)
    data.price = parseInt(data.price.replace(/\D/g, ''))
    data.status = 1
    data.image = data.image[0]
    console.log(data)
    addFoodMutation.mutate(data, {
      onSuccess: () => {
        // toast.success('Tạo món ăn thành công!') //。(20)
        window.location.reload()
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

  return (
    <div className='modal'>
      <div
        className='overlay'
        onClick={() => {
          closeAddFoodModal()
          setPreviewImage('#')
        }}
      ></div>
      <div className='modal-content bg-white flex justify-center'>
        <div className='relative'>
          <div
            onClick={() => {
              closeAddFoodModal()
              setPreviewImage('#')
            }}
            className='absolute right-0 top-[-0.5rem] rounded-full transition-all duration-300  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 flex justify-center items-center h-8 w-8  dark:text-yellow-400 font-extrabold'
          >
            <AiOutlineClose />
          </div>

          <div className='w-full justify-between items-center'>
            <div className='font-inter-700 text-3xl'>Thêm một món ăn</div>
          </div>
          <form className='w-full' onSubmit={onSubmit} noValidate>
            <div className='mt-[1rem] flex gap-10'>
              <div>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Tên món ăn'
                  autoComplete='on'
                  {...register('name')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl  py-2 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.name?.message}
                </div>
              </div>
              <div>
                <input
                  type='number'
                  id='quantity'
                  name='quantity'
                  placeholder='Số lượng'
                  autoComplete='on'
                  {...register('quantity')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl  py-2 px-[2rem]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.quantity?.message}
                </div>
              </div>
            </div>
            <input
              type='text'
              id='price'
              name='price'
              placeholder='Giá'
              {...register('price')}
              onInput={(e) => {
                console.log(e.target.value)
                e.target.value = displayNum(e.target.value)
              }}
              className='focus:outline-[#8AC0FF] w-full priceInput placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-xl rounded-xl  py-2 px-[2rem]'
            />
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
              {errors.price?.message}
            </div>

            <div>
              <textarea
                type='text'
                id='desc'
                name='desc'
                placeholder='Mô tả'
                autoComplete='off'
                {...register('desc')}
                className='resize-none h-[18vh] w-full focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400 border font-inter-500 border-[#E6E6E6] text-lg rounded-xl py-[0.7rem] px-[2rem]'
              />

              <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                {errors.desc?.message}
              </div>
            </div>

            <div className='mt-[3rem] flex'>
              <div>
                <div>Ảnh minh hoạ</div>
                <input
                  type='file'
                  id='image'
                  name='image'
                  accept='image/*'
                  {...register('image')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] placeholder:font-inter-400  font-inter-500 border-[#E6E6E6] w-full py-6'
                  onChange={(e) => {
                    const [file] = e.target.files
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file))
                      previewImageElement.current.style.visibility = 'visible'
                    }
                  }}
                />
                <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
                  {errors.avatar?.message}
                </div>
              </div>
              <img
                src={previewImage}
                className='w-[10rem] h-[10rem]'
                onError={(e) => {
                  e.target.style.visibility = 'hidden'
                }}
                ref={previewImageElement}
              />
            </div>
            <div className='mt-1 flex min-h-[1.75rem] text-lg text-red-600'>
              {errors.image?.message}
            </div>

            <div className='w-full flex justify-center items-center mt-[2rem]'>
              <button className='bg-[#0366FF] hover:bg-green-500  text-white py-[1.2rem] px-[7rem] font-ibm-plex-serif-700 rounded-lg'>
                Xác nhận
              </button>
            </div>
          </form>
          <Modal
            style={{
              overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 28
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
                borderRadius: '1rem',
                zIndex: 29
              }
            }}
            isOpen={addFoodMutation.isPending}
          >
            <>
              <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang xử lý...</div>
              <TailSpin
                height='200'
                width='200'
                color='#4fa94d'
                ariaLabel='tail-spin-loading'
                radius='5'
                visible={true}
                wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
              />
            </>
          </Modal>
        </div>
      </div>
    </div>
  )
}
