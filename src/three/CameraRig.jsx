import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GALAXY_CENTER, SOLAR_CENTER, WRITING_CENTER, LENS_CENTER } from '../config'
import * as THREE from 'three'

const VIEWS = {
  '/':         { pos: [0, 34, 62], look: [0, -1, 30] },
  '/projects': { pos: [-4, 12, -38], look: GALAXY_CENTER },
  '/writing':  { pos: [-70, 34, 52], look: WRITING_CENTER },
  '/cabinet':  { pos: [70, 26, 48],  look: SOLAR_CENTER },
}

export default function CameraRig({ path }) {
  const controls = useRef()
  const animating = useRef(true)          // true = kamera sedang meluncur otomatis
  const goal = useRef(new THREE.Vector3())

  // Setiap halaman berganti, aktifkan lagi peluncuran otomatis
  useEffect(() => {
    animating.current = true
  }, [path])

  useFrame(({ camera }, dt) => {
    const c = controls.current
    if (!c || !animating.current) return

    const v = VIEWS[path] ?? VIEWS['/']
    const speed = 2.5

    camera.position.x = THREE.MathUtils.damp(camera.position.x, v.pos[0], speed, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, v.pos[1], speed, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, v.pos[2], speed, dt)

    c.target.x = THREE.MathUtils.damp(c.target.x, v.look[0], speed, dt)
    c.target.y = THREE.MathUtils.damp(c.target.y, v.look[1], speed, dt)
    c.target.z = THREE.MathUtils.damp(c.target.z, v.look[2], speed, dt)

    // Sudah hampir sampai → berhenti mengendalikan kamera
    goal.current.set(...v.pos)
    if (camera.position.distanceTo(goal.current) < 0.02) animating.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}                 // geser (kanan-klik) dimatikan, hanya putar & zoom
      enableDamping
      dampingFactor={0.08}              // efek meluncur halus setelah drag
      rotateSpeed={0.5}
      minDistance={4}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2 - 0.02} // kamera tidak bisa turun ke bawah grid
      onStart={() => { animating.current = false }} // user mulai drag → serahkan kendali ke user
    />
  )
}