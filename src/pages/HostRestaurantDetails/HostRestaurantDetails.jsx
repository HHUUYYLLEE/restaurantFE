import HostRestaurantDetail from '../../components/HostRestaurantDetail/HostRestaurantDetail'
import HostRestaurantFood from '../../components/HostRestaurantFood/HostRestaurantFood'
export default function HostRestaurantDetails() {
  return (
    <>
      <div className='w-full mt-[10rem]'>
        <div className='mx-auto w-[85%] pb-[2rem]'>
          <HostRestaurantDetail />
          <HostRestaurantFood />
        </div>
      </div>
    </>
  )
}
