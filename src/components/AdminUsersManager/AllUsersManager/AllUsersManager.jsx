import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'
import { Oval } from 'react-loader-spinner'
import Modal from 'react-modal'
import { getAllUsers, modifyUserStatus } from '../../../api/admin.api'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'

export default function AllUsersManager({ refetchState, setRefetchState }) {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const [userId, setUserId] = useState('')
  const [lockUserStatusModal, setLockUserStatusModal] = useState(false)
  const [unlockUserStatusModal, setUnlockUserStatusModal] = useState(false)

  const { data: user_data } = useQuery({
    queryKey: ['all_data', refetchState],
    queryFn: () => {
      return getAllUsers()
    }
  })
  const modifyAUserStatus = useMutation({
    mutationFn: (body) => modifyUserStatus(body)
  })
  const submitModifyUserStatus = (status) => {
    let data = {}
    data.user_id = userId
    data.status = status
    modifyAUserStatus.mutate(data, {
      onSuccess: () => {
        setRefetchState((prev) => !prev)
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.errors
          console.log(formError)
        }
      }
    })
  }
  const columns1 = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => (
        <div className='rounded-full w-[3rem] h-[3rem] flex items-center overflow-hidden justify-center'>
          <img referrerPolicy='no-referrer' src={url} className='' />
        </div>
      )
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
    {
      title: 'Blogger',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <>
          {status === 3 ? (
            <FaCheckCircle
              style={{
                color: 'green',
                width: '1.5vw',
                height: '1.5vw'
              }}
            />
          ) : (
            <IoMdCloseCircle
              style={{
                color: 'red',
                width: '1.7vw',
                height: '1.7vw'
              }}
            />
          )}
        </>
      )
    }
    // {
    //   title: 'Quản lý',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status, row) => (
    //     <>
    //       {_id !== row._id && (
    //         <div>
    //           {status !== 0 ? (
    //             <button
    //               onClick={() => setLockUserStatusModal(true)}
    //               className='flex items-center w-[6.5rem] justify-center gap-x-2 bg-red-500 hover:bg-red-700 rounded-md px-[0.5rem]'
    //             >
    //               <FaLock style={{ color: 'white' }} />
    //               <div className='text-white'>Tạm khoá</div>
    //             </button>
    //           ) : (
    //             <button
    //               onClick={() => setUnlockUserStatusModal(true)}
    //               className='flex items-center w-[6.5rem] justify-center gap-x-2 bg-green-500 hover:bg-green-700 rounded-md px-[0.5rem]'
    //             >
    //               <FaUnlock style={{ color: 'white' }} />
    //               <div className='text-white'>Mở khoá</div>
    //             </button>
    //           )}
    //         </div>
    //       )}
    //     </>
    //   )
    // }
  ]
  const data1 = user_data?.data.users.map((data) => {
    data.key = data._id
    delete data.password
    delete data.role
    delete data.refresh_token
    delete data.createdAt
    delete data.updatedAt
    return data
  })

  return (
    <div className='w-[90vw] mx-auto'>
      <div className='mt-5'>
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                setUserId(record._id)
              }
            }
          }}
          columns={columns1}
          dataSource={data1}
        />
      </div>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 20
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={lockUserStatusModal}
        onRequestClose={() => setLockUserStatusModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Xác nhận tạm khoá user?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitModifyUserStatus(0)
              setLockUserStatusModal(false)
            }}
            className='flex justify-center items-center 
            bg-red-500 hover:bg-orange-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setLockUserStatusModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Huỷ
          </button>
        </div>
      </Modal>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 20
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={unlockUserStatusModal}
        onRequestClose={() => setUnlockUserStatusModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Xác nhận mở khoá user?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitModifyUserStatus(1)
              setUnlockUserStatusModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setUnlockUserStatusModal(false)}
            className='flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 
            text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.1rem] text-sm sm:text-lg sm:px-[2rem]'
          >
            Huỷ
          </button>
        </div>
      </Modal>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 27
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            transform: 'translate(-50%, -50%)',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '2vw',
            paddingBottom: '4vw',
            borderWidth: '0px',
            borderRadius: '1rem'
          }
        }}
        isOpen={modifyAUserStatus.isPending}
      >
        <Oval
          height='150'
          width='150'
          color='rgb(249,115,22)'
          secondaryColor='rgba(249,115,22,0.5)'
          ariaLabel='tail-spin-loading'
          radius='5'
          visible={true}
          wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
        />
      </Modal>
    </div>
  )
}
