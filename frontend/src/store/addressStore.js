import { create } from 'zustand'
import { addressAPI } from '../api/addressAPI'

const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  // Adresleri getir
  fetchAddresses: async () => {
    set({ loading: true, error: null })
    try {
      const data = await addressAPI.getAddresses()
      set({ addresses: data.addresses, loading: false })
    } catch (error) {
      const message = error.response?.data?.message || 'Adresler yüklenemedi'
      set({ loading: false, error: message })
    }
  },

  // Adres ekle
  addAddress: async (addressData) => {
    set({ loading: true, error: null })
    try {
      const data = await addressAPI.createAddress(addressData)
      set({
        addresses: [...get().addresses, data.address],
        loading: false
      })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Adres eklenemedi'
      set({ loading: false, error: message })
      return { success: false, error: message }
    }
  },

  // Adres güncelle
  updateAddress: async (id, addressData) => {
    set({ loading: true, error: null })
    try {
      const data = await addressAPI.updateAddress(id, addressData)
      set({
        addresses: get().addresses.map(addr =>
          addr._id === id ? data.address : addr
        ),
        loading: false
      })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Adres güncellenemedi'
      set({ loading: false, error: message })
      return { success: false, error: message }
    }
  },

  // Adres sil
  deleteAddress: async (id) => {
    set({ loading: true, error: null })
    try {
      await addressAPI.deleteAddress(id)
      set({
        addresses: get().addresses.filter(addr => addr._id !== id),
        loading: false
      })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Adres silinemedi'
      set({ loading: false, error: message })
      return { success: false, error: message }
    }
  },

  // Varsayılan adres yap
  setDefaultAddress: async (id) => {
    set({ loading: true, error: null })
    try {
      await addressAPI.setDefaultAddress(id)
      set({
        addresses: get().addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === id
        })),
        loading: false
      })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'İşlem başarısız'
      set({ loading: false, error: message })
      return { success: false, error: message }
    }
  }
}))

export default useAddressStore