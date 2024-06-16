import AdminReviewsManager from '../../components/AdminReviewsManager/AdminReviewsManager'
import AdminUsersManager from '../../components/AdminUsersManager/AdminUsersManager'

export default function Admin({ collapsedSidebar, option }) {
  return (
    <div className='pt-[5rem]'>
      {!collapsedSidebar && (
        <div className='fixed z-[10] bg-[rgba(0,0,0,0.6)] h-[100vh] w-[100vw]'></div>
      )}
      <div className=''>{option === 0 ? <AdminUsersManager /> : <AdminReviewsManager />}</div>
    </div>
  )
}
