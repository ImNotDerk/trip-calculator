## MODIFIED Requirements

### Requirement: Perform a fill-up
The system SHALL allow the user to "fill up" — select a subset of active trips for the selected car, archive those trips at a given gas price, compute total costs from the selected trips, and clear the selected trips from the active list. This creates a FillUp record that groups the archived trips. The user SHALL be presented with a trip selection step before confirming the fill-up.

#### Scenario: Fill up with selected trips
- **WHEN** user enters a gas price of 60 per liter, clicks "Fill Up", selects 2 of 3 active trips, confirms the selection, and confirms the cost summary
- **THEN** only the 2 selected trips are marked as "filled" and linked to a new FillUp record. The 1 unselected trip remains active. The FillUp record contains: date of fill-up, gas price, sum of selected trip distances, sum of selected trip fuel usage, total fuel cost (fuel sum × gas price), sum of selected trip tolls, and grand total (fuel cost + tolls).

#### Scenario: Fill up with all trips selected (default behavior)
- **WHEN** user clicks "Fill Up", leaves all active trips selected (default), confirms the selection, and confirms the cost summary
- **THEN** all active trips for the current car are marked as "filled" and linked to a new FillUp record. This matches the previous behavior but now requires explicit selection confirmation.

#### Scenario: Fill up with no active trips
- **WHEN** user clicks "Fill Up" but there are no active trips for the selected car
- **THEN** the Fill Up button is disabled with a message that there are no trips to fill up. No selection modal appears.

#### Scenario: Fill up confirmation
- **WHEN** user confirms their trip selection
- **THEN** the system shows a confirmation dialog with the total cost summary (computed from selected trips only) before finalizing

#### Scenario: FILL_UP reducer action with explicit tripIds
- **WHEN** the `FILL_UP` action is dispatched with `{ carId, tripIds: [id1, id3] }`
- **THEN** only trips whose IDs are in the `tripIds` array are archived. Other active trips for the same car remain unchanged. The new FillUp record's `tripIds` field equals the dispatched `tripIds` array.
