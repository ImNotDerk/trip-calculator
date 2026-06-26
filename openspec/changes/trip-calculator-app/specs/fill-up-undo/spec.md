## ADDED Requirements

### Requirement: Undo a fill-up
The system SHALL allow the user to undo the latest fill-up, removing the FillUp record and restoring all its linked trips back to active status. Undoing a fill-up MUST NOT delete the trip data — it only reverts the trips' status from "filled" to "active" and clears their `fillUpId`.

#### Scenario: Undo fill-up from toast notification
- **WHEN** user confirms a fill-up
- **THEN** a toast appears with an "Undo" button for 10 seconds. Clicking "Undo" restores all archived trips to the active tank.

#### Scenario: Undo fill-up from Last Fill-Up card
- **WHEN** user views the car detail page with a Last Fill-Up card visible
- **THEN** an "Undo" button is available. First click toggles "Confirm undo?", second click executes the undo and shows a success toast.

#### Scenario: Undo fill-up from history page
- **WHEN** user expands the latest fill-up on the Fill-Up History page
- **THEN** an "Undo — restore trips" button is visible. Clicking it shows a confirmation modal explaining that trips will be restored (not deleted). Confirming executes the undo.

#### Scenario: Undo only available for latest fill-up
- **WHEN** there are multiple fill-ups for a car
- **THEN** only the most recent fill-up shows the undo option, since undoing an older fill-up while newer ones exist would create an inconsistent state

#### Scenario: Undo vs Delete distinction
- **WHEN** user undoes a fill-up → trips are **restored to active** (data preserved)
- **WHEN** user deletes a fill-up → fill-up record is **removed and all linked trips are permanently deleted**

### Requirement: UNDO_FILL_UP reducer action
The reducer SHALL include an `UNDO_FILL_UP` action that finds the latest FillUp for the given `carId`, removes it from state, and sets all its linked trips' `status` to `"active"` and `fillUpId` to `null`.

#### Scenario: UNDO_FILL_UP with no fill-ups
- **WHEN** UNDO_FILL_UP is dispatched for a car with no fill-ups
- **THEN** state is returned unchanged
