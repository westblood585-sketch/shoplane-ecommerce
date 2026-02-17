import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Package, ChevronRight, PauseCircle, PlayCircle, XCircle, Clock } from 'lucide-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const MySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const fetchSubscriptions = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscriptions`)
            setSubscriptions(data.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching subscriptions:', error)
            toast.error('Abonelikler yüklenirken bir hata oluştu')
            setLoading(false)
        }
    }

    const handleStatusChange = async (id, newStatus, reason = '') => {
        if (!window.confirm(`Abonelik durumunu ${newStatus === 'active' ? 'aktif' : newStatus === 'paused' ? 'duraklat' : 'iptal'} yapmak istediğinize emin misiniz?`)) return

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/subscriptions/${id}/status`, {
                status: newStatus,
                cancelReason: reason
            })
            toast.success('Abonelik durumu güncellendi')
            fetchSubscriptions()
        } catch (error) {
            console.error('Error updating subscription status:', error)
            toast.error('Durum güncellenirken bir hata oluştu')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Aboneliklerim</h1>

            {subscriptions.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Henüz Aboneliğiniz Yok</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Düzenli sipariş vererek tasarruf etmeye başlayın!</p>
                    <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-300">
                        Alışverişe Başla
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {subscriptions.map((sub) => (
                        <motion.div
                            key={sub._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={sub.product.images[0]}
                                                alt={sub.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sub.product.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Abonelik No: {sub.subscriptionNumber}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 
                    ${sub.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            sub.status === 'paused' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {sub.status === 'active' && <PlayCircle size={16} />}
                                        {sub.status === 'paused' && <PauseCircle size={16} />}
                                        {sub.status === 'cancelled' && <XCircle size={16} />}
                                        {sub.status === 'active' ? 'Aktif' : sub.status === 'paused' ? 'Duraklatıldı' : 'İptal Edildi'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-primary-600 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Sonraki Teslimat</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(sub.nextDeliveryDate).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="text-primary-600 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {sub.plan === 'weekly' ? 'Haftalık' :
                                                    sub.plan === 'biweekly' ? '2 Haftalık' :
                                                        sub.plan === 'monthly' ? 'Aylık' : '3 Aylık'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Adet</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{sub.quantity}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tutar</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">₺{sub.finalPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {sub.status !== 'cancelled' && (
                                    <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        {sub.status === 'active' ? (
                                            <button
                                                onClick={() => handleStatusChange(sub._id, 'paused')}
                                                className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors border border-yellow-200 dark:border-yellow-900/30"
                                            >
                                                <PauseCircle size={18} />
                                                Duraklat
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(sub._id, 'active')}
                                                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors border border-green-200 dark:border-green-900/30"
                                            >
                                                <PlayCircle size={18} />
                                                Tekrar Başlat
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleStatusChange(sub._id, 'cancelled', 'Kullanıcı isteği')}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-900/30 ml-auto"
                                        >
                                            <XCircle size={18} />
                                            Aboneliği İptal Et
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MySubscriptions
