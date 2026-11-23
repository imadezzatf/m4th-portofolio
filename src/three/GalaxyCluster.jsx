import { useMemo } from 'react'
import Galaxy from './Galaxy'

const PALETTE = [
  ['#ffcf9e', '#6f8cff'],
  ['#ffd1e8', '#7a6bff'],
  ['#fff1c9', '#5fb6ff'],
  ['#ffb27a', '#c46bff'],
]

export default function GalaxyCluster({ n = 34 }) {
  const items = useMemo(() => {
    const list = []
    while (list.length < n) {
      const p = [
        (Math.random() * 2 - 1) * 28,
        (Math.random() * 2 - 1) * 9,
        (Math.random() * 2 - 1) * 20,
      ]
      // sisakan ruang kosong di tengah untuk Bima Sakti
      if (Math.hypot(p[0], p[1], p[2]) < 11) continue

      const radius = 1.2 + Math.random() * 2
      const [inside, outside] = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      list.push({
        position: p,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        radius,
        count: Math.floor(900 + radius * 350),
        branches: 2 + Math.floor(Math.random() * 3),
        speed: 0.02 + Math.random() * 0.05,
        inside,
        outside,
      })
    }
    return list
  }, [n])

  return items.map((g, i) => <Galaxy key={i} size={0.08} {...g} />)
}