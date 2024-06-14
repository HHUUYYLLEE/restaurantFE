import { applicationJSONInstance } from '../utils/http'

export const orderFood = (body) => applicationJSONInstance.post('order_food', body)
export const placeAnOrder = (body) => applicationJSONInstance.post('order_food/placeorder', body)
export const getAllUserOrders = (params) => applicationJSONInstance.get(`order_food`, { params })
export const getOrder = (id) => applicationJSONInstance.get(`order_food/${id}`)
export const getOrderHost = (id) => applicationJSONInstance.get(`order_food/host_order/${id}`)
export const getAllRestaurantsPlacedOrderFood = () =>
  applicationJSONInstance.get(`order_food/all_placed_orders`)
export const updateOrderHost = (formData) =>
  applicationJSONInstance.put(`order_food/update_order_host/`, formData)
export const cancelOrder = (formData) =>
  applicationJSONInstance.put(`order_food/cancel_order/`, formData)
