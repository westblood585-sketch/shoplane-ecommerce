import API from './axiosConfig'

export const chatAPI = {
  // Sohbet başlat/getir
  getOrCreateChat: async () => {
    const response = await API.get('/chat')
    return response.data
  },

  // Mesaj gönder
  sendMessage: async (message) => {
    const response = await API.post('/chat/message', { message })
    return response.data
  },

  // Tüm sohbetleri getir (Admin)
  getAllChats: async () => {
    const response = await API.get('/chat/all')
    return response.data
  },

  // Admin mesaj gönder
  sendAdminMessage: async (chatId, message) => {
    const response = await API.post(`/chat/${chatId}/admin-message`, { message })
    return response.data
  },

  // Sohbeti kapat
  closeChat: async (chatId) => {
    const response = await API.put(`/chat/${chatId}/close`)
    return response.data
  }
}