import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../../components/seo/SEO'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import ProductCardV2 from '../../components/common/ProductCardV2'
import FrequentlyBoughtTogether from '../../components/product/FrequentlyBoughtTogether'
import { productAPI } from '../../api/productAPI'
import useCartStore from '../../store/cartStore'
import useFavoriteStore from '../../store/favoriteStore'
import useAuthStore from '../../store/authStore'
import useRecentlyViewedStore from '../../store/recentlyViewedStore' // YENİ

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { isAuthenticated } = useAuthStore()
  const { addToRecentlyViewed } = useRecentlyViewedStore() // YENİ

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productAPI.getProduct(id)
        setProduct(data.product)
        setSelectedSize(data.product.sizes?.[0] || '')
        setSelectedColor(data.product.colors?.[0] || '')

        // SON BAKILAN ÜRÜNLERE EKLE
        addToRecentlyViewed({
          _id: data.product._id,
          name: data.product.name,
          price: data.product.price,
          oldPrice: data.product.oldPrice,
          images: data.product.images,
          brand: data.product.brand,
          rating: data.product.rating,
          numReviews: data.product.numReviews,
          stock: data.product.stock
        })

        // İlgili ürünleri getir
        const related = await productAPI.getProducts({
          category: data.product.category,
          limit: 4
        })
        setRelatedProducts(related.products.filter(p => p._id !== id))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, addToRecentlyViewed])

  // ... geri kalan kod aynı
  
  const favorite = product ? isFavorite(product._id) : false

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedSize, selectedColor, quantity)
      // TODO: Toast notification
    }
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    if (product) {
      toggleFavorite(product._id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Ürün bulunamadı</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-16 md:pb-0">
      {/* SEO */}
      {product && (
        <SEO
          title={`${product.name} - ${product.brand || 'MyShop'} | MyShop`}
          description={`${product.description?.substring(0, 155) || 'Ürün'}... ✓ ${product.price}₺ ✓ Ücretsiz Kargo ✓ Hızlı Teslimat ✓ ${product.rating || 0} ⭐ (${product.numReviews || 0} değerlendirme)`}
          keywords={`${product.name}, ${product.brand || 'MyShop'}, ${product.category}, online alışveriş, ${product.name} fiyat, ${product.name} satın al`}
          image={product.images?.[0] || 'https://myshop-dogukanbayar.vercel.app/og-image.png'}
          url={`/products/${product._id}`}
          type="product"
          productData={{
            name: product.name,
            images: product.images || [],
            description: product.description,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            rating: product.rating,
            numReviews: product.numReviews
          }}
          breadcrumbList={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Ürünler', path: '/products' },
            { name: product.category, path: `/products?category=${product.category}` },
            { name: product.name, path: `/products/${product._id}` }
          ]}
        />
      )}

      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Ana Sayfa</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-blue-600">Ürünler</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Geri Dön</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left - Images */}
          <div>
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow-lg"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Brand */}
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {product.brand}
            </p>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                    className="text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.numReviews} değerlendirme)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b">
              <span className="text-4xl font-bold text-gray-900">
                ₺{product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ₺{product.oldPrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold text-sm">
                    %{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)} İndirim
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-3">Renk: <span className="font-normal">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-3">Beden: <span className="font-normal">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-semibold mb-3">Adet</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                  disabled={quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={20} />
                </button>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.stock} adet stokta)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition disabled:opacity-50"
              >
                <ShoppingCart size={24} />
                {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-4 rounded-xl border-2 transition ${
                  favorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={favorite ? 'currentColor' : 'none'} />
              </button>

              <button className="p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition">
                <Share2 size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Truck className="text-green-600" size={20} />
                <span className="text-sm">Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                <span className="text-sm">Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER - YENİ */}
        {product && (
          <div className="my-12">
            <FrequentlyBoughtTogether currentProduct={product} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCardV2 key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default ProductDetailPage