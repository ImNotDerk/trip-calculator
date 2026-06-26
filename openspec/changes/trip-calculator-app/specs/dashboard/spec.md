## ADDED Requirements

### Requirement: Show per-car summary
The system SHALL display a summary dashboard for each car showing: total distance, total fuel used, total tolls, and number of active trips.

#### Scenario: Dashboard with active trips
- **WHEN** Car A has 3 active trips totaling 66.1km, 5.84L fuel, and 45 in tolls
- **THEN** the dashboard for Car A shows: 3 trips, 66.1 km, 5.84 L, 45 in tolls

#### Scenario: Dashboard with empty car
- **WHEN** Car A has no active trips
- **THEN** the dashboard shows zeros for all stats and "No active trips" message

### Requirement: Live cost estimate
The system SHALL allow the user to input a gas price per liter. All cost estimates MUST update in real-time as the gas price changes.

#### Scenario: Cost estimate updates
- **WHEN** user enters a gas price of 60 and Car A has 5.84L of active fuel usage
- **THEN** the estimated fuel cost for Car A displays as 350.40

#### Scenario: Update gas price
- **WHEN** user changes the gas price from 60 to 65
- **THEN** all displayed cost estimates update immediately to reflect the new price

### Requirement: All-cars overview
The system SHALL show summary cards for all cars on the dashboard page side by side.

#### Scenario: Two cars on dashboard
- **WHEN** both Car A and Car B exist with active trips
- **THEN** the dashboard shows a summary card for each car with their respective stats and cost estimates
