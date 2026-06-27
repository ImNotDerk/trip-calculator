## Why

Users have no way to know when new features or fixes are deployed. Each `develop → main` merge silently updates the app — there is no in-app notification of what changed. This leaves users unaware of improvements and gives the project no visible release history.

## What Changes

- Add a `public/version.json` file containing the current app version and a changelog of past releases
- On first visit after a new version is deployed, show a one-time changelog modal summarizing what's new
- After the user dismisses the modal, save the seen version to localStorage so it does not reappear until the next version bump
- The changelog modal follows the existing full-screen overlay design pattern (matching FillUpButton confirmation modal)

## Capabilities

### New Capabilities

- `changelog-popup`: A version-aware changelog modal that fetches `version.json` at runtime, compares against the user's last-seen version in localStorage, and displays release notes on first visit after a deploy.

### Modified Capabilities

<!-- No existing capabilities have requirement changes. This is purely additive. -->

## Impact

- **New files**: `public/version.json`, `src/components/ChangelogChecker.tsx`, `src/components/ChangelogModal.tsx`
- **Modified files**: `src/App.tsx` (one import + one component render), `src/types/index.ts` (two new interfaces)
- **localStorage**: new key `trip-calc-seen-version`
- **Dependencies**: none — no new packages, no API changes, no backend
- **Breaking changes**: none
