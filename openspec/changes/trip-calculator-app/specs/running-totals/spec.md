## ADDED Requirements

### Requirement: Running totals in trip tables
All trip tables SHALL display a footer row (`<tfoot>`) showing the summed totals for distance (km), fuel usage (L), and toll costs (₱).

#### Scenario: Active trips table totals
- **WHEN** a car has 3 active trips with distances 26km, 20.1km, 20km, usage 2.20L, 1.89L, 1.95L, and tolls 0, 45, 30
- **THEN** the table footer shows: total distance = 66.1 km, total usage = 6.04 L, total tolls = ₱75

#### Scenario: Fill-up sub-table totals
- **WHEN** user expands a fill-up containing 2 trips
- **THEN** the sub-table footer shows the summed totals for those trips

#### Scenario: Table with no tolls
- **WHEN** no trips in the table have toll costs
- **THEN** the toll total displays "—" instead of "₱0"

### Requirement: Footer row styling
The footer row SHALL use a double-thickness top border and the soft surface background to visually separate it from the data rows.

#### Scenario: Footer visual distinction
- **WHEN** a trip table has a footer row
- **THEN** it is separated by a 2px border, uses `bg-surface-soft` background, and the label cell reads "Totals" in uppercase muted text
