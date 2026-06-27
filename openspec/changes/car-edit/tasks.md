## 1. Types and State

- [x] 1.1 Add `UPDATE_CAR` to the `Action` union type in `src/types/index.ts` with shape `{ type: "UPDATE_CAR"; carId: string; name: string; plateNumber?: string }`
- [x] 1.2 Add `UPDATE_CAR` case to the reducer in `src/context/AppContext.tsx` — trim `name` and `plateNumber`, reject empty `name` (no-op), update the matching car's `name` and `plateNumber` while preserving `id` and `createdAt`

## 2. EditCarModal Component

- [x] 2.1 Create `src/components/EditCarModal.tsx` — a controlled modal component receiving `car`, `onClose`, and a dispatch-capable `onSave` callback
- [x] 2.2 Implement form UI with pre-filled "Car Name" (required) and "Plate Number" (optional) inputs, reusing the same styling classes as the Add Car modal (input height, border, focus ring, typography)
- [x] 2.3 Add validation: name input cannot be empty after trimming — show inline error "Car name cannot be empty." and disable the Save button when invalid
- [x] 2.4 Wire Cancel button, backdrop click, and Escape key to call `onClose` without dispatching
- [x] 2.5 Wire Save button to call `onSave(name, plateNumber)` which dispatches `UPDATE_CAR` and closes the modal

## 3. Car Management Page Integration

- [x] 3.1 Add `EditCarModal` import and edit modal state (`editingCar`, `setEditingCar`) to `src/pages/CarManagementPage.tsx`
- [x] 3.2 Add "Edit" button to each car card (text-only muted link style, positioned next to "Delete" with a separator) that sets `editingCar` to open the modal
- [x] 3.3 Render `EditCarModal` when `editingCar` is set, passing the car data, `onClose={() => setEditingCar(null)}`, and `onSave` that dispatches `UPDATE_CAR` then clears `editingCar`

## 4. Car Detail Page Integration

- [x] 4.1 Add `EditCarModal` import and edit modal state to `src/pages/CarDetailPage.tsx`
- [x] 4.2 Add a small outlined "Edit" button near the car name and plate number header
- [x] 4.3 Render `EditCarModal` with the same pattern as Car Management page

## 5. Verification

- [x] 5.1 Run `npm run build` to verify TypeScript compiles without errors
- [x] 5.2 Run `npm run dev` and manually test: add a car, edit its name from Car Management page, verify update appears in CarSelector and Car Detail page
- [x] 5.3 Test validation: save with empty name is blocked, Cancel closes without saving, Escape key dismisses modal
- [x] 5.4 Test edit from Car Detail page, verify header updates after save
- [x] 5.5 Refresh the page and verify edits persist (localStorage write-through)
- [x] 5.6 Verify trips and fill-ups are unaffected by car edits
