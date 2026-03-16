import type { CSSProperties } from 'react'
import type { PokemonEntry } from '../types'
import { getPokemonSpriteUrl, getPrimarySpecialty, getSurfaceStyle } from '../lib/visuals'

interface PokemonArtworkProps {
  entry: Pick<PokemonEntry, 'id' | 'name' | 'specialties'>
  size?: 'mini' | 'card' | 'hero' | 'detail'
}

export function PokemonArtwork({ entry, size = 'card' }: PokemonArtworkProps) {
  const style = getSurfaceStyle(getPrimarySpecialty(entry)) as CSSProperties

  return (
    <div className={`pokemon-art pokemon-art--${size}`} style={style}>
      <div className="pokemon-art__ring" aria-hidden="true" />
      <img alt="" loading="lazy" src={getPokemonSpriteUrl(entry.id)} />
    </div>
  )
}
