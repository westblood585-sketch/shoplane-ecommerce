import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Calendar, Package, CreditCard, Gift, Shield,
    TrendingUp, Check, MapPin, Clock, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axiosConfig'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

function PreOrderModal({ product, isOpen, onClose }) {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuthStore()
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Info, 2: Address, 3: Confirm

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        district: '',
        zipCode: '',
        phone: user?.phone || ''
    })

    if (!product?.isPreOrder) return null

    const { preOrderInfo } = product
    const totalAmount = product.price * quantity
    const depositPercentage = preOrderInfo.depositPercentage || 100
    const depositAmount = preOrderInfo.depositAmount || (totalAmount * depositPercentage / 100)
    const remainingAmount = totalAmount - depositAmount
    const releaseDate = new Date(preOrderInfo.releaseDate)
    const daysUntilRelease = Math.ceil((releaseDate - new Date()) / (1000 * 60 * 60 * 24))

    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setShippingAddress({ ...shippingAddress, [name]: value })
    }

    const handlePreOrder = async () => {
        if (!isAuthenticated) {
            toast.error('Ön sipariş için giriş yapmalısınız')
            navigate('/login')
            return
        }

        setLoading(true)
        try {
            const response = await API.post('/pre-orders', {
                productId: product._id,
                quantity,
                shippingAddress
            })

            toast.success('Ön sipariş oluşturuldu!')
            onClose()

            // Payment sayfasına yönlendir
            navigate('/payment', {
                state: {
                    preOrderId: response.data.preOrder._id,
                    isPreOrder: true,
                    depositAmount
                }
            })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ön sipariş oluşturulamadı')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                    <Package size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Ön Sipariş</h2>
                                    <p className="text-white/80 text-sm">
                                        {step === 1 && 'Bilgileri İncele'}
                                        {step === 2 && 'Teslimat Adresi'}
                                        {step === 3 && 'Onay'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* STEP 1: Product Info & Benefits */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    {/* Product */}
                                    <div className="flex gap-4 pb-6 border-b dark:border-dark-border">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-32 h-32 object-cover rounded-xl"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 dark:text-dark-text">{product.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-bold text-purple-600">{product.price}₺</div>
                                                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm font-bold">
                                                    ÖN SİPARİŞ
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                            Adet
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 border-2 border-gray-300 dark:border-dark-border rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-dark-hover transition"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-20 h-10 text-center border-2 border-gray-300 dark:border-dark-border rounded-lg font-bold dark:bg-dark-hover dark:text-dark-text"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 border-2 border-gray-300 dark:border-dark-border rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-dark-hover transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Release Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="text-blue-600" size={20} />
                                                <span className="font-bold dark:text-dark-text">Çıkış Tarihi</span>
                                            </div>
                                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                                {releaseDate.toLocaleDateString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                                                {daysUntilRelease} gün kaldı
                                            </p>
                                        </div>

                                        {preOrderInfo.estimatedShipDate && (
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="text-green-600" size={20} />
                                                    <span className="font-bold dark:text-dark-text">Tahmini Kargo</span>
                                                </div>
                                                <p className="text-green-600 dark:text-green-400 font-semibold">
                                                    {new Date(preOrderInfo.estimatedShipDate).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Benefits */}
                                    {preOrderInfo.preOrderBenefits && preOrderInfo.preOrderBenefits.length > 0 && (
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-900 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Gift className="text-purple-600" size={20} />
                                                <span className="font-bold dark:text-dark-text">Ön Sipariş Avantajları</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {preOrderInfo.preOrderBenefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Quota */}
                                    {preOrderInfo.maxPreOrders && (
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <TrendingUp className="text-orange-600" size={20} />
                                                <span className="font-bold dark:text-dark-text">Sınırlı Sayıda</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                                                        style={{
                                                            width: `${(preOrderInfo.currentPreOrders / preOrderInfo.maxPreOrders) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                                    {preOrderInfo.maxPreOrders - preOrderInfo.currentPreOrders} kota kaldı
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Info */}
                                    <div className="p-4 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CreditCard className="text-gray-600 dark:text-gray-400" size={20} />
                                            <span className="font-bold dark:text-dark-text">Ödeme Bilgileri</span>
                                        </div>
                                        <div className="space-y-2">
                                            {depositPercentage < 100 ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Depozito (%{depositPercentage})</span>
                                                        <span className="font-bold dark:text-dark-text">{depositAmount.toFixed(2)}₺</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Kalan Tutar</span>
                                                        <span className="font-bold dark:text-dark-text">{remainingAmount.toFixed(2)}₺</span>
                                                    </div>
                                                    <div className="pt-2 border-t dark:border-dark-border flex justify-between text-lg">
                                                        <span className="font-bold dark:text-dark-text">Toplam</span>
                                                        <span className="font-bold text-purple-600">{totalAmount.toFixed(2)}₺</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                        * Kalan tutarı ürün çıkmadan önce ödeyeceksiniz
                                                    </p>
                                                </>
                                            ) : (
                                                <div className="flex justify-between text-lg">
                                                    <span className="font-bold dark:text-dark-text">Toplam Tutar</span>
                                                    <span className="font-bold text-purple-600">{totalAmount.toFixed(2)}₺</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {preOrderInfo.description && (
                                        <div className="p-4 border border-gray-200 dark:border-dark-border rounded-xl">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {preOrderInfo.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 2: Shipping Address */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="text-blue-600" size={24} />
                                        <h3 className="text-xl font-bold dark:text-dark-text">Teslimat Adresi</h3>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                            Ad Soyad *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingAddress.fullName}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                            Adres *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleAddressChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                                İl *
                                            </label>
                                            <select
                                                name="city"
                                                value={shippingAddress.city}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text"
                                                required
                                            >
                                                <option value="">Seçiniz</option>
                                                <option value="İstanbul">İstanbul</option>
                                                <option value="Ankara">Ankara</option>
                                                <option value="İzmir">İzmir</option>
                                                <option value="Bursa">Bursa</option>
                                                <option value="Antalya">Antalya</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                                İlçe *
                                            </label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={shippingAddress.district}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                                Posta Kodu
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={shippingAddress.zipCode}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                                                Telefon *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={shippingAddress.phone}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-purple-500 dark:bg-dark-hover dark:text-dark-text"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Confirmation */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Check className="text-green-600" size={24} />
                                        <h3 className="text-xl font-bold dark:text-dark-text">Sipariş Özeti</h3>
                                    </div>

                                    {/* Product Summary */}
                                    <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-xl">
                                        <h4 className="font-bold mb-2 dark:text-dark-text">Ürün</h4>
                                        <div className="flex gap-3">
                                            <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                            <div className="flex-1">
                                                <p className="font-semibold dark:text-dark-text">{product.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Adet: {quantity}</p>
                                            </div>
                                            <p className="font-bold text-purple-600">{totalAmount.toFixed(2)}₺</p>
                                        </div>
                                    </div>

                                    {/* Address Summary */}
                                    <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-xl">
                                        <h4 className="font-bold mb-2 dark:text-dark-text">Teslimat Adresi</h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {shippingAddress.fullName}<br />
                                            {shippingAddress.address}<br />
                                            {shippingAddress.district} / {shippingAddress.city}<br />
                                            {shippingAddress.phone}
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-900 rounded-xl">
                                        <h4 className="font-bold mb-3 dark:text-dark-text">Ödeme Planı</h4>
                                        {depositPercentage < 100 ? (
                                            <>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-700 dark:text-gray-300">Şimdi Ödenecek (Depozito)</span>
                                                    <span className="font-bold text-purple-600">{depositAmount.toFixed(2)}₺</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-700 dark:text-gray-300">Sonra Ödenecek</span>
                                                    <span className="font-bold dark:text-dark-text">{remainingAmount.toFixed(2)}₺</span>
                                                </div>
                                                <div className="pt-2 border-t border-purple-200 dark:border-purple-900 flex justify-between text-lg">
                                                    <span className="font-bold dark:text-dark-text">Toplam</span>
                                                    <span className="font-bold text-purple-600">{totalAmount.toFixed(2)}₺</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex justify-between text-lg">
                                                <span className="font-bold dark:text-dark-text">Ödenecek Tutar</span>
                                                <span className="font-bold text-purple-600">{totalAmount.toFixed(2)}₺</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Important Notice */}
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                            <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                                <p className="font-bold mb-1">Önemli Bilgiler:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Ön sipariş iptal edilemez</li>
                                                    <li>Ürün çıkış tarihinde kargoya verilir</li>
                                                    {depositPercentage < 100 && (
                                                        <li>Kalan tutarı ürün çıkmadan önce ödemeniz gerekir</li>
                                                    )}
                                                    <li>Tahmini teslimat süresi 2-3 iş günüdür</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t dark:border-dark-border bg-gray-50 dark:bg-dark-hover">
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="flex-1 py-3 border-2 border-gray-300 dark:border-dark-border rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-dark-card transition dark:text-dark-text"
                                    >
                                        Geri
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition"
                                    >
                                        Devam Et
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePreOrder}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Clock className="animate-spin" size={20} />
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={20} />
                                                Ön Siparişi Onayla
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PreOrderModal
