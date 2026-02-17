import API from './axiosConfig'

export const authAPI = {
  // Kayıt ol
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData)

      // Data ve token'ı kontrol et
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response?.data || { success: false, message: 'Geçersiz sunucu yanıtı' }
    } catch (error) {
      console.error('authAPI.register Error:', error)
      throw error
    }
  },

  // Giriş yap
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password })
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response?.data || { success: false, message: 'Geçersiz sunucu yanıtı' }
    } catch (error) {
      console.error('authAPI.login Error:', error)
      throw error
    }
  },

  // Social Login
  socialLogin: async (providerData) => {
    try {
      const response = await API.post('/auth/social-login', providerData)
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response
    } catch (error) {
      console.error('authAPI.socialLogin Error:', error)
      throw error
    }
  },

  // Çıkış yap
  logout: async () => {
    const response = await API.post('/auth/logout')
    localStorage.removeItem('token')
    return response.data
  },

  // Mevcut kullanıcı
  getMe: async () => {
    const response = await API.get('/auth/me')
    return response.data
  },

  // Profil güncelle
  updateProfile: async (userData) => {
    const response = await API.put('/auth/profile', userData)
    return response.data
  },

  // Şifre değiştir
  changePassword: async (currentPassword, newPassword) => {
    const response = await API.put('/auth/password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Şifremi unuttum
  forgotPassword: async (email) => {
    const response = await API.post('/auth/forgot-password', { email })
    return response.data
  },

  // Şifre sıfırla
  resetPassword: async (resetToken, password) => {
    const response = await API.put(`/auth/reset-password/${resetToken}`, { password })
    return response.data
  }
}