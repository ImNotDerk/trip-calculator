## ADDED Requirements

### Requirement: App exposes version and changelog data
The system SHALL include a `public/version.json` file containing the current app version and a chronological list of changelog entries, each with a version, date, title, and list of change descriptions.

#### Scenario: Version file is accessible
- **WHEN** a GET request is made to `/trip-calculator/version.json`
- **THEN** the server SHALL return a JSON object with a `version` string and an `entries` array of changelog objects

#### Scenario: Version file has valid structure
- **WHEN** `version.json` is parsed at runtime
- **THEN** the response SHALL contain `version` (a non-empty semver string) and `entries` (an array where each entry has `version`, `date`, `title`, and `changes` fields)

---

### Requirement: App detects new versions on load
The system SHALL fetch `version.json` on every page load and compare the current version against the user's last-seen version stored in localStorage under the key `trip-calc-seen-version`.

#### Scenario: First-time visitor
- **WHEN** a user visits the app for the first time and no `trip-calc-seen-version` key exists in localStorage
- **THEN** the system SHALL show the changelog modal with all entries from `version.json`

#### Scenario: Returning user on same version
- **WHEN** a user visits the app and the `trip-calc-seen-version` value equals the `version` field in `version.json`
- **THEN** the system SHALL NOT show the changelog modal

#### Scenario: Returning user after version bump
- **WHEN** a user visits the app and the `trip-calc-seen-version` value differs from the `version` field in `version.json`
- **THEN** the system SHALL show the changelog modal with all entries from `version.json`

---

### Requirement: Changelog modal follows existing design patterns
The system SHALL render the changelog as a full-screen overlay modal matching the design patterns established by the FillUpButton confirmation modal.

#### Scenario: Modal structure
- **WHEN** the changelog modal is shown
- **THEN** it SHALL render a fixed backdrop overlay (`fixed inset-0 z-50 bg-ink/40`) with a centered card (`bg-canvas rounded-lg shadow-lg`)
- **AND** the card SHALL contain a "What's New" heading, a scrollable list of changelog entries, a close button in the header, and a "Got it" dismiss button in the footer

#### Scenario: Dark mode support
- **WHEN** the user has dark mode enabled
- **THEN** the modal SHALL use dark mode color tokens (dark canvas, dark ink, etc.) via CSS custom property inheritance

#### Scenario: Long changelog scrollability
- **WHEN** the changelog contains many entries that would exceed the viewport height
- **THEN** the entries list SHALL be scrollable with a maximum height constraint

---

### Requirement: Changelog modal can be dismissed
The system SHALL allow the user to dismiss the changelog modal, and upon dismissal, SHALL save the current version to localStorage so the modal does not appear again for the same version.

#### Scenario: Dismiss via "Got it" button
- **WHEN** the user clicks the "Got it" button in the modal footer
- **THEN** the system SHALL save the current `version` value to `localStorage` key `trip-calc-seen-version`
- **AND** the modal SHALL close

#### Scenario: Dismiss via X button
- **WHEN** the user clicks the X close button in the modal header
- **THEN** the system SHALL save the current `version` value to `localStorage` key `trip-calc-seen-version`
- **AND** the modal SHALL close

---

### Requirement: Error handling degrades gracefully
The system SHALL handle all failure modes silently — the app must continue to function normally regardless of whether the changelog modal succeeds or fails.

#### Scenario: Network error fetching version.json
- **WHEN** the fetch for `version.json` fails (network error, 404, or server unavailable)
- **THEN** the system SHALL NOT show the changelog modal
- **AND** the system SHALL NOT surface any error to the user (no console errors, no error toast)

#### Scenario: Malformed version.json
- **WHEN** `version.json` is fetched but the JSON is malformed or missing required fields
- **THEN** the system SHALL NOT show the changelog modal
- **AND** the system SHALL NOT surface any error to the user

#### Scenario: localStorage unavailable
- **WHEN** localStorage is unavailable (private browsing, quota exceeded)
- **THEN** the system SHALL still fetch and show the changelog modal
- **AND** localStorage write failures SHALL NOT prevent the modal from closing

#### Scenario: Component unmounts before fetch completes
- **WHEN** the user navigates away before the `version.json` fetch resolves
- **THEN** the system SHALL NOT attempt to update state on an unmounted component (no React warning)
