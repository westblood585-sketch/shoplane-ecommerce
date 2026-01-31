import { ShoppingCart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
        <ShoppingCart size={80} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Sepetiniz Boş</h2>
      <p className="text-gray-600 mb-8 text-lg">
        Henüz sepetinize ürün eklemediniz.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Alışverişe Başla
        <ArrowRight size={20} />
      </Link>
    </div>
  )
}

export default EmptyCart