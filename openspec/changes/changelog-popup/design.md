## Context

Trip Calculator is a static React SPA deployed to GitHub Pages. There is no backend, no build-time version injection, and no runtime notification mechanism. Users currently have no way to know when new features or fixes are deployed. The app already has mature patterns for full-screen overlay modals (FillUpButton, DataBackup) and localStorage write-through persistence (AppContext).

The app uses `BrowserRouter` with `basename="/trip-calculator/"` and Vite's `base: "/trip-calculator/"`. All static assets in `public/` are served at `/trip-calculator/<file>`.

## Goals / Non-Goals

**Goals:**
- Show a one-time changelog modal the first time a user visits after a new version deploy
- Never show the modal again for the same version (stored in localStorage)
- Gracefully handle all error states (fetch failure, malformed JSON, localStorage unavailable, offline)
- Follow existing modal design patterns exactly (FillUpButton overlay style)
- Zero new dependencies

**Non-Goals:**
- Automatic version bumping from CI — version.json is manually updated before deploy
- "What's New" badge/indicator in the nav (out of scope for initial implementation)
- Forcing the modal on every page load of the same version
- Modifying the service worker for instant delivery of version.json

## Decisions

### Decision 1: Fetch version.json at runtime vs. build-time injection

**Chosen: Runtime fetch from `public/version.json`**

Alternatives considered:
- **Build-time injection** (Vite `define` or env var): Requires a rebuild to change the version. Doesn't work with the SW cache-first strategy — the JS bundle would be cached the same way. Rejected.
- **Runtime fetch**: version.json is a separate HTTP resource that gets fetched fresh (after SW cache update). Decouples version data from code. Allows the same JS bundle to show different changelogs over time.

### Decision 2: String equality comparison vs. semver filtering

**Chosen: Simple string equality (`storedVersion !== currentVersion`)**

The modal shows ALL entries in `version.json` when the version differs, not just "unseen" entries filtered by semver. This is simpler, has no edge cases around malformed semver strings, and is still a good user experience (the full changelog is rarely more than a few entries).

### Decision 3: Separate controller vs. combined component

**Chosen: Two components — `ChangelogChecker` (controller) and `ChangelogModal` (presentation)**

Alternatives considered:
- **Single component**: Simpler file count but mixes fetch/I/O concerns with rendering. Harder to test.
- **Two components**: `ChangelogChecker` handles async fetch, localStorage read/write, error swallowing, and unmount cleanup. `ChangelogModal` is a pure presentational component receiving `entries` and `onClose` props. Clean separation.

### Decision 4: Placement in the component tree

**Chosen: Inside `ToastProvider`, outside `<Routes>`**

This ensures the modal fires regardless of which route the user lands on, and it has access to ToastProvider if future enhancements need to show toasts. Inside `ThemeProvider` so dark mode CSS variables cascade properly.

### Decision 5: localStorage key convention

**Chosen: `trip-calc-seen-version`** — follows the existing `trip-calc-*` prefix convention (`trip-calc-cars`, `trip-calc-theme`, etc.).

### Decision 6: Modal design pattern

**Chosen: Full-screen overlay (FillUpButton pattern)**

The FillUpButton confirmation modal is the most polished overlay in the app. Match its structure exactly:
- `fixed inset-0 z-50` backdrop with `bg-ink/40`
- Centered card with `bg-canvas rounded-lg shadow-lg`
- `border-t border-hairline` separator above action buttons
- Primary action button: `bg-primary text-on-primary rounded-md`
- Close button: X SVG icon in header

## Risks / Trade-offs

- **Service worker cache delay**: The SW uses cache-first, so after a deploy, the old version.json is served until the SW background-updates. The changelog appears on the second visit, not the first. → Mitigation: Document this as a known limitation. Acceptable for v1.
- **localStorage unavailable**: In private browsing or when storage is full, the modal will appear on every page load. → Mitigation: This is graceful degradation — the app still works, the modal is just shown more often. Try-catch around all localStorage calls.
- **`version.json` grows unbounded**: If every release adds an entry, the file grows over time. → Mitigation: Not a real concern — the file is tiny (a few KB even after 50 releases). The modal is scrollable.
- **Missed version bumps**: If a deploy happens without bumping `version.json`, no modal appears. → Mitigation: This is a process concern, not a technical one. Consider a CI check in the future.

## Open Questions

<!-- None — the design is straightforward with clear patterns to follow. -->
