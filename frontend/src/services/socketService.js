import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        withCredentials: true
      })

      this.socket.on('connect', () => {
        console.log('🔌 Socket connected:', this.socket.id)
        
        if (userId) {
          this.socket.emit('join-user-room', userId)
        }
      })

      this.socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected')
      })
    }

    return this.socket
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join-admin-room')
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback)
    }
  }

  onAdminNotification(callback) {
    if (this.socket) {
      this.socket.on('admin-notification', callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new SocketService()