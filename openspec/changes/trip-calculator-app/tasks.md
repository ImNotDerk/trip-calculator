## 1. Project Setup

- [x] 1.1 Scaffold Vite + React + TypeScript project (manual scaffold — directory already existed)
- [x] 1.2 Install dependencies: react-router-dom, tailwindcss v4, @tailwindcss/vite
- [x] 1.3 Configure Tailwind CSS v4 with Vite plugin in `vite.config.ts`
- [x] 1.4 Create `index.html`, `src/main.tsx`, `src/App.tsx`, and `src/index.css` entry points
- [x] 1.5 Verify dev server starts successfully (`npm run dev`)

## 2. Types & Data Layer

- [x] 2.1 Define TypeScript interfaces in `src/types/index.ts`: Car, Trip, FillUp
- [x] 2.2 Implement `src/services/storage.ts` localStorage wrapper with typed get/set for cars, trips, fill-ups
- [x] 2.3 Add helper functions: generateId(), roundTo2(), computeEstimatedUsage()

## 3. State Management

- [x] 3.1 Create `src/context/AppContext.tsx` with AppState interface, reducer actions, and AppProvider
- [x] 3.2 Implement reducer cases: ADD_CAR, REMOVE_CAR, ADD_TRIP, UPDATE_TRIP, DELETE_TRIP, FILL_UP, DELETE_FILL_UP
- [x] 3.3 Wire write-through persistence: every reducer dispatch saves to localStorage
- [x] 3.4 Create shared gas price state (integrated into AppContext rather than separate hook — gas price is global per design decision in design.md)

## 4. Layout & Navigation

- [x] 4.1 Set up React Router in `App.tsx` with routes: /, /cars, /cars/:carId, /cars/:carId/history, /cars/:carId/trips/new
- [x] 4.2 Create `src/components/Layout.tsx` with header, car selector, and `<Outlet />`
- [x] 4.3 Create `src/components/CarSelector.tsx` dropdown to switch active car (synced with URL)

## 5. Car Management

- [x] 5.1 Create `src/pages/CarManagementPage.tsx` with "Add Car" form and list of existing cars
- [x] 5.2 Implement add car flow with validation (non-empty name)
- [x] 5.3 Implement remove car with confirmation dialog and cascade delete

## 6. Trip Logging

- [x] 6.1 Create `src/pages/AddTripPage.tsx` with form: date, direction, label, distance, fuel consumption, toll
- [x] 6.2 Auto-compute estimated usage as user types distance or fuel consumption
- [x] 6.3 Validate required fields on submit (date, distance, fuel consumption)
- [x] 6.4 Create `src/components/TripTable.tsx` to display active trips sorted by date (newest first)
- [x] 6.5 Create `src/components/TripRow.tsx` with inline edit capability for all fields
- [x] 6.6 Implement recalculate on edit (distance or fuel consumption changes)
- [x] 6.7 Implement delete active trip with confirmation
- [x] 6.8 Create `src/pages/CarDetailPage.tsx` composing TripTable, Add Trip button, FillUpButton, and toll summary

## 7. Dashboard

- [x] 7.1 Create `src/components/SummaryCard.tsx` showing trip count, total distance, total fuel, total tolls, and estimated cost
- [x] 7.2 Create `src/components/GasPriceInput.tsx` — live gas price field that drives cost estimates
- [x] 7.3 Create `src/pages/DashboardPage.tsx` with SummaryCards for all cars side by side
- [x] 7.4 Wire live cost estimate: gas price change → all SummaryCards update in real-time

## 8. Fill-Up

- [x] 8.1 Create `src/components/FillUpButton.tsx` — "Fill Up" button that shows confirmation modal
- [x] 8.2 Implement fill-up computation: sum distances, sum fuel, compute fuel cost, toll cost, grand total
- [x] 8.3 Implement archive logic: mark trips as "filled", create FillUp record, clear active trips
- [x] 8.4 Handle edge case: no active trips to fill up (button disabled)
- [x] 8.5 Display confirmation dialog with cost summary before finalizing

## 9. Fill-Up History

