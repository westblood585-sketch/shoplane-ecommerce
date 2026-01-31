import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Token ekle
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Hata yönetimi
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz - sadece bazı endpoint'ler için login'e yönlendir
      // favorites, chat gibi opsiyonel endpoint'ler için yönlendirme yapma
      const url = error.config?.url || ''
      const skipRedirectEndpoints = ['/favorites', '/chat', '/notifications']
      const shouldSkipRedirect = skipRedirectEndpoints.some(ep => url.includes(ep))
      
      if (!shouldSkipRedirect && window.location.pathname !== '/login') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API