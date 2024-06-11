import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaFood } from '../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { displayNum } from '../../../utils/utils'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { updateFood } from '../../../api/food.api'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { AiOutlineClose } from 'react-icons/ai'
import { TailSpin } from 'react-loader-spinner'

export default function EditFoodModal({
  closeEditFoodModal,
  food_id,
  name,
  price,
  desc,
  quantity,
  image_url
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaFood)
  })
  const [previewImage, setPreviewImage] = useState()
  const previewImageElement = useRef()
  useEffect(() => {
    Modal.setAppElement('body')
  })
  const updateFoodMutation = useMutation({
    mutationFn: (body) => updateFood(body)
  })

  const onSubmit = handleSubmit((data) => {
    data.food_id = food_id
    data.quantity = parseInt(data.quantity)
    data.price = parseInt(data.price.replace(/\D/g, ''))
    data.status = 1
    data.image = data.image[0]
    console.log(data)
    updateFoodMutation.mutate(data, {
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
          closeEditFoodModal()
          setPreviewImage('#')
        }}
      ></div>
      <div className='modal-content bg-white flex justify-center'>
        <div className='relative'>
          <div
            onClick={() => {
              closeEditFoodModal()
              setPreviewImage('#')
            }}
            className='absolute right-0 top-[-0.5rem] 
            rounded-full transition-all duration-300
             cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500
              flex justify-center items-center h-8 w-8 dark:text-yellow-400 font-extrabold'
          >
            <AiOutlineClose />
          </div>

          <div className='flex justify-between items-center'>
            <div className='font-inter-700 sm:text-2xl'>Sửa thông tin món ăn</div>
          </div>
          <form className='w-[70vw] sm:w-[40vw]' onSubmit={onSubmit} noValidate>
            <div className='mt-[1rem] flex gap-x-8 sm:justify-between'>
              <div>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Tên món ăn'
                  defaultValue={name}
                  autoComplete='off'
                  {...register('name')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                  placeholder:font-inter-400 border font-inter-500  focus:placeholder:text-transparent
                  border-[#ff822e] text-sm rounded-xl px-[4vw] w-[30vw] sm:px-[1rem] sm:w-[18vw]'
                />
                <div className='mt-1 min-h-[1.75rem] text-xs text-red-600'>
                  {errors.name?.message}
                </div>
              </div>
              <div>
                <input
                  type='text'
                  id='price'
                  name='price'
                  placeholder='Giá'
                  autoComplete='off'
                  defaultValue={displayNum(price)}
                  {...register('price')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                  placeholder:font-inter-400 border font-inter-500 focus:placeholder:text-transparent
                  border-[#ff822e] text-sm rounded-xl px-[4vw] w-[30vw] sm:w-[18vw]'
                />
                <div className='mt-1 flex min-h-[1.75rem] text-xs text-red-600'>
                  {errors.price?.message}
                </div>
              </div>
            </div>
            <input
              type='number'
              id='quantity'
              name='quantity'
              placeholder='Số lượng'
              {...register('quantity')}
              defaultValue={quantity}
              onInput={(e) => {
                console.log(e.target.value)
                e.target.value = displayNum(e.target.value)
              }}
              className='focus:outline-[#8AC0FF] w-full priceInput 
              placeholder:text-[#4F4F4F] placeholder:font-inter-400 border 
              font-inter-500 border-[#ff822e] text-sm px-[1rem] rounded-xl 
              focus:placeholder:text-transparent'
            />
            <div className='mt-1 flex min-h-[1.75rem] text-xs text-red-600'>
              {errors.quantity?.message}
            </div>

            <div>
              <textarea
                type='text'
                id='desc'
                name='desc'
                autoComplete='off'
                defaultValue={desc}
                {...register('desc')}
                className='resize-none h-[18vh] w-full 
                focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                placeholder:font-inter-400 border font-inter-500 border-orange-500
                focus:placeholder:text-transparent
                text-xs rounded-xl px-[1rem] py-[0.5rem]'
              />

              <div className='mt-1 flex min-h-[1.75rem] text-xs text-red-600'>
                {errors.desc?.message}
              </div>
            </div>

            <div className=' flex'>
              <div>
                <div>Ảnh minh hoạ (Hãy thêm ảnh khác)</div>
                <input
                  type='file'
                  id='image'
                  name='image'
                  accept='image/*'
                  {...register('image')}
                  className='focus:outline-[#8AC0FF] placeholder:text-[#4F4F4F] 
                  placeholder:font-inter-400 font-inter-500 border-[#E6E6E6] w-full'
                  onChange={(e) => {
                    const [file] = e.target.files
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file))
                      previewImageElement.current.style.visibility = 'visible'
                    }
                  }}
                />
                <div className='mt-1 flex min-h-[1.75rem] text-xl text-red-600'>
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

            <div className='w-full flex justify-center items-center'>
              <button
                className='bg-orange-600 hover:bg-green-500  
              text-white px-[2rem] py-[0.5rem] font-ibm-plex-serif-700 rounded-lg'
              >
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
            isOpen={updateFoodMutation.isPending}
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
