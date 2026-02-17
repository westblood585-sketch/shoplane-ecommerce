import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-hot-toast'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      couponCode: '',
      couponDiscount: 0,
      giftWrap: null,
      bundles: [], // NEW: Bundle items

      // Sepete ürün ekle
      addItem: (product, size = 'Standart', color = 'Standart', quantity = 1, options = {}) => {
        const { items } = get()

        // Create unique ID for cart item based on product + variants + subscription options
        const cartItemId = `${product._id}-${size}-${color}${options.isSubscription ? `-${options.plan}` : ''}`

        const existingItem = items.find(item => item.cartItemId === cartItemId || (item._id === product._id && item.size === size && item.color === color && !item.isSubscription && !options.isSubscription))

        if (existingItem) {
          // Check stock limit
          if (existingItem.quantity + quantity > product.stock) {
            toast.error('Stok limitine ulaşıldı!')
            return
          }

          set({
            items: items.map(item =>
              (item.cartItemId === cartItemId || item._id === existingItem._id)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
          toast.success('Sepet güncellendi!')
        } else {
          if (quantity > product.stock) {
            toast.error('Yetersiz stok!')
            return
          }

          set({
            items: [...items, {
              ...product,
              cartItemId,
              size: size,
              color: color,
              selectedSize: size, // Keep both for compatibility
              selectedColor: color, // Keep both for compatibility
              quantity,
              // Subscription specific fields
              isSubscription: options.isSubscription,
              plan: options.plan,
              discount: options.discount,
              originalPrice: product.price,
              price: options.price || product.price, // Use subscription price if provided
              isNew: undefined // Clean up
            }]
          })
          toast.success('Sepete eklendi!')

          // Track funnel event
          if (window.trackFunnelEvent) {
            window.trackFunnelEvent('add_to_cart', {
              productId: product._id,
              productName: product.name,
              quantity,
              price: product.price
            })
          }

          // Track journey touchpoint
          if (window.trackJourneyTouchpoint) {
            window.trackJourneyTouchpoint('add_to_cart', {
              product: product._id,
              metadata: {
                quantity,
                price: product.price,
                productName: product.name
              }
            })
          }
        }
      },

      // Ürün miktarını güncelle
      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) return

        const items = get().items
        const item = items.find(i => i.cartItemId === cartId || i.cartId === cartId)

        if (item && quantity > item.stock) {
          toast.error('Maksimum stok miktarına ulaştınız!')
          return
        }

        set({
          items: items.map(item =>
            (item.cartItemId === cartId || item.cartId === cartId) ? { ...item, quantity } : item
          )
        })
      },

      // Ürünü sepetten kaldır
      removeItem: (cartId) => {
        set({
          items: get().items.filter(item => (item.cartItemId !== cartId && item.cartId !== cartId))
        })
      },

      // Sepeti temizle
      clearCart: () => {
        set({ items: [], couponCode: '', couponDiscount: 0, giftWrap: null })
      },

      // Gift wrap functions
      setGiftWrap: (wrap) => {
        set({ giftWrap: wrap })
      },

      removeGiftWrap: () => {
        set({ giftWrap: null })
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
        const { items, bundles } = get()
        const itemsTotal = items.reduce((total, item) => {
          return total + (item.product.price * item.quantity)
        }, 0)
        const bundlesTotal = bundles.reduce((total, bundle) => {
          return total + (bundle.price * bundle.quantity)
        }, 0)
        return itemsTotal + bundlesTotal
      },

      // Sepetteki toplam ürün sayısı
      getTotalItems: () => {
        const { items, bundles } = get()
        const itemsCount = items.reduce((count, item) => count + item.quantity, 0)
        const bundlesCount = bundles.reduce((count, bundle) => count + bundle.quantity, 0)
        return itemsCount + bundlesCount
      },

      // Bundle işlemleri
      addBundleToCart: (bundle, quantity = 1, selectedProducts = []) => {
        const { bundles } = get()
        const existingIndex = bundles.findIndex(
          b => b.bundle._id === bundle._id &&
          JSON.stringify(b.selectedProducts) === JSON.stringify(selectedProducts)
        )
        if (existingIndex !== -1) {
          const newBundles = [...bundles]
          newBundles[existingIndex].quantity += quantity
          set({ bundles: newBundles })
        } else {
          set({
            bundles: [
              ...bundles,
              {
                bundle,
                quantity,
                selectedProducts,
                price: bundle.pricing.finalPrice
              }
            ]
          })
        }
      },
      removeBundleFromCart: (bundleId, selectedProducts = []) => {
        set({
          bundles: get().bundles.filter(
            b => !(b.bundle._id === bundleId &&
              JSON.stringify(b.selectedProducts) === JSON.stringify(selectedProducts))
          )
        })
      },
      updateBundleQuantity: (bundleId, selectedProducts, quantity) => {
        const { bundles } = get()
        const newBundles = bundles.map(b => {
          if (b.bundle._id === bundleId &&
              JSON.stringify(b.selectedProducts) === JSON.stringify(selectedProducts)) {
            return { ...b, quantity: Math.max(1, quantity) }
          }
          return b
        })
        set({ bundles: newBundles })
      },
      clearBundles: () => set({ bundles: [] }),
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore