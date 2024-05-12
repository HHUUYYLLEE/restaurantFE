import RestaurantsList from '../../components/Profile/RestaurantsList/Restaurantslist'
import UserProfile from '../../components/Profile/UserProfile/UserProfile'

export default function Profile() {
  return (
    <>
      <div className='mt-44 w-full pb-10'>
        <UserProfile />
        <RestaurantsList />
      </div>
    </>
  )
}
