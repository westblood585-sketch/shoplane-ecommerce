import { ArrowUpDown } from 'lucide-react'

function SortBar({ sortBy, setSortBy }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-4">
        <ArrowUpDown size={20} className="text-gray-600" />
        <span className="font-semibold">Sırala:</span>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="relevance">Önerilen</option>
          <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
          <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
          <option value="rating">En Yüksek Puan</option>
          <option value="newest">En Yeniler</option>
          <option value="popular">En Popüler</option>
        </select>
      </div>
    </div>
  )
}

export default SortBar