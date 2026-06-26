## ADDED Requirements

### Requirement: Toast notification system
The system SHALL provide a toast notification framework via `ToastProvider` context and `useToast` hook. Toasts appear as fixed-position cards at the bottom-right of the viewport with auto-dismiss and optional action buttons.

#### Scenario: Show a toast with action
- **WHEN** `addToast` is called with a message, an action button, and a duration
- **THEN** a toast card appears at bottom-right with the message text and action button. The toast auto-dismisses after the specified duration.

#### Scenario: Dismiss a toast
- **WHEN** user clicks the × button on a toast
- **THEN** the toast is removed immediately

#### Scenario: Action button triggers callback
- **WHEN** user clicks the action button on a toast
- **THEN** the provided `onClick` callback fires and the toast is dismissed

#### Scenario: Cleanup on unmount
- **WHEN** the ToastProvider unmounts
- **THEN** all active toast timers are cleared to prevent memory leaks

### Requirement: Fill-up undo toast
After a fill-up is confirmed, the system SHALL show a toast with an "Undo" action button that dispatches `UNDO_FILL_UP` for the car.

#### Scenario: Undo toast appears after fill-up
- **WHEN** user confirms a fill-up
- **THEN** a toast appears: "Fill-up recorded. N trips archived." with an "Undo" button, lasting 10 seconds

#### Scenario: Undo toast dismisses after timeout
- **WHEN** 10 seconds pass without user interaction
- **THEN** the undo toast auto-dismisses and the fill-up becomes permanent (though still undoable via the history page)

### Requirement: Undo success toast
After successfully undoing a fill-up, the system SHALL show a brief confirmation toast.

#### Scenario: Undo success toast
- **WHEN** user undoes a fill-up from the Last Fill-Up card
- **THEN** a toast appears: "Fill-up undone. N trips restored." for 5 seconds (no action button)
