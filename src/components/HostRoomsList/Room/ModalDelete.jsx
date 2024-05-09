import { TailSpin } from 'react-loader-spinner'
import Modal from 'react-modal'
import { useMutation } from '@tanstack/react-query'

export default function ModalDelete({ id, toggle, checked }) {
  const mutationDelete = useMutation({
    mutationFn: (data) => {
      // return checkARoom(data)
    }
  })
  return (
    <>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
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
        isOpen={checked}
        onRequestClose={() => {
          if (!mutationDelete.isPending) toggle(false)
        }}
      >
        {mutationDelete.isPending ? (
          <>
            <div className='text-[#4FA94D] font-dmsans-700 mb-[5vh] text-3xl'>Đang gửi yêu cầu xoá...</div>
            <TailSpin
              height='200'
              width='200'
              color='#4fa94d'
              ariaLabel='tail-spin-loading'
              radius='5'
              visible={true}
              wrapperStyle={{ display: 'flex', 'justify-content': 'center' }}
            />
          </>
        ) : (
          <>
            <div className='font-inter-700 text-4xl'>Xác nhận xoá phòng trọ?</div>
            <div className='mt-[8vh] flex justify-between'>
              <button
                // onClick={() => updateRoomCheck({ _id: room?._id, is_checked_information: true })}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#0366FF] hover:bg-green-700 text-white font-inter-700 rounded-lg text-xl'
              >
                Xác minh
              </button>
              <button
                onClick={() => toggle(false)}
                className='w-[10vw] h-[8vh] flex justify-center items-center bg-[#DD1A1A] hover:bg-red-900 text-white font-inter-700 rounded-lg text-xl'
              >
                Huỷ
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
