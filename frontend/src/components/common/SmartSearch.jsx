import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { productAPI } from '../../api/productAPI'

const SmartSearch = ({ isMobile = false, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [popularSearches] = useState([
    'iPhone', 'Nike', 'Laptop', 'Ayakkabı', 'Saat'
  ])
  
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const searchRef = useRef(null)

  // LocalStorage'dan son aramaları yükle
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent)
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcuts (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounced search
  const debouncedSearch = useRef(null)

  useEffect(() => {
    debouncedSearch.current = (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      const timer = setTimeout(async () => {
        setLoading(true)
        try {
          const data = await productAPI.getProducts({
            keyword: searchQuery,
            limit: 5
          })
          setResults(data.products)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setLoading(false)
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearch.current) {
      debouncedSearch.current(query)
    }
  }, [query])

  const handleSearch = (searchTerm) => {
    // Son aramalara ekle
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Arama sayfasına yönlendir
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
    setQuery('')
    setIsOpen(false)
    onClose?.()
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-xl'}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Ürün ara... (⌘K)"
          className="w-full pl-12 pr-12 py-3 md:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-white shadow-sm"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}

        {!isMobile && (
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono hidden md:block">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Loading */}
            {loading && (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600 mt-3">Aranıyor...</p>
              </div>
            )}

            {/* Search Results */}
            {!loading && query && results.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-2 font-semibold">Ürünler</p>
                {results.map(product => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    onClick={() => {
                      handleSearch(query)
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-blue-600 transition">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">₺{product.price.toFixed(2)}</span>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition" />
                    </div>
                  </Link>
                ))}
                
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full mt-2 py-3 text-center text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
                >
                  Tüm sonuçları gör ({results.length}+)
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && query && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="font-semibold mb-1">Sonuç bulunamadı</p>
                <p className="text-sm text-gray-600">"{query}" için ürün bulunamadı</p>
              </div>
            )}

            {/* Recent & Popular Searches */}
            {!loading && !query && (
              <div className="p-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                        <Clock size={14} />
                        Son Aramalar
                      </div>
                      <button
                        onClick={handleClearRecent}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Temizle
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-left"
                      >
                        <Clock size={16} className="text-gray-400" />
                        <span className="flex-1 text-sm">{search}</span>
                        <ArrowRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 font-semibold">
                    <TrendingUp size={14} />
                    Popüler Aramalar
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-left"
                    >
                      <TrendingUp size={16} className="text-blue-600" />
                      <span className="flex-1 text-sm">{search}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SmartSearch