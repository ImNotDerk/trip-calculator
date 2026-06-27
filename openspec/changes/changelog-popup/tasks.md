## 1. Types and Data

- [x] 1.1 Add `ChangelogEntry` and `VersionManifest` interfaces to `src/types/index.ts`
- [x] 1.2 Create `public/version.json` with version "1.1.0" and two changelog entries (Initial Release + What's New)

## 2. Changelog Modal Component

- [x] 2.1 Create `src/components/ChangelogModal.tsx` — presentational full-screen overlay following the FillUpButton modal pattern, accepting `entries: ChangelogEntry[]` and `onClose: () => void` props
- [x] 2.2 Implement modal header with "What's New" heading (font-display) and X close button
- [x] 2.3 Implement scrollable entries list with version badge, date, title, and bulleted changes using text-primary em-dash bullets
- [x] 2.4 Implement footer with `border-t border-hairline` separator and "Got it" dismiss button (`bg-primary text-on-primary`)

## 3. Changelog Checker Component

- [x] 3.1 Create `src/components/ChangelogChecker.tsx` — controller component with `useEffect` fetch of `import.meta.env.BASE_URL + "version.json"`
- [x] 3.2 Implement localStorage comparison: read `trip-calc-seen-version`, compare with `data.version`, conditionally show modal
- [x] 3.3 Implement handleDismiss: save version to localStorage, close modal
- [x] 3.4 Handle all error states: fetch failure (catch, return null), malformed JSON (catch, return null), localStorage unavailable (try-catch), unmount before fetch resolves (cleanup flag)

## 4. Integration

- [x] 4.1 Import and render `<ChangelogChecker />` in `src/App.tsx` inside `ToastProvider` and outside `<Routes>`

## 5. Verification

- [x] 5.1 Clear localStorage, load app — confirm modal appears with all entries
- [x] 5.2 Dismiss modal — confirm `trip-calc-seen-version` is set in localStorage, confirm modal does not reappear on reload
- [x] 5.3 Bump version in version.json to "1.2.0", add a new entry — confirm modal appears with all entries
- [x] 5.4 Test dark mode — confirm modal respects dark mode color tokens
- [x] 5.5 Test offline — disconnect network, reload, confirm app loads normally with no modal and no console errors
- [x] 5.6 Test mobile viewport — confirm modal is scrollable and all buttons are reachable
