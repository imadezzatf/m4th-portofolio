import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import Glow from './Glow'
import { Waves } from './MilkyWay'
import { ACCENT } from '../config'

// radius = jarak orbit, size = ukuran planet (tidak sesuai skala),
// period = lama satu orbit dalam tahun Bumi (data asli)
const PLANETS = [
    { name: 'mercury', radius: 4.2, size: 0.25, colors: ['#8d8a84', '#5c5954', '#aba7a0'], period: 0.24 },
    { name: 'venus', radius: 5.8, size: 0.5, colors: ['#d9b37c', '#b58952', '#edd0a3'], period: 0.62 },
    { name: 'earth', radius: 7.6, size: 0.6, colors: ['#1d4375', '#4f7a63', '#8ca39c'], period: 1, home: true, moons: [{ size: 0.1, radius: 0.9, speed: 1.4, color: '#cfd2d6' }] },
    { name: 'mars', radius: 9.4, size: 0.35, colors: ['#b8573b', '#873823', '#d97b5d'], period: 1.88 },
    { name: 'jupiter', radius: 13, size: 1.3, colors: ['#c99e73', '#9c6e49', '#e3c6a6'], period: 11.86, banded: true, moons: [{ size: 0.11, radius: 1.7, speed: 1.6, color: '#e6d3a7' }, { size: 0.12, radius: 2.1, speed: 1.1, color: '#c8c4bc' }, { size: 0.1, radius: 2.5, speed: 0.8, color: '#a89f94' }] },
    { name: 'saturn', radius: 17, size: 1.1, colors: ['#d6bc8b', '#ad9263', '#ebd7b0'], period: 29.46, banded: true, rings: true, moons: [{ size: 0.12, radius: 2.6, speed: 0.9, color: '#dfb87c' }] },
    { name: 'uranus', radius: 20.5, size: 0.8, colors: ['#8ecad6', '#67a5b3', '#bce5ed'], period: 84, rings: true },
    { name: 'neptune', radius: 23.5, size: 0.78, colors: ['#3b62b8', '#25438a', '#648ce0'], period: 165 },
]

function createPlanetTexture(colors, banded = false) {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = colors[0]
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (banded) {
        for (let y = 0; y < canvas.height; y += 6) {
            ctx.fillStyle = y % 12 === 0 ? colors[1] : colors[2]
            ctx.globalAlpha = 0.38
            ctx.fillRect(0, y, canvas.width, 4)
        }
        ctx.globalAlpha = 1
    } else {
        const spots = [
            [52, 40, 26, colors[1]],
            [115, 66, 32, colors[1]],
            [188, 46, 28, colors[2]],
            [82, 92, 24, colors[2]],
            [215, 88, 22, colors[1]],
        ]
        spots.forEach(([x, y, radius, color]) => {
            const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius)
            gradient.addColorStop(0, color)
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fill()
        })
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}

function OrbitRing({ radius }) {
    const points = useMemo(() => {
        const vertices = []
        const segments = 160
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            vertices.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
        }
        return vertices
    }, [radius])

    return <Line points={points} color="#dce4f7" lineWidth={1.1} transparent opacity={0.32} />
}

function AsteroidBelt() {
    const fineRef = useRef()
    const chunkRef = useRef()
    const { fineGeometry, chunkGeometry } = useMemo(() => {
        const makeBelt = (count, minRadius, maxRadius, spreadY) => {
            const positions = new Float32Array(count * 3)
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2
                const t = (Math.random() + Math.random()) * 0.5
                const radius = minRadius + t * (maxRadius - minRadius)
                positions[i * 3] = Math.cos(angle) * radius
                positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY
                positions[i * 3 + 2] = Math.sin(angle) * radius
            }
            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            return geometry
        }

        return {
            fineGeometry: makeBelt(850, 10.3, 12.2, 0.55),
            chunkGeometry: makeBelt(260, 10.5, 12.0, 0.4),
        }
    }, [])

    useFrame((_, dt) => {
        if (fineRef.current) fineRef.current.rotation.y += dt * 0.032
        if (chunkRef.current) chunkRef.current.rotation.y += dt * 0.042
    })

    return (
        <group>
            <points ref={fineRef} geometry={fineGeometry}>
                <pointsMaterial size={0.09} color="#b5aea4" transparent opacity={0.68} sizeAttenuation depthWrite={false} />
            </points>
            <points ref={chunkRef} geometry={chunkGeometry}>
                <pointsMaterial size={0.16} color="#ded6ca" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
            </points>
        </group>
    )
}

