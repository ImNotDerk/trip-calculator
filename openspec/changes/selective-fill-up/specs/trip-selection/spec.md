## ADDED Requirements

### Requirement: Trip selection in fill-up flow
The system SHALL present a trip selection step when the user initiates a fill-up, allowing them to choose which active trips to include before seeing the cost-summary confirmation. All active trips for the car SHALL be pre-selected by default.

#### Scenario: Selection modal opens with all trips checked
- **WHEN** user clicks "Fill Up" and the car has 4 active trips
- **THEN** a selection modal appears listing all 4 trips with checkboxes, all checked. A running totals footer shows the aggregate distance, fuel usage, and tolls for all 4 selected trips.

#### Scenario: Deselect individual trips
- **WHEN** user unchecks 1 of 4 trips in the selection modal
- **THEN** that trip's row becomes unchecked, the running totals footer recalculates to reflect only the 3 selected trips, and the "Confirm Selection" button remains enabled.

#### Scenario: Deselect all trips
- **WHEN** user unchecks every trip in the selection modal (or uses "Deselect All")
- **THEN** the running totals footer shows zeros, and the "Confirm Selection" button is disabled with a message indicating at least one trip must be selected.

#### Scenario: Select All / Deselect All toggle
- **WHEN** user clicks "Select All" (or "Deselect All") in the selection modal header
- **THEN** all trip checkboxes toggle to the corresponding state, and the running totals footer updates accordingly.

#### Scenario: Confirm selection proceeds to cost summary
- **WHEN** user has selected a subset of trips and clicks "Confirm Selection"
- **THEN** the selection modal closes and the existing cost-summary confirmation modal opens, showing totals computed only from the selected trips.

#### Scenario: Cancel selection returns to car detail
- **WHEN** user clicks "Cancel" in the selection modal
- **THEN** the modal closes with no state change, and no fill-up is performed.

#### Scenario: Selection modal with a single active trip
- **WHEN** user clicks "Fill Up" and the car has only 1 active trip
- **THEN** the selection modal still appears with that single trip pre-checked. This maintains UI consistency regardless of trip count.

### Requirement: Live cost preview in selection modal
The system SHALL display a live-updating cost summary footer in the selection modal that reflects only the currently selected trips.

#### Scenario: Cost preview updates on toggle
- **WHEN** user checks or unchecks a trip in the selection modal
- **THEN** the footer immediately updates to show total distance, total fuel usage, total tolls, and estimated fuel cost (total fuel × current gas price) for the selected trips only.

#### Scenario: Cost preview shows zero when nothing selected
- **WHEN** no trips are selected
- **THEN** the footer shows all values as zero.
