## 1. Reducer Changes

- [x] 1.1 Update `FILL_UP` action type to require `tripIds: string[]` in the payload
- [x] 1.2 Modify the `FILL_UP` reducer to filter trips by the provided `tripIds` array instead of all active trips for the car
- [x] 1.3 Add validation: skip trips where `id` is not in `tripIds`, or where the trip is not active or doesn't belong to the car

## 2. Selection Modal UI

- [x] 2.1 Add selection state to `FillUpButton` (`selectedTripIds: string[]`, initialized to all active trip IDs)
- [x] 2.2 Create the selection modal with a trip list showing checkboxes, trip details (label, direction, distance, fuel, tolls), and a running-totals footer for selected trips only
- [x] 2.3 Add "Select All" / "Deselect All" toggle in the modal header
- [x] 2.4 Disable "Confirm Selection" button when zero trips are selected, with an inline message
- [x] 2.5 Add "Cancel" button that closes the modal without dispatching

## 3. Two-Step Flow Wiring

- [x] 3.1 Change "Fill Up" button onClick from opening the confirmation modal to opening the selection modal
- [x] 3.2 On "Confirm Selection", close the selection modal and open the existing confirmation modal with totals computed from selected trips only
- [x] 3.3 Update the confirmation modal to display per-trip breakdown for the selected trips (in addition to existing aggregate totals)
- [x] 3.4 On "Confirm Fill-Up", dispatch `FILL_UP` with `{ carId, tripIds: selectedTripIds }`
- [x] 3.5 Handle the single-active-trip case: still show the selection modal for UI consistency

## 4. Edge Cases & Cleanup

- [x] 4.1 When `activeTrips` changes (trips added/deleted while selection modal is open), dismiss the selection modal to prevent stale selections
- [x] 4.2 Ensure the toast "Undo" button after fill-up dispatches `UNDO_FILL_UP` correctly (no changes needed, but verify)
- [x] 4.3 Ensure the Last Fill-Up card on CarDetailPage and the FillUpHistoryPage undo still work correctly (no changes needed, but verify)
- [ ] 4.4 Manual smoke test: fill up all trips, fill up a subset, fill up a single trip, cancel at each step, undo each case
