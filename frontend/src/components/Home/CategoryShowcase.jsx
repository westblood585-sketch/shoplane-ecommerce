import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Smartphone, Shirt, Shoe, Heart, Home, Zap, Users, Sparkles } from 'lucide-react'

function CategoryShowcase() {
  const [hoveredId, setHoveredId] = useState(null)

  const categories = [
    { 
      id: 1, 
      name: "Elektronik", 
      slug: "elektronik", 
      icon: Smartphone,
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-50 to-cyan-50",
      description: "Teknoloji ürünleri"
    },
    { 
      id: 2, 
      name: "Giyim", 
      slug: "giyim", 
      icon: Shirt,
      gradient: "from-purple-500 to-pink-500",
      lightGradient: "from-purple-50 to-pink-50",
      description: "Moda koleksiyonu"
    },
    { 
      id: 3, 
      name: "Ayakkabı", 
      slug: "ayakkabi", 
      icon: Shoe,
      gradient: "from-orange-500 to-red-500",
      lightGradient: "from-orange-50 to-red-50",
      description: "Ayakkabı seçimi"
    },
    { 
      id: 4, 
      name: "Aksesuar", 
      slug: "aksesuar", 
      icon: Heart,
      gradient: "from-rose-500 to-pink-500",
      lightGradient: "from-rose-50 to-pink-50",
      description: "Tamamlayıcı ürünler"
    },
    { 
      id: 5, 
      name: "Ev & Yaşam", 
      slug: "ev-yasam", 
      icon: Home,
      gradient: "from-green-500 to-emerald-500",
      lightGradient: "from-green-50 to-emerald-50",
      description: "Ev ürünleri"
    },
    { 
      id: 6, 
      name: "Spor & Outdoor", 
      slug: "spor-outdoor", 
      icon: Zap,
      gradient: "from-indigo-500 to-blue-500",
      lightGradient: "from-indigo-50 to-blue-50",
      description: "Spor ekipmanları"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-bg dark:via-dark-hover dark:to-dark-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Sparkles size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">KATEGORILER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-dark-text">
            Tüm Kategorileri Keşfet
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Milyonlarca ürün içinden istediğinizi bulun. Modern tasarım ve geniş seçim.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative h-64 overflow-hidden rounded-3xl cursor-pointer"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* 3D Effect Layers */}
                <motion.div 
                  className="absolute inset-0 bg-white/10 backdrop-blur-md"
                  animate={{
                    opacity: hoveredId === category.id ? 0.5 : 0.2,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated Background Shapes */}
                <motion.div 
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                  animate={{
                    x: hoveredId === category.id ? 20 : 0,
                    y: hoveredId === category.id ? 10 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div 
                  className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    x: hoveredId === category.id ? -20 : 0,
                    y: hoveredId === category.id ? -10 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
                  {/* Icon with 3D Effect */}
                  <motion.div
                    animate={{
                      scale: hoveredId === category.id ? 1.3 : 1,
                      rotateY: hoveredId === category.id ? 10 : 0,
                      y: hoveredId === category.id ? -10 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="mb-4 relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative bg-white/20 backdrop-blur-md p-6 rounded-3xl">
                      <IconComponent size={48} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Category Name */}
                  <motion.h3
                    animate={{
                      y: hoveredId === category.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg"
                  >
                    {category.name}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    animate={{
                      opacity: hoveredId === category.id ? 1 : 0.7,
                      y: hoveredId === category.id ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-white/90 mb-6 drop-shadow-md"
                  >
                    {category.description}
                  </motion.p>

                  {/* Browse Button */}
                  <motion.div
                    animate={{
                      opacity: hoveredId === category.id ? 1 : 0,
                      y: hoveredId === category.id ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/products?category=${category.name}`}
                      className="px-6 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full font-bold text-sm transition-all duration-300 border border-white/30 hover:border-white/50 shadow-lg"
                    >
                      Keşfet →
                    </Link>
                  </motion.div>
                </div>

                {/* Hover Border Glow */}
                <motion.div
                  animate={{
                    opacity: hoveredId === category.id ? 0.5 : 0,
                  }}
                  className="absolute inset-0 border-2 border-white/20 rounded-3xl pointer-events-none"
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Hepsi görülüyor mü? Tüm kategorileri görmek için...
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Tüm Ürünleri Gözat
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CategoryShowcase