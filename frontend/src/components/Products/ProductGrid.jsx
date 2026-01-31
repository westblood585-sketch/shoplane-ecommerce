import ProductCard from '../common/ProductCard'
import { Grid, List } from 'lucide-react'

function ProductGrid({ products, viewMode, setViewMode, totalProducts }) {
  return (
    <div>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          <span className="font-semibold">{totalProducts}</span> ürün bulundu
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <ProductCardList key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* No Results */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-semibold mb-2">Ürün Bulunamadı</h3>
          <p className="text-gray-600">Filtrelerinizi değiştirmeyi deneyin</p>
        </div>
      )}
    </div>
  )
}

// List View için özel kart
function ProductCardList({ product }) {
  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition">
      <img 
        src={product.images?.[0]} 
        alt={product.name}
        className="w-32 h-32 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category} • {product.brand}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-blue-600">
            ₺{product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-gray-400 line-through">
                ₺{product.oldPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                %{discountPercentage} İNDİRİM
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">⭐ {product.rating}</span>
          <span className="text-sm text-gray-600">({product.numReviews} yorum)</span>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
          </span>
        </div>
      </div>

      <button className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition h-fit">
        Sepete Ekle
      </button>
    </div>
  )
}

export default ProductGrid