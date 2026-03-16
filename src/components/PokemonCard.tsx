import { getHabitatsForPokemon } from '../data/pokopia'
import { formatPokemonId, labelForTime, labelForWeather } from '../lib/filters'
import { getBadgeStyle, getHabitatVisual, getPrimarySpecialty, getSpecialtyVisual, getSurfaceStyle } from '../lib/visuals'
import type { PokemonEntry } from '../types'
import { Badge } from './Badge'
import { PokemonArtwork } from './PokemonArtwork'

interface PokemonCardProps {
  entry: PokemonEntry
  isSelected: boolean
  onSelect: (id: number) => void
}

export function PokemonCard({ entry, isSelected, onSelect }: PokemonCardProps) {
  const linkedHabitats = getHabitatsForPokemon(entry)
  const primarySpecialty = getPrimarySpecialty(entry)
  const habitatVisual = getHabitatVisual(entry.idealHabitat)

  return (
    <button
      aria-pressed={isSelected}
      className={`entity-card entity-card--pokemon${isSelected ? ' entity-card--selected' : ''}`}
      onClick={() => onSelect(entry.id)}
      style={getSurfaceStyle(primarySpecialty)}
      type="button"
    >
      <div className="entity-card__topline">
        <span className="entity-card__eyebrow">{formatPokemonId(entry.id)}</span>
        <span className="entity-card__count">{linkedHabitats.length} habitat matches</span>
      </div>

      <div className="pokemon-card__shell">
        <PokemonArtwork entry={entry} size="card" />

        <div className="pokemon-card__body">
          <div className="entity-card__heading">
            <h3>{entry.name}</h3>
            {entry.idealHabitat ? (
              <Badge compact icon={habitatVisual.icon} style={getBadgeStyle(habitatVisual)}>
                {entry.idealHabitat}
              </Badge>
            ) : null}
          </div>

          <p className="entity-card__summary">
            {entry.idealHabitat ? `${entry.idealHabitat} habitat affinity` : 'No ideal habitat listed'}
          </p>

          <div className="badge-group">
            {entry.specialties.map((specialty) => {
              const specialtyVisual = getSpecialtyVisual(specialty)

              return (
                <Badge compact icon={specialtyVisual.icon} key={specialty} style={getBadgeStyle(specialtyVisual)}>
                  {specialty}
                </Badge>
              )
            })}
          </div>

          {entry.favorites.length ? (
            <p className="entity-card__subtext">
              Favourites: {entry.favorites.slice(0, 2).join(', ')}
              {entry.favorites.length > 2 ? ` +${entry.favorites.length - 2}` : ''}
            </p>
          ) : (
            <p className="entity-card__subtext">No favourite cues listed yet.</p>
          )}
        </div>
      </div>

      <div className="entity-card__meta">
        <span>{entry.timeOfDay.map(labelForTime).join(', ') || 'Any time'}</span>
        <span>{entry.weather.map(labelForWeather).join(', ') || 'Any weather'}</span>
      </div>
    </button>
  )
}
