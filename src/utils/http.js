import axios from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import { clearAccessTokenFromLS, getAccessTokenFromLS, saveAccessTokenToLS, saveInfoFromLS } from './auth'

const URL = {
  BASE_URL: 'http://localhost:4000/api/',
  DEPLOY_URL: 'https://restaurantbe-huyle-2a11ba84.koyeb.app/api/'
}

const instance = axios.create({
  baseURL: URL.DEPLOY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

var accessToken = getAccessTokenFromLS()

instance.interceptors.request.use(
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
instance.interceptors.response.use(
  (response) => {
    // console.log(response)
    const { url } = response.config

    if (url === 'host/login') {
      // console.log(url)

      accessToken = response.data.data.accessToken
      //console.log(accessToken)
      saveInfoFromLS(response.data.data.user)
      saveAccessTokenToLS(accessToken)
    } else if (url === 'host/logout') {
      console.log(response.data)
      accessToken = ''
      clearAccessTokenFromLS()
      toast.success('Đăng xuất thành công')
    }
    return response
  },
  function (error) {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      const data = error.response?.data
      const message = data.message || error.message
      // console.log(message)
      toast.error(message)
    }
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const data = error.response?.data
      console.log(data)
      const message = data.message || error.message
      clearAccessTokenFromLS()
      toast.error(message)
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

const http = instance

export default http
