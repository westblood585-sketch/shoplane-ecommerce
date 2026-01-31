import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCompareStore = create(
  persist(
    (set, get) => ({
      compareList: [],

      // Karşılaştırmaya ekle/çıkar
      toggleCompare: (product) => {
        const list = get().compareList
        const exists = list.find(p => p._id === product._id)

        if (exists) {
          set({ compareList: list.filter(p => p._id !== product._id) })
          return { success: true, message: 'Karşılaştırmadan çıkarıldı', added: false }
        } else {
          if (list.length >= 4) {
            return { success: false, message: 'En fazla 4 ürün karşılaştırabilirsiniz' }
          }
          set({ compareList: [...list, product] })
          return { success: true, message: 'Karşılaştırmaya eklendi', added: true }
        }
      },

      // Tümünü temizle
      clearCompare: () => {
        set({ compareList: [] })
      },

      // Ürün karşılaştırmada mı?
      isInCompare: (productId) => {
        return get().compareList.some(p => p._id === productId)
      }
    }),
    {
      name: 'compare-storage'
    }
  )
)

export default useCompareStore