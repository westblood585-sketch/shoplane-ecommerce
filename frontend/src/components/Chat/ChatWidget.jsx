import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Bot, Trash2 } from 'lucide-react'
import API from '../../api/axiosConfig'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Chat başlat (Kimlik doğrulama gerektirmez)
  const startNewChat = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting new guest chat...')
      // Local chat ID oluştur - backend isteği gerekmez
      setChatId('guest-' + Date.now())
      
      // Hoş geldin mesajını ekle
      const welcomeMsg = {
        id: Date.now(),
        sender: 'bot',
        message: `Merhaba! 👋\n\nSize nasıl yardımcı olabilirim?\n\n• Sipariş takibi\n• Kargo bilgisi\n• İade süreci\n• Ödeme seçenekleri\n• İndirim kampanyaları`,
        timestamp: new Date()
      }
      setMessages([welcomeMsg])
    } catch (err) {
      console.error('Start chat error:', err.message)
      // Fallback olarak local bot kullan
      setChatId('guest-' + Date.now())
      const welcomeMsg = {
        id: Date.now(),
        sender: 'bot',
        message: `Merhaba! 👋\n\nSize nasıl yardımcı olabilirim?\n\n• Sipariş takibi\n• Kargo bilgisi\n• İade süreci\n• Ödeme seçenekleri\n• İndirim kampanyaları`,
        timestamp: new Date()
      }
      setMessages([welcomeMsg])
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Chat açıldığında
  useEffect(() => {
    if (isOpen && !chatId) {
      startNewChat()
    }
  }, [isOpen, chatId])

  // Fallback Bot cevapları
  const getBotFallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim()
    
    // Selamlaşma
    if (msg.match(/^(merhaba|selam|hey|hi|hello|alo|oi|sa|asalamualaikum)/)) {
      const greetings = [
        'Merhaba! 👋 Size nasıl yardımcı olabilirim?',
        'Hoş geldiniz! 😊 Soru veya sorun mu var?',
        'Hey! 👋 Ne yapmam gerektiğini söyle.'
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // Sipariş takibi
    if (msg.includes('sipariş') || msg.includes('siparis') || msg.includes('takip') || msg.includes('nerede') || msg.includes('geldi mi')) {
      return 'Siparişlerinizi hesabınız altında "Siparişlerim" bölümünden takip edebilirsiniz. Sipariş numarası ile de sistem üzerinde arama yapabilirsiniz. 📦'
    }

    // Kargo ve teslimat
    if (msg.includes('kargo') || msg.includes('teslimat') || msg.includes('ne zaman') || msg.includes('kaç gün')) {
      return 'Standart kargo 2-4 iş günü içinde teslim edilir.\n✅ Ücretsiz kargo: 500₺ ve üzeri alışverişlerde\n✅ Hızlı teslimat: Seçili ürünlerde 1 gün içinde\n🚚 Durumu "Siparişlerim"den takip edebilirsiniz.'
    }

    // İade ve değişim
    if (msg.includes('iade') || msg.includes('değişim') || msg.includes('degisim') || msg.includes('geri') || msg.includes('para')) {
      return '✅ 14 gün içinde hiç kullanılmamış ürünleri iade edebilirsiniz.\n✅ Kargo ücreti bize ait\n✅ 24 saat içinde işlem başlatabilirsiniz\n\nİade sürecini başlatmak için "Siparişlerim" → ürünü seçin → "İade Talep Et" 🔄'
    }

    // Ödeme
    if (msg.includes('ödeme') || msg.includes('odeme') || msg.includes('kredi') || msg.includes('kart') || msg.includes('para') || msg.includes('havale') || msg.includes('eft')) {
      return '💳 Ödeme Seçenekleri:\n✅ Kredi Kartı\n✅ Banka Kartı\n✅ Havale/EFT\n✅ Kapıda Ödeme\n✅ Mobil Cüzdan (Apple Pay, Google Pay)\n\nTüm işlemler SSL şifreli ve güvenlidir.'
    }

    // Güvenlik
    if (msg.includes('güvenlik') || msg.includes('guvenlik') || msg.includes('şifre') || msg.includes('sifre') || msg.includes('güvenli') || msg.includes('emniyetli')) {
      return '🔒 Verileriniz tamamen güvenlidir!\n✅ 256-bit SSL Encryption\n✅ PCI DSS Uyumlu\n✅ 2FA Seçeneği Mevcuttur\n✅ Düzenli Güvenlik Denetimleri\n\nHesap güvenliğini "Profil" → "Güvenlik Ayarları"nda yönetebilirsiniz.'
    }

    // Kampanya ve İndirim
    if (msg.includes('indirim') || msg.includes('kampanya') || msg.includes('discount') || msg.includes('promosyon') || msg.includes('fiyat')) {
      return '🎉 Aktif Kampanyalar:\n✅ Yeni üyeler: İlk alışveriş 100₺ indirim\n✅ Haftalık flash sale: Her Pazartesi 18:00\n✅ Bülten abonesine özel: 15% indirim kuponu\n✅ Puan sistemi: Her alışveriş puan kazanın\n\nTüm kampanyaları ana sayfada görebilirsiniz!'
    }

    // Ürün arama
    if (msg.includes('nasıl ara') || msg.includes('ürün bul') || msg.includes('urun bul') || msg.includes('kategoriler')) {
      return '🔍 Ürün Bulmak İçin:\n✅ Üst kısımdaki arama çubuğunu kullanın\n✅ Kategoriler menüsünden göz atın\n✅ "Filtreler" ile sonuçları daraltın\n✅ "Sırala" ile en uygun sonuçları bulun\n\nBeğendiğiniz ürünleri "Favori"lerinize ekleyebilirsiniz! ❤️'
    }

    // Profil ve Hesap
    if (msg.includes('profil') || msg.includes('hesap') || msg.includes('bilgi') || msg.includes('değişir') || msg.includes('degisir')) {
      return '👤 Hesap Bilgileri:\n✅ Profil sayfasında tüm bilgilerinizi görüntüleyebilirsiniz\n✅ E-posta, telefon, adres bilgilerini güncelleyebilirsiniz\n✅ Şifrenizi değiştirebilirsiniz\n✅ Tercihleri yönetebilirsiniz\n\n"Profil" → "Ayarlar"a tıklayın.'
    }

    // Favoriler ve Karşılaştırma
    if (msg.includes('favori') || msg.includes('beğen') || msg.includes('karşılaş') || msg.includes('compare')) {
      return '❤️ Favoriler ve Karşılaştırma:\n✅ Ürüne tıklayıp "♥ Favorim" ekleyin\n✅ Favorileriniz hesabınız altında kaydedilir\n✅ Birden fazla ürünü karşılaştırabilirsiniz\n✅ Karşılaştırma listesini paylaşabilirsiniz\n\nMobil uygulamada da aynı başlıklar mevcuttur!'
    }

    // Satış Sonrası Hizmetler
    if (msg.includes('garanti') || msg.includes('onarım') || msg.includes('onarim') || msg.includes('teknik') || msg.includes('sorun')) {
      return '🔧 Satış Sonrası Hizmetler:\n✅ Ürün garantisi: Üretici garantisı geçerli\n✅ Teknik destek: 7/24 canlı sohbet\n✅ Onarım hizmetleri: Yetkili servisler ile anlaşmalı\n✅ Yedek parçalar: Tüm ürünlerde tedarik edilir\n\nSorun yaşıyorsanız: support@eticaret.com'
    }

    // İletişim
    if (msg.includes('iletişim') || msg.includes('iletisim') || msg.includes('telefon') || msg.includes('email') || msg.includes('adres') || msg.includes('bize ulaş')) {
      return '📞 Bize Ulaşın:\n✅ E-mail: support@eticaret.com\n✅ Telefon: 0850 XXX XXXX (Pazartesi-Cuma 09:00-18:00)\n✅ Canlı Sohbet: 24 saat (ben!)\n✅ Sosyal Medya: @eticaret_tr\n\nEn hızlı cevap için canlı sohbeti kullanın!'
    }

    // Puan ve Rozetler
    if (msg.includes('puan') || msg.includes('puan') || msg.includes('rozet') || msg.includes('gamifi')) {
      return '🏆 Puan ve Rozetler:\n✅ Her alışveriş 1₺ = 1 puan kazanın\n✅ Puanları sonraki alışverişte kullanın (100 puan = 100₺)\n✅ Rozetler kazanarak seviye atlayın\n✅ VIP seviyede özel indirimler alın\n\nProfilinde "Puan & Rozetler" bölümüne bakın! ⭐'
    }

    // Genel yardım
    if (msg.includes('yardım') || msg.includes('yardim') || msg.includes('help') || msg.includes('neye') || msg.includes('nasıl')) {
      return '💡 Size yardımcı olabileceğim konular:\n• 📦 Sipariş takibi\n• 🚚 Kargo ve teslimat\n• 🔄 İade ve değişim\n• 💳 Ödeme yöntemleri\n• 👤 Profil ve hesap\n• ❤️ Favoriler\n• 🏆 Puan sistemi\n• 🔒 Güvenlik\n• 📞 İletişim bilgileri\n\nBirini seçin veya direkt soru sorun!'
    }

    // Teşekkür ve Cevaplar
    if (msg.match(/^(teşekkür|tesekkur|sağol|sagol|eyvallah|çok güzel|cok guzel|harika|super|thanks|thank you)/)) {
      return 'Birşey değil! 😊 Size daha nasıl yardımcı olabilirim?'
    }

    // Başka sorular
    if (msg.includes('?') || msg.length > 20) {
      const responses = [
        'İlginç soru! 🤔 Bunu tam olarak anlayamadım, daha detaylı açıklar mısınız?',
        'Hmmm, biraz karışık geldi. 📝 Lütfen daha açık yazabilir misiniz?',
        'Anladığımı tam emin değilim. 🤷 Başka bir şekilde sorabilir misiniz?',
        'Hmm, bu konuda yardımcı olabilirim ama biraz detay gerek! 📋'
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Varsayılan cevap
    const defaults = [
      'Merhaba! 👋 Sipariş, kargo, iade gibi konularda yardımcı olabilirim. Ne istiyorsunuz?',
      'Anladığım kadarıyla... 🤔 Biraz daha açıklar mısınız? Hangi konuda sorun yaşıyorsunuz?',
      'Bir saniye, bu konuyu tam açıklamak için daha fazla bilgi gerekiyor. 📝 Detay verebilir misiniz?'
    ]
    return defaults[Math.floor(Math.random() * defaults.length)]
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Mesaj gönder (Backend isteği gerekmez - lokal bot cevabı kullan)
  const handleSend = async (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || isTyping) return

    // Eğer chat başlamadıysa başlat
    if (!chatId) {
      await startNewChat()
      return
    }

    // Kullanıcı mesajını hemen göster
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date(),
      read: true
    }

    setMessages(prev => [...prev, userMsg])
    const messageText = inputMessage
    setInputMessage('')
    setIsTyping(true)
    setError(null)

    try {
      // Lokal bot cevabı kullan (kimlik doğrulama gerektirmez)
      const botResponseText = getBotFallbackResponse(messageText)
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: botResponseText,
        timestamp: new Date()
      }
      
      // Typing effect
      setTimeout(() => {
        setMessages(prev => [...prev, botMsg])
        setIsTyping(false)
      }, 800)
    } catch (err) {
      console.error('Error generating bot response:', err.message)
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: getBotFallbackResponse(messageText),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }
  }

  // Chat temizle
  const clearChat = () => {
    if (window.confirm('Sohbeti silmek istediğinize emin misiniz?')) {
      setMessages([])
      setChatId(null)
      startNewChat()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-125 hover:shadow-3xl transition-all duration-300 group animate-bounce"
          title="Sohbete başla"
        >
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 ${
          isMinimized ? 'w-96 h-20' : 'w-[420px] h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg relative">
                <Bot className="text-white" size={24} />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg">MyShop AI</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-lg"></span>
                  <p className="text-xs font-medium opacity-90">Çevrimiçi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition duration-200"
                title="Sohbeti temizle"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition duration-200"
                title={isMinimized ? 'Pencereyi aç' : 'Küçült'}
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition duration-200"
                title="Kapat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[450px] overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50/50 to-blue-50/50 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                {loading && (
                  <div className="flex items-center justify-center h-24">
                    <div className="space-y-3 text-center">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-gray-500">Sohbet başlatılıyor...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 animate-shake">
                    <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
                  </div>
                )}

                {messages.length === 0 && !loading && (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <p className="text-sm text-center">Hoş geldiniz! Sorununuzu yazın.</p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md hover:shadow-lg'
                          : 'bg-white text-gray-800 rounded-bl-md border border-gray-200/50 hover:border-gray-300'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Bot size={10} className="text-white" />
                          </div>
                          <p className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bot Asistan</p>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-2 font-medium ${msg.sender === 'user' ? 'opacity-70' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-200/50">
                      <div className="flex gap-2">
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Merhaba, nasıl yardımcı olabilirim..."
                    className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400 disabled:opacity-50"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
                  >
                    <Send size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWidget
