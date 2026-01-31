import { Heart } from 'lucide-react'
import { useState } from 'react'
import useFavoriteStore from '../../store/favoriteStore'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

function FavoriteButton({ productId, size = 20, className = '' }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const [loading, setLoading] = useState(false)

  const favorite = isFavorite(productId)

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)
    const result = await toggleFavorite(productId)
    setLoading(false)

    if (!result.success) {
      alert(result.error)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        p-2 rounded-full transition-all
        ${favorite 
          ? 'bg-red-500 hover:bg-red-600 scale-110' 
          : 'bg-white hover:bg-gray-100'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
    >
      <Heart
        size={size}
        fill={favorite ? 'white' : 'none'}
        color={favorite ? 'white' : 'currentColor'}
        className={loading ? 'animate-pulse' : ''}
      />
    </button>
  )
}

export default FavoriteButton