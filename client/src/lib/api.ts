import axios, { AxiosError, AxiosResponse } from 'axios'

const baseApiUrl = import.meta.env.VITE_API_BACKEND_HOST

// Create an Axios instance
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add an interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // Error from data validation is: {message: ['Error message 1', 'Error message 2'], statusCode: 400} or just {message: 'Error message', statusCode: 400}
    const message = error instanceof AxiosError ? error.response?.data?.message : error?.message
    const normalizedMessage = Array.isArray(message) ? message.join(', ') : message
    const errorResponse = {
      message: normalizedMessage ?? 'Unknown error',
      statusCode: error.response?.status,
    }

    return Promise.reject(errorResponse)
  },
)

export default api
