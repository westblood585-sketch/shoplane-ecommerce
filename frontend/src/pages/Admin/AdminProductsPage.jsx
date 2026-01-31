import { useState, useEffect } from 'react'
import { productAPI } from '../../api/productAPI'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    brand: '',
    stock: '',
    images: ['']
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getProducts({ limit: 100 })
      setProducts(data.products)
    } catch (error) {
      console.error('Products fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData)
      } else {
        await productAPI.createProduct(formData)
      }
      
      fetchProducts()
      setShowModal(false)
      resetForm()
    } catch (error) {
      alert(error.response?.data?.message || 'İşlem başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || '',
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      images: product.images
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      await productAPI.deleteProduct(id)
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Silme başarısız')
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      brand: '',
      stock: '',
      images: ['']
    })
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6">Ürün</th>
                  <th className="text-left py-4 px-6">Kategori</th>
                  <th className="text-left py-4 px-6">Marka</th>
                  <th className="text-left py-4 px-6">Fiyat</th>
                  <th className="text-left py-4 px-6">Stok</th>
                  <th className="text-left py-4 px-6">Durum</th>
                  <th className="text-left py-4 px-6">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{product.category}</td>
                    <td className="py-4 px-6">{product.brand}</td>
                    <td className="py-4 px-6 font-semibold">₺{product.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Ürün Ekle/Düzenle */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Fiyat</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Eski Fiyat (Opsiyonel)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Aksesuar">Aksesuar</option>
                      <option value="Ayakkabı">Ayakkabı</option>
                      <option value="Giyim">Giyim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Marka</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Resim URL</label>
                  <input
                    type="url"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage