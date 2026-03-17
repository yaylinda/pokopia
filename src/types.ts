export type ViewMode = 'pokemon' | 'habitats'

export interface PokemonEntry {
  id: number
  slug: string
  name: string
  specialties: string[]
  idealHabitat: string | null
  favorites: string[]
  habitatIds: number[]
  timeOfDay: string[]
  weather: string[]
}

export interface HabitatEntry {
  id: number
  slug: string
  name: string
  area: string | null
  details: string
  setup: string[]
}

export interface PokopiaData {
  updatedAt: string
  pokemon: PokemonEntry[]
  habitats: HabitatEntry[]
}

export interface PokemonFilters {
  specialty: string
  idealHabitat: string
  time: string
  weather: string
  favorite: string
}

export interface HabitatFilters {
  area: string
}
