import { useForm } from 'react-hook-form'
import BannerImage from '../../asset/img/banner.jpg'
import useQueryConfig from '../../hooks/useQueryConfig'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRandomRoom } from '../../api/food.api'
import { omit } from 'lodash'
import { FadeLoader } from 'react-spinners'
import Slider from 'react-slick'
import fooddrink from '../../asset/img/fooddrink.gif'
export default function Banner() {
  return (
    <div className='relative'>
      <img src={BannerImage} alt='' className='w-[100%] sm:h-[90vh] mt-[11vh]' />
      <div className='absolute top-5 left-8'>
        <div className='flex w-[80vw] sm:w-[95vw] h-[20vh] sm:h-[80vh] p-[0.5rem] bg-[#0000006c]'>
          <div className='sm:m-[5rem]'>
            <div
              className='rainbow-text italic font-dancing-script-500 
            text-3xl sm:text-[7rem] animate-rainbowtext sm:h-[10rem] sm:pt-[2rem]'
            >
              vnFood
            </div>
            <div className='text-[#fffefef1] sm:text-[2rem]  italic animate-blinkingText'>
              Tìm chỗ, đặt chỗ, gọi đồ ăn, có ngay tại đây!
            </div>
          </div>
          <div className=''>
            <img className='w-[70vw] sm:w-[40vw]' src={fooddrink} />
          </div>
        </div>
      </div>
    </div>
  )
}
