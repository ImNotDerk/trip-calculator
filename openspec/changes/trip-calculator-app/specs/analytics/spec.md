## ADDED Requirements

### Requirement: Analytics page per car
The system SHALL provide an analytics page at `/cars/:carId/analytics` displaying four charts for a specific car: trip efficiency over time, fill-up costs, distance per fill-up, and fuel price trend.

#### Scenario: Analytics with data
- **WHEN** Car A has trips and fill-ups recorded and user navigates to the analytics page
- **THEN** four chart cards are displayed in a 2×2 responsive grid with correct data

#### Scenario: Analytics with no data
- **WHEN** the selected car has no trips and no fill-ups
- **THEN** the analytics page shows an empty state with a link to log the first trip

#### Scenario: Partial data
- **WHEN** the selected car has trips but no fill-ups
- **THEN** the efficiency chart renders, and the three fill-up charts each show "No data available yet"

### Requirement: Trip efficiency chart
The system SHALL render a LineChart showing fuel consumption rate (km/L) for each trip over time, sorted by date ascending.

#### Scenario: Efficiency chart
- **WHEN** Car A has 5 trips with fuel consumption values 11.8, 12.1, 10.5, 11.2, 11.9 km/L
- **THEN** a line chart plots these values by date with the coral primary color

### Requirement: Fill-up costs chart
The system SHALL render a BarChart showing grand total cost for each fill-up over time.

#### Scenario: Fill-up costs chart
- **WHEN** Car A has 3 fill-ups with grand totals ₱2,340, ₱2,100, ₱2,560
- **THEN** a bar chart plots these values by date with the coral primary color

### Requirement: Distance per fill-up chart
The system SHALL render a BarChart showing total distance driven per fill-up.

#### Scenario: Distance chart
- **WHEN** Car A has fill-ups with distances 340km, 295km, 410km
- **THEN** a bar chart plots these values by date with the teal accent color

### Requirement: Fuel price trend chart
The system SHALL render a LineChart showing gas price per liter for each fill-up over time.

#### Scenario: Fuel price trend
- **WHEN** Car A has fill-ups at prices ₱60, ₱62, ₱58 per liter
- **THEN** a line chart plots these values by date with the amber accent color

### Requirement: Dark mode chart colors
All chart elements (axes, grid lines, tooltips) MUST adapt their colors when dark mode is active.

#### Scenario: Charts in dark mode
- **WHEN** dark mode is active and charts are rendered
- **THEN** grid lines use the dark hairline color, axis text uses dark muted color, and tooltips use the dark elevated surface background
