## ADDED Requirements

### Requirement: Dark mode toggle
The system SHALL provide a light/dark theme toggle accessible from the top navigation bar. The user's preference MUST persist across sessions and the system MUST respect the OS-level `prefers-color-scheme` setting on first visit.

#### Scenario: Toggle to dark mode
- **WHEN** user clicks the moon icon in the top nav
- **THEN** all page surfaces invert: canvas becomes dark brown (#1a1915), text becomes light cream (#f5f0e8), cards become dark elevated (#1f1e1b), and the preference is saved to localStorage

#### Scenario: Toggle back to light mode
- **WHEN** user clicks the sun icon in the top nav while in dark mode
- **THEN** the theme reverts to light cream canvas with dark ink text

#### Scenario: Persist preference across sessions
- **WHEN** user has selected dark mode and refreshes the page
- **THEN** the page loads in dark mode with no flash of light mode

#### Scenario: Respect system preference on first visit
- **WHEN** a new user visits with their OS set to dark mode and no stored preference exists
- **THEN** the app loads in dark mode

### Requirement: Dark palette
The system MUST define a complete dark-mode color palette that inverts all light-mode design tokens while maintaining the coral primary accent. Accent colors (teal, amber) and semantic colors (success, warning, error) MUST remain readable on dark backgrounds.

#### Scenario: All components render correctly in dark mode
- **WHEN** dark mode is active
- **THEN** all pages, cards, forms, tables, modals, and badges render with correct contrast and no hardcoded light colors bleed through

### Requirement: Footer distinction in dark mode
The footer SHALL remain visually distinct from the page canvas in dark mode via a darker background and subtle top border.

#### Scenario: Footer in dark mode
- **WHEN** dark mode is active
- **THEN** the footer background (#11100e) is darker than the page canvas (#1a1915) and a top border separates them
