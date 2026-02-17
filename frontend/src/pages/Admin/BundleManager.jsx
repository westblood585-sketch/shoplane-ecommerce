import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import API from '../../api/axiosConfig'

function BundleManager() {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bundlePrice: '',
    discountPercent: '',
    stock: '100',
    products: [],
    isActive: true
  })

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      const response = await API.get('/bundles')
      setBundles(response.data.bundles)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Paketi silmek istediğinize emin misiniz?')) return
    try {
      await API.delete(`/bundles/${id}`)
      setBundles(bundles.filter(b => b._id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      bundlePrice: '',
      discountPercent: '',
      stock: '100',
      products: [],
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={24} className="text-purple-600" />
          <h1 className="text-3xl font-bold dark:text-dark-text">
            Paket Yönetimi
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Paket
        </button>
      </div>

      {/* Bundles List */}
      {!loading ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-dark-hover">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold dark:text-dark-text">
                    Paket Adı
                  </th>
                  <th className="px-6 py-4 text-left font-semibold dark:text-dark-text">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left font-semibold dark:text-dark-text">
                    İndirim
                  </th>
                  <th className="px-6 py-4 text-left font-semibold dark:text-dark-text">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-left font-semibold dark:text-dark-text">
                    Satılan
                  </th>
                  <th className="px-6 py-4 text-center font-semibold dark:text-dark-text">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-dark-border">
                {bundles.map((bundle) => (
                  <tr key={bundle._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover">
                    <td className="px-6 py-4 dark:text-dark-text">
                      {bundle.name}
                    </td>
                    <td className="px-6 py-4 dark:text-dark-text">
                      {bundle.bundlePrice?.toLocaleString('tr-TR')}₺
                    </td>
                    <td className="px-6 py-4 dark:text-dark-text">
                      %{bundle.discountPercent}
                    </td>
                    <td className="px-6 py-4 dark:text-dark-text">
                      {bundle.stock}
                    </td>
                    <td className="px-6 py-4 dark:text-dark-text">
                      {bundle.soldCount}
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(bundle._id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
    </div>
  )
}

export default BundleManager
