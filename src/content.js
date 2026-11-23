export const ABOUT = {
  paragraphs: [
    "Hi, I'm Ezzat! I build things for the web, and I get lost in the night sky when I should be sleeping.",
    "This site is a small universe. Every page is a different corner of it: a cluster of galaxies, a solar system, a few orbits, and a bend in spacetime.",
    "The scene behind this text is gravitational lensing. Light from a faraway galaxy gets bent by the gravity of a galaxy in front of it, so we see the same distant object in places it isn't. I like that idea: what you see depends on what stands in between.",
    "Hide this text with the eye button (or press H) and drag around to explore.",
  ],
  links: [
    { label: 'email', href: 'https://mail.google.com/mail/?view=cm&to=imadezzatf@gmail.com' },
    { label: 'github', href: 'https://github.com/imadezzatf' },
  ],
}

export const PROJECTS = {
  sub: 'some notable things i have built!',
  items: [
    {
      title: 'cosmos portfolio',
      desc: 'This very website. A 3D universe built with React Three Fiber, where every page is its own scene.',
      tags: ['react', 'three.js', 'vite'],
      link: 'https://github.com/imadezzatf/m4th-portofolio',
      // video: diputar saat di-hover. poster = gambar yang tampil sebelum diputar
      media: { type: 'image', src: '/media/cosmos.webp' },
    },
    {
      title: 'habit tracker app',
      desc: 'A minimal habit tracker with streaks, gentle reminders, and a weekly summary.',
      tags: ['react native', 'firebase'],
      link: '',
      // gambar biasa
      media: { type: 'image', src: '/media/app-tracker.webp' },
    },
    {
      title: 'weather dashboard',
      desc: 'A clean dashboard that turns a messy weather API into a quick glance.',
      tags: ['javascript', 'rest api'],
      link: '',
      media: { type: 'image', src: '/media/cabinet/weather.webp' },
      // tanpa media: kartu tampil tanpa gambar
    },
    {
      title: 'fedora gnome setup',
      desc: 'A quick look at my Fedora Linux desktop running GNOME, with a clean and minimal setup.',
      tags: ['fedora', 'gnome', 'linux'],
      link: '',
      media: { type: 'video', src: '/media/linux-web.mp4', poster: '/media/linux-poster.webp' },
    },
  ],
}

export const WRITING = {
  sub: 'notes, thoughts, and things i learned along the way.',
  items: [
    {
      slug: 'why-i-started-building-in-public',
      title: 'Why I started building in public',
      date: 'November 20, 2026',
      body: [
        "For a long time I waited until things were ready before showing them to anyone. Ready never came.",
        "So I tried the opposite: ship something small, imperfect, and tell people about it. The first few posts were embarrassing. They were also the first time anyone gave me feedback that actually helped.",
        "Building in public is not about an audience. It is about making it a little harder to quietly give up.",
      ],
    },
    {
      slug: 'what-the-night-sky-taught-me',
      title: 'What the night sky taught me about patience',
      date: 'November 12, 2026',
      body: [
        "The light you see from a star tonight left it a very long time ago. You are looking at the past, and it is still beautiful.",
        "I think about that when a project feels slow. Most good things take a while to arrive, and you only see the light once it has travelled far enough.",
        "Keep going. Someone, somewhere, will see it when it gets there.",
      ],
    },
    {
      slug: 'learning-in-the-open',
      title: 'Learning in the open',
      date: 'November 5, 2026',
      body: [
        "You do not need to be an expert to start writing about something. You need a question and a little stubbornness.",
        "When I learn a new tool, I write down what confused me. Those notes turned out to be the most useful thing I have ever published, because they are written for the person I was last week.",
      ],
    },
    {
      slug: 'how-i-built-this-website',
      title: 'How I built this website',
      date: 'October 28, 2026',
      body: [
        "This site is a fixed 3D canvas with plain HTML laid on top. The canvas never reloads, so moving between pages is just the camera gliding to a new spot.",
        "Stars are one object made of thousands of points, galaxies are spirals generated from a formula, and the orbits you see on the writing page come from a single equation.",
        "The best part of building it was how small each piece was on its own. Stack enough small pieces and you get a universe.",
      ],
    },
  ],
}

