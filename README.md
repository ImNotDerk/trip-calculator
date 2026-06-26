# Trip Calculator

A warm, editorial web app for tracking car trips, fuel usage, and fill-up costs. Built as a personal tool to replace manual notes-app calculations.

## Features

### Multi-Car Management
Add, switch between, and remove cars. Each car has completely isolated trip tracking and fill-up history.

### Trip Logging
Log individual trips with date, direction (to/from/other), distance (km), fuel consumption rate (km/L), and optional toll cost. Fuel usage is auto-computed as you type. Inline edit and delete any active trip.

### Live Dashboard
Per-car summary cards showing trip count, total distance, total fuel, total tolls, and estimated fuel cost. Enter a gas price and all cost estimates update in real-time across all cars.

### Fill-Up Workflow
When you refuel, archive all active trips at the current gas price. The app computes total distance, fuel used, fuel cost, toll cost, and grand total — then resets for the next tank.

### Fill-Up History
Browse past fill-ups sorted by date. Expand any fill-up to see individual trips. View cost breakdowns (fuel vs tolls). Undo or delete fill-ups as needed.

### Undo Fill-Up
Made a mistake? Undo the latest fill-up from three places:
- Toast notification that appears right after filling up (10-second window)
- "Undo" button on the Last Fill-Up card on the car detail page
- "Undo — restore trips" button in the fill-up history

Undoing restores all trips to the active tank — no data is lost.

### Running Totals
Every trip table shows a footer row with total distance, total fuel usage, and total toll costs at a glance.

### Analytics Dashboard
Four charts per car:
- **Trip Efficiency** — km/L over time (line chart)
- **Fill-Up Costs** — grand total per fill-up (bar chart)
- **Distance Per Fill-Up** — km driven per tank (bar chart)
- **Fuel Price Trend** — gas price changes over time (line chart)

### Dark Mode
Toggle between light and dark themes. Preference is saved to localStorage and respects your system setting on first visit. No flash on page load.

### Data Persistence
All data (cars, trips, fill-ups, gas price) is saved to your browser's localStorage. No accounts, no backend, no cloud — your data never leaves your device.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| State | Context + useReducer |
| Charts | Recharts |
| Storage | localStorage |
| Design | Anthropic claude.com system |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deploy

The `dist/` folder is a static site. Deploy to:
- GitHub Pages
- Vercel (`vercel --prod`)
- Netlify (`netlify deploy --prod --dir=dist`)

## Privacy

This app runs entirely in your browser. No data is sent to any server. All trip data, car information, and preferences are stored in localStorage and never leave your device.
