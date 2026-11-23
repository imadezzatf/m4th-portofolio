import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GALAXY_CENTER, SOLAR_CENTER, WRITING_CENTER } from '../config'

const VIEWS = {
  '/':         { pos: [0, 34, 62],   look: [0, -1, 30] },
  '/projects': { pos: [-4, 12, -38], look: GALAXY_CENTER },
  '/writing':  { pos: [-70, 34, 52], look: WRITING_CENTER },
  '/cabinet':  { pos: [70, 26, 48],  look: SOLAR_CENTER },
}

export default function CameraRig({ path }) {
  const controls = useRef()
  const animating = useRef(true)
  const goal = useRef(new THREE.Vector3())
  const width = useThree((s) => s.size.width)

  // meluncur ulang saat pindah halaman atau lebar layar berubah (misalnya HP diputar)
  useEffect(() => {
    animating.current = true
  }, [path, width])

  useFrame(({ camera, size }, dt) => {
    const c = controls.current
    if (!c || !animating.current) return

    const v = VIEWS[path] ?? VIEWS['/']
    const speed = 2.5

    // layar sempit → mundurkan kamera supaya adegan tidak terpotong
    const aspect = size.width / size.height
    const k = aspect < 1.2 ? Math.min(2, 1 + (1.2 - aspect) * 0.9) : 1

    goal.current.set(
      v.look[0] + (v.pos[0] - v.look[0]) * k,
      v.look[1] + (v.pos[1] - v.look[1]) * k,
      v.look[2] + (v.pos[2] - v.look[2]) * k
    )

    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.current.x, speed, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.current.y, speed, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.current.z, speed, dt)

    c.target.x = THREE.MathUtils.damp(c.target.x, v.look[0], speed, dt)
    c.target.y = THREE.MathUtils.damp(c.target.y, v.look[1], speed, dt)
    c.target.z = THREE.MathUtils.damp(c.target.z, v.look[2], speed, dt)

    if (camera.position.distanceTo(goal.current) < 0.02) animating.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      minDistance={4}
      maxDistance={140}   // dinaikkan karena kamera bisa mundur di layar HP
      maxPolarAngle={Math.PI / 2 - 0.02}
      onStart={() => { animating.current = false }}
    />
  )
}