import AdminHeader from '../../components/AdminHeader'
import { useState, cloneElement } from 'react'
export default function Adminlayout({ children }) {
  const [collapsedSidebar, setCollapsedSidebar] = useState(true)
  const [option, setOption] = useState(0)
  return (
    <>
      <div className='flex flex-col min-h-[100vh] bg-[#EEE] relative'>
        <div className=''>
          <AdminHeader
            collapsedSidebar={collapsedSidebar}
            setCollapsedSidebar={setCollapsedSidebar}
            setOption={setOption}
          />
        </div>

        <div className='bg-[#EEE]'>
          {cloneElement(children, {
            collapsedSidebar,
            option
          })}
        </div>
      </div>
    </>
  )
}
