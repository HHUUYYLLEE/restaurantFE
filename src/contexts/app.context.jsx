import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getInfoFromLS } from '../utils/auth'

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
  setMapDraw: () => null,
  markersGroup: [],
  setMarkersGroup: () => null,
  loggedIn: false,
  setLoggedIn: () => null,
  modalLogin: false,
  setModalLogin: () => null,
  adminSidebarOption: 0,
  setAdminSidebarOption: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }) => {
  const [valueQuery, setValueQuery] = useState(initialAppContext.valueQuery)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [info, setInfo] = useState(initialAppContext.info)
  const [leafletMap, setLeafletMap] = useState(initialAppContext.leafletMap)
  const [mapDraw, setMapDraw] = useState(initialAppContext.mapDraw)
  const [markersGroup, setMarkersGroup] = useState(initialAppContext.markersGroup)
  const [modalLogin, setModalLogin] = useState(initialAppContext.modalLogin)
  const [adminSidebarOption, setAdminSidebarOption] = useState(initialAppContext.adminSidebarOption)

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
        setMapDraw,
        markersGroup,
        setMarkersGroup,
        modalLogin,
        setModalLogin,
        adminSidebarOption,
        setAdminSidebarOption
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
