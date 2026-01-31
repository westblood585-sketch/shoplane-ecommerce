import { X, Package, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

function NotificationToast({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!notification) return null

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (notification.type) {
      case 'order-status':
        return <Package className="text-blue-600" size={24} />
      case 'new-order':
        return <ShoppingCart className="text-green-600" size={24} />
      case 'success':
        return <CheckCircle className="text-green-600" size={24} />
      case 'error':
        return <AlertCircle className="text-red-600" size={24} />
      default:
        return <Package className="text-blue-600" size={24} />
    }
  }

  return (
    <div className={`
      fixed top-20 right-4 z-50 bg-white shadow-2xl rounded-xl p-4 min-w-[300px] max-w-md
      transform transition-all duration-300
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600">
            {notification.message}
          </p>
          {notification.orderNumber && (
            <p className="text-xs text-gray-500 mt-2">
              Sipariş: {notification.orderNumber}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default NotificationToast