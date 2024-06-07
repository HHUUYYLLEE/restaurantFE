import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Mainlayout({ children }) {
  return (
    <>
      <div className='flex flex-col max-h-[100vh] bg-[#EEE]'>
        <div className=''>
          <Header />
        </div>
        <div className='bg-[#EEE]'>{children}</div>
        <div className='bg-orange-600'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Mainlayout
