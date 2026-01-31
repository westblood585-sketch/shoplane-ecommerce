import { useState } from 'react'
import { Star, Truck, Shield, RotateCcw } from 'lucide-react'

function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')

  const tabs = [
    { id: 'description', label: 'Açıklama' },
    { id: 'features', label: 'Özellikler' },
    { id: 'reviews', label: 'Yorumlar' },
    { id: 'shipping', label: 'Kargo & İade' }
  ]

  const mockReviews = [
    {
      id: 1,
      user: 'Ahmet Y.',
      rating: 5,
      date: '15 Aralık 2024',
      comment: 'Harika bir ürün! Beklentilerimin üzerinde geldi. Kesinlikle tavsiye ederim.',
      helpful: 24
    },
    {
      id: 2,
      user: 'Ayşe K.',
      rating: 4,
      date: '10 Aralık 2024',
      comment: 'Kalitesi çok iyi, fiyatına göre mükemmel. Sadece kargo biraz geç geldi.',
      helpful: 18
    },
    {
      id: 3,
      user: 'Mehmet S.',
      rating: 5,
      date: '5 Aralık 2024',
      comment: 'İkinci kez alıyorum, çok memnunum. Herkese öneririm.',
      helpful: 32
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === tab.id
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.name} size en yüksek kalitede hizmet sunmak için özel olarak tasarlanmıştır. 
              Premium malzemeler kullanılarak üretilmiştir ve uzun ömürlü kullanım için test edilmiştir.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ürünümüz günlük kullanıma uygun olup, modern tasarımı ile dikkat çekmektedir. 
              Ergonomik yapısı sayesinde uzun süreli kullanımlarda bile rahatlık sağlar.
            </p>
            <h3 className="font-bold text-lg mb-2 mt-6">Öne Çıkan Avantajlar:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Yüksek kaliteli malzeme</li>
              <li>Uzun ömürlü kullanım</li>
              <li>Modern ve şık tasarım</li>
              <li>Kolay bakım ve temizlik</li>
              <li>2 yıl garanti</li>
            </ul>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Marka</p>
              <p className="font-semibold">{product.brand}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Kategori</p>
              <p className="font-semibold">{product.category}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Renk</p>
              <p className="font-semibold">{product.color}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Stok Kodu</p>
              <p className="font-semibold">SKU-{product.id.toString().padStart(6, '0')}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Garanti Süresi</p>
              <p className="font-semibold">2 Yıl</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Menşei</p>
              <p className="font-semibold">Türkiye</p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Genel Puan */}
            <div className="flex items-center gap-8 pb-6 border-b">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{product.rating}</div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                      color="#FCD34D"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{product.reviews} değerlendirme</p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yorumlar */}
            {mockReviews.map(review => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? '#FCD34D' : 'none'}
                        color="#FCD34D"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Faydalı buldum ({review.helpful})
                </button>
              </div>
            ))}

            <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
              Yorum Yaz
            </button>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <Truck className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-lg mb-2">Kargo Bilgileri</h3>
                <p className="text-gray-700 mb-2">
                  Siparişiniz 1-3 iş günü içinde kargoya verilir.
                </p>
                <p className="text-gray-700">
                  <strong>Ücretsiz Kargo:</strong> 500 TL ve üzeri alışverişlerinizde kargo ücretsizdir.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <RotateCcw className="text-green-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-lg mb-2">İade Koşulları</h3>
                <p className="text-gray-700 mb-2">
                  Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.
                </p>
                <p className="text-gray-700">
                  İade edilecek ürün kullanılmamış ve orijinal ambalajında olmalıdır.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Shield className="text-purple-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-lg mb-2">Garanti</h3>
                <p className="text-gray-700">
                  Tüm ürünlerimiz 2 yıl resmi distribütör garantisi altındadır.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs