import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getWard } from '../../../api/address.api'
import { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context'

export default function SubPopUpAddress({ id, hideAll }) {
  console.log(id)
  const { data } = useQuery({
    queryKey: ['ward', id],
    queryFn: () => {
      return getWard(id)
    },
    placeholderData: keepPreviousData
  })

  const { setValueAddress, setValueQuery } = useContext(AppContext)

  const wards = data?.data?.wards
  console.log(wards)
  return (
    <div className='absolute fix_hover top-0 right-[-91%]'>
      <div className='z-50 bg-white divide-y h-[18rem] overflow-y-auto example divide-gray-100 border border-black shadow min-w-[18rem] '>
        <ul className=''>
          {wards &&
            wards.map((ward) => {
              return (
                <li key={ward._id} className='text-black w-full '>
                  <div
                    onClick={() => {
                      setValueAddress(ward.ward)
                      setValueQuery((prev) => ({ ...prev, address: ward._id }))
                      localStorage.setItem(ward._id, ward.ward)
                      hideAll()
                    }}
                    className='block cursor-pointer hover:text-blue-500 border-b-[0.25px] border-black px-2 py-2 transition-all duration-400'
                  >
                    <div className='flex justify-between items-center'>
                      <div> {ward.ward}</div>
                    </div>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
