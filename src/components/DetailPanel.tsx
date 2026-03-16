import { getHabitatsForPokemon, getPokemonForHabitat } from '../data/pokopia'
import { formatPokemonId, labelForTime, labelForWeather } from '../lib/filters'
import { getBadgeStyle, getHabitatVisual, getSpecialtyVisual, getSurfaceStyle } from '../lib/visuals'
import type { HabitatEntry, PokemonEntry, ViewMode } from '../types'
import { Badge } from './Badge'
import { PokemonArtwork } from './PokemonArtwork'

interface DetailPanelProps {
  activeView: ViewMode
  selectedHabitat: HabitatEntry | null
  selectedPokemon: PokemonEntry | null
  onSelectHabitat: (id: number) => void
  onSelectPokemon: (id: number) => void
}

export function DetailPanel({
  activeView,
  onSelectHabitat,
  onSelectPokemon,
  selectedHabitat,
  selectedPokemon,
}: DetailPanelProps) {
  if (activeView === 'pokemon') {
    if (!selectedPokemon) {
      return (
        <aside className="detail-panel" data-detail-panel>
          <p className="detail-panel__eyebrow">Selection</p>
          <h2>Choose a Pokemon to inspect its habitat recipe</h2>
          <p className="detail-panel__lead">
            Each card shows specialties, timing, and the habitats linked from the source sheet.
          </p>
        </aside>
      )
    }

    const habitats = getHabitatsForPokemon(selectedPokemon)

    return (
      <aside className="detail-panel" data-detail-panel>
        <p className="detail-panel__eyebrow">{formatPokemonId(selectedPokemon.id)}</p>
        <div className="detail-panel__hero" style={getSurfaceStyle(getSpecialtyVisual(selectedPokemon.specialties[0] ?? ''))}>
          <PokemonArtwork entry={selectedPokemon} size="detail" />
          <div className="detail-panel__headline">
            <h2>{selectedPokemon.name}</h2>
            <p className="detail-panel__lead">
              {selectedPokemon.idealHabitat
                ? `${selectedPokemon.idealHabitat} spaces suit this Pokemon best.`
                : 'No ideal habitat is listed yet.'}
            </p>

            {selectedPokemon.idealHabitat ? (
              <Badge
                compact
                icon={getHabitatVisual(selectedPokemon.idealHabitat).icon}
                style={getBadgeStyle(getHabitatVisual(selectedPokemon.idealHabitat))}
              >
                {selectedPokemon.idealHabitat} affinity
              </Badge>
            ) : null}
          </div>
        </div>

        <section className="detail-section">
          <h3>Specialties</h3>
          <div className="badge-group">
            {selectedPokemon.specialties.map((specialty) => (
              <Badge
                icon={getSpecialtyVisual(specialty).icon}
                key={specialty}
                style={getBadgeStyle(getSpecialtyVisual(specialty))}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h3>Favourite cues</h3>
          <div className="badge-group">
            {selectedPokemon.favorites.length ? (
              selectedPokemon.favorites.map((favorite) => (
                <Badge key={favorite} tone="leaf">
                  {favorite}
                </Badge>
              ))
            ) : (
              <Badge tone="stone">No favourites listed</Badge>
            )}
          </div>
        </section>

        <section className="detail-section detail-section--split">
            <div>
              <h3>Time windows</h3>
              <div className="badge-group">
                {selectedPokemon.timeOfDay.length ? (
                  selectedPokemon.timeOfDay.map((time) => (
                    <Badge key={time} icon={time} tone="sun">
                      {labelForTime(time)}
                    </Badge>
                  ))
                ) : (
                <Badge tone="stone">Any time</Badge>
              )}
            </div>
          </div>

            <div>
              <h3>Weather</h3>
              <div className="badge-group">
                {selectedPokemon.weather.length ? (
                  selectedPokemon.weather.map((weather) => (
                    <Badge key={weather} icon={weather} tone="wave">
                      {labelForWeather(weather)}
                    </Badge>
                  ))
                ) : (
                <Badge tone="stone">Any weather</Badge>
              )}
            </div>
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-section__header">
            <h3>Linked habitats</h3>
            <span>{habitats.length}</span>
          </div>
          <div className="detail-list">
            {habitats.length ? (
              habitats.map((habitat) => (
                <button className="detail-list__item" key={habitat.id} onClick={() => onSelectHabitat(habitat.id)} type="button">
                  <strong>{habitat.name}</strong>
                  <span>{habitat.area ?? 'Area unknown'}</span>
                  <small>{habitat.details}</small>
                </button>
              ))
            ) : (
              <div className="detail-list__empty">No habitat links were provided in the sheet.</div>
            )}
          </div>
        </section>
      </aside>
    )
  }

  if (!selectedHabitat) {
    return (
      <aside className="detail-panel" data-detail-panel>
        <p className="detail-panel__eyebrow">Selection</p>
        <h2>Choose a habitat to inspect its setup and residents</h2>
        <p className="detail-panel__lead">
          Habitat cards summarize area placement, setup recipe, and the Pokemon that reference them.
        </p>
      </aside>
    )
  }

  const linkedPokemon = getPokemonForHabitat(selectedHabitat)

  return (
    <aside className="detail-panel" data-detail-panel>
      <p className="detail-panel__eyebrow">Habitat #{selectedHabitat.id}</p>
      <div className="detail-panel__hero detail-panel__hero--habitat">
        <div className="habitat-card__crest habitat-card__crest--detail" aria-hidden="true">
          <span>{(selectedHabitat.area ?? '??').slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="detail-panel__headline">
          <h2>{selectedHabitat.name}</h2>
          <p className="detail-panel__lead">{selectedHabitat.details}</p>
        </div>
      </div>

      <section className="detail-section">
        <h3>Area</h3>
        <div className="badge-group">
          <Badge tone="wave">{selectedHabitat.area ?? 'Area unknown'}</Badge>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section__header">
          <h3>Setup recipe</h3>
          <span>{selectedHabitat.setup.length}</span>
        </div>
        <ul className="detail-checklist">
          {selectedHabitat.setup.length ? (
            selectedHabitat.setup.map((item) => <li key={item}>{item}</li>)
          ) : (
            <li>Setup notes have not been filled in yet.</li>
          )}
        </ul>
      </section>

      <section className="detail-section">
        <div className="detail-section__header">
          <h3>Matching Pokemon</h3>
          <span>{linkedPokemon.length}</span>
        </div>
        <div className="detail-list">
          {linkedPokemon.length ? (
            linkedPokemon.map((pokemon) => (
              <button className="detail-list__item" key={pokemon.id} onClick={() => onSelectPokemon(pokemon.id)} type="button">
                <div className="detail-list__pokemon">
                  <PokemonArtwork entry={pokemon} size="mini" />
                  <div>
                    <strong>{pokemon.name}</strong>
                    <span>{pokemon.specialties.join(', ') || 'No specialties listed'}</span>
                    <small>{pokemon.idealHabitat ?? 'No ideal habitat listed'}</small>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="detail-list__empty">No linked Pokemon reference this habitat yet.</div>
          )}
        </div>
      </section>
    </aside>
  )
}
