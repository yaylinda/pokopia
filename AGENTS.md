# AGENTS

Pokopia is a static React + TypeScript field guide for the Nintendo Switch game Pokopia. It turns a shared Google Sheet into a searchable reference app for Pokemon entries and habitat recipes, then ships the result as a GitHub Pages site.

## Key directories

- `src/`: app entrypoint, UI components, styling, shared types, and generated data access.
- `src/components/`: browse cards, detail panel, filter controls, badges, and stat tiles.
- `src/data/`: normalized dataset and data helpers consumed by the app.
- `src/lib/`: pure filtering and formatting logic with Vitest coverage.
- `scripts/`: maintenance scripts, including the sheet-to-JSON sync.
- `scripts/claudia/`: Claudia metadata files for repo-scoped task definitions and progress tracking.
- `docs/`: contributor-facing implementation notes for the current build.
- `.github/workflows/`: CI and GitHub Pages deployment automation.

## Run and verify

```bash
npm install
npm run sync:data
npm run dev
```

```bash
npm run lint
npm run test
npm run build
```

## Conventions

- Treat `src/data/pokopia-data.json` as generated output; refresh it with `npm run sync:data` instead of editing it by hand.
- Keep the app static-hosting friendly: no runtime sheet fetches, no backend assumptions, and no features that require server state.
- Preserve the two-surface UX split between `Pokemon` and `Habitat Dex` unless the product direction clearly changes.
- Follow the existing module split: `src/App.tsx` owns high-level state, while `src/components/` and `src/lib/` stay focused and reusable.
- Treat `scripts/claudia/prd.json` and `scripts/claudia/progress.txt` as agent metadata; update them deliberately and keep workflows ignoring that path.

## Do not modify casually

- `scripts/sync-sheet-data.mjs` and `src/data/pokopia-data.json` together define the data ingestion pipeline; keep them in sync.
- `vite.config.ts` contains the production GitHub Pages base path for this repo.
