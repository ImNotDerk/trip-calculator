## 1. Setup

- [ ] 1.1 Install `tesseract.js` dependency and verify it compiles
- [ ] 1.2 Create module structure: `src/services/ocr.ts`, `src/hooks/useOCR.ts`, `src/components/PhotoOCRInput.tsx`

## 2. OCR Service Layer

- [ ] 2.1 Implement `src/services/ocr.ts` — dynamic import wrapper for Tesseract.js, `recognizeNumber()` function that takes an image blob, runs OCR, and returns `{value: number | null, confidence: number, rawText: string}`
- [ ] 2.2 Implement number extraction utility in `ocr.ts` — regex to find the first decimal or integer value in OCR output text
- [ ] 2.3 Implement `useOCR` hook — manages OCR lifecycle state (`idle | loading-engine | capturing | preview | processing | success | error`), calls `recognizeNumber()`, returns result + status + progress

## 3. PhotoOCRInput Component

- [ ] 3.1 Build `PhotoOCRInput` component shell — accepts `fieldLabel`, `fieldUnit`, `onValueExtracted` callback, renders open/close toggle
- [ ] 3.2 Implement camera capture flow — file input with `accept="image/*"` + `capture="environment"`, handle permission denial with fallback message
- [ ] 3.3 Implement file upload flow — separate file input without `capture` attribute for gallery picker
- [ ] 3.4 Implement image preview — display captured/selected image, "Retake" and "Extract" buttons
- [ ] 3.5 Implement "Extract" button — triggers OCR, shows progress bar with Tesseract progress events, displays result (confidence percentage, extracted value)
- [ ] 3.6 Implement success/failure UI states — green checkmark + confidence on success, warning on no-number-found, error on unrecognizable text
- [ ] 3.7 Implement image lifecycle cleanup — revoke blob URLs on replace, unmount, and navigation. Cap image resolution before OCR (~1200px max dimension).

## 4. AddTripPage Integration

- [ ] 4.1 Add `PhotoOCRInput` instance below the "Fuel Consumption (km/L)" field — extracts and populates `fuelConsumptionKmL` form state
- [ ] 4.2 Add `PhotoOCRInput` instance below the "Distance (km)" field — extracts and populates `distanceKm` form state
- [ ] 4.3 Ensure OCR-populated values pass existing validation rules (positive number required)
- [ ] 4.4 Verify manual input flow is unchanged when OCR is not used

## 5. Edge Cases & Polish

- [ ] 5.1 Handle camera permission denied — show inline message, file upload remains available
- [ ] 5.2 Handle OCR engine load failure — display error, suggest manual input
- [ ] 5.3 Handle very large images — scale down before OCR to avoid memory issues
- [ ] 5.4 Handle revoked blob URLs (e.g., component unmounts mid-OCR) — abort OCR worker gracefully
- [ ] 5.5 Add `vite.config.ts` `optimizeDeps.exclude` for `tesseract.js` if needed for HMR compatibility
- [ ] 5.6 Test on mobile viewport (375px width) — ensure camera/file buttons are tappable, preview fits
- [ ] 5.7 Test dark mode — ensure preview, buttons, and status messages respect the design system tokens
