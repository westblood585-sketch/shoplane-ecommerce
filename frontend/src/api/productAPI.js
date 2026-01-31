import API from './axiosConfig'

export const productAPI = {
  // Tüm ürünleri getir
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params })
    return response.data
  },

  // Tek ürün getir
  getProduct: async (id) => {
    const response = await API.get(`/products/${id}`)
    return response.data
  },

  // Öne çıkan ürünler
  getFeaturedProducts: async () => {
    const response = await API.get('/products/featured')
    return response.data
  },

  // Kategoriler
  getCategories: async () => {
    const response = await API.get('/products/categories')
    return response.data
  },

  // Markalar
  getBrands: async () => {
    const response = await API.get('/products/brands')
    return response.data
  },

  // Ürün oluştur (Admin)
  createProduct: async (productData) => {
    const response = await API.post('/products', productData)
    return response.data
  },

  // Ürün güncelle (Admin)
  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData)
    return response.data
  },

  // Ürün sil (Admin)
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`)
    return response.data
  },

  // Sık birlikte alınan ürünler
  getFrequentlyBoughtTogether: async (productId) => {
    const response = await API.get(`/products/${productId}/frequently-bought-together`)
    return response.data
  }
}