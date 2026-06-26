## ADDED Requirements

### Requirement: Persist all data to localStorage
The system SHALL save all cars, trips, and fill-ups to localStorage on every state change. The system MUST restore all data on app load.

#### Scenario: Data survives page refresh
- **WHEN** user has added cars, logged trips, and performed fill-ups, then refreshes the page
- **THEN** all cars, active trips, and fill-up history are restored exactly as they were

#### Scenario: First-time load with no data
- **WHEN** the app loads for the first time with no data in localStorage
- **THEN** the system initializes with empty cars, trips, and fill-ups collections

### Requirement: Data integrity
The system MUST maintain referential integrity: when a car is deleted, all its trips and fill-ups MUST also be deleted. When a fill-up is deleted, its linked trips MUST be deleted.

#### Scenario: Cascade delete car
- **WHEN** user deletes Car A which has 5 trips and 2 fill-ups
- **THEN** Car A and all 5 trips and 2 fill-ups are removed from localStorage

#### Scenario: Cascade delete fill-up
- **WHEN** user deletes a fill-up
- **THEN** the fill-up record and all trips linked to it are removed from localStorage
