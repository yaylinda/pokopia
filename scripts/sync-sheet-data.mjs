import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { csvParseRows } from 'd3-dsv'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SHEET_ID = '1OqpRuZyPQpYg5nYvku9JwQMxjMFzhc1ER5Bqbt1tnvA'
const POKEDEX_GID = '0'
const HABITAT_GID = '92048572'

const POKEDEX_URL = `https://docs.google.com/spreadsheets/u/0/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${POKEDEX_GID}`
const HABITAT_URL = `https://docs.google.com/spreadsheets/u/0/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${HABITAT_GID}`
const OUTPUT_PATH = resolve(__dirname, '../src/data/pokopia-data.json')

const normalizeText = (value) => value.trim().replace(/\s+/g, ' ')

const splitCommaList = (value) =>
  normalizeText(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item && item.toLowerCase() !== 'none')

const splitNumberList = (value) =>
  splitCommaList(value)
    .map((item) => Number.parseInt(item, 10))
    .filter(Number.isFinite)

const slugify = (value) =>
  normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function fetchRows(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  const text = await response.text()
  return csvParseRows(text)
}

function parsePokemon(rows) {
  return rows
    .slice(1)
    .map((columns) => {
      const id = Number.parseInt(columns[0] ?? '', 10)
      const name = normalizeText(columns[1] ?? '')

      if (!Number.isFinite(id) || !name) {
        return null
      }

      const favorites = columns.slice(4, 9).map(normalizeText).filter((value) => value && value.toLowerCase() !== 'none')

      return {
        id,
        slug: slugify(name),
        name,
        specialties: splitCommaList(columns[2] ?? ''),
        idealHabitat: normalizeText(columns[3] ?? '') || null,
        favorites,
        habitatIds: splitNumberList(columns[10] ?? ''),
        timeOfDay: splitCommaList(columns[11] ?? ''),
        weather: splitCommaList(columns[12] ?? ''),
      }
    })
    .filter(Boolean)
}

function parseHabitats(rows) {
  return rows
    .slice(1)
    .map((columns) => {
      const id = Number.parseInt(columns[0] ?? '', 10)
      const name = normalizeText(columns[1] ?? '')

      if (!Number.isFinite(id) || !name) {
        return null
      }

      const details = normalizeText(columns[3] ?? '')

      return {
        id,
        slug: slugify(`${id}-${name}`),
        name,
        area: normalizeText(columns[2] ?? '') || null,
        details,
        setup: splitCommaList(details),
      }
    })
    .filter(Boolean)
}

async function main() {
  const [pokedexRows, habitatRows] = await Promise.all([fetchRows(POKEDEX_URL), fetchRows(HABITAT_URL)])

  const data = {
    generatedAt: new Date().toISOString(),
    source: {
      sheetId: SHEET_ID,
      pokedexUrl: POKEDEX_URL,
      habitatsUrl: HABITAT_URL,
    },
    pokemon: parsePokemon(pokedexRows),
    habitats: parseHabitats(habitatRows),
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`)

  console.log(`Wrote ${data.pokemon.length} Pokemon and ${data.habitats.length} habitats to ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
