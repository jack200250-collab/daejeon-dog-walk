# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `first-app/` directory:

```bash
npm start          # dev server at http://localhost:4200 (auto-reloads on changes)
npm run build      # production build → dist/
npm run watch      # dev build with watch mode
npm test           # run unit tests with Vitest
npm test -- --reporter=verbose   # run a single test file with output
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

## What This App Does

Dog-friendly walking spot finder for Daejeon, South Korea. Users pick their dog's size on an onboarding screen, then browse spots filtered by size suitability. Each spot shows real-time congestion levels computed from the current time/day. A Kakao Maps view shows all spots as markers with congestion badges.

## Architecture

Angular 21 standalone application — no NgModules anywhere.

**Bootstrap:** [first-app/src/main.ts](first-app/src/main.ts) → `bootstrapApplication(App, appConfig)`.

**App config:** [first-app/src/app/app.config.ts](first-app/src/app/app.config.ts) registers `provideRouter` and `provideBrowserGlobalErrorListeners`. Add new application-wide providers here.

**Routing:** [first-app/src/app/app.routes.ts](first-app/src/app/app.routes.ts) — all routes lazy-load their page component:

| Route | Page | Purpose |
|---|---|---|
| `/onboarding` | `OnboardingPage` | Dog size selection (small / medium / large) |
| `/list` | `ListPage` | Card list filtered by selected dog size |
| `/map` | `MapPage` | Kakao Maps view with congestion markers |
| `/detail/:id` | `DetailPage` | Full spot info + 6-slot congestion schedule |
| `**` | redirect | Falls back to `/onboarding` |

**Component file convention:** `<name>.ts` / `<name>.html` / `<name>.css` — no `.component` infix.

**Tests:** `*.spec.ts` co-located with source. Uses Angular `TestBed` + Vitest (configured via `angular.json` builder `@angular/build:unit-test`).

## Services

**`DogSizeService`** ([first-app/src/app/services/dog-size.service.ts](first-app/src/app/services/dog-size.service.ts))  
Holds the selected dog size as an Angular signal. Inject this to read or set the current size. Persists across navigation.

**`SpotsService`** ([first-app/src/app/services/spots.service.ts](first-app/src/app/services/spots.service.ts))  
Returns the hardcoded array of 10 Daejeon walking spots. Methods: `getAll()`, `getById(id)`, `getBySize(size)`. Each `Spot` has `id`, `name`, `address`, `lat`/`lng`, `spot_type` (`park | trail | riverside | forest`), `size_suitable: DogSize[]`, `features: string[]`, and `image_url`.

**`CongestionService`** ([first-app/src/app/services/congestion.service.ts](first-app/src/app/services/congestion.service.ts))  
Computes congestion from the current hour and weekday/weekend. Returns a `CongestionInfo` with `level` (`low | moderate | high`), a Korean `label`, a CSS `color`, and an `emoji` (🟢🟡🔴). `getSchedulePreview(spotType)` returns the six standard time-slot predictions used on the detail page.

## Kakao Maps Integration

The Kakao Maps JS SDK is loaded via a `<script>` tag in [first-app/src/index.html](first-app/src/index.html) with `autoload=false` and HTTPS. `MapPage` waits for the SDK by polling `window.kakao` with up to 6 retries before calling `kakao.maps.load()`. Markers use `CustomOverlay` to render congestion emoji badges. The map centers on Daejeon (36.3504, 127.3845).

Do not switch to dynamic `loadScript` approaches — the current retry pattern was chosen to handle timing issues with the Kakao SDK callback.

## Data Model

Defined in [first-app/src/app/models/spot.model.ts](first-app/src/app/models/spot.model.ts):

```typescript
type DogSize = 'small' | 'medium' | 'large'
type SpotType = 'park' | 'trail' | 'riverside' | 'forest'
type CongestionLevel = 'low' | 'moderate' | 'high'
```

## Deployment

Deployed on Vercel. Configuration in [first-app/vercel.json](first-app/vercel.json) rewrites all paths to `index.html` for client-side routing. Production builds enable the Angular service worker (PWA).

`src/environments/environment.ts` has placeholder fields (`supabaseUrl`, `supabaseKey`, `kakaoMapKey`) — the Kakao key is currently embedded directly in `index.html`, not read from the environment file.

## Style

Prettier config (`.prettierrc`): `printWidth: 100`, `singleQuote: true`, Angular HTML parser for `.html` files.
