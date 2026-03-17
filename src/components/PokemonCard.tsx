import { getHabitatsForPokemon } from '../data/pokopia'
import { formatPokemonId } from '../lib/filters'
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
  const habitatSummary = linkedHabitats.length
    ? `${linkedHabitats
        .slice(0, 2)
        .map((habitat) => habitat.name)
        .join(', ')}${linkedHabitats.length > 2 ? ` +${linkedHabitats.length - 2}` : ''}`
    : entry.idealHabitat
      ? `${entry.idealHabitat} affinity`
      : 'No habitat links yet'
  const favoriteSummary = entry.favorites.length
    ? `${entry.favorites.slice(0, 2).join(', ')}${entry.favorites.length > 2 ? ` +${entry.favorites.length - 2}` : ''}`
    : 'No favourite cues yet'

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
        <span className="entity-card__count">{linkedHabitats.length} linked habitat{linkedHabitats.length === 1 ? '' : 's'}</span>
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

          <p className="entity-card__summary">Skill set first, habitat links second, favourites close behind.</p>

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

          <dl className="entity-card__facts">
            <div>
              <dt>Habitats</dt>
              <dd>{habitatSummary}</dd>
            </div>
            <div>
              <dt>Favourites</dt>
              <dd>{favoriteSummary}</dd>
            </div>
          </dl>
        </div>
      </div>
    </button>
  )
}
