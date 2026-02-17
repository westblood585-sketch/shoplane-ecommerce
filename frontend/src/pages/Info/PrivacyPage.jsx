import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Link } from 'react-router-dom'

function PrivacyPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.privacy.description, metaDescriptions.privacy.title)
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
          {' / '}
          <span className="text-gray-900 font-semibold">Gizlilik Politikası</span>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-8 dark:text-dark-text">Gizlilik Politikası</h1>
          
          <div className="space-y-8 text-gray-600 dark:text-gray-400">
            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">1. Giriş</h2>
              <p>
                MyShop olarak, kişisel verilerinizin korunması ve gizliliğinizin sağlanması için önem veriyoruz. 
                Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizden yararlandığınızda 
                kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">2. Toplanan Bilgiler</h2>
              <p className="mb-3">Aşağıdaki bilgileri toplayabiliriz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ad, soyad ve iletişim bilgileri</li>
                <li>E-posta adresi</li>
                <li>Adres ve fatura bilgileri</li>
                <li>Telefon numarası</li>
                <li>Ödeme bilgileri</li>
                <li>Tarama geçmişi ve kullanım verileri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">3. Verilerinizin Kullanımı</h2>
              <p className="mb-3">Toplanan verileriniz aşağıdaki amaçlar ile kullanılmaktadır:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Siparişlerinizi işlemek ve teslimatını sağlamak</li>
                <li>Müşteri hizmetleri sağlamak</li>
                <li>Hizmetlerimizi geliştirmek</li>
                <li>Pazarlama ve promosyon faaliyetleri</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">4. Veri Koruması</h2>
              <p>
                Kişisel verileriniz güvenli sunucularda saklanmaktadır. Verilerinizin güvenliğini sağlamak 
                için endüstri standartları uygulamaktayız. Tüm veri transferleri SSL şifrelemesi kullanıp 
                gerçekleştirilmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">5. Üçüncü Taraflarla Paylaşım</h2>
              <p>
                Kişisel verileriniz, yasal olmayan şekilde üçüncü taraflarla paylaşılmamaktadır. 
                Ancak, sipariş teslimatı gibi gerekli durumlarda kargo şirketleri ile adres bilgileri paylaşılabilmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">6. Çerezler (Cookies)</h2>
              <p>
                Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanmaktadır. 
                Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">7. Haklarınız</h2>
              <p className="mb-3">Aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinize erişme hakkı</li>
                <li>Verilerinizi düzeltme hakkı</li>
                <li>Verilerinizi silme hakkı</li>
                <li>Veri transferi hakkı</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">8. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız varsa, lütfen info@myshop.com adresinden 
                bizimle iletişim kurunuz.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default PrivacyPage
