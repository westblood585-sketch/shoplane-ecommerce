import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import CartItem from '../../components/Cart/CartItem'
import CartSummary from '../../components/Cart/CartSummary'
import EmptyCart from '../../components/Cart/EmptyCart'
import { Package, Trash2, ArrowLeft } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import { Link } from 'react-router-dom'

function CartPage() {
  const { items, bundles, removeBundleFromCart, updateBundleQuantity, clearCart } = useCartStore()
  
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.cart.description.replace('{itemCount}', items.length + (bundles.length || 0)), metaDescriptions.cart.title)

  const handleClearCart = () => {
    if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?')) {
      clearCart()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
            {' / '}
            <span className="text-gray-900 font-semibold">Sepetim</span>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft size={20} />
            Alışverişe Devam Et
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Başlık */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">
                Sepetim ({items.length} ürün)
              </h1>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={20} />
                Sepeti Temizle
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sol: Ürün Listesi */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <CartItem key={item.cartId} item={item} />
                ))}
              </div>

              {/* Sağ: Sepet Özeti */}
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>

            {/* Bundles Section */}
            {bundles.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package size={28} className="text-purple-600" />
                  <h2 className="text-2xl font-bold dark:text-dark-text">
                    Bundles ({bundles.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {bundles.map((bundleItem, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-900 rounded-2xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Bundle Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white dark:bg-dark-card">
                          {bundleItem.bundle.images?.[0] ? (
                            <img
                              src={bundleItem.bundle.images[0]}
                              alt={bundleItem.bundle.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={40} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        {/* Bundle Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2 dark:text-dark-text">
                            {bundleItem.bundle.name}
                          </h3>
                          {/* Products in Bundle */}
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                              Includes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bundleItem.bundle.products.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-white dark:bg-dark-card rounded text-xs"
                                >
                                  {item.product.name} x{item.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Price & Savings */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-purple-600">
                              {bundleItem.price.toFixed(2)}₺
                            </span>
                            {bundleItem.bundle.pricing.originalPrice !== bundleItem.bundle.pricing.finalPrice && (
                              <>
                                <span className="text-lg text-gray-500 line-through">
                                  {bundleItem.bundle.pricing.originalPrice.toFixed(2)}₺
                                </span>
                                <span className="text-sm font-semibold text-green-600">
                                  Save {bundleItem.bundle.pricing.savings.toFixed(2)}₺
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateBundleQuantity(
                              bundleItem.bundle._id,
                              bundleItem.selectedProducts,
                              bundleItem.quantity - 1
                            )}
                            className="w-8 h-8 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold dark:text-dark-text">
                            {bundleItem.quantity}
                          </span>
                          <button
                            onClick={() => updateBundleQuantity(
                              bundleItem.bundle._id,
                              bundleItem.selectedProducts,
                              bundleItem.quantity + 1
                            )}
                            className="w-8 h-8 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition"
                          >
                            +
                          </button>
                        </div>
                        {/* Total & Remove */}
                        <div className="text-right">
                          <p className="text-2xl font-bold mb-2 dark:text-dark-text">
                            {(bundleItem.price * bundleItem.quantity).toFixed(2)}₺
                          </p>
                          <button
                            onClick={() => removeBundleFromCart(
                              bundleItem.bundle._id,
                              bundleItem.selectedProducts
                            )}
                            className="text-red-600 hover:text-red-700 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default CartPage