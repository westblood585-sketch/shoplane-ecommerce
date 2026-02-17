import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { internalLinks } from '../seo/InternalLinkingHelper'

function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">MyShop</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              En iyi ürünler, en uygun fiyatlar. Güvenli alışverişin adresi.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-pink-600 transition">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Kategoriler</h3>
            <ul className="space-y-2">
              {internalLinks.categories.slice(0, 4).map(cat => (
                <li key={cat.path}>
                  <Link to={cat.path} className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/products" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm font-semibold text-blue-400 hover:text-blue-300">
                  Tüm Kategoriler →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Tüm Ürünler</Link></li>
              <li><Link to="/about" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Hakkımızda</Link></li>
              <li><Link to="/contact" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">İletişim</Link></li>
              <li><Link to="/bundles" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Bundleler</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Müşteri Hizmetleri</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Sıkça Sorulan Sorular</Link></li>
              <li><Link to="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Kargo & Teslimat</Link></li>
              <li><Link to="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">İade & Değişim</Link></li>
              <li><Link to="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition text-sm">Gizlilik Politikası</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Bülten</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4 text-sm">Kampanyalardan haberdar ol!</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition text-white">
                <Mail size={20} />
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-sm mt-2">✓ Başarıyla abone olundu!</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 dark:border-gray-900 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; {currentYear} MyShop. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
