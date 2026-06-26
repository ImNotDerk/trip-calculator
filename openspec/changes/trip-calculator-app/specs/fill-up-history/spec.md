## ADDED Requirements

### Requirement: View fill-up list
The system SHALL display a list of past fill-ups for the selected car, sorted by date (newest first). Each entry MUST show: date, gas price, total distance, total fuel, fuel cost, toll cost, and grand total.

#### Scenario: Fill-up list for a car
- **WHEN** user navigates to the fill-up history for a car that has 3 past fill-ups
- **THEN** the 3 fill-ups are displayed with their totals, newest first

#### Scenario: No fill-ups yet
- **WHEN** the selected car has no past fill-ups
- **THEN** the system shows "No fill-ups yet" empty state

### Requirement: View fill-up details
The system SHALL allow the user to expand a fill-up to see the individual trips it contains.

#### Scenario: Expand fill-up
- **WHEN** user clicks on a fill-up in the list
- **THEN** the fill-up expands to show a sub-table with all trips included in that fill-up (date, direction, distance, fuel consumption, estimated usage, toll)

### Requirement: Fill-up cost breakdown
Each fill-up entry MUST clearly show the cost breakdown: fuel cost (based on gas price) and toll cost, summing to the grand total.

#### Scenario: Cost breakdown display
- **WHEN** a fill-up has totalFuelCost = 245.40 and totalTollCost = 45
- **THEN** the entry displays "Fuel: ₱245.40 + Tolls: ₱45 = Grand Total: ₱290.40"
