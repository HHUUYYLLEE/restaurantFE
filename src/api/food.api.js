import http from '../utils/http'

export const getAllFood = (params) => http.get(`food`, { params })
export const getRoom = (id) => http.get(`room/${id}`)
export const getRandomRoom = () => http.get(`room/randomRoom/random`)
export const checkARoom = (formData) => http.patch('room/checkRoom/check', formData)
export const getAllRoomsHost = (params) => http.get('room/getRoom/getRoomHost', { params })
export const updateARoom = (formData) => http.put('room/updateRoom/update', formData)
