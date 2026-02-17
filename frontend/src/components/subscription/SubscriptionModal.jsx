import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Calendar, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SubscriptionModal = ({ product, isOpen, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState(product.subscriptionPlans?.[0]?.plan)
    const { addItem } = useCartStore()
    const navigate = useNavigate()

    if (!isOpen || !product.isSubscriptionAvailable) return null

    const handleSubscribe = () => {
        const planDetails = product.subscriptionPlans.find(p => p.plan === selectedPlan)

        // Add to cart with subscription type
        addItem(product, 'M', 'Standart', 1, {
            isSubscription: true,
            plan: selectedPlan,
            discount: planDetails.discount,
            price: product.price * ((100 - planDetails.discount) / 100)
        })

        toast.success('Abonelik sepete eklendi!')
        onClose()
        navigate('/cart')
    }

    const getPlanLabel = (plan) => {
        switch (plan) {
            case 'weekly': return 'Haftalık'
            case 'biweekly': return '2 Haftalık'
            case 'monthly': return 'Aylık'
            case 'quarterly': return '3 Aylık'
            default: return plan
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-2xl font-bold mb-1">Abonelik Planı Seç</h2>
                            <p className="opacity-90">Düzenli sipariş ver, tasarruf et!</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="absolute bottom-0 right-8 transform translate-y-1/2">
                            <div className="bg-white dark:bg-gray-700 p-2 rounded-xl shadow-lg">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-12">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {product.name}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Plans */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Teslimat Sıklığı</h4>
                                {product.subscriptionPlans.map((plan) => (
                                    <button
                                        key={plan.plan}
                                        onClick={() => setSelectedPlan(plan.plan)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedPlan === plan.plan
                                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-cyan-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.plan ? 'border-cyan-500' : 'border-gray-300'
                                                }`}>
                                                {selectedPlan === plan.plan && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {getPlanLabel(plan.plan)}
                                            </span>
                                        </div>
                                        <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-sm">
                                            %{plan.discount} İndirim
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Benefits & Summary */}
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Abonelik Avantajları</h4>
                                <ul className="space-y-3 mb-8">
                                    {product.subscriptionBenefits?.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Check size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <ShieldCheck size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                                        <span>İstediğiniz zaman iptal edebilirsiniz</span>
                                    </li>
                                </ul>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500 dark:text-gray-400">Normal Fiyat</span>
                                        <span className="text-gray-400 line-through">₺{product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 dark:text-white">Abonelik Fiyatı</span>
                                        <span className="font-bold text-2xl text-cyan-600">
                                            ₺{(product.price * ((100 - product.subscriptionPlans.find(p => p.plan === selectedPlan).discount) / 100)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubscribe}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    Abone Ol
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default SubscriptionModal
