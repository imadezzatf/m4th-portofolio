import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import Stars from './Stars'
import CameraRig from './CameraRig'
import GalaxyCluster from './GalaxyCluster'
import MilkyWay from './MilkyWay'
import SolarSystem from './SolarSystem'
import Orbits from './Orbits'
import Lensing from './Lensing'
import { GALAXY_CENTER, SOLAR_CENTER, WRITING_CENTER, LENS_CENTER } from '../config'

export default function Experience() {
    const { pathname } = useLocation()
    // '/writing/judul-tulisan' → '/writing' (adegan ditentukan bagian pertama alamat)
    const section = '/' + (pathname.split('/')[1] ?? '')

    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 34, 62], fov: 55 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
            <color attach="background" args={['#050507']} />

            <Stars />
            <gridHelper args={[300, 150, '#2a2a33', '#16161b']} position={[0, -3, 0]} />

            <group position={LENS_CENTER}>
                <Lensing active={pathname === '/'} />
            </group>

            <group position={GALAXY_CENTER}>
                <GalaxyCluster />
                <MilkyWay active={pathname === '/projects'} />
            </group>

            <group position={WRITING_CENTER}>
                <Orbits active={pathname === '/writing'} />
            </group>

            <group position={SOLAR_CENTER}>
                <SolarSystem active={pathname === '/cabinet'} />
            </group>

            <CameraRig path={section} />
        </Canvas>
    )
}