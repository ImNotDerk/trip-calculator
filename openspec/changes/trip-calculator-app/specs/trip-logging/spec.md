## ADDED Requirements

### Requirement: Log a trip
The system SHALL allow the user to log a trip with date, direction, distance (km), fuel consumption rate (km/L), and optional toll cost. The system MUST auto-compute estimated fuel usage as `distanceKm / fuelConsumptionKmL`.

#### Scenario: Log trip successfully
- **WHEN** user fills in date, selects direction ("to", "from", or "other"), enters distance of 26km and fuel consumption of 11.8km/L, and submits
- **THEN** the trip is created with estimated usage of 2.20L (rounded to 2 decimal places) and status "active"

#### Scenario: Log trip with toll
- **WHEN** user logs a trip and enters a toll cost of 45
- **THEN** the trip is created with tollCost = 45

#### Scenario: Missing required fields
- **WHEN** user submits the trip form without a date, distance, or fuel consumption
- **THEN** the system shows a validation error for each missing field

#### Scenario: Log trip with label
- **WHEN** user enters an optional label (e.g., "grocery run")
- **THEN** the trip is created with the label attached

### Requirement: View active trips
The system SHALL display all active (not yet filled) trips for the selected car in a table with columns: Date, Direction, Distance (km), Fuel Consumption (km/L), Estimated Usage (L), Toll Cost.

#### Scenario: Active trips table
- **WHEN** user navigates to the car detail page
- **THEN** all active trips for that car are shown in a table sorted by date (newest first)

#### Scenario: No active trips
- **WHEN** there are no active trips for the selected car
- **THEN** the system displays an empty state message encouraging the user to log their first trip

### Requirement: Edit a trip
The system SHALL allow the user to edit any field of an active trip, including date, direction, distance, fuel consumption, and toll cost. Estimated usage MUST be recalculated when distance or fuel consumption changes.

#### Scenario: Edit trip distance
- **WHEN** user changes a trip's distance from 26km to 30km
- **THEN** the estimated usage is recalculated to 30 / fuelConsumptionKmL

### Requirement: Delete a trip
The system SHALL allow the user to delete an active trip. Filled trips MUST NOT be deletable except by deleting the entire fill-up.

#### Scenario: Delete active trip
- **WHEN** user clicks delete on an active trip and confirms
- **THEN** the trip is removed from the active list

#### Scenario: Cannot delete filled trip
- **WHEN** a trip has status "filled"
- **THEN** no delete button is shown for that individual trip
