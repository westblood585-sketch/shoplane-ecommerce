import { useState, useEffect, useCallback } from 'react'
import socketService from '../services/socketService'
import useAuthStore from '../store/authStore'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const { user, isAuthenticated } = useAuthStore()

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { ...notification, id }])
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission()
      } catch (err) {
        console.log('Notification permission error:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Socket bağlantısı - error handling ekle
        socketService.connect(user._id)

        // Bildirimleri dinle
        socketService.onNotification((notification) => {
          addNotification(notification)
          
          // Tarayıcı bildirimi (izin varsa)
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/logo.png'
              })
            } catch (err) {
              console.log('Notification error:', err)
            }
          }
        })

        // Admin bildirimleri (sadece admin için)
        if (user.role === 'admin') {
          socketService.joinAdminRoom()
          socketService.onAdminNotification((notification) => {
            addNotification(notification)
          })
        }
      } catch (err) {
        console.log('Socket connection error:', err)
      }
    }

    return () => {
      try {
        socketService.disconnect()
      } catch (err) {
        console.log('Socket disconnect error:', err)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?._id, user?.role])

  return {
    notifications,
    addNotification,
    removeNotification,
    requestNotificationPermission
  }
}