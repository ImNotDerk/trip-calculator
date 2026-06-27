## Context

The app currently supports two car operations: `ADD_CAR` and `REMOVE_CAR`. The `Car` interface has four fields: `id` (auto-generated), `name` (required), `plateNumber` (optional), and `createdAt` (auto-set). The Car Management page (`/cars`) lists all cars in a responsive grid with "View Details" and "Delete" buttons. The Car Detail page (`/cars/:carId`) shows the car's name and plate in an `<h1>` with trip counts and action buttons.

Users who make a typo in a car's name or need to update a plate number must currently delete the car — which cascade-deletes all its trips and fill-ups — and start over. This is unnecessarily destructive for a simple rename.

## Goals / Non-Goals

**Goals:**
- Allow users to edit a car's `name` and `plateNumber` after creation
- Reuse existing UI patterns (modal form, input styling, validation) from the Add Car flow
- Persist edits through the existing write-through localStorage mechanism
- Show edit button on both Car Management page (card-level) and Car Detail page (header-level)

**Non-Goals:**
- Adding new car fields (make, model, year, color) — out of scope
- Inline editing (click-to-edit in place without modal) — modal-only for consistency
- Editing from the CarSelector dropdown — the dropdown is for quick switching, not management
- Bulk editing multiple cars
- Editing `id` or `createdAt` — these are immutable creation metadata

## Decisions

### Decision 1: Use a modal for editing

**Chosen: Modal dialog (same pattern as Add Car)**

Alternatives considered:
- **Inline edit on the card**: Would require managing edit state per card, feels cramped on small screens, and breaks visual consistency with Add Car flow
- **New page route (`/cars/:carId/edit`)**: Overkill for two fields; adds navigation complexity with cancel/back behavior

Rationale: The Add Car modal is an established, tested pattern. Reusing it for editing gives users a familiar experience and keeps the diff small.

### Decision 2: Shared EditCarModal component vs inline modals

**Chosen: Shared `EditCarModal` component**

Alternatives considered:
- **Inline modals in each page**: Duplicates form markup, buttons, and validation logic across CarManagementPage and CarDetailPage
- **Single modal in App-level layout**: Overcomplicates state lifting; the modal should be local to the triggering page

Rationale: A shared component avoids duplication while keeping each page responsible for its own open/close state and the car data it passes in. This mirrors how the Add Car modal is duplicated between CarManagementPage and CarSelector — but extracting EditCarModal from the start avoids that same duplication for the edit flow.

### Decision 3: `UPDATE_CAR` action shape

**Chosen: `{ type: "UPDATE_CAR"; carId: string; name: string; plateNumber?: string }`**

Alternatives considered:
- **Partial update (`Partial<Car>` payload)**: More flexible but over-engineered for two editable fields; type safety is weaker
- **Separate `RENAME_CAR` + `UPDATE_PLATE` actions**: Unnecessary granularity; both fields are edited in the same form

Rationale: A single action with explicit `name` and `plateNumber` fields mirrors `ADD_CAR`'s shape and allows both fields to be updated atomically. The reducer trims values and validates that name is non-empty.

### Decision 4: No confirmation step for save

**Chosen: Single-click save (no "Confirm?" toggle)**

Alternatives considered:
- **Two-click confirmation**: Used for delete (destructive) but edit is reversible — users can just edit again
- **Undo toast**: Adds complexity without clear benefit; a rename error is trivially corrected by editing again

Rationale: Unlike delete, edit is non-destructive. The only validation is "name cannot be empty," which is handled inline in the form (disabled submit button + error message).

## Risks / Trade-offs

- **Accidental overwrite**: User could unknowingly change a car's name to something incorrect. → Mitigation: Editing is always non-destructive; the previous name is recoverable by editing again. No data is lost.
- **Concurrent edit confusion**: If a car is renamed while showing data for the old name on another page, the stale name appears until React re-renders. → Mitigation: The reducer updates state immutably; React re-renders all consumers immediately. localStorage is write-through so a refresh picks up the latest values.
