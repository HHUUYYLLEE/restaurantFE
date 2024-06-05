import useRouteElement from './useRouteElement'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { injectStyle } from 'react-toastify/dist/inject-style'
import { contextClass } from './utils/objectUi'

if (typeof window !== 'undefined') {
  injectStyle()
}

function App() {
  const routeElement = useRouteElement()
  return (
    <div>
      {routeElement}
      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || 'default'] +
          ' w-[30rem] relative flex p-3 border font-gray-300 min-h-[15vh] rounded-md justify-between overflow-hidden cursor-pointer'
        }
        bodyClassName={() => 'text-2xl rainbow-text animate-rainbowtext font-medium flex justify-center items-center'}
        position='bottom-right'
        autoClose={4000}
      />
    </div>
  )
}

export default App
