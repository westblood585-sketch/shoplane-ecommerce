import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei'
import { Suspense } from 'react'

function ProductBox() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.5} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function Hero3D() {
  return (
    <div className="relative h-[600px] bg-gradient-to-br from-blue-500 to-purple-600">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <ProductBox />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Yeni Sezon Ürünler</h1>
          <p className="text-xl mb-8">%50'ye varan indirimler</p>
          <button className="pointer-events-auto bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Alışverişe Başla
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero3D
