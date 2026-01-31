import { create } from 'zustand'

const useRecentlyViewedStore = create((set, get) => ({
  recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),

  addToRecentlyViewed: (product) => {
    const { recentlyViewed } = get()
    
    // Eğer ürün zaten varsa, önce çıkar
    const filtered = recentlyViewed.filter(p => p._id !== product._id)
    
    // Başa ekle
    const updated = [product, ...filtered].slice(0, 10) // Max 10 ürün
    
    set({ recentlyViewed: updated })
    localStorage.setItem('recentlyViewed', JSON.stringify(updated))
  },

  clearRecentlyViewed: () => {
    set({ recentlyViewed: [] })
    localStorage.removeItem('recentlyViewed')
  }
}))

export default useRecentlyViewedStore