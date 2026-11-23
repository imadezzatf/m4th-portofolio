import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Experience from './three/Experience'
import Nav from './components/Nav'
import { About, Projects, Writing, WritingPost, Cabinet } from './pages'

const Eye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
)

export default function App() {
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Tekan tombol H untuk toggle
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'h' || e.key === 'H') setHidden((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="canvas-layer">
        <Experience />
      </div>

      <button
        className="eye-btn"
        onClick={() => setHidden((h) => !h)}
        title="sembunyikan / tampilkan teks (H)"
        aria-label={hidden ? 'tampilkan teks' : 'sembunyikan teks'}
      >
        {hidden ? <EyeOff /> : <Eye />}
      </button>

      <p className={`hint ${hidden ? 'show' : ''}`}>drag to rotate · pinch or scroll to zoom</p>
      
      <main className={`content ${hidden ? 'hidden' : ''}`}>
        <Nav />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<WritingPost />} />
          <Route path="/cabinet" element={<Cabinet />} />
        </Routes>
      </main>
    </>
  )
}