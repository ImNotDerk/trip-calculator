## ADDED Requirements

### Requirement: Export data to a backup file
The system SHALL allow the user to download all app data (cars, trips, fill-ups, gas price) as a versioned JSON file. The download MUST be triggered from a "Download Backup" button on the Dashboard page.

#### Scenario: Export with data
- **WHEN** the user has cars, trips, fill-ups, and a gas price set, and clicks "Download Backup"
- **THEN** a JSON file named `trip-calculator-backup-YYYY-MM-DD.json` is downloaded containing a versioned envelope with all data

#### Scenario: Export with empty state
- **WHEN** the user has no data (empty cars, trips, fill-ups, gas price = 0) and clicks "Download Backup"
- **THEN** a valid JSON file is downloaded with empty arrays and gas price of 0

#### Scenario: Backup file format
- **WHEN** a backup file is downloaded
- **THEN** the file contains a JSON object with `version: 1`, `exportedAt` (ISO 8601 timestamp), and a `data` object containing `cars`, `trips`, `fillUps`, and `gasPrice`

### Requirement: Import backup from a file
The system SHALL allow the user to import a backup by selecting a `.json` file via the native file picker, triggered from an "Import File" button on the Dashboard page.

#### Scenario: Import a valid backup file
- **WHEN** the user selects a valid backup `.json` file
- **THEN** a confirmation modal appears showing the summary of data to be imported (counts of cars, trips, fill-ups, and gas price)

#### Scenario: Import an invalid or corrupt file
- **WHEN** the user selects a file that is not valid JSON, has wrong structure, or has an unsupported version
- **THEN** a toast notification appears with a descriptive error message, and the current app state is unchanged

#### Scenario: Same file selected twice
- **WHEN** the user selects the same backup file twice in succession
- **THEN** the import flow processes the file both times normally (the file input is reset after each selection)

### Requirement: Import backup by pasting
The system SHALL allow the user to import a backup by pasting the raw JSON contents into a text area, triggered from a "Paste Backup" button on the Dashboard page.

#### Scenario: Paste valid backup data
- **WHEN** the user pastes valid backup JSON into the paste modal textarea and clicks "Continue"
- **THEN** the paste modal closes and the confirmation modal appears showing the import summary

#### Scenario: Paste invalid data
- **WHEN** the user pastes invalid or malformed JSON and clicks "Continue"
- **THEN** an inline error message is displayed below the textarea, and the paste modal stays open

#### Scenario: Paste empty text
- **WHEN** the user clicks "Continue" in the paste modal with an empty or whitespace-only textarea
- **THEN** an inline error message "Please paste the backup data first." is displayed

#### Scenario: Paste modal textarea styling
- **WHEN** the paste modal is open
- **THEN** the textarea uses JetBrains Mono monospace font and placeholder text showing the expected JSON structure

#### Scenario: Cancel paste modal
- **WHEN** the user clicks "Cancel" in the paste modal
- **THEN** the modal closes, the textarea is cleared, and no state changes occur

### Requirement: Confirmation before import
The system SHALL show a confirmation modal before replacing all app data during an import. The modal MUST display a summary of what will be imported, a warning about data replacement, and Cancel / Import buttons.

#### Scenario: Confirm import
- **WHEN** the user clicks "Import" in the confirmation modal
- **THEN** a safety backup of the current state is automatically downloaded, the new data replaces all existing state via `REPLACE_ALL` action, and a success toast appears with the imported counts

#### Scenario: Cancel import
- **WHEN** the user clicks "Cancel" in the confirmation modal
- **THEN** the modal closes and the current app state is unchanged

#### Scenario: Importing overlay prevents double-click
- **WHEN** the user confirms an import and the import is in progress
- **THEN** an "Importing…" overlay is shown and further interaction is blocked until the operation completes

### Requirement: Safety backup before import
Before replacing app data during an import, the system MUST automatically download a safety backup of the current state. This ensures the user can recover their data if the import was a mistake.

#### Scenario: Safety backup is downloaded
- **WHEN** the user confirms an import
- **THEN** a file named `trip-calculator-safety-backup-YYYY-MM-DD.json` is downloaded containing the current app state before the data is replaced

### Requirement: Data replacement on import
The system MUST replace all persisted data (cars, trips, fill-ups, gas price) with the imported data atomically via a `REPLACE_ALL` reducer action. The selected car ID MUST be reset to null after import.

#### Scenario: Full data replacement
- **WHEN** an import is confirmed
- **THEN** all four data stores (cars, trips, fill-ups, gas price) are replaced with the imported values, `selectedCarId` is set to null, and the new state is persisted to localStorage

#### Scenario: Import empty data
- **WHEN** a user imports a backup with zero cars, zero trips, zero fill-ups, and gas price of 0
- **THEN** all current data is cleared and the app shows the empty state

### Requirement: Backup validation
The system MUST validate imported backup data before accepting it. Validation checks: valid JSON syntax, correct envelope structure (version, exportedAt, data), array types for cars/trips/fillUps, number type for gasPrice, and required fields (id, name on cars; id, carId on trips; id, carId on fillUps).

#### Scenario: Invalid JSON syntax
- **WHEN** the imported file or pasted text is not valid JSON
- **THEN** the error "Invalid JSON file." is reported and no state change occurs

#### Scenario: Unsupported version
- **WHEN** the backup file has a `version` field that is not `1`
- **THEN** the error "Unsupported backup version: X. Expected version 1." is reported

#### Scenario: Missing data fields
- **WHEN** the backup file is missing required top-level data fields (cars, trips, fillUps, gasPrice)
- **THEN** a specific error is reported indicating which field is missing or invalid

#### Scenario: Invalid records in arrays
- **WHEN** the backup file contains a car without an `id` or `name`, a trip without an `id` or `carId`, or a fill-up without an `id` or `carId`
- **THEN** a specific error is reported indicating the type of invalid record found

### Requirement: Backup UI placement
The backup controls SHALL be displayed as a card section on the Dashboard page, separated from the car summaries by a hairline rule. The section must be accessible regardless of whether any cars exist.

#### Scenario: Backup section with cars
- **WHEN** cars exist and the Dashboard shows the car grid
- **THEN** the backup section appears below a hairline separator after the car grid

#### Scenario: Backup section without cars
- **WHEN** no cars exist and the Dashboard shows the empty state
- **THEN** the backup section appears below a hairline separator after the empty state card

### Requirement: Three-button layout
The backup card SHALL present three buttons: "Download Backup" (primary, coral), "Import File" (secondary outline), and "Paste Backup" (secondary outline). All three buttons must be responsive and wrap on narrow screens.

#### Scenario: Button layout on desktop
- **WHEN** the Dashboard is viewed on a screen wider than the button group
- **THEN** all three buttons appear in a single row

#### Scenario: Button layout on mobile
- **WHEN** the Dashboard is viewed on a narrow screen
- **THEN** the buttons wrap to multiple rows as needed
