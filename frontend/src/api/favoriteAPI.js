import API from './axiosConfig'

export const favoriteAPI = {
  // Favorileri getir
  getFavorites: async () => {
    const response = await API.get('/favorites')
    return response.data
  },

  // Favoriye ekle
  addToFavorites: async (productId) => {
    const response = await API.post(`/favorites/${productId}`)
    return response.data
  },

  // Favorilerden çıkar
  removeFromFavorites: async (productId) => {
    const response = await API.delete(`/favorites/${productId}`)
    return response.data
  },

  // Favori mi kontrol et
  checkFavorite: async (productId) => {
    const response = await API.get(`/favorites/check/${productId}`)
    return response.data
  }
}