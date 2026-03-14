import rawData from './pokopia-data.json'
import type { HabitatEntry, PokopiaData, PokemonEntry } from '../types'

export const pokopiaData = rawData as PokopiaData

export const pokemonEntries = pokopiaData.pokemon
export const habitatEntries = pokopiaData.habitats

export const pokemonById = new Map<number, PokemonEntry>(pokemonEntries.map((entry) => [entry.id, entry]))
export const pokemonBySlug = new Map<string, PokemonEntry>(pokemonEntries.map((entry) => [entry.slug, entry]))

export const habitatById = new Map<number, HabitatEntry>(habitatEntries.map((entry) => [entry.id, entry]))
export const habitatBySlug = new Map<string, HabitatEntry>(habitatEntries.map((entry) => [entry.slug, entry]))

const uniqueValues = (values: string[]) => [...new Set(values)].sort((left, right) => left.localeCompare(right))

export const specialtyOptions = uniqueValues(pokemonEntries.flatMap((entry) => entry.specialties))
export const idealHabitatOptions = uniqueValues(
  pokemonEntries.flatMap((entry) => (entry.idealHabitat ? [entry.idealHabitat] : [])),
)
export const favoriteOptions = uniqueValues(pokemonEntries.flatMap((entry) => entry.favorites))
export const areaOptions = uniqueValues(habitatEntries.flatMap((entry) => (entry.area ? [entry.area] : [])))

export const timeOptions = ['🌅', '☀️', '🌄', '🌙']
export const weatherOptions = ['☀️', '☁️', '🌧️']

export function getHabitatsForPokemon(entry: PokemonEntry) {
  return entry.habitatIds
    .map((habitatId) => habitatById.get(habitatId))
    .filter((habitat): habitat is HabitatEntry => Boolean(habitat))
}

export function getPokemonForHabitat(entry: HabitatEntry) {
  return pokemonEntries.filter((pokemon) => pokemon.habitatIds.includes(entry.id))
}
