import { describe, expect, it } from 'vitest'
import { habitatEntries, pokemonEntries } from '../data/pokopia'
import { ALL_FILTER, formatPokemonId, matchesHabitatFilters, matchesPokemonFilters } from './filters'

describe('matchesPokemonFilters', () => {
  it('matches specialty and related habitat text', () => {
    const charmander = pokemonEntries.find((entry) => entry.name === 'Charmander')

    expect(charmander).toBeDefined()
    expect(
      matchesPokemonFilters(
        charmander!,
        {
          specialty: 'Burn',
          idealHabitat: ALL_FILTER,
          time: ALL_FILTER,
          weather: ALL_FILTER,
          favorite: ALL_FILTER,
        },
        'Tall grass',
      ),
    ).toBe(true)
  })
})

describe('matchesHabitatFilters', () => {
  it('matches area and linked pokemon text', () => {
    const tallGrass = habitatEntries.find((entry) => entry.id === 1)

    expect(tallGrass).toBeDefined()
    expect(
      matchesHabitatFilters(
        tallGrass!,
        {
          area: 'Withered Wasteland',
        },
        'Charmander',
      ),
    ).toBe(true)
  })
})

describe('formatPokemonId', () => {
  it('renders padded pokedex numbers', () => {
    expect(formatPokemonId(7)).toBe('#007')
  })
})
