# CLAUDE.md — Trip Calculator

## Project Overview

Trip Calculator is a single-page web application for tracking car trips, fuel usage, and fill-up costs. Built as a greenfield React 18 + TypeScript + Vite project with no backend — all data persists in `localStorage`.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 + TypeScript | Strict mode enabled |
| Build tool | Vite 6 | With `@vitejs/plugin-react` + `@tailwindcss/vite` |
| Styling | Tailwind CSS v4 | CSS-first config via `@theme` in `src/index.css` |
| Routing | React Router v6 | Client-side only, no SSR |
| State | React Context + `useReducer` | Write-through to localStorage on every dispatch |
| Charts | Recharts | Used on the Analytics page only |
| Design system | Anthropic claude.com | Cream canvas, coral primary, serif display, dark navy footer |

## Directory Structure

```
src/
├── App.tsx                    # BrowserRouter + all routes
├── main.tsx                   # ReactDOM.createRoot entry
├── index.css                  # Tailwind v4 @theme tokens + dark mode
├── types/index.ts             # Car, Trip, FillUp interfaces
├── services/
│   ├── storage.ts             # localStorage get/save typed wrappers
│   └── helpers.ts             # generateId, roundTo2, computeEstimatedUsage
├── context/
│   └── AppContext.tsx          # AppState, reducer (10 action types), AppProvider
├── hooks/
│   └── useTheme.tsx           # ThemeProvider + useTheme (light/dark toggle)
├── components/
│   ├── Layout.tsx              # Top nav + <Outlet /> + footer (flex sticky-footer)
│   ├── CarSelector.tsx         # Dropdown with inline "+ Add Car" flow
│   ├── GasPriceInput.tsx       # ₱-prefixed number input, global state
│   ├── SummaryCard.tsx         # Per-car dashboard stats card
│   ├── TripTable.tsx           # Table with <tfoot> running totals
│   ├── TripRow.tsx             # Inline edit + delete + direction badges
│   ├── FillUpButton.tsx        # Fill-up CTA with confirmation modal + undo toast
│   └── Toast.tsx               # ToastProvider + useToast (fixed bottom-right)
└── pages/
    ├── DashboardPage.tsx       # All-cars overview + gas price
    ├── CarManagementPage.tsx   # Add/delete cars
    ├── CarDetailPage.tsx       # Active trips + last fill-up card + actions
    ├── AddTripPage.tsx         # Trip form with live fuel estimation
    ├── FillUpHistoryPage.tsx   # Expandable fill-up list + undo/delete
    └── AnalyticsPage.tsx       # 4 charts (efficiency, costs, distance, price)
```

## Design System Tokens

All colors are CSS custom properties defined in `src/index.css` via Tailwind v4's `@theme` block. Two modes:

| Token | Light | Dark |
|---|---|---|
| `--color-canvas` | `#faf9f5` | `#1a1915` |
| `--color-ink` | `#141413` | `#f5f0e8` |
| `--color-primary` | `#cc785c` | `#cc785c` (unchanged) |
| `--color-surface-card` | `#efe9de` | `#1f1e1b` |
| `--color-surface-dark` | `#181715` | `#11100e` |
| `--color-hairline` | `#e6dfd8` | `#2a2824` |

**Typography**: Cormorant Garamond (serif display, weight 400) for h1-h3. Inter (humanist sans, weight 400-500) for body, buttons, labels. JetBrains Mono for code (not yet used in UI).

**Never** hardcode hex values in components. Always use Tailwind utility classes (`bg-canvas`, `text-ink`, `surface-card`, `border-hairline`, `text-primary`, etc.) which map to the CSS custom properties.

## State Management

### Reducer Actions (10 types)

