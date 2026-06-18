import type { PopWord } from './ComicPop'

type FireFn = (word: PopWord, anchorEl?: Element | null) => void

export let globalFire: FireFn | null = null

export function setGlobalFire(fn: FireFn | null) {
  globalFire = fn
}

export function fireComicPop(word: PopWord, anchorEl?: Element | null) {
  globalFire?.(word, anchorEl)
}
