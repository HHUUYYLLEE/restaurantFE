import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const getAllRestaurants = (params) => applicationJSONInstance.get(`restaurant`, { params })
export const getRestaurant = (id) => applicationJSONInstance.get(`restaurant/${id}`)
export const createARestaurant = (formData) => multipartFormInstance.post('restaurant', formData)
export const updateARestaurant = (formData) =>
  multipartFormInstance.put('restaurant/update_restaurant', formData)
export const getAllUserRestaurants = (id) =>
  applicationJSONInstance.get(`restaurant/restaurants/${id}`)
export const searchRestaurantsAndFood = (params) =>
  applicationJSONInstance.get('restaurant/restaurants_and_food', { params })
export const getRandomRestaurants = () =>
  applicationJSONInstance.get('restaurant/random_restaurants')
export const findNearbyRestaurants = (params) =>
  applicationJSONInstance.get('restaurant/find_nearby_restaurants', { params })
export const simpleSearchRestaurantsAndFood = (params) =>
  applicationJSONInstance.get('restaurant/simple_restaurants_and_food', { params })
