import type { CSSProperties } from 'react'
import type { PokemonEntry } from '../types'

interface VisualToken {
  icon: string
  background: string
  border: string
  color: string
  halo: string
  glow: string
}

const fallbackVisual: VisualToken = {
  icon: '✦',
  background: 'rgba(73, 94, 109, 0.12)',
  border: 'rgba(73, 94, 109, 0.22)',
  color: '#2d4757',
  halo: 'rgba(73, 94, 109, 0.2)',
  glow: 'rgba(73, 94, 109, 0.14)',
}

const specialtyVisuals: Record<string, VisualToken> = {
  Appraise: {
    icon: '◇',
    background: 'rgba(120, 95, 202, 0.14)',
    border: 'rgba(120, 95, 202, 0.24)',
    color: '#533da0',
    halo: 'rgba(120, 95, 202, 0.24)',
    glow: 'rgba(120, 95, 202, 0.14)',
  },
  Build: {
    icon: '▦',
    background: 'rgba(212, 120, 57, 0.16)',
    border: 'rgba(212, 120, 57, 0.25)',
    color: '#87451b',
    halo: 'rgba(212, 120, 57, 0.24)',
    glow: 'rgba(212, 120, 57, 0.14)',
  },
  Bulldoze: {
    icon: '⛏',
    background: 'rgba(163, 104, 63, 0.15)',
    border: 'rgba(163, 104, 63, 0.24)',
    color: '#6e3f1d',
    halo: 'rgba(163, 104, 63, 0.24)',
    glow: 'rgba(163, 104, 63, 0.14)',
  },
  Burn: {
    icon: '🔥',
    background: 'rgba(236, 104, 60, 0.16)',
    border: 'rgba(236, 104, 60, 0.26)',
    color: '#952d11',
    halo: 'rgba(236, 104, 60, 0.24)',
    glow: 'rgba(236, 104, 60, 0.14)',
  },
  Chop: {
    icon: '🪓',
    background: 'rgba(132, 100, 52, 0.16)',
    border: 'rgba(132, 100, 52, 0.24)',
    color: '#5f4317',
    halo: 'rgba(132, 100, 52, 0.24)',
    glow: 'rgba(132, 100, 52, 0.14)',
  },
  Crush: {
    icon: '✹',
    background: 'rgba(96, 113, 135, 0.16)',
    border: 'rgba(96, 113, 135, 0.25)',
    color: '#304458',
    halo: 'rgba(96, 113, 135, 0.24)',
    glow: 'rgba(96, 113, 135, 0.14)',
  },
  'Dream Island': {
    icon: '☁',
    background: 'rgba(128, 150, 222, 0.16)',
    border: 'rgba(128, 150, 222, 0.24)',
    color: '#3d58a7',
    halo: 'rgba(128, 150, 222, 0.24)',
    glow: 'rgba(128, 150, 222, 0.14)',
  },
  Eat: {
    icon: '🍎',
    background: 'rgba(212, 85, 84, 0.15)',
    border: 'rgba(212, 85, 84, 0.24)',
    color: '#8a2728',
    halo: 'rgba(212, 85, 84, 0.24)',
    glow: 'rgba(212, 85, 84, 0.14)',
  },
  Fly: {
    icon: '🕊',
    background: 'rgba(99, 171, 220, 0.16)',
    border: 'rgba(99, 171, 220, 0.24)',
    color: '#235f8d',
    halo: 'rgba(99, 171, 220, 0.24)',
    glow: 'rgba(99, 171, 220, 0.14)',
  },
  Gather: {
    icon: '🧺',
    background: 'rgba(173, 121, 75, 0.16)',
    border: 'rgba(173, 121, 75, 0.25)',
    color: '#734217',
    halo: 'rgba(173, 121, 75, 0.24)',
    glow: 'rgba(173, 121, 75, 0.14)',
  },
  'Gather Honey': {
    icon: '🍯',
    background: 'rgba(232, 175, 54, 0.18)',
    border: 'rgba(232, 175, 54, 0.26)',
    color: '#865300',
    halo: 'rgba(232, 175, 54, 0.25)',
    glow: 'rgba(232, 175, 54, 0.15)',
  },
  Generate: {
    icon: '⚙',
    background: 'rgba(103, 141, 166, 0.16)',
    border: 'rgba(103, 141, 166, 0.24)',
    color: '#35566d',
    halo: 'rgba(103, 141, 166, 0.24)',
    glow: 'rgba(103, 141, 166, 0.14)',
  },
  Grow: {
    icon: '🌿',
    background: 'rgba(92, 175, 114, 0.16)',
    border: 'rgba(92, 175, 114, 0.24)',
    color: '#216438',
    halo: 'rgba(92, 175, 114, 0.24)',
    glow: 'rgba(92, 175, 114, 0.14)',
  },
  Hype: {
    icon: '✦',
    background: 'rgba(236, 105, 139, 0.16)',
    border: 'rgba(236, 105, 139, 0.24)',
    color: '#9b2157',
    halo: 'rgba(236, 105, 139, 0.24)',
    glow: 'rgba(236, 105, 139, 0.14)',
  },
  Litter: {
    icon: '🧸',
    background: 'rgba(212, 127, 177, 0.17)',
    border: 'rgba(212, 127, 177, 0.25)',
    color: '#8f366d',
    halo: 'rgba(212, 127, 177, 0.24)',
    glow: 'rgba(212, 127, 177, 0.14)',
  },
  Paint: {
    icon: '🎨',
    background: 'rgba(139, 114, 224, 0.16)',
    border: 'rgba(139, 114, 224, 0.24)',
    color: '#5138ab',
    halo: 'rgba(139, 114, 224, 0.24)',
    glow: 'rgba(139, 114, 224, 0.14)',
  },
  Recycle: {
    icon: '♻',
    background: 'rgba(89, 174, 149, 0.16)',
    border: 'rgba(89, 174, 149, 0.24)',
    color: '#1e6a59',
    halo: 'rgba(89, 174, 149, 0.24)',
    glow: 'rgba(89, 174, 149, 0.14)',
  },
  Search: {
    icon: '🔍',
    background: 'rgba(88, 137, 226, 0.16)',
    border: 'rgba(88, 137, 226, 0.24)',
    color: '#234fa5',
    halo: 'rgba(88, 137, 226, 0.24)',
    glow: 'rgba(88, 137, 226, 0.14)',
  },
  Storage: {
    icon: '📦',
    background: 'rgba(171, 128, 88, 0.16)',
    border: 'rgba(171, 128, 88, 0.25)',
    color: '#71441d',
    halo: 'rgba(171, 128, 88, 0.24)',
    glow: 'rgba(171, 128, 88, 0.14)',
  },
  Teleport: {
    icon: '↗',
    background: 'rgba(116, 132, 231, 0.16)',
    border: 'rgba(116, 132, 231, 0.24)',
    color: '#384db1',
    halo: 'rgba(116, 132, 231, 0.24)',
    glow: 'rgba(116, 132, 231, 0.14)',
  },
  Trade: {
    icon: '⇄',
    background: 'rgba(232, 111, 108, 0.16)',
    border: 'rgba(232, 111, 108, 0.24)',
    color: '#a42f30',
    halo: 'rgba(232, 111, 108, 0.24)',
    glow: 'rgba(232, 111, 108, 0.14)',
  },
  Transform: {
    icon: '◐',
    background: 'rgba(140, 136, 230, 0.16)',
    border: 'rgba(140, 136, 230, 0.24)',
    color: '#5147b4',
    halo: 'rgba(140, 136, 230, 0.24)',
    glow: 'rgba(140, 136, 230, 0.14)',
  },
  Water: {
    icon: '💧',
    background: 'rgba(87, 157, 227, 0.16)',
    border: 'rgba(87, 157, 227, 0.24)',
    color: '#1d5ea4',
    halo: 'rgba(87, 157, 227, 0.24)',
    glow: 'rgba(87, 157, 227, 0.14)',
  },
  Yawn: {
    icon: '☾',
    background: 'rgba(115, 125, 188, 0.16)',
    border: 'rgba(115, 125, 188, 0.24)',
    color: '#404a86',
    halo: 'rgba(115, 125, 188, 0.24)',
    glow: 'rgba(115, 125, 188, 0.14)',
  },
}

