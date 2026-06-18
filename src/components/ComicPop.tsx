import { useEffect, useRef, useState } from 'react'
import styles from './ComicPop.module.css'
import { setGlobalFire } from './comicPopStore'

export type PopWord = 'POW!' | 'THWIP!' | 'ZAP!' | 'BOOM!' | 'YES!'

interface PopState {
  id: number
  word: PopWord
  x: number
  y: number
}

let nextId = 0

interface PopProps {
  pop: PopState
  onDone: (id: number) => void
}

function PopBurst({ pop, onDone }: PopProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = () => onDone(pop.id)
    el.addEventListener('animationend', handler)
    const t = setTimeout(() => onDone(pop.id), 800)
    return () => {
      el.removeEventListener('animationend', handler)
      clearTimeout(t)
    }
  }, [pop.id, onDone])

  return (
    <div
      className={styles.pop}
      style={{ '--pop-x': `${pop.x}px`, '--pop-y': `${pop.y}px` } as React.CSSProperties}
    >
      <span ref={ref} className={styles.label}>
        {pop.word}
      </span>
    </div>
  )
}

export function ComicPopProvider() {
  const [pops, setPops] = useState<PopState[]>([])

  useEffect(() => {
    setGlobalFire((word, anchorEl) => {
      let x = window.innerWidth / 2
      let y = window.innerHeight / 2

      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }

      x += (Math.random() - 0.5) * 40
      y += (Math.random() - 0.5) * 30

      setPops((prev) => [...prev, { id: nextId++, word, x, y }])
    })
    return () => setGlobalFire(null)
  }, [])

  function removePop(id: number) {
    setPops((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      {pops.map((p) => (
        <PopBurst key={p.id} pop={p} onDone={removePop} />
      ))}
    </>
  )
}
