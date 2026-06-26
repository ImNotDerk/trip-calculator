## Context

The user tracks car trips manually in a notes app table. They want a web app that automates fuel usage calculation, supports multiple cars, handles the "fill-up" workflow (archive trips at a gas price, reset), and persists data locally. No backend exists — this is a greenfield project. The app is single-user and personal.

Current manual workflow:
1. Log trips with date, distance, and fuel consumption
2. Manually calculate estimated fuel used (distance ÷ km/L)
3. When filling up at gas station, manually sum up costs

This app automates steps 2-3 and adds multi-car support, toll tracking, and history.

## Goals / Non-Goals

**Goals:**
- Provide a clean, mobile-friendly web interface for logging car trips
- Auto-calculate fuel usage from distance and fuel consumption rate
- Allow live gas price input to preview costs before filling up
- Implement "fill-up" workflow: archive active trips, compute totals, reset
- Support multiple cars with completely isolated data
- Persist all data in localStorage (survives refreshes)
- Track tolls as extra per-trip expenses
- View fill-up history with cost breakdowns

**Non-Goals:**
- Multi-user support or authentication
- Backend server or cloud sync
- Real-time fuel price APIs
- GPS/odometer integration
- Mobile native app (PWA is acceptable later)
- Data encryption or security beyond browser sandbox

## Decisions

### 1. React 18 + TypeScript + Vite
**Why**: React's component model fits the form/table/list UI pattern well. TypeScript adds type safety for the data model. Vite provides fast dev server and optimized builds.
**Alternatives**: Svelte (smaller bundles but smaller ecosystem), vanilla JS (no framework overhead but harder to scale features), Next.js (overkill — no SSR needed).

### 2. Client-side only (localStorage)
**Why**: Single user, no multi-device sync needed. Zero hosting cost. No privacy concerns — data never leaves the browser.
**Alternative**: IndexedDB (handles larger data better, but localStorage is simpler and sufficient for this data volume — likely hundreds of trips, not millions).

### 3. React Context + useReducer for state
**Why**: Lightweight state management without external dependencies. Reducer pattern fits the CRUD operations well. Write-through to localStorage on every state change.
**Alternative**: Zustand (simpler API but extra dependency), Redux (overkill for this scope).

### 4. React Router v6 for navigation
**Why**: Client-side routing between dashboard, car detail, history, and settings views. Enables deep-linking within the app.
**Alternative**: TanStack Router (newer but less established), no router (single-page with conditional rendering — harder to maintain with many views).

### 5. Tailwind CSS v4 for styling
**Why**: Rapid utility-first styling. Mobile-responsive utilities built in. Small bundle after purging unused classes.
**Alternative**: CSS Modules (more boilerplate), component library like MUI (heavier, opinionated look).

### 6. Data model — three entities (Car, Trip, FillUp)
**Why**: Clean separation of concerns. Trips link to Cars, FillUps link to Cars and enclose multiple Trips. The `status` field on Trip ("active" vs "filled") distinguishes current-tank trips from archived ones.
**Alternative**: Single table with more columns (messy state transitions), or normalized tables with join logic (overkill for localStorage).

### 7. Fill-up workflow — archive and reset pattern
**Why**: When user fills up, all active trips for that car are marked as "filled", linked to a new FillUp record, and the active list resets. This matches the real-world pattern: you track trips between fill-ups, then "close the books" when you refuel.
**Alternative**: Continuous log with manual grouping (harder to compute per-tank costs).

## Risks / Trade-offs

- **localStorage size limit (5-10MB)**: Risk of hitting limit with years of data. → Mitigation: Trips are small (few hundred bytes each). Even 10,000 trips ≈ 2-3MB. Not a practical concern.
- **Data loss on browser clear**: User could lose all data by clearing browser storage. → Mitigation: Phase 2 feature — JSON export/import for backups.
- **No cross-device sync**: Data lives on one device/browser. → Mitigation: Phase 2 export/import allows manual transfer.
- **Mobile usability**: Forms and tables can be fiddly on small screens. → Mitigation: Tailwind responsive utilities, mobile-first design. Test on phone during implementation.

## Open Questions

- Should gas price be per-car or global? (Decision: global — gas price is the same regardless of which car you fill)
- Should tolls be per-trip or per-fill-up? (Decision: per-trip — tolls are incurred on specific trips)
- Start with pre-seeded data or empty state? (Decision: empty state with clear onboarding to add first car)
