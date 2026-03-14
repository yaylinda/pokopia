import { getHabitatsForPokemon } from '../data/pokopia'
import { formatPokemonId, labelForTime, labelForWeather } from '../lib/filters'
import type { PokemonEntry } from '../types'
import { Badge } from './Badge'

interface PokemonCardProps {
  entry: PokemonEntry
  isSelected: boolean
  onSelect: (id: number) => void
}

export function PokemonCard({ entry, isSelected, onSelect }: PokemonCardProps) {
  const linkedHabitats = getHabitatsForPokemon(entry)

  return (
    <button
      aria-pressed={isSelected}
      className={`entity-card${isSelected ? ' entity-card--selected' : ''}`}
      onClick={() => onSelect(entry.id)}
      type="button"
    >
      <div className="entity-card__heading">
        <span className="entity-card__eyebrow">{formatPokemonId(entry.id)}</span>
        <h3>{entry.name}</h3>
      </div>

      <p className="entity-card__summary">
        {entry.idealHabitat ? `${entry.idealHabitat} habitat affinity` : 'No ideal habitat listed'}
      </p>

      <div className="badge-group">
        {entry.specialties.map((specialty) => (
          <Badge key={specialty} tone="ember">
            {specialty}
          </Badge>
        ))}
      </div>

      {entry.favorites.length ? (
        <p className="entity-card__subtext">
          Favourites: {entry.favorites.slice(0, 3).join(', ')}
          {entry.favorites.length > 3 ? ` +${entry.favorites.length - 3}` : ''}
        </p>
      ) : null}

      <div className="entity-card__meta">
        <span>{linkedHabitats.length} habitat matches</span>
        <span>
          {entry.timeOfDay.map(labelForTime).join(', ') || 'Any time'}
        </span>
        <span>
          {entry.weather.map(labelForWeather).join(', ') || 'Any weather'}
        </span>
      </div>
    </button>
  )
}
