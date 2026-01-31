import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      couponCode: '',
      couponDiscount: 0,

      // Sepete ürün ekle
      addItem: (product, size, color, quantity = 1) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          item => 
            item._id === product._id && 
            item.size === size && 
            item.color === color
        )

        if (existingItemIndex > -1) {
          // Ürün zaten varsa miktarı artır
          const newItems = [...items]
          const newQuantity = newItems[existingItemIndex].quantity + quantity
          
          // Stok kontrolü
          if (newQuantity > product.stock) {
            alert('Maksimum stok miktarına ulaştınız!')
            return
          }
          
          newItems[existingItemIndex].quantity = newQuantity
          set({ items: newItems })
        } else {
          // Yeni ürün ekle
          set({
            items: [
              ...items,
              {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || product.image,
                brand: product.brand,
                category: product.category,
                stock: product.stock,
                size: size || 'Standart',
                color: color || 'Standart',
                quantity,
                cartId: `${product._id}-${size}-${color}-${Date.now()}`
              }
            ]
          })
        }
      },

      // Ürün miktarını güncelle
      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) return
        
        const items = get().items
        const item = items.find(i => i.cartId === cartId)
        
        if (item && quantity > item.stock) {
          alert('Maksimum stok miktarına ulaştınız!')
          return
        }
        
        set({
          items: items.map(item =>
            item.cartId === cartId ? { ...item, quantity } : item
          )
        })
      },

      // Ürünü sepetten kaldır
      removeItem: (cartId) => {
        set({
          items: get().items.filter(item => item.cartId !== cartId)
        })
      },

      // Sepeti temizle
      clearCart: () => {
        set({ items: [], couponCode: '', couponDiscount: 0 })
      },

      // Kupon uygula
      applyCoupon: (code) => {
        const validCoupons = {
          'ILKALIŞVERIŞ': 10,
          'YENIYIL2025': 15,
          'KAMPANYA50': 50
        }

        if (validCoupons[code.toUpperCase()]) {
          set({
            couponCode: code.toUpperCase(),
            couponDiscount: validCoupons[code.toUpperCase()]
          })
          return true
        }
        return false
      },

      // Kuponu kaldır
      removeCoupon: () => {
        set({ couponCode: '', couponDiscount: 0 })
      },

      // Toplam hesaplamaları
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 500 ? 0 : 29.99
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal()
        return (subtotal * get().couponDiscount) / 100
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const discount = get().getDiscount()
        return subtotal + shipping - discount
      },

      // Sepetteki toplam ürün sayısı
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore