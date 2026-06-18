import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ThemeToggle } from '../components/ThemeToggle'
import shoppy from '../assets/noir.png'

const TAGLINES = [
  'Never forget milk again.',
  'Shop together, in real time.',
  'Your list, everywhere you go.',
]

const GHOST_CARDS = [
  { items: ['🥦 Broccoli', '🥛 Milk', '🍞 Bread'], depth: 0.02, x: -260, y: -80, rotate: -8 },
  { items: ['🧀 Cheese', '🍅 Tomatoes'], depth: 0.035, x: 240, y: -40, rotate: 6 },
  { items: ['🍌 Bananas', '🥚 Eggs', '🧴 Shampoo'], depth: 0.015, x: -200, y: 160, rotate: -4 },
]

const ORBIT_ITEMS = [
  { emoji: '🛒', radius: 90, duration: 8, delay: 0 },
  { emoji: '🥛', radius: 72, duration: 6, delay: -2.5 },
  { emoji: '🍎', radius: 104, duration: 10, delay: -5 },
]

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  // typewriter state
  const [displayed, setDisplayed] = useState('')
  const [tagIndex, setTagIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  // parallax mouse tracking
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    function tick() {
      const el = containerRef.current
      if (!el) { rafRef.current = requestAnimationFrame(tick); return }
      const { width, height } = el.getBoundingClientRect()
      const cx = width / 2
      const cy = height / 2
      const dx = mousePos.current.x - cx
      const dy = mousePos.current.y - cy

      ghostRefs.current.forEach((ghost, i) => {
        if (!ghost) return
        const d = GHOST_CARDS[i].depth
        ghost.style.transform =
          `translate(calc(${GHOST_CARDS[i].x}px + ${dx * d}px), calc(${GHOST_CARDS[i].y}px + ${dy * d}px)) rotate(${GHOST_CARDS[i].rotate}deg)`
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // typewriter cycling
  useEffect(() => {
    const target = TAGLINES[tagIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55)
    } else if (!isDeleting && displayed.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setTagIndex((i) => (i + 1) % TAGLINES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, tagIndex])

  async function handleSignIn() {
    try {
      await signInWithGoogle()
    } catch {
      // popup closed or auth error
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[--color-bg] px-4 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* #region parallax ghost cards */}
      {GHOST_CARDS.map((card, i) => (
        <div
          key={i}
          ref={(el) => { ghostRefs.current[i] = el }}
          className="absolute pointer-events-none select-none z-0"
          style={{
            transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
            willChange: 'transform',
          }}
        >
          <div
            className="glass rounded-xl px-5 py-4 flex flex-col gap-2"
            style={{ opacity: 0.18, filter: 'blur(1.5px)', minWidth: 140 }}
          >
            {card.items.map((item) => (
              <span key={item} className="text-[--color-ink] text-sm font-medium">{item}</span>
            ))}
          </div>
        </div>
      ))}
      {/* #endregion */}

      {/* #region receipt card unfurl */}
      <div className="receipt-unfurl relative z-10 w-full max-w-sm">
        <div
          className="glass halftone rounded-2xl px-8 py-10 flex flex-col items-center text-center shadow-2xl"
          style={{ borderTop: '3px dashed var(--color-border)' }}
        >
          {/* #region orbiting items */}
          <div className="relative mb-6" style={{ width: 128, height: 128 }}>
            <img
              src={shoppy}
              alt="GrabNGo mascot"
              className="w-32 h-32 drop-shadow-lg select-none relative z-10"
              style={{ borderRadius: '50%' }}
            />
            {ORBIT_ITEMS.map((o, i) => (
              <span
                key={i}
                className="absolute text-xl select-none pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                  animation: `orbit-${i} ${o.duration}s linear infinite`,
                  animationDelay: `${o.delay}s`,
                  transformOrigin: `${-o.radius}px 0px`,
                  willChange: 'transform',
                }}
              >
                {o.emoji}
              </span>
            ))}
          </div>
          {/* #endregion */}

          <h1 className="text-4xl sm:text-5xl font-black text-[--color-ink] mb-3 tracking-tight">
            Grab&nbsp;N&nbsp;Go
          </h1>

          {/* #region typewriter */}
          <p className="text-[--color-ink]/60 text-base mb-8 h-6 flex items-center justify-center gap-0.5">
            <span>{displayed}</span>
            <span className="typewriter-cursor">|</span>
          </p>
          {/* #endregion */}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="
              flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-base
              bg-[--color-surface] text-[--color-ink] border-2 border-[--color-ink]/20
              shadow-md hover:shadow-lg hover:border-[--color-accent]/60 active:scale-95
              transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <GoogleIcon />
            Show me the list, detective
          </button>

          {/* receipt tear marks */}
          <div className="flex gap-3 mt-8 opacity-20" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-[--color-ink]" />
            ))}
          </div>
        </div>
      </div>
      {/* #endregion */}

      <style>{`
        /* receipt unfurl */
        @keyframes receiptDrop {
          from {
            opacity: 0;
            transform: translateY(-40px) scaleY(0.85);
            clip-path: inset(0 0 100% 0);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
            clip-path: inset(0 0 0% 0);
          }
        }
        .receipt-unfurl {
          animation: receiptDrop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* orbit keyframes — each item orbits at its own radius via transformOrigin */
        @keyframes orbit-0 {
          from { transform: rotate(0deg)   translateX(90px)  rotate(0deg); }
          to   { transform: rotate(360deg) translateX(90px)  rotate(-360deg); }
        }
        @keyframes orbit-1 {
          from { transform: rotate(120deg)  translateX(72px)  rotate(-120deg); }
          to   { transform: rotate(480deg)  translateX(72px)  rotate(-480deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(240deg)  translateX(104px) rotate(-240deg); }
          to   { transform: rotate(600deg)  translateX(104px) rotate(-600deg); }
        }

        /* typewriter cursor blink */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .typewriter-cursor {
          animation: blink 0.9s step-end infinite;
          color: var(--color-accent);
          font-weight: 300;
        }
      `}</style>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.09 29.5 1 24 1 14.72 1 6.9 6.67 3.52 14.72l7.09 5.51C12.29 14.1 17.66 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.08-.4-4.55H24v8.61h12.7c-.55 2.94-2.2 5.43-4.7 7.1l7.27 5.65C43.28 37.5 46.5 31.48 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.61 28.77A14.53 14.53 0 0 1 9.5 24c0-1.66.28-3.27.79-4.77L3.2 13.72A23.93 23.93 0 0 0 1 24c0 3.87.92 7.53 2.52 10.78l7.09-5.51-.0-.5z" />
      <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.27-5.65c-1.81 1.22-4.12 1.93-6.23 1.93-6.34 0-11.71-4.6-13.39-10.73l-7.09 5.51C6.9 41.33 14.72 47 24 47z" />
    </svg>
  )
}
