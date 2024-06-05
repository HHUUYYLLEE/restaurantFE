import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const getAllFood = (params) => applicationJSONInstance.get('food', { params })
export const getRoom = (id) => applicationJSONInstance.get(`room/${id}`)
export const getRandomRoom = () => applicationJSONInstance.get(`room/randomRoom/random`)
export const checkARoom = (formData) => applicationJSONInstance.patch('room/checkRoom/check', formData)
export const getAllRoomsHost = (params) => applicationJSONInstance.get('room/getRoom/getRoomHost', { params })
export const updateARoom = (formData) => applicationJSONInstance.put('room/updateRoom/update', formData)
export const getAllFoodInRestaurant = (restaurant_id) => applicationJSONInstance.get(`food/restaurant/${restaurant_id}`)
export const addFood = (formData) => multipartFormInstance.post('food', formData)
export const getFood = (id) => applicationJSONInstance.get(`food/${id}`)
