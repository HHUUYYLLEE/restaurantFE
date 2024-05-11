import { applicationJSONInstance, multipartFormInstance } from '../utils/headers'

export const loginAccount = (body) => applicationJSONInstance.post('user/login', body)
export const signInAccount = (body) => applicationJSONInstance.post('user/register', body)
