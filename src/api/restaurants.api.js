import { applicationJSONInstance, multipartFormInstance } from '../utils/headers'

export const getAllRestaurants = (params) => applicationJSONInstance.get(`restaurant`, { params })
export const getRestaurant = (id) => applicationJSONInstance.get(`restaurant/${id}`)
export const createARestaurant = (formData) => multipartFormInstance.post('restaurant', formData)
