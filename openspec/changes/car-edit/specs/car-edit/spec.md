## ADDED Requirements

### Requirement: UPDATE_CAR reducer action

The system SHALL support a new `UPDATE_CAR` action in the application reducer that updates an existing car's `name` and `plateNumber` fields by its `id`. The action SHALL trim whitespace from both fields. If `plateNumber` is an empty string after trimming, it SHALL be set to `undefined`. If `name` is empty after trimming, the update SHALL be rejected (no-op). The `id` and `createdAt` fields SHALL remain unchanged.

#### Scenario: Successful update of both fields

- **WHEN** the `UPDATE_CAR` action is dispatched with a valid `carId`, a non-empty `name`, and a `plateNumber`
- **THEN** the car with the matching `id` SHALL have its `name` and `plateNumber` updated, `id` and `createdAt` unchanged, and the updated car list SHALL persist to localStorage via the existing write-through mechanism

#### Scenario: Update name only

- **WHEN** the `UPDATE_CAR` action is dispatched with a valid `carId`, a non-empty `name`, and no `plateNumber`
- **THEN** the car SHALL have its `name` updated and `plateNumber` set to `undefined`

#### Scenario: Update plate number only

- **WHEN** the `UPDATE_CAR` action is dispatched with a valid `carId`, a non-empty `name` matching the current value, and a new `plateNumber`
- **THEN** only the `plateNumber` SHALL be updated; `name` remains unchanged

#### Scenario: Reject empty name

- **WHEN** the `UPDATE_CAR` action is dispatched with a `name` that is empty or whitespace-only after trimming
- **THEN** the car SHALL remain unchanged and no update SHALL occur

#### Scenario: Non-existent car ID

- **WHEN** the `UPDATE_CAR` action is dispatched with a `carId` that does not match any existing car
- **THEN** the state SHALL remain unchanged

#### Scenario: Idempotent update

- **WHEN** the `UPDATE_CAR` action is dispatched with `name` and `plateNumber` values identical to the car's current values
- **THEN** the car SHALL remain unchanged (no-op at the data level)

---

### Requirement: Edit button on Car Management page

The Car Management page (`/cars`) SHALL display an "Edit" button on each car card in the car list grid. When clicked, the button SHALL open an `EditCarModal` pre-filled with that car's current `name` and `plateNumber`. The button SHALL use the same text-only muted link style as the existing "Delete" button, positioned adjacent to it, with a separator between them.

#### Scenario: Edit button visible on each car card

- **WHEN** the Car Management page renders with one or more cars
- **THEN** each car card SHALL display an "Edit" button alongside "View Details" and "Delete"

#### Scenario: Clicking Edit opens modal

- **WHEN** the user clicks the "Edit" button on a car card
- **THEN** an `EditCarModal` SHALL open with the car's current `name` pre-filled in the name input and `plateNumber` pre-filled in the plate input (empty if no plate)

#### Scenario: Edit button hidden when modal is open

- **WHEN** the edit modal is visible
- **THEN** clicking "Edit" on another car SHALL be blocked by the modal overlay

---

### Requirement: EditCarModal component

The system SHALL provide an `EditCarModal` component that reuses the same form pattern as the Add Car modal. It SHALL display a pre-filled form with "Car Name" (required) and "Plate Number" (optional) inputs, a "Cancel" button that closes the modal without saving, and a "Save Changes" button that dispatches `UPDATE_CAR`. The Save button SHALL be disabled when the name input is empty. The modal SHALL use the same styling tokens (border, background, typography, button radius) as the existing Add Car modal.

#### Scenario: Modal renders pre-filled

- **WHEN** the `EditCarModal` renders with car data `{ name: "My Car", plateNumber: "ABC-123" }`
- **THEN** the name input SHALL display "My Car" and the plate input SHALL display "ABC-123"

#### Scenario: Save dispatches UPDATE_CAR

- **WHEN** the user modifies the name to "Updated Car", clears the plate number, and clicks "Save Changes"
- **THEN** the `UPDATE_CAR` action SHALL be dispatched with `name: "Updated Car"` and `plateNumber: undefined`, and the modal SHALL close

#### Scenario: Cancel closes modal without saving

- **WHEN** the user modifies the name and clicks "Cancel"
- **THEN** the modal SHALL close and no `UPDATE_CAR` action SHALL be dispatched

#### Scenario: Empty name disables Save

- **WHEN** the name input is empty or whitespace-only
- **THEN** the Save button SHALL be disabled and an error message "Car name cannot be empty." SHALL be displayed

#### Scenario: Modal closes on backdrop click

- **WHEN** the user clicks the modal backdrop (outside the card)
- **THEN** the modal SHALL close without dispatching any action

#### Scenario: Modal closes on Escape key

- **WHEN** the user presses the Escape key while the modal is open
- **THEN** the modal SHALL close without dispatching any action

---

### Requirement: Edit button on Car Detail page

The Car Detail page (`/cars/:carId`) SHALL display an "Edit" button near the car name and plate number header. When clicked, the button SHALL open an `EditCarModal` pre-filled with the current car data, identical in behavior to the Car Management page edit flow. The button SHALL use a small outlined style consistent with other secondary actions on the page.

#### Scenario: Edit button visible on detail page

- **WHEN** the Car Detail page renders for a valid car
- **THEN** an "Edit" button SHALL be displayed adjacent to the car name and plate number

#### Scenario: Clicking Edit opens modal on detail page

- **WHEN** the user clicks the "Edit" button on the Car Detail page
- **THEN** an `EditCarModal` SHALL open pre-filled with the current car data

#### Scenario: Saved edit updates detail page display

- **WHEN** the user saves an edit from the Car Detail page's modal
- **THEN** the car name and plate number displayed on the page SHALL update to reflect the new values