- [x] 9.1 Create `src/pages/FillUpHistoryPage.tsx` with list of past fill-ups sorted by date (newest first)
- [x] 9.2 Each fill-up entry shows: date, gas price, total distance, total fuel, fuel cost, toll cost, grand total
- [x] 9.3 Implement expandable fill-up detail showing individual trips sub-table
- [x] 9.4 Implement delete fill-up with cascade (removes fill-up + linked trips)
- [x] 9.5 Handle empty state when no fill-ups exist

## 10. Polish & Verification

- [x] 10.1 Add empty states for all pages (no cars, no trips, no fill-ups)
- [x] 10.2 Mobile-responsive layout using Tailwind responsive utilities
- [x] 10.3 Manual verification: TypeScript compiles clean, Vite build succeeds (46 modules, 196KB JS, 20KB CSS)
- [x] 10.4 localStorage persistence via write-through pattern in AppContext useEffect hooks
- [x] 10.5 Cascade deletes verified in reducer logic (REMOVE_CAR removes trips+fill-ups, DELETE_FILL_UP removes linked trips)

## Deviations from Original Plan

- **3.4**: Gas price state is managed in AppContext (not a separate hook) — it's a single global value, so a separate file was unnecessary. The design decision in design.md says gas price should be global.
- **4.1**: `/settings` route was omitted — there are no settings to configure at this stage.
- **10.3**: Manual workflow walkthrough pending real browser testing; full TypeScript compilation and Vite build verified instead.

## 11. Post-Implementation Enhancements

### 11.1 Bug Fixes
- [x] 11.1.1 Fix footer positioning (sticky footer with flex layout)
- [x] 11.1.2 Require gas price before fill-up (button disabled + hint text when no price set)
- [x] 11.1.3 Add car option in car selector dropdown (inline input with confirm/cancel)

### 11.2 Fill-Up Undo
- [x] 11.2.1 Add `UNDO_FILL_UP` reducer action (reverts trips to active, removes FillUp)
- [x] 11.2.2 Toast notification with Undo button after fill-up (10s window)
- [x] 11.2.3 Undo button on Last Fill-Up card (CarDetailPage, two-click confirmation)
- [x] 11.2.4 Undo button in Fill-Up History expanded view (latest fill-up only)

### 11.3 Toast Notifications
- [x] 11.3.1 Create `ToastProvider` context and `useToast` hook
- [x] 11.3.2 Toast UI: fixed bottom-right, auto-dismiss, action buttons, × dismiss
- [x] 11.3.3 Wire into FillUpButton and CarDetailPage undo flows

### 11.4 Dark Mode
- [x] 11.4.1 Define dark palette CSS custom properties (`.dark` class overrides)
- [x] 11.4.2 Create `ThemeProvider` with localStorage persistence + system preference detection
- [x] 11.4.3 Theme toggle button (sun/moon icon) in top nav
- [x] 11.4.4 Anti-flicker script in `index.html`
- [x] 11.4.5 Footer visual distinction in dark mode

### 11.5 Analytics Dashboard
- [x] 11.5.1 Install Recharts dependency
- [x] 11.5.2 Create `AnalyticsPage` with 4 chart cards (2×2 grid)
- [x] 11.5.3 Trip efficiency LineChart, Fill-Up costs BarChart, Distance BarChart, Fuel price LineChart
- [x] 11.5.4 Dark mode chart color adaptation
- [x] 11.5.5 Add route and navigation link from CarDetailPage

### 11.6 Running Totals
- [x] 11.6.1 Add `<tfoot>` row to TripTable with summed distance, usage, tolls
- [x] 11.6.2 Footer styling: double-thickness border, soft surface background

### 11.7 Documentation
- [x] 11.7.1 Create `CLAUDE.md` (developer guide for AI-assisted development)
- [x] 11.7.2 Create `README.md` (user-facing feature documentation)
- [x] 11.7.3 Create OpenSpec specs for: dark-mode, fill-up-undo, analytics, toast-notifications, running-totals
- [x] 11.7.4 Update proposal.md with all capabilities
