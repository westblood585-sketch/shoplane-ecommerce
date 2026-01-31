import API from './axiosConfig'

export const reviewAPI = {
  // Ürün yorumlarını getir
  getReviews: async (productId) => {
    const response = await API.get(`/products/${productId}/reviews`)
    return response.data
  },

  // Yorum ekle
  createReview: async (productId, reviewData) => {
    const response = await API.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Yorum güncelle
  updateReview: async (id, reviewData) => {
    const response = await API.put(`/reviews/${id}`, reviewData)
    return response.data
  },

  // Yorum sil
  deleteReview: async (id) => {
    const response = await API.delete(`/reviews/${id}`)
    return response.data
  }
}