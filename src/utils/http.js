import axios from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import {
  clearAccessTokenFromLS,
  getAccessTokenFromLS,
  saveAccessTokenToLS,
  saveInfoToLS
} from './auth'
import { envConfig } from './env'

const applicationJSONInstance = axios.create({
  baseURL: envConfig.baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const multipartFormInstance = axios.create({
  baseURL: envConfig.baseURL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const mapInstance = axios.create({
  baseURL: envConfig.opencageURL,

  headers: {
    'Content-Type': 'application/json'
  }
})

var accessToken = getAccessTokenFromLS()

applicationJSONInstance.interceptors.request.use(
  (config) => {
    //console.log(config)
    if (accessToken && config.headers) {
      config.headers.Authorization = accessToken
      //console.log(config.headers.Authorization)
      return config
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

applicationJSONInstance.interceptors.response.use(
  (response) => {
    console.log(response)
    const { url } = response.config

    if (
      url.includes('user/login') ||
      url.includes('/user/loginGoogle') ||
      url.includes('user/register')
    ) {
      accessToken = response.data.data.accessToken
      console.log(accessToken)
      saveInfoToLS(response.data.data.user)
      saveAccessTokenToLS(accessToken)
    }
    return response
  },
  (error) => {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      const data = error.response?.data
      const message = data.message || error.message
      console.log(message)
    }
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const data = error.response?.data
      console.log(data)
      clearAccessTokenFromLS()
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

multipartFormInstance.interceptors.request.use(
  (config) => {
    //console.log(config)
    if (accessToken && config.headers) {
      config.headers.Authorization = accessToken
      //console.log(config.headers.Authorization)
      return config
    }
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

multipartFormInstance.interceptors.response.use(
  (response) => {
    console.log(response)
    const { url } = response.config

    if (
      url.includes('user/login') ||
      url.includes('/user/loginGoogle') ||
      url.includes('user/register')
    ) {
      // console.log(url)

      accessToken = response.data.data.accessToken
      //console.log(accessToken)
      saveInfoToLS(response.data.data.user)
      saveAccessTokenToLS(accessToken)
    }

    return response
  },
  (error) => {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      const data = error.response?.data
      // const message = data.message || error.message
      // console.log(message)
      // toast.error(message)
    }
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const data = error.response?.data
      console.log(data)
      // const message = data.message || error.message
      clearAccessTokenFromLS()
      // toast.error(message)
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export { applicationJSONInstance, multipartFormInstance, mapInstance }
