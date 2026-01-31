import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">MyShop</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              En iyi ürünler, en uygun fiyatlar. Güvenli alışverişin adresi.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-pink-600 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Tüm Ürünler</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Hakkımızda</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">İletişim</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Müşteri Hizmetleri</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Sıkça Sorulan Sorular</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Kargo & Teslimat</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">İade & Değişim</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">Gizlilik Politikası</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 dark:text-dark-text">Bülten</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">Kampanyalardan haberdar ol!</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresin"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
              <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition text-white">
                <Mail size={20} />
              </button>
            </div>
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
