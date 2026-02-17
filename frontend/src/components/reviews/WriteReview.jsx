import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Upload, X, Image as ImageIcon, Video } from 'lucide-react'
import API from '../../api/axiosConfig'
import useAuthStore from '../../store/authStore'

function WriteReview({ productId, onSuccess, onClose }) {
  const { isAuthenticated } = useAuthStore()
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  })
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // Simüle: Gerçek uygulamada Cloudinary/S3'e yükle
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      caption: ''
    }))
    setImages([...images, ...newImages])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Yorum yapmak için giriş yapmalısınız')
      return
    }

    if (formData.rating === 0) {
      alert('Lütfen puan verin')
      return
    }

    setLoading(true)
    try {
      await API.post(`/products/${productId}/reviews`, {
        ...formData,
        images,
        videos
      })
      alert('Yorumunuz başarıyla eklendi!')
      onSuccess()
      onClose()
    } catch (error) {
      alert(error.response?.data?.message || 'Yorum eklenemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-xl p-6 border dark:border-dark-border"
    >
      <h3 className="text-2xl font-bold mb-6 dark:text-dark-text">Yorum Yaz</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
            Puanınız *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  fill={star <= (hoveredRating || formData.rating) ? '#FCD34D' : 'none'}
                  className="text-yellow-400"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
            Başlık *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Yorumunuzu özetleyin"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-hover dark:text-dark-text"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
            Yorumunuz *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Ürün hakkında deneyimlerinizi paylaşın"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-hover dark:text-dark-text resize-none"
            rows={6}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
            Fotoğraflar (Opsiyonel)
          </label>
          
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl hover:border-blue-500 transition cursor-pointer">
            <ImageIcon size={20} />
            <span className="font-semibold dark:text-dark-text">Fotoğraf Ekle</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-dark-border rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition dark:text-dark-text"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Yorum Yap'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default WriteReview