import { Clock, Calendar, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

function PreOrderBadge({ product, size = 'normal' }) {
    if (!product || !product.isPreOrder) return null

    const releaseDate = new Date(product.preOrderInfo.releaseDate)
    const daysUntilRelease = Math.ceil((releaseDate - new Date()) / (1000 * 60 * 60 * 24))

    const isSmall = size === 'small'

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${isSmall ? 'text-xs' : 'text-sm'}`}
        >
            {/* Pre-Order Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg ${isSmall ? 'text-xs' : 'text-sm'
                }`}>
                <Clock size={isSmall ? 14 : 16} />
                <span>ÖN SİPARİŞ</span>
            </div>

            {/* Release Date */}
            {product.preOrderInfo.releaseDate && (
                <div className={`mt-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-300 ${isSmall ? 'text-xs' : 'text-sm'
                    }`}>
                    <Calendar size={isSmall ? 12 : 14} />
                    <span>
                        Çıkış: {releaseDate.toLocaleDateString('tr-TR')}
                        {daysUntilRelease > 0 && ` (${daysUntilRelease} gün)`}
                    </span>
                </div>
            )}

            {/* Limited Stock */}
            {product.preOrderInfo.maxPreOrders && (
                <div className={`mt-1 flex items-center gap-1.5 ${product.preOrderInfo.currentPreOrders / product.preOrderInfo.maxPreOrders > 0.7
                        ? 'text-red-600'
                        : 'text-orange-600'
                    } ${isSmall ? 'text-xs' : 'text-sm'}`}>
                    <TrendingUp size={isSmall ? 12 : 14} />
                    <span>
                        {product.preOrderInfo.maxPreOrders - product.preOrderInfo.currentPreOrders} kota kaldı!
                    </span>
                </div>
            )}
        </motion.div>
    )
}

export default PreOrderBadge
