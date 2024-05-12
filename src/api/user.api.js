import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const loginAccount = (body) => applicationJSONInstance.post('user/login', body)
export const signUpAccount = (body) => multipartFormInstance.post('user/register', body)
export const loginGoogleAccount = (body) => applicationJSONInstance.post('/user/loginGoogle', body)
export const getUserProfile = (id) => applicationJSONInstance.get(`/user/profile/${id}`)
export const editUserProfile = (body) => applicationJSONInstance.put('/user/updateProfile', body)
export const editUserAvatar = (body) => multipartFormInstance.put('/user/updateAvatar', body)
