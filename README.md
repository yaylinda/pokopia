# Pokopia Field Guide

A static React + TypeScript reference app for the Nintendo Switch game Pokopia. The site turns the shared Google Sheet into a searchable field guide with two connected discovery surfaces:

- `Pokédex`: browse Pokemon by specialty, ideal habitat, favorite cues, time of day, and weather.
- `Habitat Dex`: browse habitat recipes by area and see which Pokemon point back to each habitat.

## Stack

- React 19
- Vite 8
- TypeScript 5.9
- ESLint 9
- Vitest
- GitHub Pages deployment via Actions

## Local development

```bash
npm install
npm run sync:data
npm run dev
```

## Commands

```bash
npm run sync:data  # refresh src/data/pokopia-data.json from the public sheet
npm run lint       # eslint
npm run test       # vitest
npm run build      # type-check and production build
```

## Data model

The app is statically hosted, so the spreadsheet is normalized into a local JSON snapshot during development:

- Source sheet: [Pokopia spreadsheet](https://docs.google.com/spreadsheets/u/0/d/1OqpRuZyPQpYg5nYvku9JwQMxjMFzhc1ER5Bqbt1tnvA/htmlview?pli=1#gid=0)
- Sync script: `scripts/sync-sheet-data.mjs`
- Generated data: `src/data/pokopia-data.json`

This keeps the GitHub Pages build simple and avoids depending on live sheet access at runtime.

## Deployment

The repo includes two GitHub Actions workflows:

- `ci.yml` verifies `lint`, `test`, and `build` on pull requests and pushes to `main`.
- `deploy.yml` publishes the built static site to GitHub Pages when changes land on `main`.
- Workflow actions are pinned to immutable SHAs and annotated with their source release tags for supply-chain safety.
- As of March 14, 2026, GitHub's official Pages actions still emit an upstream Node.js 20 deprecation warning even when using the latest documented Pages workflow stack. Revisit those pins when GitHub ships newer Pages action majors.

For Pages hosting, set the repository Pages source to `GitHub Actions`.
