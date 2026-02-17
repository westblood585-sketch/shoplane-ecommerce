import { useEffect, useRef } from 'react'

/**
 * Giriş Tanıtım Videosu Modal Komponenti
 * 
 * Kullanıcı giriş yaptıktan sonra tanıtım videosunu otomatik gösterir
 * Video bittiğinde otomatik olarak kapatılır ve ana sayfaya yönlenilir
 */
export default function IntroVideoModal({ isOpen = false, onClose = () => {}, videoSrc = '/videos/intro-video.mp4' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Video otomatik oynatılsın
      videoRef.current.play().catch(() => {
        console.log('Video oynatma başarısız')
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Video Player - Tam Ekran */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        className="w-full h-full object-cover"
        onEnded={onClose}
      >
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>
    </div>
  )
}
