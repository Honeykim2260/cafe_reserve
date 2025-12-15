import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '@/constants'
import { ApiResponse } from '../../../shared/src/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Don't redirect if already on login page to avoid infinite refresh
          if (!window.location.pathname.includes('/auth/login')) {
            // Token expired or invalid
            localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(
      url,
      config
    )
    return response.data
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
      url,
      data,
      config
    )
    return response.data
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(
      url,
      data,
      config
    )
    return response.data
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(
      url,
      config
    )
    return response.data
  }

  // File upload method
  async uploadFile<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      }
    )
    return response.data
  }
}

export const apiClient = new ApiClient()
export const api = apiClient  // Add alias for compatibility
export default apiClient