export const CABINET = {
  sub: 'things i love to yap about. tap a song to play a snippet!!',
  items: [
    // kind: 'song' → sampul + potongan lagu otomatis dari iTunes (tulis "judul artis")
    // kind: 'film' → poster dari iTunes; link = halaman yang dibuka saat diklik
    { kind: 'song', title: 'Chocolate', by: 'The 1975', itunes: 'Chocolate The 1975' },
    {
      kind: 'film',
      title: 'Captain America: The Winter Soldier',
      by: 'Anthony & Joe Russo',
      cover: '/media/cabinet/captain.webp',
      link: 'https://en.wikipedia.org/wiki/Captain_America:_The_Winter_Soldier',
    },
    { kind: 'song', title: 'Cornerstone', by: 'Arctic Monkeys', itunes: 'Cornerstone Arctic Monkeys' },
    { kind: 'song', title: 'When It Rains', by: 'Paramore', itunes: 'When It Rains Paramore' },
    { kind: 'song', title: 'Back To Me', by: 'The Marias', itunes: 'Back To Me The Marias' },
    { kind: 'song', title: 'Untuk Perempuan Yang Sedang Di Pelukan', by: 'Payung Teduh', itunes: 'Untuk Perempuan Yang Sedang Di Pelukan Payung Teduh' },
    {
      kind: 'film',
      title: 'Project Hail Mary',
      by: 'Phil Lord & Christopher Miller',
      cover: '/media/cabinet/Project_Hail_Mary_poster.webp',
      link: 'https://en.wikipedia.org/wiki/Project_Hail_Mary_(film)',
    },
    {
      kind: 'film',
      title: 'Interstellar',
      by: 'Christopher Nolan',
      cover: '/media/cabinet/Interstellar_film_poster.webp',
      link: 'https://en.wikipedia.org/wiki/Interstellar_(film)',

    },
    {
      kind: 'film',
      title: 'Your Name',
      by: 'Makoto Shinkai',
      cover: '/media/cabinet/Your_Name_poster.webp',
      link: 'https://en.wikipedia.org/wiki/Your_Name'
    },
    { kind: 'song', title: 'LOVE DIVE', by: 'IVE', itunes: 'LOVE DIVE IVE' },
    { kind: 'song', title: 'How Sweet', by: 'NewJeans', itunes: 'How Sweet NewJeans' },
    { kind: 'song', title: 'Come Over', by: 'The Internet', itunes: 'Come Over The Internet' },
    { kind: 'song', title: 'the less i know the better', by: 'Tame Impala', itunes: 'the less i know the better Tame Impala' },
    { kind: 'song', title: 'supernova love', by: 'IVE', itunes: 'supernova love IVE' },
    { kind: 'song', title: 'Harvey', by: 'Her\'s', itunes: 'Harvey Her\'s' },
    {
      kind: 'film',
      title: 'The Last: Naruto the Movie',
      by: 'Tsuneo Kobayashi',
      cover: '/media/cabinet/TheLastNarutomovie.webp',
      link: 'https://en.wikipedia.org/wiki/The_Last:_Naruto_the_Movie',
    },
    {
      kind: 'film',
      title: 'Look Back',
      by: 'Tatsuki Fujimoto',
      cover: '/media/cabinet/Look_Back.webp',
      link: 'https://id.wikipedia.org/wiki/Look_Back_(film_2024)',
    },
    {
      kind: 'film',
      title: 'The Odyssey',
      by: 'Christopher Nolan',
      cover: '/media/cabinet/The_Odyssey-film_poster.webp',
      link: 'https://id.wikipedia.org/wiki/The_Odyssey_(film_2026)',
    },
    { kind: 'song', title: 'Telepatia', by: 'Kali Uchis', itunes: 'Telepatia Kali Uchis' },
  ],
}