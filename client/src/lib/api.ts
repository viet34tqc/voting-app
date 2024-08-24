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
    const errorResponse = {
      message:
        // Error from backend: {message: ['Error message 1', 'Error message 2'], statusCode: 400}
        error instanceof AxiosError
          ? error.response?.data?.message.join(', ')
          : error?.message ?? 'Unknown error',
      statusCode: error.response?.status,
    }

    return Promise.reject(errorResponse)
  },
)

export default api
