## Why

Currently, the fill-up action archives **all** active trips for a car in one shot. This is inflexible — users often want to fill up for only a subset of trips (e.g., a specific road trip or weekend) while leaving other ongoing trips active. The only workaround is to manually delete unwanted trips before filling up, which loses data. This feature gives users control over which trips contribute to each fill-up.

## What Changes

- Add a trip selection step between clicking "Fill Up" and the confirmation modal, where users can check/uncheck which active trips to include
- Modify the `FILL_UP` reducer action to accept an explicit list of trip IDs instead of implicitly archiving all active trips for the car
- Update the FillUpButton component to render the selection UI and pass selected trip IDs through to the dispatch
- The confirmation modal's cost summary recalculates based on the selected subset
- **BREAKING**: The `FILL_UP` action signature changes — it now requires `tripIds: string[]` in addition to `carId`

## Capabilities

### New Capabilities
- `trip-selection`: A selection step in the fill-up flow allowing users to choose which active trips to include, with select-all/deselect-all controls and live cost preview

### Modified Capabilities
- `fill-up`: The "Perform a fill-up" requirement changes from "archive all active trips" to "archive only the selected subset of active trips." The `FILL_UP` reducer action must accept an explicit trip ID list instead of implicitly targeting all active trips. All fill-up computation and undo behavior remains unchanged structurally, but the user-facing flow adds a selection step before confirmation.

## Impact

- **Affected code**: `src/components/FillUpButton.tsx` (new selection UI + updated confirmation), `src/context/AppContext.tsx` (`FILL_UP` reducer signature change), `src/pages/CarDetailPage.tsx` (no functional change, still renders FillUpButton with carId)
- **Affected specs**: `fill-up` (requirement change), `fill-up-undo` (no change needed — undo still restores all trips from the fill-up record regardless of selection)
- **No new dependencies**: Selection UI uses existing components/patterns (checkboxes, TripTable)
- **Data model**: No changes to `Trip` or `FillUp` types — the `tripIds` field on FillUp already exists
