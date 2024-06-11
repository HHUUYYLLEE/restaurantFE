import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const createReview = (formData) =>
  multipartFormInstance.post('/review/create_review', formData)
export const updateReview = (formData) =>
  multipartFormInstance.put('/review/update_review', formData)
export const deleteReview = (formData) =>
  applicationJSONInstance.put('/review/delete_review', formData)
export const likeDislikeReview = (formData) =>
  applicationJSONInstance.put('/review/like_dislike_review', formData)
export const reportReview = (formData) =>
  applicationJSONInstance.put('/review/report_review', formData)
