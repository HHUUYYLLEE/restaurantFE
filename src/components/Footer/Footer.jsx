import instagram from '../../asset/img/instagram.png'
import facebook from '../../asset/img/facebook.png'
import twitter from '../../asset/img/twitter.png'
import linked from '../../asset/img/linked.png'
import youtube from '../../asset/img/youtube.png'
import footer from '../../asset/img/footer.png'

export default function Footer() {
  return (
    <div>
      <div className='w-full h-full flex flex-col items-center z-0 bg-[#2D3E52] relative'>
        <img className='w-full' src={footer} />
        <div className='div.row flex w-10/12 justify-center text-white'>
          <div className='w-1/4'>
            <div>
              <h4 className='font-poppins-600 text-2xl '>
                Về chúng tôi
                <hr className='w-[5vw] border-2 border-white mt-3'></hr>
              </h4>

              <div className='font-roboto text-sm w-[13vw] leading-7 mt-3'>
                Được phát triển bởi team phát triển thuộc DHBKHN
                <br />
                Tên nhóm: Dazai
              </div>
              <br />

              <div className='font-roboto text-sm w-[13vw] leading-7'>Website tìm phòng trọ tốt nhất Việt Nam</div>

              <div className='list w-[13vw] mt-3 flex justify-between'>
                <img className='h-9 w-9 mr-3' src={facebook} />
                <img className='h-9 w-9 mr-3' src={twitter} />
                <img className='h-9 w-9 mr-3' src={linked} />
                <img className='h-9 w-9 mr-3' src={youtube} />
              </div>
            </div>
          </div>

          <div className='w-1/4'>
            <div>
              <h4 className='font-poppins-600 text-2xl'>
                Từ khóa
                <hr className='w-[5vw] border-2 border-white mt-3' />
              </h4>

              <div className='list mt-3 font-roboto'>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Home</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Phòng trọ</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Nhà</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Chung cư mini</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Phòng</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> 404</span>
                </div>
                <div className='item'>
                  <span className='w-[1vw] border-t-[3px] mb-[0.3vh] inline-block bg-white'></span>
                  <span className='text-sm'> Contact Us</span>
                </div>
              </div>
            </div>
          </div>

          <div className='w-1/4'>
            <div>
              <h4 className='font-poppins-600 text-2xl'>
                Instagram
                <hr className='w-[5.7vw] border-2 border-white mt-3' />
              </h4>

              <div className='list overflow-hidden mt-3'>
                <img className='max-w-[14rem] h-auto' src={instagram} />
              </div>
            </div>
          </div>

          <div className='mt-[2vh] w-[25vw]'>
            <div>
              <h4 className='font-poppins-600 text-2xl'>
                Gửi thông tin cho chúng tôi
                <hr className='w-[5vw] border-2 border-white mt-3' />
              </h4>

              <div>
                <div className='mt-3 max-w-[20vw] text-sm leading-7 font-roboto'>
                  Hãy gửi nhận xét về trang web của chúng <br /> tôi qua email để cải thiện trải nghiệm của bạn
                </div>

                <div className='mt-3'>
                  <input
                    name='someinput'
                    className='shadow font-roboto appearance-none border rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full'
                    type='text'
                    placeholder='Email Id'
                  />
                  <br />
                  <button className='bg-white  text-[#01B7F2] font-roboto py-[2vh] px-[3vw] rounded-full mt-3'>
                    ĐĂNG KÝ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='div.copyright justify-center text-white text-xs absolute bottom-0 mb-3 rotate-180'>
          © Website - 2022 | All Right Reserved. Designed By Website
        </div> */}
        <div className='mt-16 w-full flex justify-center'>
          <div className='scale-x-1 scale-y-[-1] text-white text-sm font-roboto'>
            © Website - 2022 | All Right Reserved. Designed By Website
          </div>
        </div>
      </div>
    </div>
  )
}
