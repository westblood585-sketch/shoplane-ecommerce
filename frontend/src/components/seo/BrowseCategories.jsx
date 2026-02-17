import { Link } from 'react-router-dom'
import { Grid, ArrowRight } from 'lucide-react'
import { internalLinks } from './InternalLinkingHelper'

/**
 * Browse Categories Component
 * 
 * Displays category links to encourage internal browsing
 * Helps with:
 * - Internal linking (SEO)
 * - User engagement (session time)
 * - Keyword relevance for categories
 * 
 * Usage:
 * <BrowseCategories title="Diğer Kategorileri Keşfet" />
 */
export default function BrowseCategories({ title = 'Kategorileri Keşfet', limit = 6 }) {
  const categories = internalLinks.categories.slice(0, limit)

  return (
    <section className="hidden py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="group flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              {/* Category Icon Placeholder */}
              <div className="w-16 h-16 mb-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📦</span>
              </div>

              {/* Category Label */}
              <p className="text-center text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.label}
              </p>

              {/* Keywords (hidden, for SEO) */}
              <span className="sr-only">{category.keywords}</span>
            </Link>
          ))}
        </div>

        {/* CTA to all categories */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Tüm Ürünleri Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
