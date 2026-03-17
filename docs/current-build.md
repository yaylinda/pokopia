# Current Build

This document describes the current implementation of the Pokopia Field Guide as it exists in the repository today. It is meant to help future contributors understand what has already been shipped, how the app is structured, and where the next changes should go.

## Product scope

The app is a static reference site for the Nintendo Switch game Pokopia. Its job is to turn the repo's curated dataset into a faster browsing experience than raw tables.

The current release focuses on two connected surfaces:

- `Pokemon`: browse the Pokédex by name, specialty, ideal habitat, favorites, time of day, and weather.
- `Habitat Dex`: browse habitat recipes by area and inspect which Pokemon link back to each habitat.

The app is intentionally read-only. There is no backend, user auth, or write path.

## User experience

The current UX is optimized around quick lookup and cross-reference rather than encyclopedic article pages.

- The hero section summarizes dataset size and freshness.
- The main workspace lets the user switch between `Pokemon` and `Habitat Dex`.
- Search is shared across both views and is contextual to the active surface.
- Filters are surface-specific:
  - Pokemon view exposes specialty, ideal habitat, time, weather, and favorite filters.
  - Habitat view exposes area filtering.
- Selecting a card opens a sticky detail panel on desktop and scroll-targeted detail view on mobile.
- Deep-linkable URL state preserves the active view, search query, and selected entity.

## Data model

The source of truth is the committed JSON file at `src/data/pokopia-data.json`.

- Pokemon and habitat records live directly in the repo.
- Contributors update the dataset in place when new information is confirmed.
- Pokemon `id` values are canonical National Dex numbers and double as the local sprite key.
- The app imports that JSON directly for static hosting.

This keeps GitHub Pages deployment simple and avoids relying on live external data sources in the browser.

## Runtime architecture

The app is a single React entrypoint with local module boundaries rather than a router-heavy multipage setup.

### Core files

- `src/App.tsx`
  - Owns top-level UI composition.
  - Manages active view, shared search query, filter state, and selected entity state.
  - Syncs selection state into URL query parameters for shareable links.
- `src/data/pokopia.ts`
  - Loads the committed JSON dataset.
  - Builds lookup maps and filter option lists.
  - Exposes helper functions for Pokemon-to-habitat and habitat-to-Pokemon relationships.
- `src/lib/filters.ts`
  - Houses filter predicates and formatting helpers.
  - Search is implemented as case-insensitive substring matching over normalized text.
- `src/components/*`
  - `PokemonCard.tsx` and `HabitatCard.tsx` render browse cards.
  - `DetailPanel.tsx` renders the focused entity view and cross-links between surfaces.
  - `Badge.tsx` and `FilterSelect.tsx` provide reusable UI primitives.
- `src/index.css`
  - Contains the visual system, layout rules, and responsive behavior.

### State model

The app keeps only a small amount of UI state:

- `activeView`
- `searchQuery`
- `pokemonFilters`
- `habitatFilters`
- `selectedPokemonId`
- `selectedHabitatId`

The selected entity is resolved against the current filtered list. That means:

- If the current selection still exists after filtering, it remains selected.
- If it no longer exists, the first matching result becomes the effective selection.
- If no results remain, the detail panel falls back to an empty state.

### URL behavior

The current implementation stores these values in the query string:

- `view`
- `q`
- `pokemon`
- `habitat`

This allows users to share links to a specific browsing mode and selection without adding full routing complexity.

## Search and filtering behavior

Search is not a fuzzy search engine. It is straightforward substring matching over a composed text payload.

### Pokemon search includes

- Pokemon id and name
- specialties
- ideal habitat
- favorites
- time and weather tokens
- linked habitat names, areas, and details

### Habitat search includes

- habitat id and name
- area
- habitat details
- setup items
- linked Pokemon names, specialties, and ideal habitats

This gives the user cross-surface discovery without introducing a dedicated indexing layer.

## Visual design direction

The current build intentionally avoids a generic admin-table look.

- Typography uses `Fraunces` for headlines and `Space Grotesk` for UI and body copy.
- The palette is warm and terrain-inspired, with leaf, ember, wave, and night accent tones.
- The layout behaves like a field guide with cards, badges, and a persistent inspection panel.
- Mobile behavior prioritizes stacked sections and smooth scroll-to-detail when a card is selected.

## Hosting and delivery

The app is designed to be hosted as a static site on GitHub Pages.

- Vite `base` is set to `/pokopia/` in production.
- `build` performs TypeScript project build plus Vite bundling.
- CI runs `lint`, `test`, and `build`.
- Deployment publishes the `dist` directory to GitHub Pages.

Relevant files:

- `vite.config.ts`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

## Testing and verification

The current automated test coverage is intentionally light and focused on the most important pure logic:

- `src/lib/filters.test.ts`
  - validates Pokemon filtering behavior
  - validates habitat filtering behavior
  - validates Pokédex id formatting

Local verification commands:

```bash
npm run lint
npm run test
npm run build
```

## Known limitations

These are current constraints, not necessarily bugs:

- Data freshness is manual. The committed dataset changes only when someone edits `src/data/pokopia-data.json` and commits it.
- The app has no dedicated client-side router beyond query string state.
- Search is substring-based, not ranked or typo-tolerant.
- There are no screenshots or visual regression checks in the repo.
- The Pages workflow currently depends on GitHub's official Pages actions, which still emit an upstream Node.js 20 deprecation warning as of March 14, 2026.

## Good next steps

If someone extends the app, the most sensible next investments are:

1. Add stronger automated coverage for URL-state behavior and cross-link navigation.
2. Add a lightweight screenshot-based UI test for the major surfaces.
3. Introduce richer docs around content maintenance if non-engineers will update the committed dataset regularly.
4. Consider extracting a dedicated query-state hook if the top-level UI state grows.
