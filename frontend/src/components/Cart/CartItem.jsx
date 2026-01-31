import { Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.cartId, item.quantity + 1)
    } else {
      alert('Maksimum stok miktarına ulaştınız!')
    }
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.cartId, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    if (confirm(`${item.name} sepetten kaldırılsın mı?`)) {
      removeItem(item.cartId)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex gap-6 hover:shadow-lg transition">
      {/* Ürün Resmi */}
      <Link to={`/products/${item.id}`} className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition"
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex-1">
        <Link to={`/products/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
            {item.name}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-semibold">Beden:</span> {item.size}
          </div>
          <div>
            <span className="font-semibold">Renk:</span> {item.color}
          </div>
          <div>
            <span className="font-semibold">Marka:</span> {item.brand}
          </div>
        </div>

        {/* Fiyat ve Miktar Kontrolü */}
        <div className="flex items-center justify-between">
          {/* Miktar Kontrolü */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrease}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center transition"
              disabled={item.quantity === 1}
            >
              <Minus size={18} />
            </button>
            
            <input
              type="text"
              value={item.quantity}
              readOnly
              className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
            />
            
            <button
              onClick={handleIncrease}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center transition"
              disabled={item.quantity >= item.stock}
            >
              <Plus size={18} />
            </button>

            <span className="text-sm text-gray-500 ml-2">
              (Stok: {item.stock})
            </span>
          </div>

          {/* Fiyat */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ₺{(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              Birim: ₺{item.price.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Sil Butonu */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-3 h-fit rounded-lg hover:bg-red-50 text-red-500 transition"
        title="Sepetten Kaldır"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}

export default CartItem