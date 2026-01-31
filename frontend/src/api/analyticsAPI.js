import API from './axiosConfig'

export const analyticsAPI = {
  // Dashboard istatistikleri
  getDashboardStats: async (startDate, endDate) => {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    
    const response = await API.get('/analytics/dashboard', { params })
    return response.data
  },

  // Satış raporu
  getSalesReport: async (period = 'month') => {
    const response = await API.get('/analytics/sales-report', { 
      params: { period } 
    })
    return response.data
  }
}