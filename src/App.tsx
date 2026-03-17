import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { FilterSelect } from './components/FilterSelect'
import { DetailPanel } from './components/DetailPanel'
import { HabitatCard } from './components/HabitatCard'
import { PokemonCard } from './components/PokemonCard'
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

function countActivePokemonFilters(filters: PokemonFilters) {
  return (
    Number(filters.specialty !== ALL_FILTER) +
    Number(filters.idealHabitat !== ALL_FILTER) +
    Number(filters.time !== ALL_FILTER) +
    Number(filters.weather !== ALL_FILTER) +
    Number(filters.favorite !== ALL_FILTER)
  )
}

function countActiveHabitatFilters(filters: HabitatFilters) {
  return Number(filters.area !== ALL_FILTER)
}

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
  const [filtersOpen, setFiltersOpen] = useState(false)

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
      setFiltersOpen(false)
    })
  }

  const resultLabel =
    activeView === 'pokemon'
      ? `${filteredPokemon.length} Pokemon`
      : `${filteredHabitats.length} habitats`

  const activeFilterCount =
    activeView === 'pokemon' ? countActivePokemonFilters(pokemonFilters) : countActiveHabitatFilters(habitatFilters)
  const hasActiveRefinements = activeFilterCount > 0 || searchQuery.trim().length > 0
  const refinementStatusLabel = activeFilterCount
    ? `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}${searchQuery.trim() ? ' plus search' : ''}`
    : searchQuery.trim()
      ? 'Search active'
      : 'Search stays visible; refinements stay secondary.'

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__utility">
          <p className="eyebrow">Pokopia field guide</p>
          <div className="hero__meta" aria-label="Guide summary">
            <span>{pokemonEntries.length} Pokemon</span>
            <span>{habitatEntries.length} habitats</span>
            <span>Updated {formatDateLabel(pokopiaData.updatedAt)}</span>
          </div>
        </div>

        <div className="hero__headline">
          <div>
            <h1>Pocket lookup for Pokopia</h1>
            <p className="hero__lead">
              Search by name, skill, habitat, or favourite cue without digging through raw data files.
            </p>
          </div>

          <div className="hero__aside">
            <p className="hero__hint">Built for fast in-session comparison, with the data stored directly in this repo.</p>
          </div>
        </div>
      </header>

      <main className="workspace">
        <div className="workspace__content">
          <section className="results-panel">
            <div className="results-toolbar">
              <div className="results-toolbar__top">
                <div className="view-switch" role="tablist" aria-label="Browse mode">
                  <button
                    aria-selected={activeView === 'pokemon'}
                    className={activeView === 'pokemon' ? 'is-active' : ''}
                    onClick={() => setActiveView('pokemon')}
                    role="tab"
                    type="button"
                  >
                    Pokedex
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

                <div className="results-toolbar__actions">
                  <button className="results-toolbar__toggle" onClick={() => setFiltersOpen((current) => !current)} type="button">
                    {filtersOpen ? 'Hide refinements' : 'Refine results'}
                    {activeFilterCount ? <span>{activeFilterCount}</span> : null}
                  </button>

                  {hasActiveRefinements ? (
                    <button className="results-toolbar__reset" onClick={resetFilters} type="button">
                      Clear search and filters
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="results-toolbar__search">
                <label htmlFor="search-query">{activeView === 'pokemon' ? 'Find a Pokemon' : 'Find a habitat'}</label>
                <input
                  id="search-query"
                  onChange={(event) => {
                    const nextValue = event.target.value
                    startTransition(() => setSearchQuery(nextValue))
                  }}
                  placeholder={
                    activeView === 'pokemon'
                      ? 'Bulbasaur, Grow, Bright, rainy, Pretty flowers...'
                      : 'Tall grass, Bleak Beach, plated food, Pikachu...'
                  }
                  type="search"
                  value={searchQuery}
                />
              </div>

              {filtersOpen ? (
                <div className="results-toolbar__filters">
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
                        label="Favourite cue"
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
              ) : null}
            </div>

            <div className="results-panel__header">
              <div>
                <p className="eyebrow">{activeView === 'pokemon' ? 'Pokemon index' : 'Habitat index'}</p>
                <h2>
                  {activeView === 'pokemon'
                    ? 'Compare Pokemon fast'
                    : 'Scan habitat recipes fast'}
                </h2>
                <p className="results-panel__lead">
                  {activeView === 'pokemon'
                    ? 'Cards surface the skill set, habitat links, and favourite cues first.'
                    : 'Cards keep the recipe, area, and linked residents visible at a glance.'}
                </p>
              </div>

              <div className="results-panel__summary">
                <strong>Showing {resultLabel}</strong>
                <p>{refinementStatusLabel}</p>
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
