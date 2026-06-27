## Why

Users can currently add and delete cars but cannot edit a car's name or plate number after creation. A simple typo requires deleting the car (losing all associated trips and fill-ups) and re-creating it from scratch. This change fills that gap by adding a non-destructive edit capability.

## What Changes

- New `UPDATE_CAR` reducer action that updates a car's `name` and/or `plateNumber` by `carId`
- Edit button on each car card in the Car Management page (`/cars`) that opens a pre-filled edit modal
- Edit button on the Car Detail page (`/cars/:carId`) near the car header
- Edit modal reuses the existing Add Car form pattern (name required with validation, plate number optional) pre-filled with the car's current values

## Capabilities

### New Capabilities

- `car-edit`: Allow users to edit a car's name and plate number after creation via a modal form, with a new `UPDATE_CAR` reducer action

### Modified Capabilities

<!-- No existing spec requirements are changing. Car add/delete behavior remains unchanged. -->

## Impact

- **Modified files**: `src/types/index.ts` (new action type), `src/context/AppContext.tsx` (new reducer case), `src/pages/CarManagementPage.tsx` (edit button + modal), `src/pages/CarDetailPage.tsx` (edit button + modal)
- **New files**: `src/components/EditCarModal.tsx` (shared edit modal component)
- **localStorage**: No new keys; `UPDATE_CAR` modifies existing `trip-calc-cars` data
- **Breaking changes**: None
