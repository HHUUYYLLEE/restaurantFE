import { Flash } from 'react-ruffle'
export default function FlashGame() {
  return (
    <>
      <div className='gamecontainer left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] absolute'>
        <Flash
          className='w-[990px] h-[720px]'
          src={
            {
              0: 'https://hhuuyyllee.github.io/flash/HB7.swf',
              1: 'https://hhuuyyllee.github.io/flash/N1.swf',
              2: 'https://hhuuyyllee.github.io/flash/N2.swf',
              3: 'https://hhuuyyllee.github.io/flash/N3.swf',
              4: 'https://hhuuyyllee.github.io/flash/N4.swf',
              5: 'https://hhuuyyllee.github.io/flash/N5.swf',
              6: 'https://hhuuyyllee.github.io/flash/SMH.swf'
            }[Math.floor(Math.random() * 7)]
          }
        />
      </div>
    </>
  )
}
