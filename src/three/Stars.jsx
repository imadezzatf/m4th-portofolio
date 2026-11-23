import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Stars({ count = 2500, radius = 150 }) {
  const ref = useRef()

  // useMemo: dihitung sekali saja, tidak diulang tiap frame
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count, radius])

  // useFrame: jalan tiap frame (~60x per detik). Rotasi sangat pelan.
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.005
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        sizeAttenuation
        color="#cfd6ff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}