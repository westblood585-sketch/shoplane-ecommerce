import { useState } from 'react'

function OptimizedImage({ src, alt, className, fallback = 'https://via.placeholder.com/400' }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc(fallback)
          setLoading(false)
        }}
        loading="lazy"
      />
    </div>
  )
}

export default OptimizedImage