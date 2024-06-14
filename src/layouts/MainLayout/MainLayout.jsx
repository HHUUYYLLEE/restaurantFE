import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Mainlayout({ children }) {
  return (
    <>
      <div className='flex flex-col min-h-[100vh] bg-[#EEE] relative'>
        <div className=''>
          <Header />
        </div>
        <div className='bg-[#EEE] min-h-[200vh]'>{children}</div>
        <div className='bg-orange-600 z-10'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Mainlayout
