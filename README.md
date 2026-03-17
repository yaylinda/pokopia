# Pokopia Field Guide

A static React + TypeScript reference app for the Nintendo Switch game Pokopia. The site turns a repo-owned dataset into a searchable field guide with two connected discovery surfaces:

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
npm run dev
```

## Commands

```bash
npm run lint       # eslint
npm run test       # vitest
npm run build      # type-check and production build
```

## Data model

The app is statically hosted and keeps its source of truth in-repo:

- Editable dataset: `src/data/pokopia-data.json`
- Data access helpers: `src/data/pokopia.ts`
- Pokemon `id` values use canonical National Dex numbers so sprite filenames stay stable.

This keeps the GitHub Pages build simple and avoids depending on live external data at runtime.

## Deployment

The repo includes two GitHub Actions workflows:

- `ci.yml` verifies `lint`, `test`, and `build` on pull requests and pushes to `main`.
- `deploy.yml` publishes the built static site to GitHub Pages when changes land on `main`.

For Pages hosting, set the repository Pages source to `GitHub Actions`.

## Implementation docs

- [`docs/current-build.md`](docs/current-build.md) documents the current app build, runtime structure, data flow, and known limitations.
- [`AGENTS.md`](AGENTS.md) gives coding agents and contributors a quick repository map plus working conventions.
- `scripts/claudia/` stores Claudia task metadata and progress logs used for autonomous agent workflows.
