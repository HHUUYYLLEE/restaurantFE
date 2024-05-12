import { applicationJSONInstance, multipartFormInstance } from '../utils/http'

export const loginAccount = (body) => applicationJSONInstance.post('user/login', body)
export const signUpAccount = (body) => multipartFormInstance.post('user/register', body)
export const loginGoogleAccount = (body) => applicationJSONInstance.post('/user/loginGoogle', body)
