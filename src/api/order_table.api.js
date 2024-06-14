import { applicationJSONInstance } from '../utils/http'

export const placeAnOrderTable = (body) =>
  applicationJSONInstance.post('order_table/placeorder', body)
export const getAllUserOrdersTable = (params) =>
  applicationJSONInstance.get(`order_table`, { params })
export const getOrderTable = (id) => applicationJSONInstance.get(`order_table/${id}`)
export const getOrderTableHost = (id) => applicationJSONInstance.get(`order_table/host_order/${id}`)
export const getAllRestaurantsPlacedOrderTable = () =>
  applicationJSONInstance.get(`order_table/all_placed_orders`)
export const updateOrderTableHost = (formData) =>
  applicationJSONInstance.put(`order_table/update_order_host/`, formData)
export const cancelOrderTable = (formData) =>
  applicationJSONInstance.put(`order_table/cancel_order/`, formData)
