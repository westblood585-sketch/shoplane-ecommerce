import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="relative w-screen h-screen bg-black">
      
      {/* 3D Sahne */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} />
          
          <Text
            color="white"
            fontSize={1}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
          >
            3D E-Bilet Sistemi 🚀
          </Text>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* UI */}
      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <Link
          to="/tickets"
          className="bg-white px-8 py-4 rounded-lg text-black font-bold text-xl shadow-xl"
        >
          🎟 Biletleri Gör
        </Link>
      </div>

    </div>
  )
}
