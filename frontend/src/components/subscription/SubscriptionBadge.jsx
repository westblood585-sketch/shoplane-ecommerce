import { RefreshCw } from 'lucide-react'

const SubscriptionBadge = ({ product, size = 'normal' }) => {
    if (!product.isSubscriptionAvailable) return null

    const maxDiscount = Math.max(...product.subscriptionPlans.map(p => p.discount))

    return (
        <div className={`
      inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg
      ${size === 'small' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}
    `}>
            <RefreshCw size={size === 'small' ? 10 : 12} />
            <span>Abonelikle %{maxDiscount} İndirim</span>
        </div>
    )
}

export default SubscriptionBadge