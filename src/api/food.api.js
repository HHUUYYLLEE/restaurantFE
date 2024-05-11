import { applicationJSONInstance, multipartFormInstance } from '../utils/headers'

export const getAllFood = (params) => applicationJSONInstance.get(`food`, { params })
export const getRoom = (id) => applicationJSONInstance.get(`room/${id}`)
export const getRandomRoom = () => applicationJSONInstance.get(`room/randomRoom/random`)
export const checkARoom = (formData) => applicationJSONInstance.patch('room/checkRoom/check', formData)
export const getAllRoomsHost = (params) => applicationJSONInstance.get('room/getRoom/getRoomHost', { params })
export const updateARoom = (formData) => applicationJSONInstance.put('room/updateRoom/update', formData)
