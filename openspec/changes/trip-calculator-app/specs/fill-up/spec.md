## ADDED Requirements

### Requirement: Perform a fill-up
The system SHALL allow the user to "fill up" — archive all active trips for the selected car at a given gas price, compute total costs, and reset the active trips list. This creates a FillUp record that groups the archived trips.

#### Scenario: Fill up with active trips
- **WHEN** user enters a gas price of 60 per liter, clicks "Fill Up", and confirms
- **THEN** all active trips for the current car are marked as "filled" and linked to a new FillUp record. The FillUp record contains: date of fill-up, gas price, sum of all trip distances, sum of all estimated fuel usage, total fuel cost (fuel sum × gas price), sum of all tolls, and grand total (fuel cost + tolls). Active trips list is cleared.

#### Scenario: Fill up with no active trips
- **WHEN** user clicks "Fill Up" but there are no active trips for the selected car
- **THEN** the system shows a message that there are no trips to fill up and does not create a FillUp record

#### Scenario: Fill up confirmation
- **WHEN** user clicks "Fill Up"
- **THEN** the system shows a confirmation dialog with the total cost summary before finalizing

### Requirement: Compute fill-up totals
The system MUST compute the following for each fill-up:
- `totalDistanceKm`: sum of all trip distances in the fill-up
- `totalFuelL`: sum of all trip estimated usage values
- `totalFuelCost`: totalFuelL × gasPricePerLiter
- `totalTollCost`: sum of all trip toll costs
- `grandTotal`: totalFuelCost + totalTollCost

#### Scenario: Fill-up totals are correct
- **WHEN** a fill-up covers two trips: Trip A (26km, 2.20L, toll 0) and Trip B (20.1km, 1.89L, toll 45) at gas price 60
- **THEN** totalDistanceKm = 46.1, totalFuelL = 4.09, totalFuelCost = 245.40, totalTollCost = 45, grandTotal = 290.40
