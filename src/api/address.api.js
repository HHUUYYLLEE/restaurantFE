import http from '../utils/http'

export const getDistrict = () => http.get('address/district')
export const getWard = (id) => http.get(`address/ward/${id}`)
