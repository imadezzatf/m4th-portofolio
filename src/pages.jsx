import { useEffect, useRef } from 'react'
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
  const vid = useRef(null)
  if (!media) return null

  const hide = (e) => {
    e.currentTarget.parentElement.style.display = 'none'   // file tidak ketemu → sembunyikan
  }

  if (media.type === 'video') {
    const toggle = () => {
      const v = vid.current
      if (!v) return
      if (v.paused) v.play()?.catch(() => {})
      else v.pause()
    }
    return (
      <div
        className="media"
        onMouseEnter={() => vid.current?.play()?.catch(() => {})}
        onMouseLeave={() => vid.current?.pause()}
        onClick={toggle}
      >
        <video
          ref={vid}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="metadata"
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

// Sampul kotak untuk halaman cabinet (+ potongan audio saat di-hover)
function Cover({ item }) {
  const audio = useRef(null)

  const start = () => {
    if (!item.audio) return
    if (!audio.current) {
      audio.current = new Audio(item.audio)
      audio.current.volume = 0.6
    }
    audio.current.currentTime = 0
    audio.current.play().catch(() => {})
  }
  const stop = () => audio.current?.pause()

  // hentikan suara kalau pindah halaman
  useEffect(() => () => audio.current?.pause(), [])

  return (
    <article className="cover" onMouseEnter={start} onMouseLeave={stop}>
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="cover-info">
        <h2>{item.title}</h2>
        <p>{item.note}</p>
      </div>
    </article>
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

export function Cabinet() {
  return (
    <>
      <Head title="cabinet" sub={CABINET.sub} />
      <div className="grid">
        {CABINET.items.map((c) => (
          <Cover key={c.title} item={c} />
        ))}
      </div>
    </>
  )
}