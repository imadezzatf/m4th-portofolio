import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import Glow from './Glow'

const P = 6        // semi-latus rectum (lebar dasar orbit)
const R_MAX = 30   // orbit terbuka dipotong di jarak ini

const ORBITS = [
  { name: 'circle',    note: 'e = 0',     e: 0,   color: '#8fb4ff', rot: 0 },
  { name: 'ellipse',   note: '0 < e < 1', e: 0.5, color: '#7fe0b0', rot: 0.9 },
  { name: 'parabola',  note: 'e = 1',     e: 1,   color: '#e6d3a0', rot: 2.2 },
  { name: 'hyperbola', note: 'e > 1',     e: 1.6, color: '#ff8fb8', rot: 3.6 },
]

// sudut maksimum: orbit tertutup = setengah lingkaran penuh,
// orbit terbuka = sampai jaraknya mencapai R_MAX
function thetaMax(e) {
  if (e < 1) return Math.PI
  const c = Math.min(1, Math.max(-1, (P / R_MAX - 1) / e))
  return Math.acos(c)
}

const pointAt = (e, t) => {
  const r = P / (1 + e * Math.cos(t))
  return [r * Math.cos(t), 0, r * Math.sin(t)]
}

function Orbit({ name, note, e, color, rot, showLabel }) {
  const body = useRef()
  const theta = useRef(0)
  const tMax = useMemo(() => thetaMax(e), [e])

  // garis orbit: hitung 160 titik dengan rumus
  const points = useMemo(() => {
    const pts = []
    const n = 160
    for (let i = 0; i <= n; i++) {
      pts.push(pointAt(e, -tMax + (i / n) * 2 * tMax))
    }
    return pts
  }, [e, tMax])

  const labelPos = useMemo(
    () => pointAt(e, e < 1 ? Math.PI * 0.55 : tMax * 0.9),
    [e, tMax]
  )

  useFrame((_, dt) => {
    const t = theta.current
    // hukum Kepler: makin dekat pusat, makin cepat
    const rate = Math.max(0.1, (1 + e * Math.cos(t)) ** 2) * 0.6
    let next = t + rate * dt
    if (next > tMax) next = -tMax   // orbit terbuka: ulang dari awal
    theta.current = next
    const [x, y, z] = pointAt(e, next)
    body.current.position.set(x, y, z)
  })

  return (
    <group rotation={[0, rot, 0]}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.8} />

      <mesh ref={body}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} />
        <Glow size={1.8} color={color} opacity={0.7} />
      </mesh>

      {showLabel && (
        <Html position={labelPos} center style={{ pointerEvents: 'none' }}>
          <div className="orbit-label" style={{ color }}>
            {name}
            <span>{note}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

function Earth() {
  const mesh = useRef()
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#19355c'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const continents = [
      [58, 44, 24, '#567563'], [76, 68, 19, '#75826e'], [134, 40, 28, '#5c7866'],
      [152, 70, 21, '#7f8975'], [206, 54, 22, '#557161'], [114, 94, 30, '#939ca4'],
    ]
    continents.forEach(([x, y, radius, color]) => {
      const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(25, 53, 92, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = 'rgba(240, 246, 255, 0.28)'
    for (let i = 0; i < 20; i++) {
      ctx.fillRect((i * 37) % 240, (i * 19) % 115, 26, 4)
    }

    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    return map
  }, [])

  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * 0.12
  })

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[14, 24, 12]} intensity={1.8} color="#fff9f0" />
      <mesh ref={mesh} rotation={[-Math.PI / 2 + 0.3, 0.6, 0.2]}>
        <sphereGeometry args={[1.1, 36, 36]} />
        <meshStandardMaterial map={texture || undefined} roughness={0.65} metalness={0.08} />
      </mesh>
    </group>
  )
}

export default function Orbits({ active }) {
  return (
    <group>
      {/* benda di pusat (fokus orbit) */}
      <Earth />
      <Glow size={6} color="#6fa0ff" opacity={0.7} />

      {ORBITS.map((o) => (
        <Orbit key={o.name} {...o} showLabel={active} />
      ))}

      {active && (
        <Html position={[-22, 8, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="formula">r = (h² / GM) / (1 + e cos θ)</div>
        </Html>
      )}
    </group>
  )
}
