import { GitCompare } from 'lucide-react'
import useCompareStore from '../../store/compareStore'

function CompareButton({ product, className = '' }) {
  const { toggleCompare, isInCompare } = useCompareStore()
  const inCompare = isInCompare(product._id)

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const result = toggleCompare(product)
    if (!result.success) {
      alert(result.message)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-lg transition-all
        ${inCompare 
          ? 'bg-purple-500 text-white hover:bg-purple-600' 
          : 'bg-white hover:bg-gray-100'
        }
        ${className}
      `}
      title={inCompare ? 'Karşılaştırmadan Çıkar' : 'Karşılaştırmaya Ekle'}
    >
      <GitCompare size={20} />
    </button>
  )
}

export default CompareButton