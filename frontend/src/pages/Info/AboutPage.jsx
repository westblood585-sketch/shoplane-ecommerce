import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Link } from 'react-router-dom'
import { Heart, Truck, Shield, Users } from 'lucide-react'

function AboutPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.about.description, metaDescriptions.about.title)
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
          {' / '}
          <span className="text-gray-900 font-semibold">Hakkımızda</span>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-6 dark:text-dark-text">Hakkımızda</h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            MyShop olarak, müşteri memnuniyeti ve kaliteli ürünleri sunmak amacıyla 2020 yılından itibaren hizmet vermekteyiz.
          </p>

          <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">Misyonumuz</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Türkiye'de en güvenilir, en uygun fiyatlı ve hızlı teslimat hizmeti sunan e-ticaret platformu olmaktır.
          </p>

          <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">Vizyonumuz</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Teknoloji ve inovasyonu kullanarak müşterilerimizin alışveriş deneyimini en üst seviyeye çıkarmak.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="flex gap-4">
              <Truck size={40} className="text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 dark:text-dark-text">Hızlı Teslimat</h3>
                <p className="text-gray-600 dark:text-gray-400">24-48 saat içinde tüm Türkiye'ye kargo</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Shield size={40} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 dark:text-dark-text">Güvenli Alışveriş</h3>
                <p className="text-gray-600 dark:text-gray-400">SSL şifreli ve 256-bit güvenlik</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart size={40} className="text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 dark:text-dark-text">Müşteri Hizmetleri</h3>
                <p className="text-gray-600 dark:text-gray-400">7/24 canlı destek ve hızlı çözüm</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users size={40} className="text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 dark:text-dark-text">Güvenilir İş Ortağı</h3>
                <p className="text-gray-600 dark:text-gray-400">Binlerce memnun müşteri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default AboutPage
