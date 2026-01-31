import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { discountedProducts } from '../../data/mockProducts'
import { Clock, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = new Date(endTime).getTime() - now

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}s ${minutes}d ${seconds}sn`)
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock size={18} />
      <span className="font-mono font-bold">{timeLeft}</span>
    </div>
  )
}

function DiscountSlider() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">⚡ Flaş İndirimler</h2>
        <p className="text-gray-600">Kaçırılmayacak fırsatlar - Sınırlı stok!</p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className="pb-12"
      >
        {discountedProducts.map(product => (
          <SwiperSlide key={product.id}>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl overflow-hidden shadow-xl">
              <div className="relative h-64">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg">
                  %{product.discount} İNDİRİM
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ₺{product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-red-200 line-through">
                    ₺{product.oldPrice.toFixed(2)}
                  </span>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <CountdownTimer endTime={product.endTime} />
                </div>

                <button className="w-full bg-white text-red-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                  <ShoppingCart size={20} />
                  Hemen Al
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default DiscountSlider