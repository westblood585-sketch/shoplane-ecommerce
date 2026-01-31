import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useGLTF, Environment } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

function ProductModel({ modelUrl }) {
  // Gerçek projede 3D model yüklenecek, şimdilik basit bir kutu
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4F46E5" metalness={0.7} roughness={0.2} />
    </mesh>
  )
}

function Product3DViewer({ product }) {
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden" style={{ height: '500px' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <ProductModel modelUrl={product.model3D} />
          <Environment preset="studio" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
        />
      </Canvas>

      {/* Kontroller */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-3 rounded-full transition ${autoRotate ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          title="Otomatik Döndür"
        >
          <RotateCcw size={20} />
        </button>
        
        <div className="w-px bg-gray-300" />
        
        <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition" title="Yakınlaştır">
          <ZoomIn size={20} />
        </button>
        
        <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition" title="Uzaklaştır">
          <ZoomOut size={20} />
        </button>
      </div>

      {/* 360° Badge */}
      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        360° Görünüm
      </div>
    </div>
  )
}

export default Product3DViewer