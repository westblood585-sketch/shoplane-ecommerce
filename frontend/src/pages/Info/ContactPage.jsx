import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

function ContactPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.contact.description, metaDescriptions.contact.title)
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
          {' / '}
          <span className="text-gray-900 font-semibold">İletişim</span>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-8 dark:text-dark-text">İletişim</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-dark-text">Bize Ulaşın</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold dark:text-dark-text">E-posta</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@myshop.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold dark:text-dark-text">Telefon</h3>
                    <p className="text-gray-600 dark:text-gray-400">+90 (212) 123 4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold dark:text-dark-text">Adres</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-dark-text">Mesaj Gönderin</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold dark:text-dark-text mb-2">Ad Soyad</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-dark-hover dark:text-dark-text"
                    placeholder="Adınızı giriniz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-dark-text mb-2">E-posta</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-dark-hover dark:text-dark-text"
                    placeholder="E-posta adresiniz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-dark-text mb-2">Konu</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-dark-hover dark:text-dark-text"
                    placeholder="Konu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-dark-text mb-2">Mesaj</label>
                  <textarea 
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-dark-hover dark:text-dark-text"
                    placeholder="Mesajınız"
                  ></textarea>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default ContactPage
