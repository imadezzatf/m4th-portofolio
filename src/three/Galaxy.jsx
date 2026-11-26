import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return null

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.58)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function Galaxy({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 5,
  count = 3000,
  branches = 3,
  spin = 1.2,
  randomness = 0.35,
  inside = '#ffb27a',
  outside = '#6f8cff',
  size = 0.1,
  speed = 0.03,
}) {
  const ref = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const innerColor = new THREE.Color(inside)
    const outerColor = new THREE.Color(outside)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius
      const inSpiralArm = Math.random() > 0.18
      const arm = inSpiralArm
        ? ((i % branches) / branches) * Math.PI * 2
        : Math.random() * Math.PI * 2
      const armSpread = (Math.random() - 0.5) * randomness * (0.22 + r / radius) * 1.8
      const angle = arm + r * spin + armSpread
      const radialSpread = (Math.random() - 0.5) * randomness * r * 0.38
      const starRadius = Math.max(0, r + radialSpread)

      positions[i * 3] = Math.cos(angle) * starRadius
      positions[i * 3 + 1] = (Math.random() - 0.5) * randomness * radius * 0.1 * (0.35 + r / radius)
      positions[i * 3 + 2] = Math.sin(angle) * starRadius

      color.copy(innerColor).lerp(outerColor, Math.pow(r / radius, 0.72))
      color.multiplyScalar(0.58 + Math.random() * 0.62)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [count, radius, branches, spin, randomness, inside, outside])

  const starTexture = useMemo(makeStarTexture, [])

  useFrame((_, dt) => {
    if (speed && ref.current) ref.current.rotation.y += dt * speed
  })

  return (
    <group position={position} rotation={rotation}>
      <sprite scale={[radius * 1.1, radius * 1.1, 1]}>
        <spriteMaterial
          map={starTexture || undefined}
          color={inside}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh>
        <sphereGeometry args={[radius * 0.075, 20, 20]} />
        <meshBasicMaterial
          color={inside}
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={size}
          map={starTexture || undefined}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.88}
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
