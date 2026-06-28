## Why

Trips are logged manually on mobile, but the trip's fuel consumption and distance readings are already displayed on the car's dashboard. Rather than typing two numeric values from memory (or switching apps), users can snap quick photos of their dashboard screens. Client-side OCR extracts the numbers and populates the form — turning a 30-second data-entry step into a 5-second convenience accelerator. Manual input remains the primary path; OCR is an opt-in shortcut.

## What Changes

- Add two photo-capture slots to the Add Trip form: one for "Fuel Consumption (km/L)" and one for "Distance (km)" — matching the two separate dashboard displays in the user's car.
- Each slot supports **camera capture** (using `capture="environment"` for direct phone camera) and **file upload** (gallery/file picker for previously taken photos).
- Integrate Tesseract.js for client-side WASM-based OCR — no backend, no data leaves the browser.
- Display an image preview after capture/upload, with OCR status (idle → processing → success/failure).
- Auto-populate the corresponding numeric form field on successful extraction; user can override or type manually if OCR fails or gets it wrong.
- Handle camera permission denial, unrecognizable text, and poor image quality with clear user feedback.
- **No breaking changes** — all existing trip form behavior works identically when OCR is not used.

## Capabilities

### New Capabilities

- `photo-ocr`: In-browser optical character recognition for extracting numeric trip data (km/L and distance) from dashboard photos, with both camera capture and file upload support, preview, and auto-population of the Add Trip form.

### Modified Capabilities

_None._ All existing specs are unchanged; this is purely additive.

## Impact

- **New dependency**: `tesseract.js` (~2–5 MB WASM + language data, loaded asynchronously)
- **Affected components**: `AddTripPage.tsx` (primary integration point — new `PhotoOCRInput` subcomponent)
- **New files**: `src/components/PhotoOCRInput.tsx`, `src/services/ocr.ts`, `src/hooks/useOCR.ts`
- **State management**: No new reducer actions needed — OCR output feeds directly into existing `distanceKm` / `fuelConsumptionKmL` form state
- **Bundle size**: OCR library loaded dynamically via `import()` to avoid blocking initial page load
