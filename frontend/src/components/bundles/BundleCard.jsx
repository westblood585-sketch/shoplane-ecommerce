import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowRight, Clock, Star } from 'lucide-react'

function BundleCard({ bundle, index = 0 }) {
    if (!bundle) return null

    // Calculate discount percentage manually if not provided, or trust bundle.discountPercent
    // If originalPrice is 0 or undefined, avoid division by zero
    const calculatedDiscount = bundle.originalPrice > 0
        ? Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100)
        : 0

    // Use provided discountPercent or calculated one
    const discount = bundle.discountPercent > 0 ? bundle.discountPercent : calculatedDiscount

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border border-gray-100 dark:border-dark-border"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={bundle.image || (bundle.products?.[0]?.product?.images?.[0]) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle" font-family="system-ui"%3ENo Image%3C/text%3E%3C/svg%3E'}
                    alt={bundle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Package size={14} />
                    {discount}% İndirim
                </div>

                {bundle.endDate && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(bundle.endDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-xl font-bold dark:text-dark-text group-hover:text-purple-600 transition-colors line-clamp-1">
                        {bundle.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-1">
                        {bundle.description}
                    </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                        {bundle.products?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card overflow-hidden">
                                <img
                                    src={item.product?.images?.[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        {bundle.products?.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-gray-100 dark:bg-dark-hover flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                +{bundle.products.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {bundle.products?.length} ürün
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {bundle.originalPrice?.toLocaleString('tr-TR')}₺
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                            {bundle.bundlePrice?.toLocaleString('tr-TR')}₺
                        </div>
                    </div>

                    <Link
                        to={`/bundles/${bundle._id}`}
                        className="p-3 bg-gray-100 dark:bg-dark-hover rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"
                    >
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default BundleCard
