## Context

Trip Calculator is a client-side-only React app with all data in localStorage. The Add Trip form (`AddTripPage.tsx`) has two required numeric fields — Distance (km) and Fuel Consumption (km/L) — that users currently type manually. On mobile, these values are visible on the car's dashboard but not directly accessible to the browser.

The user's car has **two separate dashboard displays**: one shows fuel consumption (km/L), the other shows distance traveled (km). To capture both values, the user needs two independent photo slots.

Tesseract.js provides WASM-based OCR that runs entirely in the browser. It's the only viable approach for this architecture (no backend). The library is large (~2–5 MB including WASM core + English language data), so it must be loaded dynamically to avoid penalizing the initial page load.

## Goals / Non-Goals

**Goals:**
- Provide two independent photo-capture slots on the Add Trip form: one for km/L, one for distance
- Each slot supports camera capture (mobile) and file picker (gallery upload)
- Run OCR entirely client-side using Tesseract.js
- Extract a single numeric value from each photo and populate the corresponding form field
- Show image preview, OCR processing state, and result feedback inline
- Handle failure modes gracefully: camera denied, no text found, garbled OCR
- Keep manual input as the default — OCR is an opt-in accelerator

**Non-Goals:**
- OCR for toll cost receipts (out of scope)
- Batch processing of multiple photos at once
- Any server-side processing or cloud OCR API
- Support for non-English OCR (English-trained model only)
- Auto-cropping or image enhancement (user is responsible for a reasonably clear photo)
- Persisting photos — images are processed in-memory and discarded after extraction

## Decisions

### 1. Tesseract.js over cloud OCR APIs

**Chosen:** Tesseract.js (client-side WASM)

**Alternatives considered:**
- Google Cloud Vision / Azure OCR: Backend required — violates the no-backend constraint.
- `ocr.space` free API: Requires internet, has rate limits, sends user data to a third party.
- Native device OCR (Web API): No standardized browser API exists for this.

**Rationale:** Tesseract.js is the only option that works offline, keeps all data local, and requires no backend. The trade-off is bundle size and accuracy.

### 2. Dynamic import over static import

**Chosen:** Dynamic `import("tesseract.js")` triggered on first user interaction with the OCR widget

**Rationale:** Tesseract.js is large. If users never use OCR (the common case), they shouldn't pay the download cost. The first OCR interaction will have a ~2 second delay while the module loads, which is acceptable given the context.

### 3. Independent photo slots (not a single combined capture)

**Chosen:** Two separate `<PhotoOCRInput>` instances — one for "Fuel Consumption (km/L)", one for "Distance (km)"

**Alternatives considered:**
- Single photo capturing both displays: Not feasible — the car's two displays are on different screens.
- Single OCR session with two crops: Over-complicated; users would need to frame both numbers in one photo.

**Rationale:** Two independent slots match the physical reality of two dashboard screens. Each slot manages its own image + OCR lifecycle independently.

### 4. Inline component within AddTripPage (not a modal)

**Chosen:** Inline expandable slots placed directly below each corresponding form field

**Alternatives considered:**
- Modal overlay: Blocks the form, creates back-navigation complexity.
- Separate page: Too much friction for a convenience feature.

**Rationale:** Inline placement keeps the form context visible, reinforces the association between photo slot and form field, and allows the user to fill one field via OCR while typing the other manually.

### 5. Simple regex extraction (no AI/LLM parsing)

**Chosen:** Regex-based number extraction from OCR text

**Alternatives considered:**
- LLM-based parsing: Overkill for extracting one number; adds latency and potential API dependency.
- Structured output from Tesseract: Tesseract's `getHOCR` output can help identify numeric blocks but adds complexity.

**Rationale:** Dashboard displays are simple — they show a number like `12.4` or `245` with minimal surrounding text. A regex that finds the first decimal/integer value in the OCR output is sufficient. Coupled with a user preview for manual override, this is the right trade-off.

### 6. Image preview before OCR (not automatic)

**Chosen:** User captures/selects image → sees preview → taps "Extract" button → OCR runs

**Alternatives considered:**
- Auto-OCR on capture: No preview; user can't verify the image is readable first.
- Continuous live OCR from camera stream: Complex, heavy on resources, Tesseract.js is too slow for real-time.

**Rationale:** A two-step flow (capture/preview → confirm/extract) gives the user control and avoids wasted OCR runs on unusable photos.

## Risks / Trade-offs

- **[OCR Accuracy]** Dashboard displays vary in font, glare, and angle. Tesseract may misread characters (e.g., `12.4` → `124` or `1Z4`). → **Mitigation**: OCR result is always shown as a suggestion that populates the form field — user can edit it before submitting. OCR confidence is displayed as a visual indicator.

- **[Bundle Size]** Tesseract.js adds significant weight. → **Mitigation**: Dynamic `import()` ensures the library is only downloaded when a user interacts with the OCR feature. The WASM core is cached by the service worker after first load.

- **[Mobile Performance]** OCR on a phone CPU takes 2–10 seconds depending on device age. → **Mitigation**: Show a clear "Processing…" state with a spinner/progress bar. The Tesseract progress event provides granular updates. Keep image resolution capped (scale to ~1200px max dimension before OCR) to speed up processing without meaningful accuracy loss.

- **[Camera Permission Denial]** Users may deny camera access. → **Mitigation**: File upload is always available as a fallback. If camera is denied, show a clear message and default to the file picker.

- **[Safari/iOS]** iOS Safari has some quirks with `getUserMedia` and file inputs. → **Mitigation**: Use standard `<input type="file" accept="image/*" capture="environment">` which works cross-browser and gives the OS-native camera-or-gallery choice.

- **[User Expectation]** Users might expect perfect OCR results. → **Mitigation**: Label the feature as "Beta" or "Experimental." The field label says "Auto-fill from photo (optional)" to set expectations. Manual input remains the default interaction.

## Open Questions

- Should OCR results auto-populate the field immediately on success, or show a "Use this value?" confirmation? → **Decision deferred to implementation**: Start with auto-populate (since manual override is trivially available by editing the field). Switch to confirmation pattern if user feedback indicates it's preferred.
- Should the extracted image be discarded immediately, or kept for the session? → **Decision**: Discard after extraction to avoid memory pressure and privacy concerns. The value is what matters, not the photo.
