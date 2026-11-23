import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Galaxy from './Galaxy'
import Glow from './Glow'
import { ACCENT } from '../config'

// Cincin yang melebar lalu memudar → efek gelombang
export function Waves({ color, maxRadius = 3.5, count = 3, period = 4 }) {
  const refs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((m, i) => {
      if (!m) return
      const p = (t / period + i / count) % 1   // progres 0 → 1, tiap cincin beda fase
      m.scale.setScalar(0.1 + p * maxRadius)
      m.material.opacity = (1 - p) * 0.7
    })
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <ringGeometry args={[0.94, 1, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function MilkyWay({ active }) {
  const youPos = [3.2, 0, 0.8]   // posisi "kita" di dalam galaksi

  return (
    <group rotation={[0.85, 0, 0.25]}>
      <Galaxy
        radius={7}
        count={9000}
        branches={4}
        spin={1.1}
        randomness={0.28}
        size={0.09}
        speed={0}                 // diam, supaya penanda tidak bergeser dari lengan
        inside="#ffe2b8"
        outside="#7f9bff"
      />
      <Glow size={9} color="#ffd9a8" opacity={0.8} />

      {/* titik "kita" */}
      <mesh position={youPos}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <Glow position={youPos} size={1.2} color={ACCENT} />
      <group position={youPos}>
        <Waves color={ACCENT} />
      </group>

      {active && (
        <Html position={youPos} center style={{ pointerEvents: 'none' }}>
          <div className="you-are-here">you are here</div>
        </Html>
      )}
    </group>
  )
}