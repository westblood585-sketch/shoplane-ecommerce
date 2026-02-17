import { useState } from 'react'

function OptimizedImage({ src, alt, className, fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle" font-family="system-ui"%3ENo Image%3C/text%3E%3C/svg%3E' }) {
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