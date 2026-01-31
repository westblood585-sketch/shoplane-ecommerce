import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HeroSectionV2() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Zap, text: 'Hızlı Teslimat', color: 'from-yellow-400 to-orange-500' },
    { icon: TrendingUp, text: 'En Trend Ürünler', color: 'from-blue-400 to-purple-500' },
    { icon: Sparkles, text: 'Premium Kalite', color: 'from-pink-400 to-red-500' }
  ];

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Video Background (opsiyonel) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        {/* Burada video eklenebilir:
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        */}
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ y: scrollY * 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full mb-6 border border-white/20"
              >
                <Sparkles className="text-yellow-400" size={20} />
                <span className="text-white text-sm font-semibold">Kış İndirimleri Başladı!</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Tarzını
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Yeniden Keşfet
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 max-w-lg"
              >
                En trend ürünler, en uygun fiyatlar ve hızlı teslimat. 
                Hayallerindeki alışveriş deneyimi burada!
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link
                  to="/products"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Alışverişe Başla
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/products?category=İndirimli"
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-full font-bold text-white hover:bg-white/20 transition-all hover:scale-105"
                >
                  İndirimleri Gör
                </Link>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <span className="text-white text-xs text-center font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Product Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ y: scrollY * -0.15 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Floating Product Cards */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-10 -right-10 w-48 h-64 bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -50%
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-10 -left-10 w-48 h-64 bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    YENİ
                  </div>
                </motion.div>

                {/* Center Large Card */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-80 h-96 bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600"
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Premium Ayakkabı</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold">₺299</span>
                        <span className="text-gray-300 line-through ml-2">₺599</span>
                      </div>
                      <button className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-110 transition-transform">
                        Satın Al
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HeroSectionV2;