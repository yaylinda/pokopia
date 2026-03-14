import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { FilterSelect } from './components/FilterSelect'
import { DetailPanel } from './components/DetailPanel'
import { HabitatCard } from './components/HabitatCard'
import { PokemonCard } from './components/PokemonCard'
import { Badge } from './components/Badge'
import { StatTile } from './components/StatTile'
import {
  areaOptions,
  favoriteOptions,
  habitatById,
  habitatBySlug,
  habitatEntries,
  idealHabitatOptions,
  pokopiaData,
  pokemonById,
  pokemonBySlug,
  pokemonEntries,
  specialtyOptions,
  timeOptions,
  weatherOptions,
} from './data/pokopia'
import { ALL_FILTER, formatDateLabel, matchesHabitatFilters, matchesPokemonFilters } from './lib/filters'
import type { HabitatFilters, PokemonFilters, ViewMode } from './types'

const defaultPokemonFilters: PokemonFilters = {
  specialty: ALL_FILTER,
  idealHabitat: ALL_FILTER,
  time: ALL_FILTER,
  weather: ALL_FILTER,
  favorite: ALL_FILTER,
}

const defaultHabitatFilters: HabitatFilters = {
  area: ALL_FILTER,
}

const specialtyLeader = specialtyOptions
  .map((specialty) => ({
    specialty,
    count: pokemonEntries.filter((entry) => entry.specialties.includes(specialty)).length,
  }))
  .sort((left, right) => right.count - left.count)[0]

const areaLeader = areaOptions
  .map((area) => ({
    area,
    count: habitatEntries.filter((entry) => entry.area === area).length,
  }))
  .sort((left, right) => right.count - left.count)[0]

const multiHabitatPokemonCount = pokemonEntries.filter((entry) => entry.habitatIds.length > 1).length

function getInitialView() {
  const params = new URLSearchParams(window.location.search)
  return params.get('view') === 'habitats' ? 'habitats' : 'pokemon'
}

function getInitialSearch() {
  const params = new URLSearchParams(window.location.search)
  return params.get('q') ?? ''
}

function getInitialPokemonId() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('pokemon')

  if (!slug) {
    return pokemonEntries[0]?.id ?? null
  }

  return pokemonBySlug.get(slug)?.id ?? pokemonEntries[0]?.id ?? null
}

function getInitialHabitatId() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('habitat')

  if (!slug) {
    return habitatEntries[0]?.id ?? null
  }

  const bySlug = habitatBySlug.get(slug)?.id

  if (bySlug) {
    return bySlug
  }

  const parsedId = Number.parseInt(slug, 10)
  return habitatById.get(parsedId)?.id ?? habitatEntries[0]?.id ?? null
}

