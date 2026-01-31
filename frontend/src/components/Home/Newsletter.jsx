import { Mail } from 'lucide-react'
import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Kaydınız alındı: ${email}`)
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Mail size={48} className="mx-auto text-white mb-6" />
        <h2 className="text-4xl font-bold text-white mb-4">
          İndirimlerden Haberdar Olun
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          E-bültenimize kayıt olun, özel fırsatları kaçırmayın!
        </p>

        <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            className="flex-1 px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          />
          <button 
            type="submit"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="text-blue-100 text-sm mt-4">
          İstediğiniz zaman abonelikten çıkabilirsiniz.
        </p>
      </div>
    </section>
  )
}

export default Newsletter