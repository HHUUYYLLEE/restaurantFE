import RestaurantDetail from '../../components/RestaurantDetail/RestaurantDetail'
import RestaurantFood from '../../components/RestaurantFood/RestaurantFood'
export default function RestaurantDetails() {
  return (
    <>
      <div className='w-full mt-[10rem]'>
        <div className='mx-auto w-[85%] pb-[2rem]'>
          <RestaurantDetail />
          <RestaurantFood />
        </div>
      </div>
    </>
  )
}
