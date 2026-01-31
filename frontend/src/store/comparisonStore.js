import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useComparisonStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToComparison: (product) => {
        const { items } = get()
        
        if (items.length >= 3) {
          alert('En fazla 3 ürün karşılaştırabilirsiniz')
          return
        }

        if (items.find(item => item._id === product._id)) {
          alert('Bu ürün zaten karşılaştırma listesinde')
          return
        }

        set({ items: [...items, product] })
      },

      removeFromComparison: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) })
      },

      clearComparison: () => {
        set({ items: [] })
      },

      isInComparison: (productId) => {
        return get().items.some(item => item._id === productId)
      }
    }),
    {
      name: 'comparison-storage'
    }
  )
)

export default useComparisonStore
