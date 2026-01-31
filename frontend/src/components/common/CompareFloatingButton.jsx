import { GitCompare, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCompareStore from '../../store/compareStore'

function CompareFloatingButton() {
  const { compareList, clearCompare } = useCompareStore()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
      <div className="bg-purple-600 text-white rounded-xl shadow-2xl p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare size={20} />
            <span className="font-semibold">Karşılaştır</span>
          </div>
          <button
            onClick={clearCompare}
            className="p-1 hover:bg-purple-700 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm mb-3">{compareList.length} ürün seçildi</p>

        <div className="flex gap-2 mb-3">
          {compareList.map(product => (
            <img
              key={product._id}
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
          ))}
        </div>

        <Link
          to="/compare"
          className="block w-full py-2 bg-white text-purple-600 text-center rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Karşılaştır
        </Link>
      </div>
    </div>
  )
}

export default CompareFloatingButton