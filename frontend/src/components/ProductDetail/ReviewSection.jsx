import { useState, useEffect } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { reviewAPI } from '../../api/reviewAPI'
import useAuthStore from '../../store/authStore'

function ReviewSection({ productId }) {
  const { isAuthenticated, user } = useAuthStore()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const data = await reviewAPI.getReviews(productId)
      setReviews(data.reviews)
    } catch (error) {
      console.error('Reviews fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      alert('Yorum yapmak için giriş yapmalısınız')
      return
    }

    try {
      await reviewAPI.createReview(productId, formData)
      setFormData({ rating: 5, comment: '' })
      setShowForm(false)
      fetchReviews()
      alert('Yorumunuz başarıyla eklendi!')
    } catch (error) {
      alert(error.response?.data?.message || 'Yorum eklenemedi')
    }
  }

  const RatingStars = ({ rating, onChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition'}
            disabled={readonly}
          >
            <Star
              size={readonly ? 20 : 24}
              fill={star <= rating ? '#FCD34D' : 'none'}
              color="#FCD34D"
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  return (
    <div>
      {/* Yorum Yaz Butonu */}
      {isAuthenticated && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition mb-6"
        >
          Yorum Yaz
        </button>
      )}

      {/* Yorum Formu */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Yorumunuzu Yazın</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Puanınız</label>
            <RatingStars 
              rating={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Yorumunuz</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
              required
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Gönder
            </button>
          </div>
        </form>
      )}

      {/* Yorumlar */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-semibold">{review.user?.name || 'Anonim'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <RatingStars rating={review.rating} readonly />
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <ThumbsUp size={16} />
                Faydalı ({review.helpful || 0})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewSection