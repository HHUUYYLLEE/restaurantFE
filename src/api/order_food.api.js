import { applicationJSONInstance } from '../utils/http'

export const orderFood = (body) => applicationJSONInstance.post('order_food', body)
export const placeAnOrder = (body) => applicationJSONInstance.post('order_food/placeorder', body)
export const getAllUserOrders = (params) => applicationJSONInstance.get(`order_food`, { params })
export const getOrder = (id) => applicationJSONInstance.get(`order_food/${id}`)
