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
  const setupSummary = entry.setup.length
    ? `${entry.setup.slice(0, 2).join(', ')}${entry.setup.length > 2 ? ` +${entry.setup.length - 2}` : ''}`
    : 'No setup notes yet'
  const residentSummary = linkedPokemon.length
    ? `${linkedPokemon
        .slice(0, 2)
        .map((pokemon) => pokemon.name)
        .join(', ')}${linkedPokemon.length > 2 ? ` +${linkedPokemon.length - 2}` : ''}`
    : 'No linked residents yet'

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

      <div className="entity-card__heading">
        <h3>{entry.name}</h3>
        <Badge compact tone="wave">
          {entry.area ?? 'Area unknown'}
        </Badge>
      </div>

      <p className="entity-card__summary">{entry.details}</p>

      <div className="badge-group">
        {entry.setup.slice(0, 3).map((item) => (
          <Badge key={item} tone="leaf">
            {item}
          </Badge>
        ))}
      </div>

      <dl className="entity-card__facts">
        <div>
          <dt>Recipe</dt>
          <dd>{setupSummary}</dd>
        </div>
        <div>
          <dt>Residents</dt>
          <dd>{residentSummary}</dd>
        </div>
      </dl>
    </button>
  )
}
