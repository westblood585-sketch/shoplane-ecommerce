import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function FAQPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.faq.description, metaDescriptions.faq.title)
  const [expanded, setExpanded] = useState(null)

  const faqs = [
    {
      question: "Siparişlerim ne zaman teslim edilir?",
      answer: "Standart kargo ile 2-3 iş günü içinde teslim edilmektedir. Hızlı kargo ile ise 24 saat içinde teslim sağlanmaktadır."
    },
    {
      question: "Ürünleri geri gönderebilir miyim?",
      answer: "Evet, ürünün teslim tarihinden itibaren 14 gün içinde hiçbir soru sormaksızın iade edebilirsiniz."
    },
    {
      question: "Ödeme yöntemleri nelerdir?",
      answer: "Kredi kartı, banka havalesi, EFT ve kapıda ödeme yöntemleri mevcuttur."
    },
    {
      question: "İndirimli ürünlerde iade hakkım var mı?",
      answer: "Evet, indirimlerdeki ürünler de 14 gün içinde iade edilebilir."
    },
    {
      question: "Kargo ücreti ne kadar?",
      answer: "100₺ ve üzeri alışverişlerde kargo ücretsizdir. Bunun altında 20₺ kargo ücreti alınmaktadır."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
          {' / '}
          <span className="text-gray-900 font-semibold">Sıkça Sorulan Sorular</span>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-8 dark:text-dark-text">Sıkça Sorulan Sorular</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === index ? null : index)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border flex justify-between items-center transition"
                >
                  <span className="font-semibold dark:text-dark-text text-left">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-600 transition ${expanded === index ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expanded === index && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default FAQPage
