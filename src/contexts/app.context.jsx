import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getInfoFromLS } from '../utils/auth'
// import { getAccessTokenFromLS, getInfoFromLS } from '../utils/auth'

const initialAppContext = {
  valueAddress: 'Vị trí',
  setValueAddress: () => null,
  valueQuery: {},
  setValueQuery: () => null,
  isAuthenticated: Boolean(getAccessTokenFromLS() && getInfoFromLS()),
  setIsAuthenticated: () => null,
  info: getInfoFromLS(),
  setInfo: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }) => {
  const [valueAddress, setValueAddress] = useState(initialAppContext.valueAddress)
  const [valueQuery, setValueQuery] = useState(initialAppContext.valueQuery)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [info, setInfo] = useState(initialAppContext.info)
  return (
    <AppContext.Provider
      value={{
        valueAddress,
        setValueAddress,
        valueQuery,
        setValueQuery,
        isAuthenticated,
        setIsAuthenticated,
        info,
        setInfo
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
