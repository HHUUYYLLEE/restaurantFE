import BannerImage from '../../asset/img/banner.jpg'
import fooddrink from '../../asset/img/fooddrink.gif'
export default function Banner() {
  return (
    <div className='relative'>
      <img
        src={BannerImage}
        alt=''
        className='w-full sm:h-[90vh] mt-[11vh]'
      />
      <div className='absolute top-0 w-full'>
        <div className='flex  h-[27vh] sm:h-[90vh] p-[0.5rem] bg-[#0000006c]'>
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
            <img
              className='w-[70vw] sm:w-[40vw]'
              src={fooddrink}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
