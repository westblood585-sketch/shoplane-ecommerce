import API from './axiosConfig'

export const paymentAPI = {
  // Ödeme başlat
  checkout: async (orderId, cardDetails) => {
    const response = await API.post('/payment/checkout', {
      orderId,
      cardDetails
    })
    return response.data
  },

  // 3D Secure ödeme
  checkout3D: async (orderId, cardDetails) => {
    const response = await API.post('/payment/3d-secure', {
      orderId,
      cardDetails
    })
    return response.data
  }
}