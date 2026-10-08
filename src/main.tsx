import './style.css'


type Tema = 'light' | 'dark'
type Categoria = 'web' | 'dis' | 'est'

interface Proyecto {
  t: string
  c: Categoria
  e: string
  g: string
  d: string
}

declare global {
  interface Window {
    closeM: () => void
  }
}


function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`No existe el elemento #${id}`)
  return el as T
}

/* ---------- Modo claro / oscuro ---------- */
const root: HTMLElement = document.documentElement
const btn = $<HTMLButtonElement>('theme')

function setTheme(t: Tema): void {
  root.setAttribute('data-theme', t)
  btn.textContent = t === 'dark' ? '☀️ Claro' : '🌙 Oscuro'
  try {
    localStorage.setItem('tema', t)
  } catch {
    /* sin almacenamiento */
  }
}

let saved: string | null = null
try {
  saved = localStorage.getItem('tema')
} catch {
  /* sin almacenamiento */
}
const inicial: Tema =
  saved === 'dark' || saved === 'light'
    ? saved
    : window.matchMedia('(prefers-color-scheme:dark)').matches
      ? 'dark'
      : 'light'
setTheme(inicial)

btn.onclick = (): void => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
}

$<HTMLSpanElement>('yr').textContent = String(new Date().getFullYear())

/* ---------- Texto que se escribe solo ---------- */
const words: string[] = ['Estudiante creativa', 'Desarrolladora web', 'Diseñadora de ideas']
const typed = $<HTMLDivElement>('typed')
let wi = 0
let ci = 0
let del = false

function tick(): void {
  const w = words[wi]
  typed.textContent = w.slice(0, ci)
  if (!del && ci === w.length) {
    del = true
    setTimeout(tick, 1400)
    return
  }
  if (del && ci === 0) {
    del = false
    wi = (wi + 1) % words.length
  }
  ci += del ? -1 : 1
  setTimeout(tick, del ? 40 : 80)
}
tick()

/* ---------- Proyectos: cambia aquí los tuyos ---------- */
const data: Proyecto[] = [
  { t: 'Mi portafolio personal', c: 'web', e: '🌐', g: '#f8d3bf,#e8a7b9', d: 'Pàgina web responsive con modo claro y oscuro, hecha con Vite y TypeScript' },
  { t: 'Mi hoja de vida', c: 'est', e: '📓', g: '#b9e0d2,#c9b8e8', d: 'Pàgina sencilla en HTML con mi hoja de vida: Datos personales, estudios, habilidades y contacto.' },
  { t: 'Identidad visual', c: 'dis', e: '🎨', g: '#c9b8e8,#e8a7b9', d: 'Logo y paleta de colores para un proyecto de clase.' },
  { t: 'Juego de Pac-Man', c: 'web', e: '✅', g: '#e8a7b9,#f8d3bf', d: 'Videojuego hecho con HTML, CSS y JavaScript, con movimiento personaje, fantasmas y puntaje.' },
  { t: 'Póster creativo', c: 'dis', e: '🖼️', g: '#f8d3bf,#b9e0d2', d: 'Diseño de póster para un evento escolar, cuidando la tipografìa.' },
  { t: 'Proyecto de investigación', c: 'est', e: '🔬', g: '#c9b8e8,#b9e0d2', d: 'Investigaciòn sobre como es el desarrollador web hoy: tecnologìas, tecndencias y herramientas màs usadas.' },
]

const grid = $<HTMLDivElement>('grid')
const modal = $<HTMLDivElement>('modal')

function abrirModal(p: Proyecto): void {
  $<HTMLElement>('mt').textContent = `${p.e} ${p.t}`
  $<HTMLElement>('md').textContent = p.d
  modal.classList.add('open')
}

function draw(f: string): void {
  grid.innerHTML = ''
  data.forEach((p: Proyecto) => {
    if (f !== 'all' && p.c !== f) return
    const d = document.createElement('div')
    d.className = 'card proj'
    d.tabIndex = 0
    d.innerHTML = `<div class="thumb" style="background:linear-gradient(135deg,${p.g})">${p.e}</div><div class="in"><h3>${p.t}</h3><p>${p.d}</p></div>`
    d.addEventListener('click', () => abrirModal(p))
    d.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') abrirModal(p)
    })
    grid.appendChild(d)
  })
}
draw('all')

const filters = $<HTMLDivElement>('filters')
filters.addEventListener('click', (e: MouseEvent) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button')
  if (!b) return
  filters.querySelectorAll('button').forEach((x) => x.classList.remove('on'))
  b.classList.add('on')
  draw(b.dataset.f ?? 'all')
})

window.closeM = (): void => {
  modal.classList.remove('open')
}
modal.addEventListener('click', (e: MouseEvent) => {
  if (e.target === modal) window.closeM()
})

/* ---------- Formulario ---------- */
function toast(s: string): void {
  const x = $<HTMLDivElement>('toast')
  x.textContent = s
  x.classList.add('show')
  setTimeout(() => x.classList.remove('show'), 2800)
}

const form = $<HTMLFormElement>('form')
form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault()
  toast(`💌 ¡Gracias, ${$<HTMLInputElement>('n').value}! Mensaje enviado`)
  form.reset()
})

/* ---------- Animaciones al hacer scroll ---------- */
const io = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return
      const el = en.target as HTMLElement
      el.classList.add('in')
      el.querySelectorAll<HTMLElement>('.bar i').forEach((b) => {
        b.style.width = `${b.dataset.w}%`
      })
      el.querySelectorAll<HTMLElement>('[data-n]').forEach((s) => {
        const n = Number(s.dataset.n)
        let c = 0
        const st = window.setInterval(() => {
          c += Math.ceil(n / 40)
          if (c >= n) {
            c = n
            window.clearInterval(st)
          }
          s.textContent = String(c)
        }, 30)
      })
      io.unobserve(el)
    })
  },
  { threshold: 0.2 },
)
document.querySelectorAll<HTMLElement>('.rv').forEach((el) => io.observe(el))

/* ---------- Barra de progreso ---------- */
const prog = $<HTMLDivElement>('prog')
window.addEventListener('scroll', () => {
  const h = document.documentElement
  prog.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`
})

/* ---------- Pétalos cayendo ---------- */
interface Petalo {
  x: number
  y: number
  r: number
  s: number
  a: number
}

const cv = $<HTMLCanvasElement>('petals')
const cx = cv.getContext('2d')
const P: Petalo[] = []

function resize(): void {
  cv.width = window.innerWidth
  cv.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

for (let i = 0; i < 28; i++) {
  P.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 5 + Math.random() * 7,
    s: 0.4 + Math.random() * 0.8,
    a: Math.random() * 6,
  })
}

function animar(): void {
  if (!cx) return
  cx.clearRect(0, 0, cv.width, cv.height)
  P.forEach((p) => {
    p.y += p.s
    p.a += 0.02
    p.x += Math.sin(p.a) * 0.8
    if (p.y > cv.height + 10) {
      p.y = -10
      p.x = Math.random() * cv.width
    }
    cx.beginPath()
    cx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.a, 0, 7)
    cx.fillStyle = 'rgba(232,140,165,.6)'
    cx.fill()
  })
  requestAnimationFrame(animar)
}
animar()