import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Search, Loader } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axiosConfig'

function VisualSearch({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      alert('Kamera özelliği yakında gelecek!')
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      alert('Kamera erişimi reddedildi')
    }
  }

  const handleSearch = async () => {
    if (!selectedImage) return

    setSearching(true)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await API.post('/products/visual-search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResults(response.data.products || [])
    } catch (error) {
      console.error('Visual search error:', error)
      alert('Arama başarısız oldu')
    } finally {
      setSearching(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
    onClose()
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResults([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b dark:border-dark-border">
                <h2 className="text-2xl font-bold dark:text-dark-text flex items-center gap-2">
                  <Camera size={24} className="text-purple-600" />
                  Görsel Arama
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {results.length === 0 ? (
                  <>
                    {/* Upload Area */}
                    {!previewUrl ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                          isDragActive
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-300 dark:border-dark-border hover:border-purple-400'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload size={48} className="mx-auto mb-3 text-gray-400" />
                        <p className="text-lg font-semibold mb-2 dark:text-dark-text">
                          {isDragActive
                            ? 'Resmi buraya bırak...'
                            : 'Resmi sürükle veya tıkla'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PNG, JPG, WEBP formatlarında resimler desteklenir
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Preview */}
                        <div className="mb-6">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full max-h-96 object-contain rounded-lg mb-4"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleReset}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-dark-border rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition"
                            >
                              Değiştir
                            </button>
                            <button
                              onClick={handleSearch}
                              disabled={searching}
                              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {searching ? (
                                <>
                                  <Loader size={20} className="animate-spin" />
                                  Aranıyor...
                                </>
                              ) : (
                                <>
                                  <Search size={20} />
                                  Benzerlerini Bul
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Camera Button */}
                    {!previewUrl && (
                      <div className="mt-6 pt-6 border-t dark:border-dark-border">
                        <button
                          onClick={handleCameraCapture}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <Camera size={20} />
                          Kamera ile Çek
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Results */}
                    <div>
                      <h3 className="text-lg font-bold mb-4 dark:text-dark-text">
                        Benzer Ürünler ({results.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {results.map((product) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => handleProductClick(product._id)}
                            className="cursor-pointer group"
                          >
                            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-hover h-48 mb-2">
                              <img
                                src={product.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23e5e7eb"/%3E%3Ctext x="50%" y="50%" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle" font-family="system-ui"%3ENo Image%3C/text%3E%3C/svg%3E'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <p className="font-semibold text-sm line-clamp-2 dark:text-dark-text mb-1">
                              {product.name}
                            </p>
                            <p className="text-purple-600 font-bold">
                              ₺{product.price?.toFixed(2)}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={handleReset}
                        className="w-full mt-6 px-4 py-3 border-2 border-gray-300 dark:border-dark-border rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition"
                      >
                        Yeni Arama Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default VisualSearch
