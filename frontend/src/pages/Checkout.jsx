export default function Checkout() {
  return (
    <div className="p-10">
      <h1 className="text-4xl mb-4">💳 Ödeme</h1>
      <input className="border p-2 block mb-3" placeholder="Kart Numarası" />
      <input className="border p-2 block mb-3" placeholder="Ad Soyad" />
      <button className="bg-green-600 text-white px-6 py-2">
        Ödeme Yap
      </button>
    </div>
  )
}
