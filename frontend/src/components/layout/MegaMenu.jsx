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
      <div className="flex gap-2">
        {categories.map((category, catIndex) => (
          <div
            key={category.id}
            className="relative group"
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            {/* Category Button with 3D Effect */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/products?category=${category.name}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition group relative"
              >
                {/* Icon with 3D Rotation */}
                <motion.div
                  animate={{ rotateY: activeCategory === category.id ? 15 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="perspective"
                >
                  <category.icon size={20} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </motion.div>
                
                <span className="font-semibold whitespace-nowrap dark:text-dark-text text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </span>

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            {/* 3D Mega Menu Dropdown */}
            <AnimatePresence>
              {activeCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                  className="absolute top-full left-0 mt-3 z-50"
                  style={{ width: '1000px' }}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div 
                    className="relative bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-xl"
                    initial={{ rotateX: -10 }}
                    animate={{ rotateX: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Animated Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5`}
                      animate={{ opacity: [0.05, 0.1, 0.05] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative grid grid-cols-12 gap-0">
                      {/* Left - Subcategories with 3D Cards */}
                      <div className="col-span-7 p-8 bg-gradient-to-b from-gray-50 to-white dark:from-dark-hover dark:to-dark-card">
                        <div className="grid grid-cols-2 gap-6">
                          {category.subcategories.map((sub, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              whileHover={{ y: -5 }}
                              className="group/sub p-4 rounded-2xl hover:bg-white dark:hover:bg-dark-bg transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer relative overflow-hidden"
                            >
                              {/* Hover 3D Background */}
                              <motion.div
                                className={`absolute -inset-full bg-gradient-to-br ${category.color} opacity-0 group-hover/sub:opacity-5 transition-opacity duration-300`}
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                              />

                              <div className="relative flex items-center gap-3 mb-4">
                                <motion.div
                                  whileHover={{ rotate: 360, scale: 1.2 }}
                                  transition={{ duration: 0.6 }}
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover/sub:shadow-xl transition-shadow`}
                                >
                                  <sub.icon size={20} className="text-white" />
                                </motion.div>
                                <h3 className="font-bold text-gray-900 dark:text-dark-text group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400 transition-colors">{sub.title}</h3>
                              </div>

                              {/* Items with stagger animation */}
                              <ul className="space-y-2.5 relative">
                                {sub.items.map((item, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + i * 0.05, duration: 0.3 }}
                                  >
                                    <Link
                                      to={`/products?category=${category.name}&subcategory=${item}`}
                                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-2 transition-all flex items-center gap-2 group/item relative"
                                    >
                                      {/* Animated Chevron */}
                                      <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <ChevronRight size={14} className="group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors" />
                                      </motion.div>
                                      <span className="group-hover/item:font-semibold transition-all">{item}</span>
                                      
                                      {/* Hover Line */}
                                      <motion.div
                                        className="absolute bottom-0 left-6 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/item:opacity-100"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    </Link>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Right - Featured & Banner with 3D Effect */}
                      <div className="col-span-5 p-8 bg-gradient-to-b from-white to-gray-50 dark:from-dark-card dark:to-dark-hover border-l border-gray-100 dark:border-gray-700">
                        {/* Featured Products */}
                        <motion.div
                          className="mb-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <h3 className="font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            >
                              <TrendingUp size={18} className={`bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                            </motion.div>
                            {category.featured.title}
                          </h3>

                          <div className="space-y-3">
                            {category.featured.products.map((product, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                                whileHover={{ x: 10, scale: 1.02 }}
                              >
                                <Link
                                  to="/products"
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition group relative overflow-hidden border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50"
                                >
                                  {/* 3D Image Container */}
                                  <motion.div
                                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-dark-bg shadow-lg"
                                    whileHover={{
                                      rotateY: 15,
                                      rotateX: -10,
                                      scale: 1.1
                                    }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                  >
                                    <img
                                      src={`https://images.unsplash.com/${product.image}?w=200`}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </motion.div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                      {product.name}
                                    </p>
                                    <motion.p
                                      className={`text-sm font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      {product.price}
                                    </motion.p>
                                  </div>

                                  <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                  >
                                    <ChevronRight size={16} />
                                  </motion.div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* 3D Banner with Parallax */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          whileHover={{ scale: 1.05, rotateY: 5 }}
                          className="group/banner"
                        >
                          <Link
                            to={`/products?category=${category.name}`}
                            className="block relative h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                          >
                            {/* Animated Background */}
                            <motion.img
                              src={`https://images.unsplash.com/${category.banner.image}?w=600`}
                              alt={category.banner.title}
                              className="w-full h-full object-cover"
                              animate={{ scale: 1.05 }}
                              whileHover={{ scale: 1.15 }}
                              transition={{ duration: 0.5 }}
                            />

                            {/* Gradient Overlay */}
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75 group-hover/banner:opacity-85`}
                              animate={{ opacity: [0.75, 0.8, 0.75] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Content with 3D Transform */}
                            <motion.div
                              className="absolute inset-0 flex flex-col items-center justify-center text-white p-4"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <motion.h4
                                className="text-lg font-bold mb-1"
                                whileHover={{ scale: 1.1 }}
                              >
                                {category.banner.title}
                              </motion.h4>
                              <motion.p
                                className="text-sm opacity-90"
                                whileHover={{ opacity: 1 }}
                              >
                                {category.banner.subtitle}
                              </motion.p>
                            </motion.div>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
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