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

  return (
    <button
      aria-pressed={isSelected}
      className={`entity-card${isSelected ? ' entity-card--selected' : ''}`}
      onClick={() => onSelect(entry.id)}
      type="button"
    >
      <div className="entity-card__heading">
        <span className="entity-card__eyebrow">Habitat #{entry.id}</span>
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
        <span>{linkedPokemon.length} linked Pokemon</span>
        <span>{entry.setup.length} setup notes</span>
      </div>
    </button>
  )
}
