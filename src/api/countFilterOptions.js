import http from '../utils/http'

export const getServicesCount = () => http.get('room/countServices/count')
export const getNumberOfPeopleCount = () => http.get('room/countPeoples/count')
