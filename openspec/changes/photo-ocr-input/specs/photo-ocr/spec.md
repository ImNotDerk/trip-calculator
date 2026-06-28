## ADDED Requirements

### Requirement: Photo capture via camera or file upload

The system SHALL provide an image input mechanism on the Add Trip form for each of the two dashboard fields (Fuel Consumption km/L and Distance km). Each input SHALL support both in-the-moment camera capture and uploading a previously taken photo from the device's gallery.

#### Scenario: User captures a photo with camera

- **WHEN** user taps the camera button on a photo OCR slot
- **THEN** the device's native camera opens (rear/environment-facing on mobile)
- **AND** the captured image is displayed as a preview in the slot

#### Scenario: User uploads a photo from gallery

- **WHEN** user taps the upload/choose-file button on a photo OCR slot
- **THEN** the device's file picker opens, filtered to image types (JPEG, PNG, WebP)
- **AND** the selected image is displayed as a preview in the slot

#### Scenario: Camera permission denied

- **WHEN** user taps the camera button but the browser cannot access the camera (permission denied or no camera available)
- **THEN** the system SHALL display an inline message: "Camera unavailable — upload a photo instead"
- **AND** the file upload button remains functional as a fallback

### Requirement: Client-side OCR extraction

The system SHALL use Tesseract.js (WASM) to extract text from the captured/uploaded image entirely in the browser. No image data SHALL be sent to any external server.

#### Scenario: Successful OCR extraction of a numeric value

- **WHEN** user taps "Extract" on a photo preview
- **THEN** the system SHALL display a "Processing…" indicator with a progress bar
- **AND** upon completion, extract the first decimal or integer numeric value from the recognized text
- **AND** populate the corresponding form field (km/L or distance) with the extracted number
- **AND** display a success indicator (green checkmark) on the photo slot

#### Scenario: OCR finds no numeric text

- **WHEN** OCR completes but no numeric value is found in the recognized text
- **THEN** the system SHALL display a warning: "No number found — please type manually"
- **AND** the form field SHALL NOT be modified

#### Scenario: OCR module loading on first use

- **WHEN** user triggers OCR for the first time (no prior session in this page load)
- **THEN** the Tesseract.js module SHALL be dynamically imported
- **AND** the user SHALL see a "Loading OCR engine…" indicator during the download
- **AND** OCR proceeds once the module is ready

### Requirement: OCR result feedback and override

The system SHALL clearly indicate the OCR result status and SHALL always allow the user to override the extracted value by editing the form field directly.

#### Scenario: User edits an OCR-populated field

- **WHEN** OCR populates a form field with an extracted value
- **THEN** the field SHALL remain editable as a standard number input
- **AND** the user SHALL be able to modify the value before submitting the trip

#### Scenario: OCR confidence display

- **WHEN** OCR extraction completes
- **THEN** the system SHALL display the Tesseract confidence score as a percentage (e.g., "Confidence: 87%")
- **AND** confidence below 60% SHALL be displayed with a warning color (amber)
- **AND** confidence below 40% SHALL be displayed with an error color (red)

### Requirement: Image lifecycle management

The system SHALL manage the lifecycle of captured/uploaded images to minimize memory usage and protect user privacy.

#### Scenario: Image discarded after extraction

- **WHEN** OCR extraction completes (success or failure)
- **THEN** the captured image blob URL SHALL be revoked
- **AND** the preview SHALL persist until the user captures a new image or navigates away

#### Scenario: User replaces a photo before extraction

- **WHEN** user captures or uploads a new photo while a previous unprocessed photo exists
- **THEN** the previous image's blob URL SHALL be revoked
- **AND** the new image SHALL replace it in the preview

#### Scenario: No photo persistence between page navigations

- **WHEN** user navigates away from the Add Trip page
- **THEN** all captured images SHALL be discarded
- **AND** OCR state SHALL reset on next visit

### Requirement: Feature is opt-in and non-blocking

The system SHALL treat photo OCR as an optional convenience feature. Manual numeric input SHALL remain the primary interaction pattern, and the trip form SHALL function identically when OCR is not used.

#### Scenario: Trip form submits without OCR

- **WHEN** user fills in the Distance and Fuel Consumption fields manually (without using OCR)
- **THEN** the form SHALL submit and create a trip exactly as it does today
- **AND** no OCR-related UI SHALL interfere with the manual input flow

#### Scenario: Mixed mode — one field OCR, one field manual

- **WHEN** user uses OCR to populate the Distance field but types Fuel Consumption manually
- **THEN** both values SHALL be included in the trip submission
- **AND** validation rules SHALL apply equally to both fields