| Action | Purpose |
|---|---|
| `ADD_CAR` | Creates car, auto-selects it |
| `REMOVE_CAR` | Cascade deletes car + its trips + its fill-ups |
| `SELECT_CAR` | Sets `selectedCarId` |
| `ADD_TRIP` | Creates trip with `status: "active"`, auto-computes `estimatedUsageL` |
| `UPDATE_TRIP` | Merges updates, recalculates if distance/consumption changed |
| `DELETE_TRIP` | Removes single active trip |
| `FILL_UP` | Archives active trips to a FillUp, resets list |
| `UNDO_FILL_UP` | Reverts latest fill-up: removes FillUp, restores trips to active |
| `DELETE_FILL_UP` | Permanently deletes FillUp + all its linked trips |
| `SET_GAS_PRICE` | Sets global gas price, triggers live cost updates |

### Persistence

Four `useEffect` hooks in `AppProvider` write to localStorage on every state change:
- `saveCars(state.cars)` — key: `trip-calc-cars`
- `saveTrips(state.trips)` — key: `trip-calc-trips`
- `saveFillUps(state.fillUps)` — key: `trip-calc-fillups`
- `saveGasPrice(state.gasPrice)` — key: `trip-calc-gas-price`

Dark mode preference: `trip-calc-theme` in localStorage.

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | DashboardPage | All-cars summary + gas price input |
| `/cars` | CarManagementPage | Add/delete cars |
| `/cars/:carId` | CarDetailPage | Active trips, last fill-up, actions |
| `/cars/:carId/trips/new` | AddTripPage | New trip form |
| `/cars/:carId/history` | FillUpHistoryPage | Expandable fill-up list |
| `/cars/:carId/analytics` | AnalyticsPage | Charts (Recharts) |

## Key Patterns

### Write-through persistence
Every reducer dispatch automatically saves to localStorage via `useEffect` on the relevant state slice. No manual save calls needed.

### Dark mode
CSS-only approach via `@custom-variant dark` in `index.css`. A `.dark` class on `<html>` swaps all `--color-*` custom properties. `ThemeProvider` manages the class + localStorage. An inline `<script>` in `index.html` applies the class before React mounts to prevent FOUC.

### Undo fill-up
Three undo entry points:
1. Toast notification (10s, right after fill-up)
2. "Undo" button on Last Fill-Up card (CarDetailPage)
3. "Undo — restore trips" button in expanded fill-up (FillUpHistoryPage)

All dispatch `UNDO_FILL_UP` which removes the FillUp record and sets its trips back to `status: "active"`.

### Running totals
`TripTable` computes `totalDistance`, `totalUsage`, `totalToll` from its `trips` prop and renders a `<tfoot>` row. Appears on both active trips and fill-up sub-tables.

## Build & Deploy

```bash
npm run dev      # Dev server with HMR
npm run build    # TypeScript check + Vite production build → dist/
npm run preview  # Preview production build locally
```

Output is a static site (HTML + JS + CSS) deployable to GitHub Pages, Vercel, Netlify, or any static host.

## Dependencies

| Package | Purpose |
|---|---|
| `react`, `react-dom` (^18) | UI framework |
| `react-router-dom` (^6) | Client-side routing |
| `tailwindcss` (^4), `@tailwindcss/vite` | Styling |
| `recharts` (^3) | Analytics charts |
| `typescript` (~5.6) | Type checking |
| `vite` (^6), `@vitejs/plugin-react` | Build tool |

## Notes for Claude

- **Don't hardcode colors** — always use Tailwind utility classes that map to CSS custom properties.
- **Don't add state libraries** — Context + useReducer is the intended pattern.
- **Don't add a backend** — this is intentionally client-side only.
- **Respect the design system** — cream canvas, coral primary, serif display, hairline borders, 8px button radius, 12px card radius.
- **Use two-click confirmation for destructive actions** — first click toggles a "Confirm?" state, second click executes.
- **All new specs go in `openspec/changes/trip-calculator-app/specs/<feature-name>/spec.md`** following the existing format.
- **Never commit or push without approval** — after making changes, suggest the `git add`, `git commit`, and `git push` commands for the user to run themselves. Do not execute them automatically.
