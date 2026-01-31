import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import OptimizedImage from './OptimizedImage'
import FavoriteButton from './FavoriteButton'
import CompareButton from './CompareButton'

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCartStore()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addItem(product, 'M', product.color, 1)
    alert('Ürün sepete eklendi!')
  }

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ürün Resmi */}
      <div className="relative h-64 overflow-hidden bg-gray-100 group">
        <OptimizedImage 
          src={product.images?.[0] || product.image} // Backend'den gelen images array
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Favori Butonu - Sağ üst köşe */}
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={product._id} />
        </div>
        
        {/* İndirim Rozeti */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            %{discountPercentage} İNDİRİM
          </div>
        )}

        {/* Stok Durumu */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
            Tükendi
          </div>
        )}

        {/* Hover Butonları */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full transition-colors ${
              isFavorite ? 'bg-red-500' : 'bg-white'
            }`}
          >
            <Heart 
              size={20} 
              fill={isFavorite ? 'white' : 'none'}
              color={isFavorite ? 'white' : 'black'}
            />
          </button>
          <CompareButton product={product} />
          <Link 
            to={`/products/${product._id || product.id}`}
            className="px-6 py-3 bg-white rounded-full font-semibold hover:bg-gray-100"
          >
            Ürünü Gör
          </Link>
        </div>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={16} fill="#FCD34D" color="#FCD34D" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-gray-400">(125 yorum)</span>
        </div>

        {/* Fiyat */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ₺{product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₺{product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Sepete Ekle Butonu */}
        <button 
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            product.inStock 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard