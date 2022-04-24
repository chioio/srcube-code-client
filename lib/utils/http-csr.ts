import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { BASE_URL } from '.'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

const refreshToken = () => {
  return fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('refresh-token')}`,
    },
  })
}

const onRequestFulfilled = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = localStorage.getItem('access-token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

const onRequestRejected = async (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseRejected = async (error: AxiosError): Promise<any> => {
  const config = error.config as any

  if (error!.response?.status === 401 && !config._retry) {
    config._retry = true

    await refreshToken()
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (data) {
          const { access_token, refresh_token } = data

          localStorage.setItem('access-token', access_token)
          localStorage.setItem('refresh-token', refresh_token)
          instance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${access_token}`
        }
        if (data.statusCode === 401) {
          localStorage.removeItem('access-token')
          localStorage.removeItem('refresh-token')
          toast.error('Your session has expired. Please login again.')
        }
      })

    return instance(config)
  }

  toast.error(error.message)

  return Promise.resolve(error)
}

instance.interceptors.request.use(onRequestFulfilled, onRequestRejected)

instance.interceptors.response.use(onResponseFulfilled, onResponseRejected)

export { instance as default }
