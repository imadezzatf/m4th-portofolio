import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Galaxy({
  position = [0, 0, 0],
  rotation = [0, 0, 0],   // kemiringan galaksi
  radius = 5,
  count = 3000,           // jumlah titik
  branches = 3,           // jumlah lengan spiral
  spin = 1.2,             // seberapa melengkung lengannya
  randomness = 0.35,      // seberapa menyebar titik dari garis lengan
  inside = '#ffb27a',     // warna pusat
  outside = '#6f8cff',    // warna tepi
  size = 0.1,             // ukuran titik
  speed = 0.03,           // kecepatan putar (0 = diam)
}) {
  const ref = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cIn = new THREE.Color(inside)
    const cOut = new THREE.Color(outside)
    const c = new THREE.Color()

    // jarak acak, bergeser ke pusat supaya pusat lebih padat
    const scatter = (r) =>
      Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomness * r

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spinAngle = r * spin   // makin jauh, makin melengkung → spiral

      positions[i * 3]     = Math.cos(branchAngle + spinAngle) * r + scatter(r)
      positions[i * 3 + 1] = scatter(r) * 0.3   // galaksi tipis seperti piringan
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + scatter(r)

      c.copy(cIn).lerp(cOut, r / radius)
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count, radius, branches, spin, randomness, inside, outside])

  useFrame((_, dt) => {
    if (speed) ref.current.rotation.y += dt * speed
  })

  return (
    <group position={position} rotation={rotation}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={size}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}