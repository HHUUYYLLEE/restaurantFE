import AdminHeader from '../../components/AdminHeader'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <>
      <div className='flex bg-[#F4F7FE]'>
        <div className=''>
          <AdminSidebar />
        </div>
        <div className='w-full h-full  p-6'>
          <div>
            <AdminHeader />
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
