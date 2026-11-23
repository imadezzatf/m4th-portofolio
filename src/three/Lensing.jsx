import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import Galaxy from './Galaxy'
import Glow from './Glow'
import { ACCENT } from '../config'

const S = [20, 0, 0]    // galaksi latar (sumber cahaya)
const E = [-20, 0, 0]   // Bumi (pengamat)
const B = 3.5           // seberapa jauh cahaya lewat dari galaksi pelensa

// Jaring kawat yang melengkung ke bawah di tengah = ruang-waktu yang dibelokkan massa
function Well() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(48, 30, 48, 30)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getZ(i))
      pos.setY(i, -5 / Math.sqrt(1 + (r / 3.2) ** 2))
    }
    return g
  }, [])

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color="#8fa4ff" wireframe transparent opacity={0.16} depthWrite={false} />
    </mesh>
  )
}

// Titik cahaya yang berjalan: sumber → titik tikungan → Bumi
function Photon({ sign, offset }) {
  const ref = useRef()
  const { s, k, e } = useMemo(
    () => ({
      s: new THREE.Vector3(...S),
      k: new THREE.Vector3(0, 0, sign * B),
      e: new THREE.Vector3(...E),
    }),
    [sign]
  )

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.12 + offset) % 1
    if (t < 0.5) ref.current.position.lerpVectors(s, k, t * 2)
    else ref.current.position.lerpVectors(k, e, (t - 0.5) * 2)
  })

  return (
    <group ref={ref}>
      <Glow size={1.4} color="#fff3d6" opacity={1} />
    </group>
  )
}

function Label({ position, children, accent }) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div className={`orbit-label ${accent ? 'accent' : ''}`}>{children}</div>
    </Html>
  )
}

export default function Lensing({ active }) {
  return (
    <group>
      <Well />

      {/* galaksi pelensa (di depan, di dasar sumur) */}
      <Galaxy
        position={[0, -3.6, 0]}
        rotation={[0.5, 0, 0.2]}
        radius={2.6}
        count={3500}
        branches={3}
        size={0.07}
        speed={0.05}
        inside="#ffd1a0"
        outside="#7f9bff"
      />
      <Glow position={[0, -3.6, 0]} size={8} color="#ffcf9e" opacity={0.6} />

      {/* galaksi latar (sumber cahaya) */}
      <Galaxy
        position={S}
        rotation={[1.0, 0.3, 0]}
        radius={1.7}
        count={2500}
        branches={2}
        size={0.07}
        speed={0.06}
        inside="#ffffff"
        outside="#ff9ec2"
      />
      <Glow position={S} size={5} color="#ffc2dc" opacity={0.7} />

      {/* Bumi (pengamat) */}
      <mesh position={E}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#4a86d8" />
      </mesh>
      <Glow position={E} size={3} color="#6fa0ff" opacity={0.6} />

      {/* dua sinar yang menikung + garis putus-putus arah bayangan */}
      {[1, -1].map((s) => (
        <group key={s}>
          <Line
            points={[S, [0, 0, s * B], E]}
            color="#ffe2b8"
            lineWidth={1.2}
            transparent
            opacity={0.7}
          />
          <Line
            points={[E, [20, 0, s * B * 2]]}
            color="#ffffff"
            lineWidth={1}
            dashed
            dashSize={0.6}
            gapSize={0.5}
            transparent
            opacity={0.3}
          />
          {/* posisi bayangan galaksi latar yang terlihat dari Bumi */}
          <Glow position={[20, 0, s * B * 2]} size={2} color="#ffc2dc" opacity={0.7} />
          <Photon sign={s} offset={0} />
          <Photon sign={s} offset={0.5} />
        </group>
      ))}

      {active && (
        <>
          <Label position={[0, -6.6, 0]}>foreground galaxy</Label>
          <Label position={[20, 3.2, 0]}>background galaxy</Label>
          <Label position={E.map((v, i) => (i === 1 ? 2 : v))} accent>earth</Label>
          <Label position={[-6, 4, 0]}>gravitational lensing</Label>
        </>
      )}
    </group>
  )
}