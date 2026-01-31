// Socket.io ile bildirim gönder
exports.sendNotification = (userId, notification) => {
  if (global.io) {
    global.io.to(`user-${userId}`).emit('notification', notification)
    console.log(`📢 Notification sent to user ${userId}`)
  }
}

// Admin'e bildirim gönder
exports.sendAdminNotification = (notification) => {
  if (global.io) {
    global.io.to('admin-room').emit('admin-notification', notification)
    console.log('📢 Admin notification sent')
  }
}

// Sipariş durumu bildirimi
exports.sendOrderStatusUpdate = (order, userId) => {
  const statusMessages = {
    pending: 'Siparişiniz alındı ve hazırlanıyor',
    processing: 'Siparişiniz işleniyor',
    shipped: 'Siparişiniz kargoya verildi',
    delivered: 'Siparişiniz teslim edildi',
    cancelled: 'Siparişiniz iptal edildi'
  }

  const notification = {
    type: 'order-status',
    title: 'Sipariş Durumu Güncellendi',
    message: statusMessages[order.status],
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    timestamp: new Date()
  }

  exports.sendNotification(userId, notification)
}

// Yeni sipariş bildirimi (Admin'e)
exports.sendNewOrderNotification = (order) => {
  const notification = {
    type: 'new-order',
    title: 'Yeni Sipariş!',
    message: `${order.orderNumber} numaralı yeni sipariş alındı`,
    orderId: order._id,
    orderNumber: order.orderNumber,
    totalPrice: order.totalPrice,
    timestamp: new Date()
  }

  exports.sendAdminNotification(notification)
}