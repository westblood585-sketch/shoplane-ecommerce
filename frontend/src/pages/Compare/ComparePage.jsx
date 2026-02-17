import { Link } from 'react-router-dom'
import { memo } from 'react'
import { X, ShoppingCart, Star } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import useCompareStore from '../../store/compareStore'
import useCartStore from '../../store/cartStore'

const ComparePage = memo(function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useCompareStore()
  const { addItem } = useCartStore()

  const handleAddToCart = (product) => {
    addItem(product, 'M', product.colors?.[0] || 'Standart', 1)
    alert('Ürün sepete eklendi!')
  }

  const features = [
    { key: 'price', label: 'Fiyat' },
    { key: 'brand', label: 'Marka' },
    { key: 'category', label: 'Kategori' },
    { key: 'rating', label: 'Puan' },
    { key: 'stock', label: 'Stok' },
    { key: 'colors', label: 'Renkler' },
    { key: 'sizes', label: 'Bedenler' }
  ]

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Karşılaştırma Listesi Boş</h1>
          <p className="text-gray-600 mb-8">Karşılaştırmak için ürün ekleyin</p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Ürünleri Keşfet
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Ürün Karşılaştırma</h1>
          <button
            onClick={clearCompare}
            className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            Tümünü Temizle
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-6 text-left font-bold w-48 bg-gray-50 sticky left-0">
                  Özellikler
                </th>
                {compareList.map(product => (
                  <th key={product._id} className="p-6 min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(product)}
                        className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <Link
                        to={`/products/${product._id}`}
                        className="font-bold hover:text-blue-600 transition line-clamp-2"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Fiyat */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Fiyat</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{product.price.toFixed(2)}
                    </div>
                    {product.oldPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ₺{product.oldPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Marka */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Marka</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">{product.brand}</td>
                ))}
              </tr>

              {/* Kategori */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Kategori</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">{product.category}</td>
                ))}
              </tr>

              {/* Puan */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Değerlendirme</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                            color="#FCD34D"
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-sm text-gray-600">({product.numReviews})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stok */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Stok Durumu</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Renkler */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Renk Seçenekleri</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    {product.colors?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Bedenler */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-6 font-semibold bg-gray-50 sticky left-0">Beden Seçenekleri</td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    {product.sizes?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/*İşlemler */}
              <tr>
                <td className="p-6 font-semibold bg-gray-50 sticky left-0"> İşlemler </td>
                {compareList.map(product => (
                  <td key={product._id} className="p-6">
                    <div className="space-y-2">
                      <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover :bg-blue-700 transition disabled :opacity-50 disabled :cursor-not-allowed " >
                        <ShoppingCart size={20} />
                        Sepete Ekle
                      </button>
                      <Link to={`/products/${product._id}`} className="block w-full py-3 border-2 border-blue-600 text-blue-600 text-center rounded-lg font-semibold hover :bg-blue-50 transition" > Detayları Gör
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  )
})

export default ComparePage