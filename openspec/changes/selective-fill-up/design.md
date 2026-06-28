## Context

The current fill-up flow is a single-step confirmation: click "Fill Up" → see cost summary modal → confirm. All active trips for the car get archived into one FillUp record with no option to exclude any. The `FILL_UP` reducer action implicitly targets all `state.trips` matching `carId` with `status === "active"`.

This change inserts a trip selection step between the button click and the confirmation modal, giving users control over which trips contribute to the fill-up. The `tripIds` field already exists on the `FillUp` type, so the data model requires no changes.

## Goals / Non-Goals

**Goals:**
- Allow users to select a subset of active trips to include in a fill-up
- Default to all trips selected (preserving the current "all in" behavior as the default)
- Show a live cost summary that updates as trips are toggled
- Modify `FILL_UP` reducer to accept an explicit `tripIds` list
- Keep the existing undo, toast, and history behaviors intact

**Non-Goals:**
- Multi-car fill-ups (still scoped to one car)
- Saving partial selections as drafts (selection is ephemeral, per fill-up action)
- Changing the FillUp or Trip data types
- Refactoring the confirmation modal design (only the data it displays changes)

## Decisions

### Decision 1: Replace single modal with two-step flow (selection → confirmation)

**Chosen:** The "Fill Up" button opens a selection modal first. After confirming the selection, the existing cost-summary confirmation modal appears.

**Rationale:** Two separate modals make each step focused and clear. The selection modal shows the trip list with checkboxes and live totals. The confirmation modal (existing) shows the final cost breakdown before committing. This keeps the existing confirmation modal mostly intact.

**Alternatives considered:**
- Single combined modal with checkboxes + cost summary: Would be too dense. The current confirmation modal is already information-rich.
- Inline selection on CarDetailPage (no modal): Would clutter the car detail page. A modal keeps the flow self-contained.

### Decision 2: Checkbox-based selection with select-all/deselect-all toggle

**Chosen:** A checkbox per trip row, plus a "Select All" / "Deselect All" toggle in the header. Default: all checked. The "Confirm Selection" button is disabled when zero trips are selected.

**Rationale:** Checkboxes are the standard pattern for multi-select. Defaulting to all selected means the existing workflow (click → confirm → done) only adds one extra click-through for users who want everything — they just confirm the pre-selected list.

**Alternatives considered:**
- Toggle switches per trip: Less standard for multi-select, more suitable for binary on/off states.
- Drag-to-select: Over-engineered for the typical number of active trips (rarely more than 5-10).

### Decision 3: FILL_UP reducer accepts `tripIds: string[]` instead of implicit all-active

**Chosen:** Add `tripIds` to the FILL_UP action payload. The reducer filters trips by `tripIds.includes(t.id)` instead of `status === "active"`. It validates that each trip is active and belongs to the car.

**Rationale:** Explicit is better than implicit. The selection is made in the UI and passed directly. This also makes the reducer more testable — you can control exactly which trips are archived.

**Alternatives considered:**
- Keep the reducer all-or-nothing and filter trips in the UI before dispatching: Violates write-through persistence pattern. The UI should not modify trip state directly.
- Add a separate `SELECT_TRIPS_FOR_FILL_UP` action: Unnecessary state management. The selection is transient UI state, not app state.

### Decision 4: Trip selection is component-local state, not context state

**Chosen:** The selection state (which trip IDs are checked) lives in `FillUpButton` component state via `useState`. It is passed to the `FILL_UP` dispatch as `tripIds` and then discarded.

**Rationale:** The selection is only relevant during the fill-up flow. Persisting it would add complexity with no benefit — there's no use case for "remember my selection for later."

### Decision 5: Trip table in selection modal reuses existing TripTable patterns

**Chosen:** Render a simplified trip list (no inline edit/delete actions) with checkboxes. Reuse the same column layout and running-totals footer from `TripTable`, but computed only from selected trips.

**Rationale:** Consistency with the rest of the app. Users already understand the trip table format.

## Risks / Trade-offs

- **Extra click for "fill up all" users**: Users who always fill up all trips now have one extra "Confirm Selection" click. → Mitigation: Default all trips checked, so the extra step is just clicking "Confirm Selection" — no mental overhead.
- **Undo restores all trips from fill-up, not a subset**: If a user selected 3 of 5 trips for a fill-up, undoing restores exactly those 3 trips (the ones linked to the fill-up). This is correct behavior — not a bug. The 2 unselected trips remain active throughout.
- **FillUpButton component complexity**: The component grows from one modal to two modals + selection state. → Mitigation: Extract the selection modal into a named inner component or separate file if it becomes unwieldy.

## Open Questions

None — the design is straightforward and all decisions are resolved above.
