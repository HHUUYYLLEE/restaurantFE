import 'react-toastify/dist/ReactToastify.css'
import { injectStyle } from 'react-toastify/dist/inject-style'
import useRouteElement from './useRouteElement'

if (typeof window !== 'undefined') {
  injectStyle()
}

function App() {
  const routeElement = useRouteElement()
  return <div>{routeElement}</div>
}

export default App
