import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const getAllFood = (params) => applicationJSONInstance.get('food', { params })
export const getAllFoodInRestaurant = (restaurant_id) =>
  applicationJSONInstance.get(`food/restaurant/${restaurant_id}`)
export const addFood = (formData) => multipartFormInstance.post('food', formData)
export const updateFood = (formData) => multipartFormInstance.put('food/update_food', formData)
export const getFood = (id) => applicationJSONInstance.get(`food/${id}`)
