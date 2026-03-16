import { getPokemonForHabitat } from '../data/pokopia'
import type { HabitatEntry } from '../types'
import { Badge } from './Badge'

interface HabitatCardProps {
  entry: HabitatEntry
  isSelected: boolean
  onSelect: (id: number) => void
}

export function HabitatCard({ entry, isSelected, onSelect }: HabitatCardProps) {
  const linkedPokemon = getPokemonForHabitat(entry)
  const areaMark = (entry.area ?? '??')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <button
      aria-pressed={isSelected}
      className={`entity-card entity-card--habitat${isSelected ? ' entity-card--selected' : ''}`}
      onClick={() => onSelect(entry.id)}
      type="button"
    >
      <div className="entity-card__topline">
        <span className="entity-card__eyebrow">Habitat #{entry.id}</span>
        <span className="entity-card__count">{linkedPokemon.length} linked Pokemon</span>
      </div>

      <div className="habitat-card__crest" aria-hidden="true">
        <span>{areaMark}</span>
      </div>

      <div className="entity-card__heading">
        <h3>{entry.name}</h3>
      </div>

      <p className="entity-card__summary">{entry.details}</p>

      <div className="badge-group">
        <Badge tone="wave">{entry.area ?? 'Area unknown'}</Badge>
        {entry.setup.slice(0, 2).map((item) => (
          <Badge key={item} tone="leaf">
            {item}
          </Badge>
        ))}
      </div>

      <div className="entity-card__meta">
        <span>{entry.setup.length} setup notes</span>
        <span>{linkedPokemon.slice(0, 2).map((pokemon) => pokemon.name).join(', ') || 'No resident links yet'}</span>
      </div>
    </button>
  )
}
