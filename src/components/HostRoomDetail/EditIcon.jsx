export default function EditIcon() {
  return (
    <div className='flex hover:text-[#01B7F2] hover:border-[#01B7F2] border-black'>
      <div className='flex-col border-inherit'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          fill='none'
          viewBox='0 0 22 22'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          stroke='currentColor'
        >
          <path d='M8.8 20.199A2.733 2.733 0 0 1 6.869 21H3v-3.844c0-.724.288-1.419.8-1.931m5 4.974-5-4.974m5 4.974 9.974-9.978M3.8 15.225l9.984-9.995m0 0 1.426-1.428a2.733 2.733 0 0 1 3.867-.001l1.126 1.127a2.733 2.733 0 0 1 0 3.865l-1.428 1.428M13.783 5.23l4.991 4.991' />
        </svg>

        <div className='w-[20px] h-0 border-solid border-[1.1px] border-inherit'></div>
      </div>
      <div className='mt-[0.9rem] font-poppins-400'>Chỉnh sửa</div>
    </div>
  )
}
