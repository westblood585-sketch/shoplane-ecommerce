import { Link } from 'react-router-dom'
import { Home, Search, AlertCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-dark-bg dark:to-dark-hover flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full text-center"
        >
          {/* 404 illustration */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <div className="flex justify-center">
              <AlertCircle size={120} className="text-red-500 dark:text-red-400" />
            </div>
          </motion.div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-black mb-4 dark:text-dark-text">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-dark-text">
            Sayfa Bulunamadı
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Lütfen aşağıdaki bağlantılardan birini kullanarak devam edin.
          </p>

          {/* Error Code Info */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Hata Kodu:</strong> 404 - Sayfa Bulunamadı
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Home Button */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <Home size={20} />
              Ana Sayfa
            </Link>

            {/* Products Button */}
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              <Search size={20} />
              Ürünleri Gözat
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg p-8 mb-8">
            <h3 className="text-lg font-bold mb-4 dark:text-dark-text">
              Hızlı Bağlantılar
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Ürünler', path: '/products' },
                { name: 'Hakkımızda', path: '/about' },
                { name: 'İletişim', path: '/contact' },
                { name: 'Sıkça Sorulan', path: '/faq' },
                { name: 'Gizlilik', path: '/privacy' }
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hala sorun yaşıyor musunuz?{' '}
            <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Bizimle iletişime geçin
            </Link>
          </p>

          {/* Decorative elements */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xs mx-auto opacity-50">
            <div className="h-2 bg-gradient-to-r from-red-500 to-red-300 rounded-full"></div>
            <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
