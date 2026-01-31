import { Link } from "react-router-dom"

const tickets = [
  { id: 1, name: "Konser", price: 500 },
  { id: 2, name: "Tiyatro", price: 300 },
  { id: 3, name: "Festival", price: 800 },
]

export default function Tickets() {
  return (
    <div className="p-10">
      <h1 className="text-4xl mb-6">🎟 Biletler</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tickets.map(t => (
          <div key={t.id} className="border p-4 rounded shadow">
            <h2 className="text-xl">{t.name}</h2>
            <p>{t.price} TL</p>
            <Link to="/checkout" className="text-blue-600 mt-2 inline-block">
              Satın Al
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
