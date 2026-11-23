import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Glow from './Glow'
import { Waves } from './MilkyWay'
import { ACCENT } from '../config'

// radius = jarak orbit, size = ukuran planet (tidak sesuai skala),
// period = lama satu orbit dalam tahun Bumi (data asli)
const PLANETS = [
    { name: 'mercury', radius: 4.2, size: 0.25, color: '#a39b92', period: 0.24 },
    { name: 'venus', radius: 5.8, size: 0.5, color: '#e3c58b', period: 0.62 },
    { name: 'earth', radius: 7.6, size: 0.6, color: '#4a86d8', period: 1, home: true },
    { name: 'mars', radius: 9.4, size: 0.35, color: '#c1583a', period: 1.88 },
    { name: 'jupiter', radius: 13, size: 1.3, color: '#d4a373', period: 11.86 },
    { name: 'saturn', radius: 17, size: 1.1, color: '#e6d3a0', period: 29.46, rings: true },
    { name: 'uranus', radius: 20.5, size: 0.8, color: '#9fe0e6', period: 84 },
    { name: 'neptune', radius: 23.5, size: 0.78, color: '#4f6fe0', period: 165 },
]

function Planet({ name, radius, size, color, period, rings, home, showLabel }) {
    const orbit = useRef()
    const ringHolder = useRef()
    const phase = useMemo(() => Math.random() * Math.PI * 2, []) // posisi awal acak
    const speed = 0.35 / Math.sqrt(period)  // makin lama periodenya, makin lambat

    // atur posisi awal sekali saja
    useEffect(() => {
        orbit.current.rotation.y = phase
    }, [phase])

    useFrame((_, dt) => {
        orbit.current.rotation.y += dt * speed
        // putar balik cincin supaya kemiringannya tidak ikut berputar mengelilingi matahari
        if (ringHolder.current) ringHolder.current.rotation.y = -orbit.current.rotation.y
    })

    return (
        <>
            {/* garis orbit tipis */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.015, radius + 0.015, 128]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.12}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* lengan yang berputar di pusat */}
            <group ref={orbit}>
                {/* planet menempel di ujung lengan */}
                <group position={[radius, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[size, 32, 32]} />
                        <meshStandardMaterial color={color} roughness={0.9} />
                    </mesh>

                    {rings && (
                        <group ref={ringHolder}>
                            <mesh rotation={[-Math.PI / 2 + 0.45, 0, 0]}>
                                <ringGeometry args={[size * 1.4, size * 2.3, 64]} />
                                <meshBasicMaterial
                                    color="#cdb98a"
                                    transparent
                                    opacity={0.6}
                                    side={THREE.DoubleSide}
                                    depthWrite={false}
                                />
                            </mesh>
                        </group>
                    )}

                    {home && (
                        <>
                            <Glow size={size * 4} color={ACCENT} opacity={0.6} />
                            <Waves color={ACCENT} maxRadius={size * 5} count={3} period={3} />
                        </>
                    )}

                    {showLabel && (
                        <Html center style={{ pointerEvents: 'none' }}>
                            <div className={`planet-label ${home ? 'home' : ''}`}>
                                {name}
                                {home && <span>Our Planet !!</span>}
                            </div>
                        </Html>
                    )}
                </group>
            </group>
        </>
    )
}

export default function SolarSystem({ active }) {
    return (
        <group>
            {/* cahaya: ambient lemah + cahaya dari matahari (decay 0 = tidak meredup oleh jarak) */}
            <ambientLight intensity={0.25} />
            <pointLight intensity={4} decay={0} color="#fff3d6" />

            {/* matahari */}
            <mesh>
                <sphereGeometry args={[2.2, 48, 48]} />
                <meshBasicMaterial color="#ffd27a" />
            </mesh>
            <Glow size={16} color="#ffb347" opacity={0.9} />
            <Glow size={7} color="#fff1c9" opacity={1} />
            {active && (
                <Html position={[0, 3.4, 0]} center style={{ pointerEvents: 'none' }}>
                    <div className="planet-label">sun</div>
                </Html>
            )}

            {PLANETS.map((p) => (
                <Planet key={p.name} {...p} showLabel={active} />
            ))}
        </group>
    )
}