import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

function ImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Ana Resim */}
        <div className="relative bg-gray-100 rounded-2xl overflow-hidden group" style={{ height: '500px' }}>
          <img
            src={images[selectedIndex]}
            alt={`${productName} - ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Zoom Butonu */}
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
          >
            <Maximize2 size={20} />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail'ler */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                selectedIndex === index ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={images[selectedIndex]}
            alt={productName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  )
}

export default ImageGallery
