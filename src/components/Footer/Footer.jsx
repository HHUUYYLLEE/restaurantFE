import facebook from '../../asset/img/facebook.png'
import email from '../../asset/img/email.png'
import phone from '../../asset/img/phone.png'
import pinlocation from '../../asset/img/pinlocation.png'
import logobk from '../../asset/img/logo_bk.png'
export default function Footer() {
  return (
    <div className='bg-orange-600'>
      <div className='w-full bg-orange-600 text-white'>
        <div className='mx-[2rem] sm:flex sm:gap-x-[7rem] 2xl:gap-x-[15rem]'>
          <div className='py-[2rem]'>
            <div className=' text-white italic text-lg'>Liên lạc qua</div>
            <div className='flex items-center gap-x-3 sm:mt-[1.5rem]'>
              <a href='https://www.facebook.com/huy.leba.75'>
                <img
                  className='w-[10vw] sm:w-[3vw]'
                  src={facebook}
                  alt=''
                />
              </a>
              <div>Huy Lê</div>
            </div>
            <div className='flex mt-[0.5rem] items-center gap-x-3'>
              <img
                src={email}
                className='w-[10vw] sm:w-[3vw]'
              />
              <div>huy.lb194586@sis.hust.edu.vn</div>
            </div>
            <div className='flex mt-[0.5rem] items-center gap-x-3'>
              <img
                src={phone}
                className='w-[10vw] sm:w-[3vw]'
              />
              <div>0833471885</div>
            </div>
          </div>
          <div className='hidden sm:block sm:py-[2rem]'>
            <div className=' sm:text-white sm:italic sm:text-lg'>Địa chỉ</div>
            <a href='https://maps.app.goo.gl/sgkvz8YxsUW29rSi8'>
              <div className='sm:flex sm:mt-[1.5rem] sm:items-center sm:gap-x-3'>
                <img
                  src={pinlocation}
                  className='sm:w-[3vw]'
                />
                <div className='sm:text-[0.9rem]'>204-K1, Nguyễn Hiền. Bách Khoa, Hai Bà Trưng, Hà Nội</div>
              </div>
            </a>
          </div>
        </div>
        <hr className='h-[0.1rem] border-none bg-white' />
        <div className='flex justify-center py-[1rem] '>
          <span>Tham khảo từ&nbsp;</span>
          <span className='italic'>
            <a href='https://foody.vn'>Foody.vn</a>
          </span>
        </div>
      </div>
    </div>
  )
}
