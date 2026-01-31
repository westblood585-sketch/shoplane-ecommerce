import API from './axiosConfig'

export const addressAPI = {
  // Tüm adresleri getir
  getAddresses: async () => {
    const response = await API.get('/addresses')
    return response.data
  },

  // Tek adres getir
  getAddress: async (id) => {
    const response = await API.get(`/addresses/${id}`)
    return response.data
  },

  // Adres oluştur
  createAddress: async (addressData) => {
    const response = await API.post('/addresses', addressData)
    return response.data
  },

  // Adres güncelle
  updateAddress: async (id, addressData) => {
    const response = await API.put(`/addresses/${id}`, addressData)
    return response.data
  },

  // Adres sil
  deleteAddress: async (id) => {
    const response = await API.delete(`/addresses/${id}`)
    return response.data
  },

  // Varsayılan adres yap
  setDefaultAddress: async (id) => {
    const response = await API.put(`/addresses/${id}/default`)
    return response.data
  }
}