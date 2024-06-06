import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Mainlayout({ children }) {
  return (
    <>
      <div className='flex flex-col min-h-[100vh]'>
        <div className=''>
          <Header />
        </div>
        <div className='bg-[#EEE]'>{children}</div>
        <div className=''>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Mainlayout
