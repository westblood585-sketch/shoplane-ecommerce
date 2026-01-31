import { categories } from '../../data/mockProducts'
import { useState } from 'react'

function CategoryShowcase() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Kategoriler</h2>
          <p className="text-gray-600">Tüm kategorilere göz atın</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`${category.color} rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                hoveredId === category.id ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'
              }`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-4 transition-transform duration-300 ${
                  hoveredId === category.id ? 'scale-125 rotate-12' : 'scale-100'
                }`}>
                  {category.icon}
                </div>
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase