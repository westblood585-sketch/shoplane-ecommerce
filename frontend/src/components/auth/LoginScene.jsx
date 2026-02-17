import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Float, PerspectiveCamera, Environment, Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function GlassShape({ position, type }) {
    const mesh = useRef()

    useFrame((state) => {
        if (mesh.current) {
            const t = state.clock.getElapsedTime()
            mesh.current.rotation.x = t * 0.1
            mesh.current.rotation.y = t * 0.15
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={position}>
            <mesh ref={mesh} receiveShadow castShadow>
                {type === 'torus' && <torusGeometry args={[0.8, 0.2, 64, 128]} />}
                {type === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
                {type === 'sphere' && <sphereGeometry args={[0.7, 64, 64]} />}

                {/* Ultra-Clear Glass Material */}
                <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0}
                    metalness={0.1}
                    transmission={1} // Fully transparent glass
                    thickness={2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={1.5}
                    reflectivity={0.5}
                    chromaticAberration={0.05}
                />
            </mesh>
        </Float>
    )
}

function ParticleField() {
    return (
        <group>
            {/* Subtle dust to catch light */}
            <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.3} color="#ffffff" />
        </group>
    )
}

export default function LoginScene() {
    return (
        <div className="w-full h-full absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
            <Canvas shadows dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                {/* Slow slight rotation for cinematic feel */}
                {/* <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} /> */}

                {/* Lighting matched to typical high-key fashion video */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -5, -10]} intensity={1} color="#a5f3fc" /> {/* Subtle Cyan rim */}
                <pointLight position={[5, -5, 5]} intensity={1} color="#fbcfe8" /> {/* Subtle Pink rim */}

                {/* Minimalist Floating Glass Shapes */}
                <GlassShape position={[-3, 1, -2]} type="torus" />
                <GlassShape position={[3.5, -1, -1]} type="icosa" />
                <GlassShape position={[-2, -2.5, 1]} type="sphere" />

                <ParticleField />

                {/* Studio Environment for reflections */}
                <Environment preset="studio" blur={1} />
            </Canvas>
        </div>
    )
}
