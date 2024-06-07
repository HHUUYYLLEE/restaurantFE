import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getInfoFromLS } from '../utils/auth'
// import { getAccessTokenFromLS, getInfoFromLS } from '../utils/auth'

const initialAppContext = {
  valueQuery: {},
  setValueQuery: () => null,
  isAuthenticated: Boolean(getAccessTokenFromLS() && getInfoFromLS()),
  setIsAuthenticated: () => null,
  info: getInfoFromLS(),
  setInfo: () => null,
  leafletMap: null,
  setLeafletMap: () => null,
  mapDraw: null,
  setMapDraw: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }) => {
  const [valueQuery, setValueQuery] = useState(initialAppContext.valueQuery)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [info, setInfo] = useState(initialAppContext.info)
  const [leafletMap, setLeafletMap] = useState(initialAppContext.leafletMap)
  const [mapDraw, setMapDraw] = useState(initialAppContext.mapDraw)
  return (
    <AppContext.Provider
      value={{
        valueQuery,
        setValueQuery,
        isAuthenticated,
        setIsAuthenticated,
        info,
        setInfo,
        leafletMap,
        setLeafletMap,
        mapDraw,
        setMapDraw
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
