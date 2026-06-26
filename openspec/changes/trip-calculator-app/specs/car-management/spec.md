## ADDED Requirements

### Requirement: Add a car
The system SHALL allow the user to add a car by providing a name (e.g., "Honda Civic").

#### Scenario: Add car successfully
- **WHEN** user enters a car name and submits the "Add Car" form
- **THEN** the car is created with a unique ID and appears in the car selector

#### Scenario: Empty car name
- **WHEN** user submits the form with an empty car name
- **THEN** the system shows a validation error and does not create the car

### Requirement: Switch between cars
The system SHALL allow the user to select the active car from a dropdown or tab selector at the top of the app. All displayed data (trips, fill-ups, summaries) MUST be scoped to the selected car.

#### Scenario: Switch active car
- **WHEN** user selects a different car from the car selector
- **THEN** all displayed trips and summaries update to reflect the newly selected car

#### Scenario: No cars exist
- **WHEN** no cars have been added yet
- **THEN** the system prompts the user to add their first car

### Requirement: Remove a car
The system SHALL allow the user to delete a car and all its associated trips and fill-ups.

#### Scenario: Delete car with confirmation
- **WHEN** user clicks delete on a car
- **THEN** the system asks for confirmation before permanently deleting the car, its trips, and its fill-ups
