## Why

The user currently tracks car trips in a notes app table with manual calculations for fuel usage and costs. This is error-prone, doesn't support multiple cars, and provides no history or cost analysis. A dedicated app will automate calculations, persist data across sessions, and give clear visibility into commuting costs.

## What Changes

- New web application for tracking car trips and fuel costs
- Auto-calculate estimated fuel usage from distance and fuel consumption rate
- Input live gas price to see real-time cost estimates for current trips
- "Fill-up" workflow to archive trips at a given gas price, compute totals, and reset for the next tank
- Support two or more cars with completely separate trip tracking and fill-up history
- Track toll costs as per-trip extra expenses
- View fill-up history with detailed cost breakdowns
- All data stored client-side (localStorage) — no backend, no account needed
- Dark mode with system preference detection and localStorage persistence
- Undo fill-up capability (toast notification, Last Fill-Up card, history page)
- Analytics dashboard with charts (trip efficiency, fill-up costs, distance, fuel price trends)
- Toast notification system for transient user feedback
- Running totals in trip table footers
- Inline "+ Add Car" flow from the car selector dropdown

## Capabilities

### New Capabilities
- `car-management`: Add, edit, remove cars. Switch between cars to isolate trip data and costs per vehicle. Inline add-car from the car selector dropdown.
- `trip-logging`: Log individual trips with date, direction (to/from/other), distance (km), fuel consumption rate (km/L), and optional toll cost. Auto-compute estimated fuel usage. Edit and delete active trips.
- `fill-up`: Archive all active trips for a car at the current gas price. Compute total distance, total fuel used, fuel cost, toll cost, and grand total. Reset active trips for the next tank. Gas price required before filling up.
- `fill-up-undo`: Undo the latest fill-up from three entry points (toast, Last Fill-Up card, history page). Restores trips to active without data loss.
- `dashboard`: Per-car summary of active trips showing total distance, total fuel, total tolls, and estimated cost based on a live gas price input.
- `fill-up-history`: View past fill-ups with date, gas price, and full cost breakdown. Expand to see individual trips within each fill-up. Undo or delete fill-ups.
- `analytics`: Per-car analytics page with four Recharts charts: trip efficiency (line), fill-up costs (bar), distance per fill-up (bar), fuel price trend (line). Dark-mode aware chart colors.
- `data-persistence`: All data (cars, trips, fill-ups) persists in localStorage. Data survives page refreshes and browser restarts.
- `dark-mode`: Light/dark theme toggle in the top nav. Persists to localStorage. Respects OS `prefers-color-scheme` on first visit. Anti-flicker script in `index.html`.
- `toast-notifications`: ToastProvider context + useToast hook for transient notifications with optional action buttons and auto-dismiss.
- `running-totals`: All trip tables display a footer row with summed distance, fuel usage, and toll costs.

### Modified Capabilities
<!-- None — this is a new project with no existing specs -->

## Impact

- New repository: `trip-calculator` (greenfield project)
- Tech stack: React 18, TypeScript, Vite, Tailwind CSS v4, React Router v6, Recharts
- No external APIs or backend services
- Deployable as static site (GitHub Pages, Vercel, or similar)
- Single-user, personal use — no authentication needed
