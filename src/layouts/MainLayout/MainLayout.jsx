import Footer from '../../components/Footer'
import Header from '../../components/Header'
import PopUpAddress from '../../components/PopUpAddress'

function Mainlayout({ children }) {
  return (
    <>
      <div className='flex flex-col min-h-[100vh]'>
        <div className='bg-[#DCEAFF]'>
          <Header />
        </div>
        <div>{children}</div>
        <div className='mt-auto'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Mainlayout
