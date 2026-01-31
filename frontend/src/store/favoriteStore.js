import { create } from 'zustand'
import { favoriteAPI } from '../api/favoriteAPI'

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  // Favorileri getir
  fetchFavorites: async () => {
    set({ loading: true, error: null })
    try {
      const data = await favoriteAPI.getFavorites()
      set({ favorites: data.favorites, loading: false })
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Favoriler yüklenemedi' 
      })
    }
  },

  // Favoriye ekle/çıkar (toggle)
  toggleFavorite: async (productId) => {
    try {
      const isFavorite = get().favorites.some(fav => fav.product._id === productId)

      if (isFavorite) {
        await favoriteAPI.removeFromFavorites(productId)
        set({ 
          favorites: get().favorites.filter(fav => fav.product._id !== productId) 
        })
      } else {
        const data = await favoriteAPI.addToFavorites(productId)
        set({ 
          favorites: [...get().favorites, data.favorite] 
        })
      }

      return { success: true, isFavorite: !isFavorite }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'İşlem başarısız' 
      }
    }
  },

  // Ürün favori mi kontrol et
  isFavorite: (productId) => {
    return get().favorites.some(fav => fav.product._id === productId)
  }
}))

export default useFavoriteStore