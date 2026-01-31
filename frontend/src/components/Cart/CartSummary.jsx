import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { Ticket, Truck, X, CheckCircle } from 'lucide-react'

function CartSummary() {
  const navigate = useNavigate()
  const {
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCartStore()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponError, setCouponError] = useState('')

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const discount = getDiscount()
  const total = getTotal()

  const handleApplyCoupon = () => {
    if (!inputCoupon.trim()) {
      setCouponError('Lütfen bir kupon kodu girin')
      return
    }

    const success = applyCoupon(inputCoupon)
    if (success) {
      setCouponError('')
      setInputCoupon('')
    } else {
      setCouponError('Geçersiz kupon kodu!')
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponError('')
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>

      {/* Kupon Kodu */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
          <Ticket size={18} />
          İndirim Kodu
        </label>
        
        {couponCode ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-semibold text-green-900">{couponCode}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                placeholder="Kupon kodunuz"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Uygula
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
          </>
        )}

        {/* Geçerli Kuponlar Listesi */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Geçerli Kuponlar:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• <strong>ILKALIŞVERIŞ</strong> - %10 indirim</div>
            <div>• <strong>YENIYIL2025</strong> - %15 indirim</div>
            <div>• <strong>KAMPANYA50</strong> - %50 indirim</div>
          </div>
        </div>
      </div>

      {/* Fiyat Detayları */}
      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Ara Toplam:</span>
          <span className="font-semibold">₺{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-700">
          <div className="flex items-center gap-2">
            <Truck size={18} />
            <span>Kargo:</span>
          </div>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">ÜCRETSİZ</span>
            ) : (
              `₺${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {shipping > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>₺{(500 - subtotal).toFixed(2)}</strong> daha alışveriş yapın, kargo bedava!
            </p>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>İndirim ({couponCode}):</span>
            <span className="font-semibold">-₺{discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Toplam */}
      <div className="flex justify-between items-center mb-6 text-2xl font-bold">
        <span>Toplam:</span>
        <span className="text-blue-600">₺{total.toFixed(2)}</span>
      </div>

      {/* Ödemeye Geç Butonu */}
      <button
        onClick={handleCheckout}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
      >
        Ödemeye Geç
      </button>

      {/* Güvenlik Rozetleri */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-600">Güvenli Ödeme</p>
          </div>
          <div>
            <div className="text-2xl mb-1">↩️</div>
            <p className="text-xs text-gray-600">Kolay İade</p>
          </div>
          <div>
            <div className="text-2xl mb-1">✓</div>
            <p className="text-xs text-gray-600">Hızlı Teslimat</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSummary