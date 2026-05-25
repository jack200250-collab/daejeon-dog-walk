# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `first-app/` directory:

```bash
npm start          # dev server at http://localhost:4200 (auto-reloads on changes)
npm run build      # production build → dist/
npm run watch      # dev build with watch mode
npm test           # run unit tests with Vitest
```

Generate new components/services/pipes with the Angular CLI:
```bash
npx ng generate component <name>
npx ng generate service <name>
npx ng generate --help   # full list of schematics
```

Format code:
```bash
npx prettier --write .
```

## Architecture

Angular 21 standalone application — no NgModules anywhere.

**Bootstrap:** [src/main.ts](src/main.ts) calls `bootstrapApplication(App, appConfig)`.

**App config:** [src/app/app.config.ts](src/app/app.config.ts) registers global providers (`provideRouter`, `provideBrowserGlobalErrorListeners`). Add new application-wide providers here.

**Routing:** [src/app/app.routes.ts](src/app/app.routes.ts) exports the `Routes` array. The root component renders `<router-outlet>` via `RouterOutlet`.

**Root component:** [src/app/app.ts](src/app/app.ts) uses Angular signals (`signal()`) for reactive state. Component files follow the pattern `<name>.ts` / `<name>.html` / `<name>.css` (no `.component` infix).

**Tests:** `*.spec.ts` files co-located with source. Uses Angular `TestBed` + Vitest (configured via `angular.json` builder `@angular/build:unit-test`).

## Style

Prettier config (`.prettierrc`): `printWidth: 100`, `singleQuote: true`, Angular HTML parser for `.html` files.