const habitatVisuals: Record<string, VisualToken> = {
  Bright: {
    icon: '✦',
    background: 'rgba(240, 194, 78, 0.18)',
    border: 'rgba(240, 194, 78, 0.28)',
    color: '#875600',
    halo: 'rgba(240, 194, 78, 0.22)',
    glow: 'rgba(240, 194, 78, 0.12)',
  },
  Cool: {
    icon: '❄',
    background: 'rgba(99, 182, 216, 0.16)',
    border: 'rgba(99, 182, 216, 0.24)',
    color: '#16647f',
    halo: 'rgba(99, 182, 216, 0.2)',
    glow: 'rgba(99, 182, 216, 0.12)',
  },
  Dark: {
    icon: '☽',
    background: 'rgba(92, 99, 170, 0.16)',
    border: 'rgba(92, 99, 170, 0.24)',
    color: '#343c86',
    halo: 'rgba(92, 99, 170, 0.2)',
    glow: 'rgba(92, 99, 170, 0.12)',
  },
  Dry: {
    icon: '◌',
    background: 'rgba(192, 156, 102, 0.18)',
    border: 'rgba(192, 156, 102, 0.26)',
    color: '#7f5722',
    halo: 'rgba(192, 156, 102, 0.22)',
    glow: 'rgba(192, 156, 102, 0.12)',
  },
  Humid: {
    icon: '💧',
    background: 'rgba(69, 174, 188, 0.16)',
    border: 'rgba(69, 174, 188, 0.24)',
    color: '#135f67',
    halo: 'rgba(69, 174, 188, 0.2)',
    glow: 'rgba(69, 174, 188, 0.12)',
  },
  Warm: {
    icon: '☀',
    background: 'rgba(238, 133, 73, 0.17)',
    border: 'rgba(238, 133, 73, 0.25)',
    color: '#964019',
    halo: 'rgba(238, 133, 73, 0.22)',
    glow: 'rgba(238, 133, 73, 0.12)',
  },
}

export function getSpecialtyVisual(name: string) {
  return specialtyVisuals[name] ?? fallbackVisual
}

export function getHabitatVisual(name: string | null) {
  return (name ? habitatVisuals[name] : null) ?? fallbackVisual
}

export function getBadgeStyle(token: VisualToken): CSSProperties {
  return {
    '--badge-bg': token.background,
    '--badge-border': token.border,
    '--badge-color': token.color,
  } as CSSProperties
}

export function getSurfaceStyle(token: VisualToken): CSSProperties {
  return {
    '--card-accent': token.color,
    '--card-halo': token.halo,
    '--card-glow': token.glow,
    '--art-bg': token.background,
    '--art-border': token.border,
    '--art-ink': token.color,
  } as CSSProperties
}

export function getPokemonSpriteUrl(id: number) {
  return `${import.meta.env.BASE_URL}pokemon-icons/${id.toString().padStart(3, '0')}.png`
}

export function getPrimarySpecialty(entry: Pick<PokemonEntry, 'specialties'>) {
  return getSpecialtyVisual(entry.specialties[0] ?? '')
}
