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
      </div>
    </div>
  )
}
