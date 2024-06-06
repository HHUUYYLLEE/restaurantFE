import RestaurantsList from '../../components/Profile/RestaurantsList/Restaurantslist'
import UserProfile from '../../components/Profile/UserProfile/UserProfile'

export default function Profile() {
  return (
    <>
      <div className='sm:mt-44 mt-[8rem] w-full pb-10'>
        <UserProfile />
        <RestaurantsList />
      </div>
    </>
  )
}
