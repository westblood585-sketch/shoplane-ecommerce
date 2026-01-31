import { X, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { productAPI } from '../../api/productAPI'

function FilterSidebar({ filters, setFilters, isOpen, setIsOpen }) {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Kategorileri ve markaları fetch et
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getBrands()
        ])
        setCategories(categoriesData.categories)
        setBrands(brandsData.brands)
      } catch (error) {
        console.error('Filter data error:', error)
      }
    }

    fetchFilters()
  }, [])

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    setFilters({ ...filters, categories: newCategories })
  }

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    setFilters({ ...filters, brands: newBrands })
  }

  const handlePriceChange = (min, max) => {
    setFilters({ 
      ...filters, 
      minPrice: min, 
      maxPrice: max 
    })
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      minPrice: 0,
      maxPrice: 999999,
      inStock: false,
      rating: 0
    })
  }

  const priceRanges = [
    { label: "Tümü", min: 0, max: 999999 },
    { label: "0 - 500 TL", min: 0, max: 500 },
    { label: "500 - 1000 TL", min: 500, max: 1000 },
    { label: "1000 - 2000 TL", min: 1000, max: 2000 },
    { label: "2000 TL ve üzeri", min: 2000, max: 999999 }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white shadow-lg z-50
        transition-transform duration-300 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter size={24} />
              <h2 className="text-2xl font-bold">Filtreler</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* Clear Filters */}
          <button 
            onClick={clearFilters}
            className="w-full mb-6 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
          >
            Filtreleri Temizle
          </button>

          {/* Kategori Filtreleri */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Kategori</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fiyat Aralığı */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Fiyat Aralığı</h3>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                    onChange={() => handlePriceChange(range.min, range.max)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marka Filtreleri */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Marka</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Puan Filtresi */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Değerlendirme</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => setFilters({ ...filters, rating })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700">
                    {rating}+ ⭐
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Stok Durumu */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Sadece Stokta Olanlar</span>
            </label>
          </div>
        </div>
      </aside>
    </>
  )
}

export default FilterSidebar