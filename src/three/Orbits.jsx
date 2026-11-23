import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
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

export default function Orbits({ active }) {
  return (
    <group>
      {/* benda di pusat (fokus orbit) */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#4a86d8" />
      </mesh>
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