import { useQuery, useMutation } from '@tanstack/react-query'
import { verifyBlogger, getAllBloggerRequestsUsers } from '../../../api/admin.api'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Oval } from 'react-loader-spinner'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { FaCheck } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

export default function BloggerRequestsUserManager({ refetchState, setRefetchState }) {
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const [userId, setUserId] = useState('')
  const [acceptBloggerUserModal, setAcceptBloggerUserModal] = useState(false)
  const [denyBloggerUserModal, setDenyBloggerUserModal] = useState(false)

  const { data: requests_data } = useQuery({
    queryKey: ['all_blogger_requests', refetchState],
    queryFn: () => {
      return getAllBloggerRequestsUsers()
    }
  })
  const verifyBloggerMutation = useMutation({
    mutationFn: (body) => verifyBlogger(body)
  })
  const submitVerifyBloggerStatus = (status) => {
    let data = {}
    data.user_id = userId
    data.status = status
    verifyBloggerMutation.mutate(data, {
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
  const columns2 = [
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
      title: 'Yêu cầu',
      render: () => (
        <>
          <div className='flex gap-x-2'>
            <button
              onClick={() => setAcceptBloggerUserModal(true)}
              className='flex items-center  justify-center gap-x-2 bg-green-500 hover:bg-green-700 rounded-md px-[0.5rem]'
            >
              <FaCheck style={{ color: 'white' }} />
              <div className='text-white'>Chấp nhận</div>
            </button>
            <button
              onClick={() => setDenyBloggerUserModal(true)}
              className='flex items-center  justify-center gap-x-2 bg-red-500 hover:bg-red-700 rounded-md px-[0.5rem]'
            >
              <IoClose style={{ color: 'white' }} />
              <div className='text-white'>Từ chối</div>
            </button>
          </div>
        </>
      )
    }
  ]
  const data2 = requests_data?.data.users.map((data) => {
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
          locale={{ emptyText: 'Chưa có yêu cầu' }}
          onRow={(record) => {
            return {
              onClick: () => {
                setUserId(record._id)
              }
            }
          }}
          columns={columns2}
          dataSource={data2}
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
        isOpen={acceptBloggerUserModal}
        onRequestClose={() => setAcceptBloggerUserModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Chấp nhận yêu cầu blogger user?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitVerifyBloggerStatus(3)
              setAcceptBloggerUserModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setAcceptBloggerUserModal(false)}
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
        isOpen={denyBloggerUserModal}
        onRequestClose={() => setDenyBloggerUserModal(false)}
      >
        <div className='font-inter-700 sm:text-2xl'>Từ chối yêu cầu blogger user?</div>
        <div className='sm:mt-[8vh] mt-[2vh] flex gap-x-4 sm:gap-x-12 justify-center'>
          <button
            onClick={() => {
              submitVerifyBloggerStatus(1)
              setDenyBloggerUserModal(false)
            }}
            className='flex justify-center items-center 
            bg-green-500 hover:bg-green-700 text-white font-inter-700 rounded-lg
            px-[1rem] py-[0.5rem] sm:py-[1.1rem] sm:text-lg text-sm
            '
          >
            Xác nhận
          </button>
          <button
            onClick={() => setDenyBloggerUserModal(false)}
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
        isOpen={verifyBloggerMutation.isPending}
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
