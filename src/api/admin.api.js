import { applicationJSONInstance } from '../utils/http'

export const getAllReviews = (params) => applicationJSONInstance.get('admin/reviews', { params })
export const getAllBloggerRequestsUsers = () =>
  applicationJSONInstance.get('admin/blogger_requests')
export const getAllUsers = () => applicationJSONInstance.get('admin/users')
export const deleteReview = (formData) =>
  applicationJSONInstance.post('admin/delete_review', formData)
export const verifyBlogger = (formData) =>
  applicationJSONInstance.post('admin/verify_blogger', formData)
export const modifyUserStatus = (formData) =>
  applicationJSONInstance.post('admin/modify_user_status', formData)
