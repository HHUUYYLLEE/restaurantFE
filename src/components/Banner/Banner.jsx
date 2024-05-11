import { useForm } from 'react-hook-form'
import BannerImage from '../../asset/img/banner.jpg'
import useQueryConfig from '../../hooks/useQueryConfig'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRandomRoom } from '../../api/food.api'
import { omit } from 'lodash'
import { FadeLoader } from 'react-spinners'
import Slider from 'react-slick'
export default function Banner() {
  return (
    <div>
      <img src={BannerImage} alt='' className='pointer-events-none w-[100%]' />
    </div>
  )
}
