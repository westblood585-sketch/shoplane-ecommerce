import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Smartphone, Laptop, Watch, Camera, Headphones, 
  ShirtIcon, Briefcase, Gem, 
  ShoppingBag, Dumbbell, Sparkles, Home,
  ChevronRight, TrendingUp, Flame, Star
} from 'lucide-react'

function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'elektronik',
      name: 'Elektronik',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      subcategories: [
        {
          title: 'Telefon & Tablet',
          icon: Smartphone,
          items: ['iPhone', 'Samsung Galaxy', 'iPad', 'Android Tablet', 'Aksesuarlar']
        },
        {
          title: 'Bilgisayar',
          icon: Laptop,
          items: ['Laptop', 'Masaüstü', 'MacBook', 'Gaming PC', 'Monitör']
        },
        {
          title: 'Giyilebilir Teknoloji',
          icon: Watch,
          items: ['Apple Watch', 'Samsung Watch', 'Akıllı Bileklik', 'Kulaklık']
        },
        {
          title: 'Fotoğraf & Video',
          icon: Camera,
          items: ['DSLR Kamera', 'Mirrorless', 'Drone', 'GoPro', 'Lens']
        }
      ],
      featured: {
        title: 'En Çok Satanlar',
        products: [
          { name: 'iPhone 15 Pro Max', price: '54.999₺', image: 'photo-1678685888221-cda773a3dcdb' },
          { name: 'MacBook Air M3', price: '48.999₺', image: 'photo-1517336714731-489689fd1ca8' },
          { name: 'AirPods Pro 2', price: '8.999₺', image: 'photo-1606841837239-c5a1a4a07af7' }
        ]
      },
      banner: {
        title: 'Elektronik Fırsatları',
        subtitle: '%50\'ye varan indirim',
        image: 'photo-1607082348824-0a96f2a4b9da'
      }
    },
    {
      id: 'giyim',
      name: 'Giyim',
      icon: ShirtIcon,
      color: 'from-purple-500 to-pink-500',
      subcategories: [
        {
          title: 'Kadın Giyim',
          icon: ShirtIcon,
          items: ['Elbise', 'Bluz', 'Pantolon', 'Etek', 'Ceket']
        },
        {
          title: 'Erkek Giyim',
          icon: Briefcase,
          items: ['Gömlek', 'Tişört', 'Pantolon', 'Ceket', 'Takım Elbise']
        },
        {
          title: 'Spor Giyim',
          icon: Dumbbell,
          items: ['Koşu', 'Yoga', 'Fitness', 'Basketbol', 'Futbol']
        },
        {
          title: 'İç Giyim',
          icon: Gem,
          items: ['Pijama', 'Gecelik', 'Tayt', 'Atlet']
        }
      ],
      featured: {
        title: 'Trend Ürünler',
        products: [
          { name: 'Zara Crop Blazer', price: '1.799₺', image: 'photo-1591369822096-ffd140ec948f' },
          { name: 'H&M Mom Jean', price: '899₺', image: 'photo-1582418702059-97ebafb35d09' },
          { name: 'Mango Saten Elbise', price: '1.299₺', image: 'photo-1595777457583-95e059d581b8' }
        ]
      },
      banner: {
        title: 'Yeni Sezon Koleksiyonu',
        subtitle: 'İlk alışverişe özel %20 indirim',
        image: 'photo-1523381210434-271e8be1f52b'
      }
    },
    {
      id: 'ayakkabi',
      name: 'Ayakkabı',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-500',
      subcategories: [
        {
          title: 'Spor Ayakkabı',
          icon: Dumbbell,
          items: ['Koşu', 'Basketbol', 'Antrenman', 'Yürüyüş', 'Tenis']
        },
        {
          title: 'Günlük Ayakkabı',
          icon: ShoppingBag,
          items: ['Sneaker', 'Casual', 'Loafer', 'Espadrille']
        },
        {
          title: 'Kadın Ayakkabı',
          icon: Sparkles,
          items: ['Topuklu', 'Bot', 'Babet', 'Sandalet']
        },
        {
          title: 'Erkek Ayakkabı',
          icon: Briefcase,
          items: ['Klasik', 'Bot', 'Terlik', 'Sandalet']
        }
      ],
      featured: {
        title: 'Çok Satanlar',
        products: [
          { name: 'Nike Air Max 90', price: '4.999₺', image: 'photo-1542291026-7eec264c27ff' },
          { name: 'Adidas Ultraboost', price: '5.999₺', image: 'photo-1608231387042-66d1773070a5' },
          { name: 'Converse Chuck Taylor', price: '1.899₺', image: 'photo-1607522370275-f14206abe5d3' }
        ]
      },
      banner: {
        title: 'Ayakkabı Kampanyası',
        subtitle: '2 Al 1 Öde fırsatı',
        image: 'photo-1560769629-975ec94e6a86'
      }
    },
    {
      id: 'aksesuar',
      name: 'Aksesuar',
      icon: Gem,
      color: 'from-green-500 to-emerald-500',
      subcategories: [
        {
          title: 'Çanta',
          icon: ShoppingBag,
          items: ['El Çantası', 'Sırt Çantası', 'Laptop Çantası', 'Spor Çantası']
        },
        {
          title: 'Saat',
          icon: Watch,
          items: ['Kadın Saat', 'Erkek Saat', 'Akıllı Saat', 'Çocuk Saat']
        },
        {
          title: 'Takı',
          icon: Gem,
          items: ['Kolye', 'Küpe', 'Bileklik', 'Yüzük']
        },
        {
          title: 'Gözlük',
          icon: Star,
          items: ['Güneş Gözlüğü', 'Optik Gözlük', 'Gece Gözlüğü']
        }
      ],
      featured: {
        title: 'Öne Çıkanlar',
        products: [
          { name: 'Ray-Ban Aviator', price: '3.999₺', image: 'photo-1511499767150-a48a237f0083' },
          { name: 'Michael Kors Çanta', price: '8.999₺', image: 'photo-1590874103328-eac38a683ce7' },
          { name: 'Casio G-Shock', price: '2.999₺', image: 'photo-1523170335258-f5ed11844a49' }
        ]
      },
      banner: {
        title: 'Aksesuar İndirimi',
        subtitle: 'Tüm aksesuarlarda %30 indirim',
        image: 'photo-1611652022419-a9419f74343d'
      }
    },
    {
      id: 'ev',
      name: 'Ev & Yaşam',
      icon: Home,
      color: 'from-indigo-500 to-purple-500',
      subcategories: [
        {
          title: 'Ev Aletleri',
          icon: Home,
          items: ['Süpürge', 'Ütü', 'Blender', 'Mikser', 'Kahve Makinesi']
        },
        {
          title: 'Mutfak',
          icon: Sparkles,
          items: ['Tencere Set', 'Tava', 'Bıçak Set', 'Sofra Takımı']
        },
        {
          title: 'Ev Tekstili',
          icon: Gem,
          items: ['Nevresim', 'Havlu', 'Perde', 'Halı']
        },
        {
          title: 'Dekorasyon',
          icon: Star,
          items: ['Vazo', 'Tablo', 'Ayna', 'Saat', 'Aydınlatma']
        }
      ],
      featured: {
        title: 'Popüler Ürünler',
        products: [
          { name: 'Dyson V15 Detect', price: '24.999₺', image: 'photo-1558317374-067fb5f30001' },
          { name: 'Nespresso Vertuo', price: '4.999₺', image: 'photo-1517668808822-9ebb02f2a0e6' },
          { name: 'Philips Airfryer XXL', price: '5.999₺', image: 'photo-1585515320310-259814833133' }
        ]
      },
      banner: {
        title: 'Ev Aletlerinde',
        subtitle: 'Kış fırsatları başladı',
        image: 'photo-1556911220-bff31c812dba'
      }
    },
    {
      id: 'spor',
      name: 'Spor & Outdoor',
      icon: Dumbbell,
      color: 'from-red-500 to-pink-500',
      subcategories: [
        {
          title: 'Fitness',
          icon: Dumbbell,
          items: ['Dambıl', 'Yoga Matı', 'Pilates', 'Direnç Bandı']
        },
        {
          title: 'Outdoor',
          icon: TrendingUp,
          items: ['Kamp Malzemeleri', 'Çadır', 'Uyku Tulumu', 'Trekking']
        },
        {
          title: 'Takım Sporları',
          icon: Flame,
          items: ['Futbol', 'Basketbol', 'Voleybol', 'Tenis']
        },
        {
          title: 'Su Sporları',
          icon: Star,
          items: ['Yüzme', 'Dalış', 'Sörf', 'Kano']
        }
      ],
      featured: {
        title: 'En Çok Tercih Edilenler',
        products: [
          { name: 'Decathlon Yoga Matı', price: '299₺', image: 'photo-1601925260368-ae2f83cf8b7f' },
          { name: 'Nike Dambıl Seti', price: '1.899₺', image: 'photo-1517344884509-a0c97ec11bcc' },
          { name: 'The North Face Çanta', price: '3.299₺', image: 'photo-1622260614153-03223fb72052' }
        ]
      },
      banner: {
        title: 'Spor Ürünlerinde',
        subtitle: 'Fit ol, sağlıklı yaşa',
        image: 'photo-1534438327276-14e5300c3a48'
      }
    },
    {
      id: 'kozmetik',
      name: 'Kozmetik',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      subcategories: [
        {
          title: 'Cilt Bakımı',
          icon: Sparkles,
          items: ['Temizleyici', 'Tonik', 'Serum', 'Nemlendirici', 'Maske']
        },
        {
          title: 'Makyaj',
          icon: Gem,
          items: ['Fondöten', 'Ruj', 'Maskara', 'Far', 'Allık']
        },
        {
          title: 'Saç Bakımı',
          icon: Star,
          items: ['Şampuan', 'Saç Kremi', 'Saç Maskesi', 'Serum']
        },
        {
          title: 'Kişisel Bakım',
          icon: ShoppingBag,
          items: ['Parfüm', 'Deodorant', 'Duş Jeli', 'El Kremi']
        }
      ],
      featured: {
        title: 'Yeni Gelenler',
        products: [
          { name: 'Estée Lauder Serum', price: '2.999₺', image: 'photo-1556228720-195a672e8a03' },
          { name: 'Dyson Supersonic', price: '14.999₺', image: 'photo-1522338140262-f46f5913618a' },
          { name: 'Philips OneBlade', price: '1.599₺', image: 'photo-1503342217505-b0a15ec3261c' }
        ]
      },
      banner: {
        title: 'Kozmetik Fırsatları',
        subtitle: '3 Al 2 Öde kampanyası',
        image: 'photo-1596462502278-27bfdc403348'
      }
    }
  ]

  return (
    <div className="hidden lg:block relative">
      <div className="flex gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              to={`/products?category=${category.name}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition group"
            >
              <category.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium whitespace-nowrap">{category.name}</span>
            </Link>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {activeCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 z-50"
                  style={{ width: '900px' }}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-0">
                      {/* Left - Subcategories */}
                      <div className="col-span-7 p-6 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-6">
                          {category.subcategories.map((sub, index) => (
                            <div key={index}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                                  <sub.icon size={16} className="text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900">{sub.title}</h3>
                              </div>
                              <ul className="space-y-2">
                                {sub.items.map((item, i) => (
                                  <li key={i}>
                                    <Link
                                      to={`/products?category=${category.name}&subcategory=${item}`}
                                      className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-1 group"
                                    >
                                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right - Featured & Banner */}
                      <div className="col-span-5 p-6 bg-white">
                        {/* Featured Products */}
                        <div className="mb-6">
                          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-orange-500" />
                            {category.featured.title}
                          </h3>
                          <div className="space-y-3">
                            {category.featured.products.map((product, index) => (
                              <Link
                                key={index}
                                to="/products"
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
                              >
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                  <img
                                    src={`https://images.unsplash.com/${product.image}?w=200`}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold truncate group-hover:text-blue-600 transition">
                                    {product.name}
                                  </p>
                                  <p className="text-sm font-bold text-blue-600">{product.price}</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Banner */}
                        <Link
                          to={`/products?category=${category.name}`}
                          className="block relative h-32 rounded-xl overflow-hidden group"
                        >
                          <img
                            src={`https://images.unsplash.com/${category.banner.image}?w=600`}
                            alt={category.banner.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-80`} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                            <h4 className="text-lg font-bold mb-1">{category.banner.title}</h4>
                            <p className="text-sm opacity-90">{category.banner.subtitle}</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MegaMenu