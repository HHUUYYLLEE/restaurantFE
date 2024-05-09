import http from '../utils/http'

export const loginAccount = (body) => http.post('host/login', body)
export const logoutAccount = () => http.post('host/logout')