function VoyagerProbe({ active }) {
    const probeRef = useRef()
    const basePos = useMemo(() => new THREE.Vector3(26.5, 2.2, -3.4), [])

    useFrame(({ clock }) => {
        const t = clock.elapsedTime
        if (!probeRef.current) return

        probeRef.current.position.set(
            basePos.x + Math.sin(t * 0.35) * 0.25,
            basePos.y + Math.sin(t * 0.7) * 0.16,
            basePos.z + Math.cos(t * 0.3) * 0.2
        )
        probeRef.current.rotation.set(
            0.38 + Math.sin(t * 0.4) * 0.05,
            -0.65 + Math.cos(t * 0.3) * 0.06,
            0.28 + t * 0.04
        )
    })

    return (
        <group ref={probeRef} position={basePos.toArray()} scale={0.78}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.95, 0.24, 0.26, 28, 1, true]} />
                <meshStandardMaterial color="#eceae4" metalness={0.45} roughness={0.35} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.05, 0.48, 8]} />
                <meshStandardMaterial color="#c8c5be" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.38, 0.38, 0.3, 10]} />
                <meshStandardMaterial color="#2c3038" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.39, 0, -0.24]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
                <meshStandardMaterial color="#f2be63" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[-1.15, 0.55, -0.25]} rotation={[0, 0, 1.12]}>
                <cylinderGeometry args={[0.016, 0.024, 2.5, 6]} />
                <meshStandardMaterial color="#9ea3ad" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0.72, -0.52, -0.32]} rotation={[0, 0, -0.95]}>
                <cylinderGeometry args={[0.045, 0.055, 1.45, 10]} />
                <meshStandardMaterial color="#595d66" metalness={0.6} roughness={0.45} />
            </mesh>
            <mesh position={[0.1, -0.78, -0.2]} rotation={[0.15, 0, 0.1]}>
                <cylinderGeometry args={[0.02, 0.026, 1.35, 6]} />
                <meshStandardMaterial color="#b4b8c2" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0.16, -1.45, -0.1]}>
                <boxGeometry args={[0.22, 0.16, 0.18]} />
                <meshStandardMaterial color="#d4cfc4" metalness={0.5} roughness={0.4} />
            </mesh>
            <Glow size={2.2} color="#ffd99e" opacity={0.2} />

            {active && (
                <Html position={[0, 1.35, 0]} center style={{ pointerEvents: 'none' }}>
                    <div className="planet-label accent" style={{ color: '#e7a663' }}>
                        VOYAGER
                    </div>
                </Html>
            )}
        </group>
    )
}

function Planet({ name, radius, size, colors, banded, period, rings, home, showLabel, moons }) {
    const orbit = useRef()
    const mesh = useRef()
    const moonRefs = useRef([])
    const initialized = useRef(false)
    const texture = useMemo(() => createPlanetTexture(colors, banded), [colors, banded])
    const phase = useMemo(() => Math.random() * Math.PI * 2, []) // posisi awal acak
    const speed = 0.35 / Math.sqrt(period)  // makin lama periodenya, makin lambat

    useFrame(({ clock }, dt) => {
        if (orbit.current) {
            if (!initialized.current) {
                orbit.current.rotation.y = phase
                initialized.current = true
            }
            orbit.current.rotation.y += dt * speed
        }
        if (mesh.current) mesh.current.rotation.y += dt * 0.35
        if (moons) {
            moons.forEach((moon, index) => {
                const moonMesh = moonRefs.current[index]
                if (!moonMesh) return
                const angle = clock.elapsedTime * moon.speed + index * 2.1
                moonMesh.position.set(Math.cos(angle) * moon.radius, 0, Math.sin(angle) * moon.radius)
            })
        }
    })

    return (
        <>
            <OrbitRing radius={radius} />

            {/* lengan yang berputar di pusat */}
            <group ref={orbit}>
                {/* planet menempel di ujung lengan */}
                <group position={[radius, 0, 0]}>
                    <mesh ref={mesh}>
                        <sphereGeometry args={[size, 32, 32]} />
                        <meshStandardMaterial map={texture || undefined} roughness={0.72} />
                    </mesh>

                    {moons?.map((moon, index) => (
                        <mesh key={`${name}-moon-${index}`} ref={(el) => (moonRefs.current[index] = el)}>
                            <sphereGeometry args={[moon.size, 16, 16]} />
                            <meshStandardMaterial color={moon.color} roughness={0.8} />
                        </mesh>
                    ))}

                    {rings && (
                        <mesh rotation={[-Math.PI / 2 + 0.45, 0, 0]}>
                            <ringGeometry args={[size * 1.4, size * 2.3, 64]} />
                            <meshStandardMaterial
                                color={name === 'uranus' ? '#9ad0db' : '#cdb98a'}
                                transparent
                                opacity={0.62}
                                roughness={0.8}
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>
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
            <Glow size={16} color="#ffb347" opacity={0.68} />
            <Glow size={7} color="#fff1c9" opacity={0.78} />
            <AsteroidBelt />
            <VoyagerProbe active={active} />
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