function scrollToDetailPanel() {
  if (!window.matchMedia('(max-width: 960px)').matches) {
    return
  }

  window.requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('[data-detail-panel]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}

function resolveSelection<T extends { id: number }>(selectedId: number | null, entries: T[]) {
  if (!entries.length) {
    return null
  }

  if (selectedId && entries.some((entry) => entry.id === selectedId)) {
    return selectedId
  }

  return entries[0].id
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>(getInitialView)
  const [searchQuery, setSearchQuery] = useState(getInitialSearch)
  const [pokemonFilters, setPokemonFilters] = useState(defaultPokemonFilters)
  const [habitatFilters, setHabitatFilters] = useState(defaultHabitatFilters)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(getInitialPokemonId)
  const [selectedHabitatId, setSelectedHabitatId] = useState<number | null>(getInitialHabitatId)

  const deferredQuery = useDeferredValue(searchQuery)

  const filteredPokemon = pokemonEntries.filter((entry) => matchesPokemonFilters(entry, pokemonFilters, deferredQuery))
  const filteredHabitats = habitatEntries.filter((entry) => matchesHabitatFilters(entry, habitatFilters, deferredQuery))

  const resolvedPokemonId = resolveSelection(selectedPokemonId, filteredPokemon)
  const resolvedHabitatId = resolveSelection(selectedHabitatId, filteredHabitats)

  const selectedPokemon = resolvedPokemonId ? pokemonById.get(resolvedPokemonId) ?? null : null
  const selectedHabitat = resolvedHabitatId ? habitatById.get(resolvedHabitatId) ?? null : null

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    params.set('view', activeView)

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    } else {
      params.delete('q')
    }

    if (selectedPokemon) {
      params.set('pokemon', selectedPokemon.slug)
    } else {
      params.delete('pokemon')
    }

    if (selectedHabitat) {
      params.set('habitat', selectedHabitat.slug)
    } else {
      params.delete('habitat')
    }

    const nextSearch = params.toString()
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`

    window.history.replaceState(null, '', nextUrl)
  }, [activeView, searchQuery, selectedHabitat, selectedPokemon])

  function selectPokemon(id: number) {
    startTransition(() => {
      setActiveView('pokemon')
      setSelectedPokemonId(id)
    })

    scrollToDetailPanel()
  }

  function selectHabitat(id: number) {
    startTransition(() => {
      setActiveView('habitats')
      setSelectedHabitatId(id)
    })

    scrollToDetailPanel()
  }

  function resetFilters() {
    startTransition(() => {
      setSearchQuery('')
      setPokemonFilters(defaultPokemonFilters)
      setHabitatFilters(defaultHabitatFilters)
    })
  }

  const resultLabel =
    activeView === 'pokemon'
      ? `${filteredPokemon.length} Pokemon`
      : `${filteredHabitats.length} habitats`

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Pokopia Field Guide</p>
          <h1>A polished reference app for finding the right Pokemon and habitat recipes fast.</h1>
          <p className="hero__lead">
            Built from the public Pokopia spreadsheet as a static, GitHub Pages-ready guide with cross-linked discovery between
            Pokemon, habitat builds, weather windows, and favorite cues.
          </p>

          <div className="hero__actions">
            <Badge onClick={() => selectPokemon(1)} tone="sun">
              Start with the Pokédex
            </Badge>
            <Badge onClick={() => selectHabitat(1)} tone="wave">
              Browse habitat recipes
            </Badge>
            <Badge
              onClick={() => {
                startTransition(() => {
                  setActiveView('pokemon')
                  setPokemonFilters((current) => ({ ...current, time: '🌙' }))
                })
              }}
              tone="night"
            >
              Spotlight night Pokemon
            </Badge>
          </div>
        </div>

        <div className="hero__stats">
          <div className="hero__stat-grid">
            <StatTile caption="Sheet-backed entries" label="Pokemon" value={pokemonEntries.length.toString()} />
            <StatTile caption="Buildable habitat recipes" label="Habitats" value={habitatEntries.length.toString()} />
            <StatTile
              caption="Pokemon mapped to multiple habitats"
              label="Multi-habitat"
              value={multiHabitatPokemonCount.toString()}
            />
            <StatTile caption="Last local sync" label="Updated" value={formatDateLabel(pokopiaData.generatedAt)} />
          </div>

          <div className="hero__insights">
            <article>
              <p>Most common specialty</p>
              <strong>{specialtyLeader ? `${specialtyLeader.specialty} (${specialtyLeader.count})` : 'Unknown'}</strong>
            </article>
            <article>
              <p>Largest habitat region</p>
              <strong>{areaLeader ? `${areaLeader.area} (${areaLeader.count})` : 'Unknown'}</strong>
            </article>
            <article>
              <p>Source of truth</p>
              <strong>
                <a href="https://docs.google.com/spreadsheets/u/0/d/1OqpRuZyPQpYg5nYvku9JwQMxjMFzhc1ER5Bqbt1tnvA/htmlview?pli=1#gid=0">
                  Google Sheet
                </a>
              </strong>
            </article>
          </div>
        </div>
      </header>

      <main className="workspace">
        <section className="control-panel">
          <div className="view-switch" role="tablist" aria-label="Browse mode">
            <button
              aria-selected={activeView === 'pokemon'}
              className={activeView === 'pokemon' ? 'is-active' : ''}
              onClick={() => setActiveView('pokemon')}
              role="tab"
              type="button"
            >
              Pokemon
            </button>
            <button
              aria-selected={activeView === 'habitats'}
              className={activeView === 'habitats' ? 'is-active' : ''}
              onClick={() => setActiveView('habitats')}
              role="tab"
              type="button"
            >
              Habitat Dex
            </button>
          </div>

          <div className="control-panel__search">
            <label htmlFor="search-query">Search the guide</label>
            <input
              id="search-query"
              onChange={(event) => {
                const nextValue = event.target.value
                startTransition(() => setSearchQuery(nextValue))
              }}
              placeholder={
                activeView === 'pokemon'
                  ? 'Try Bulbasaur, Grow, Bright, rainy, Pretty flowers...'
                  : 'Try Tall grass, Bleak Beach, plated food, Pikachu...'
              }
              type="search"
              value={searchQuery}
            />
          </div>

          <div className="control-panel__filters">
            {activeView === 'pokemon' ? (
              <>
                <FilterSelect
                  label="Specialty"
                  onChange={(value) => setPokemonFilters((current) => ({ ...current, specialty: value }))}
                  options={[ALL_FILTER, ...specialtyOptions]}
                  value={pokemonFilters.specialty}
                />
                <FilterSelect
                  label="Ideal habitat"
                  onChange={(value) => setPokemonFilters((current) => ({ ...current, idealHabitat: value }))}
                  options={[ALL_FILTER, ...idealHabitatOptions]}
                  value={pokemonFilters.idealHabitat}
                />
                <FilterSelect
                  label="Time"
                  onChange={(value) => setPokemonFilters((current) => ({ ...current, time: value }))}
                  options={[ALL_FILTER, ...timeOptions]}
                  value={pokemonFilters.time}
                />
                <FilterSelect
                  label="Weather"
                  onChange={(value) => setPokemonFilters((current) => ({ ...current, weather: value }))}
                  options={[ALL_FILTER, ...weatherOptions]}
                  value={pokemonFilters.weather}
                />
                <FilterSelect
                  label="Favourite"
                  onChange={(value) => setPokemonFilters((current) => ({ ...current, favorite: value }))}
                  options={[ALL_FILTER, ...favoriteOptions]}
                  value={pokemonFilters.favorite}
                />
              </>
            ) : (
              <FilterSelect
                label="Area"
                onChange={(value) => setHabitatFilters((current) => ({ ...current, area: value }))}
                options={[ALL_FILTER, ...areaOptions]}
                value={habitatFilters.area}
              />
            )}
          </div>

          <div className="control-panel__footer">
            <strong>{resultLabel}</strong>
            <button onClick={resetFilters} type="button">
              Reset filters
            </button>
          </div>
        </section>

        <div className="workspace__content">
          <section className="results-panel">
            <div className="results-panel__header">
              <div>
                <p className="eyebrow">{activeView === 'pokemon' ? 'Browse Pokemon' : 'Browse habitats'}</p>
                <h2>
                  {activeView === 'pokemon'
                    ? 'Cross-reference specialties, timing, and favorite cues.'
                    : 'Inspect area recipes and which Pokemon they support.'}
                </h2>
              </div>
            </div>

            <div className="results-grid">
              {activeView === 'pokemon' ? (
                filteredPokemon.length ? (
                  filteredPokemon.map((entry) => (
                    <PokemonCard
                      entry={entry}
                      isSelected={entry.id === resolvedPokemonId}
                      key={entry.id}
                      onSelect={selectPokemon}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <h3>No Pokemon match the current filters.</h3>
                    <p>Clear a few constraints or broaden the search terms to explore more possibilities.</p>
                  </div>
                )
              ) : filteredHabitats.length ? (
                filteredHabitats.map((entry) => (
                  <HabitatCard
                    entry={entry}
                    isSelected={entry.id === resolvedHabitatId}
                    key={entry.id}
                    onSelect={selectHabitat}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No habitats match the current filters.</h3>
                  <p>Try a different area or search by a required item, setup note, or Pokemon name.</p>
                </div>
              )}
            </div>
          </section>

          <DetailPanel
            activeView={activeView}
            onSelectHabitat={selectHabitat}
            onSelectPokemon={selectPokemon}
            selectedHabitat={selectedHabitat}
            selectedPokemon={selectedPokemon}
          />
        </div>
      </main>
    </div>
  )
}
