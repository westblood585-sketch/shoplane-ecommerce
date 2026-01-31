import { useState } from 'react'
import { Plus, MapPin, Trash2, Edit, Check } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import useAddressStore from '../../store/addressStore'

function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    zipCode: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      updateAddress(editingId, formData)
    } else {
      addAddress(formData)
    }

    // Reset form
    setFormData({
      title: '',
      fullName: '',
      phone: '',
      city: '',
      district: '',
      address: '',
      zipCode: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (address) => {
    setFormData(address)
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      deleteAddress(id)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      fullName: '',
      phone: '',
      city: '',
      district: '',
      address: '',
      zipCode: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Adreslerim</h1>
            <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Yeni Adres Ekle
          </button>
        </div>

        {/* Adres Formu */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Adres Başlığı</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ev, İş, vb."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Alıcı adı soyadı"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">İl</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="İstanbul"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">İlçe</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Kadıköy"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Posta Kodu</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="34710"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adres</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Mahalle, sokak, bina no, daire no"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Adres Listesi */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map(address => (
            <div
              key={address.id}
              className={`bg-white rounded-xl shadow-md p-6 relative ${
                address.isDefault ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {/* Varsayılan Badge */}
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Check size={14} />
                  Varsayılan
                </div>
              )}

              {/* İkon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-lg">{address.title}</h3>
              </div>

              {/* Bilgiler */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="font-semibold text-gray-900">{address.fullName}</p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>{address.district} / {address.city}</p>
                <p>Posta Kodu: {address.zipCode}</p>
              </div>

              {/* Butonlar */}
              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Boş Durum */}
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-20">
            <MapPin size={80} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Henüz Adres Eklemediniz</h3>
            <p className="text-gray-600 mb-6">İlk teslimat adresinizi ekleyin</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Adres Ekle
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default AddressesPage