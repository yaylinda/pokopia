import { getHabitatsForPokemon, getPokemonForHabitat } from '../data/pokopia'
import type { HabitatEntry, HabitatFilters, PokemonEntry, PokemonFilters } from '../types'

export const ALL_FILTER = 'All'

const normalizeQuery = (value: string) => value.trim().toLowerCase()

export function formatPokemonId(id: number) {
  return `#${id.toString().padStart(3, '0')}`
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function labelForTime(token: string) {
  switch (token) {
    case '🌅':
      return 'Dawn'
    case '☀️':
      return 'Day'
    case '🌄':
      return 'Dusk'
    case '🌙':
      return 'Night'
    default:
      return token
  }
}

export function labelForWeather(token: string) {
  switch (token) {
    case '☀️':
      return 'Sunny'
    case '☁️':
      return 'Cloudy'
    case '🌧️':
      return 'Rainy'
    default:
      return token
  }
}

export function matchesPokemonFilters(entry: PokemonEntry, filters: PokemonFilters, query: string) {
  if (filters.specialty !== ALL_FILTER && !entry.specialties.includes(filters.specialty)) {
    return false
  }

  if (filters.idealHabitat !== ALL_FILTER && entry.idealHabitat !== filters.idealHabitat) {
    return false
  }

  if (filters.time !== ALL_FILTER && !entry.timeOfDay.includes(filters.time)) {
    return false
  }

  if (filters.weather !== ALL_FILTER && !entry.weather.includes(filters.weather)) {
    return false
  }

  if (filters.favorite !== ALL_FILTER && !entry.favorites.includes(filters.favorite)) {
    return false
  }

  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return true
  }

  const relatedHabitatText = getHabitatsForPokemon(entry)
    .flatMap((habitat) => [habitat.name, habitat.area ?? '', habitat.details])
    .join(' ')

  const haystack = [
    entry.id.toString(),
    entry.name,
    entry.specialties.join(' '),
    entry.idealHabitat ?? '',
    entry.favorites.join(' '),
    entry.timeOfDay.join(' '),
    entry.weather.join(' '),
    relatedHabitatText,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalizedQuery)
}

export function matchesHabitatFilters(entry: HabitatEntry, filters: HabitatFilters, query: string) {
  if (filters.area !== ALL_FILTER && entry.area !== filters.area) {
    return false
  }

  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return true
  }

  const relatedPokemonText = getPokemonForHabitat(entry)
    .flatMap((pokemon) => [pokemon.name, pokemon.specialties.join(' '), pokemon.idealHabitat ?? ''])
    .join(' ')

  const haystack = [
    entry.id.toString(),
    entry.name,
    entry.area ?? '',
    entry.details,
    entry.setup.join(' '),
    relatedPokemonText,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalizedQuery)
}
