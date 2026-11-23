import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ABOUT, PROJECTS, WRITING, CABINET } from './content'


function Head({ title, sub }) {
  return (
    <>
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </>
  )
}

// Kotak gambar / video untuk kartu proyek
function Media({ media, alt }) {
  const box = useRef(null)
  const vid = useRef(null)
  const [near, setNear] = useState(false)   // true = kartu sudah terlihat

  useEffect(() => {
    if (media?.type !== 'video' || !box.current) return
    if (vid.current) vid.current.muted = true   // wajib muted agar autoplay lolos di HP

    const io = new IntersectionObserver(
      ([e]) => {
        const v = vid.current
        if (e.isIntersecting) {
          setNear(true)                     // mulai unduh video
          v?.play()?.catch(() => { })       // jalan saat kelihatan
        } else {
          v?.pause()                        // berhenti saat di luar layar
        }
      },
      { threshold: 0.25 }
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [media])

  if (!media) return null

  const hide = (e) => {
    e.currentTarget.parentElement.style.display = 'none'
  }

  if (media.type === 'video') {
    return (
      <div ref={box} className="media">
        <video
          ref={vid}
          src={near ? media.src : undefined}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload={near ? 'auto' : 'none'}
          onError={hide}
        />
      </div>
    )
  }

  return (
    <div className="media">
      <img src={media.src} alt={alt} loading="lazy" onError={hide} />
    </div>
  )
}

export function About() {
  return (
    <>
      <Head title="about" />
      {ABOUT.paragraphs.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
      <p className="links">
        {ABOUT.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
      </p>
    </>
  )
}

export function Projects() {
  return (
    <>
      <Head title="projects" sub={PROJECTS.sub} />
      <div className="grid">
        {PROJECTS.items.map((p) => (
          <article className="card" key={p.title}>
            <Media media={p.media} alt={p.title} />
            <h2>{p.title}</h2>
            <p>{p.desc}</p>
            <div className="tags">{p.tags.join(' · ')}</div>
            {p.link && (
              <a className="more" href={p.link} target="_blank" rel="noreferrer">
                view project →
              </a>
            )}
          </article>
        ))}
      </div>
    </>
  )
}

export function Writing() {
  return (
    <>
      <Head title="writing" sub={WRITING.sub} />
      <ul className="post-list">
        {WRITING.items.map((w) => (
          <li key={w.slug}>
            <Link to={`/writing/${w.slug}`}>{w.title}</Link>
            <div className="date">{w.date}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

export function WritingPost() {
  const { slug } = useParams()
  const post = WRITING.items.find((w) => w.slug === slug)

  if (!post) {
    return (
      <>
        <Link className="back" to="/writing">← all writing</Link>
        <h1>not found</h1>
        <p>That post does not exist (yet).</p>
      </>
    )
  }

  return (
    <article className="post">
      <Link className="back" to="/writing">← all writing</Link>
      <h1>{post.title}</h1>
      <div className="date">{post.date}</div>
      {post.body.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </article>
  )
}

// hanya satu lagu yang boleh berbunyi pada satu waktu
let currentAudio = null

// hasil pencarian iTunes disimpan, supaya satu judul tidak dicari dua kali
const itunesCache = new Map()

function fetchItunes(query, kind) {
  const key = `${kind}:${query}`
  if (!itunesCache.has(key)) {
    const entity = kind === 'film' ? 'movie' : 'song'
    const p = fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&limit=1`
    )
      .then((r) => r.json())
      .then((j) => {
        const t = j.results?.[0]
        if (!t) return false
        return {
          cover: t.artworkUrl100?.replace('100x100', '600x600'),
          audio: kind === 'film' ? null : t.previewUrl,
        }
      })
      .catch(() => false)
    itunesCache.set(key, p)
  }
  return itunesCache.get(key)
}

// null = sedang memuat, false = tidak ketemu / gagal, objek = berhasil
function useItunes(query, kind) {
  const [data, setData] = useState(query ? null : false)

  useEffect(() => {
    if (!query) return
    let alive = true
    fetchItunes(query, kind).then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [query, kind])

  return data
}

function Piece({ item }) {
  const itunes = useItunes(item.itunes, item.kind)
  const cover = item.cover || itunes?.cover
  const src = item.audio || itunes?.audio
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)

  // hentikan suara kalau pindah halaman
  useEffect(() => () => audio.current?.pause(), [])

  const toggle = () => {
    if (!src) return
    if (!audio.current) {
      const a = new Audio(src)
      a.volume = 0.6
      a.addEventListener('play', () => setPlaying(true))
      a.addEventListener('pause', () => setPlaying(false))
      a.addEventListener('ended', () => setPlaying(false))
      audio.current = a
    }
    const a = audio.current
    if (!a.paused) {
      a.pause()
      return
    }
    if (currentAudio && currentAudio !== a) currentAudio.pause()
    a.currentTime = 0
    a.play().catch(() => { })
    currentAudio = a
  }

  const shape = item.kind === 'film' || item.tall ? 'tall' : 'square'
  const noCover = !cover && itunes !== null   // gagal/tanpa gambar → judul selalu tampil
  const cls = `piece ${shape} ${noCover ? 'nocover' : ''} ${playing ? 'playing' : ''}`

  const body = (
    <>
      {cover && (
        <img
          src={cover}
          alt={item.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      {playing && (
        <div className="eqbars" aria-hidden="true">
          <i /><i /><i />
        </div>
      )}
      <div className="piece-info">
        <h2>{item.title}</h2>
        {item.by && <p>{item.by}</p>}
      </div>
    </>
  )

  // film dengan link → tautan biasa; sisanya → tombol putar/berhenti
  if (item.kind === 'film' && item.link) {
    return (
      <a className={cls} href={item.link} target="_blank" rel="noreferrer">
        {body}
      </a>
    )
  }

  return (
    <div
      className={cls}
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      {body}
    </div>
  )
}

export function Cabinet() {
  return (
    <>
      <Head title="cabinet" sub={CABINET.sub} />
      <div className="wall">
        {CABINET.items.map((it) => (
          <Piece key={`${it.kind}-${it.title}`} item={it} />
        ))}
      </div>
    </>
  )
}