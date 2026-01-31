import { Check, Minus, Plus } from 'lucide-react'

function ProductOptions({ 
  product, 
  selectedSize, 
  setSelectedSize, 
  selectedColor, 
  setSelectedColor,
  quantity,
  setQuantity 
}) {
  
  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Beden Seçimi - Sadece sizes varsa göster */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-lg">Beden Seçin</label>
            <button className="text-blue-600 text-sm hover:underline">Beden Tablosu</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                  selectedSize === size
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Renk Seçimi - Sadece colors varsa göster */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="font-semibold text-lg mb-3 block">Renk Seçin</label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => {
              // Renk hex kodları (basit mapping)
              const colorMap = {
                'Siyah': '#000000',
                'Beyaz': '#FFFFFF',
                'Gri': '#808080',
                'Kırmızı': '#EF4444',
                'Mavi': '#3B82F6',
                'Yeşil': '#10B981',
                'Sarı': '#FCD34D',
                'Turuncu': '#F97316',
                'Mor': '#A855F7',
                'Pembe': '#EC4899',
                'Kahverengi': '#92400E',
                'Gümüş': '#D1D5DB',
                'Altın': '#F59E0B',
                'RGB': 'linear-gradient(90deg, #FF0000, #00FF00, #0000FF)'
              }

              const colorHex = colorMap[color] || '#9CA3AF'
              const isGradient = color === 'RGB'

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-12 h-12 rounded-full border-4 transition ${
                    selectedColor === color
                      ? 'border-blue-600 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ 
                    background: isGradient ? colorHex : colorHex,
                    boxShadow: color === 'Beyaz' ? 'inset 0 0 0 1px #E5E7EB' : 'none'
                  }}
                  title={color}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={20} color={color === 'Beyaz' || color === 'Sarı' ? '#000' : '#FFF'} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {selectedColor && (
            <p className="text-sm text-gray-600 mt-2">Seçili: {selectedColor}</p>
          )}
        </div>
      )}

      {/* Adet Seçimi */}
      <div>
        <label className="font-semibold text-lg mb-3 block">Adet</label>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrease}
            disabled={quantity === 1}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={18} />
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (val >= 1 && val <= product.stock) {
                setQuantity(val)
              }
            }}
            className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
          />
          <button
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
          <span className="text-sm text-gray-600">
            ({product.stock} adet stokta)
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductOptions