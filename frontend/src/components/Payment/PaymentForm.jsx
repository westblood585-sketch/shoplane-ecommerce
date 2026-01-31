import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'

function PaymentForm({ onSubmit, loading }) {
  const [cardDetails, setCardDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: ''
  })

  const [use3D, setUse3D] = useState(true)

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardDetails({ ...cardDetails, cardNumber: formatted })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(cardDetails, use3D)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Kart Üzerindeki İsim</label>
        <input
          type="text"
          value={cardDetails.cardHolderName}
          onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value.toUpperCase() })}
          placeholder="AHMET YILMAZ"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Kart Numarası</label>
        <div className="relative">
          <input
            type="text"
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <CreditCard className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Ay</label>
          <input
            type="text"
            value={cardDetails.expireMonth}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                setCardDetails({ ...cardDetails, expireMonth: value })
              }
            }}
            placeholder="MM"
            maxLength="2"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Yıl</label>
          <input
            type="text"
            value={cardDetails.expireYear}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              setCardDetails({ ...cardDetails, expireYear: value })
            }}
            placeholder="YY"
            maxLength="2"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">CVV</label>
          <input
            type="text"
            value={cardDetails.cvc}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              setCardDetails({ ...cardDetails, cvc: value })
            }}
            placeholder="123"
            maxLength="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="use3D"
          checked={use3D}
          onChange={(e) => setUse3D(e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        <label htmlFor="use3D" className="text-sm">
          3D Secure ile öde (Önerilen)
        </label>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Ödemeniz 256-bit SSL sertifikası ile güvence altındadır.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            İşleniyor...
          </>
        ) : (
          <>
            <Lock size={20} />
            Ödemeyi Tamamla
          </>
        )}
      </button>

      {/* Test Kartları */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-xs font-semibold text-blue-900 mb-2">Test Kartları (Sandbox):</p>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Başarılı: 5528 7900 0000 0001</div>
          <div>• Başarısız: 5528 7900 0000 0002</div>
          <div>• 3D Secure: 5528 7900 0000 0003</div>
          <div className="text-xs text-blue-600 mt-2">CVV: 123, Tarih: 12/30</div>
        </div>
      </div>
    </form>
  )
}

export default PaymentForm