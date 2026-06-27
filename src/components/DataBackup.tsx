import { useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";
import type { Car, Trip, FillUp, BackupEnvelope } from "../types";

/* ── Helpers ── */

function buildBackupBlob(state: {
  cars: Car[];
  trips: Trip[];
  fillUps: FillUp[];
  gasPrice: number;
}): Blob {
  const envelope: BackupEnvelope = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      cars: state.cars,
      trips: state.trips,
      fillUps: state.fillUps,
      gasPrice: state.gasPrice,
    },
  };
  return new Blob([JSON.stringify(envelope, null, 2)], {
    type: "application/json",
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/* ── Types ── */

interface ImportSummary {
  cars: number;
  trips: number;
  fillUps: number;
  gasPrice: number;
}

interface ImportStateIdle {
  phase: "idle";
}

interface ImportStateConfirming {
  phase: "confirming";
  envelope: BackupEnvelope;
  summary: ImportSummary;
}

interface ImportStateImporting {
  phase: "importing";
}

type ImportState = ImportStateIdle | ImportStateConfirming | ImportStateImporting;

/* ── Validation ── */

interface ValidationResult {
  valid: boolean;
  envelope?: BackupEnvelope;
  error?: string;
}

function validateBackup(raw: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { valid: false, error: "Invalid JSON file." };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return {
      valid: false,
      error: "Backup file must contain a JSON object.",
    };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.version !== 1) {
    return {
      valid: false,
      error: `Unsupported backup version: ${String(obj.version)}. Expected version 1.`,
    };
  }

  if (typeof obj.exportedAt !== "string") {
    return { valid: false, error: "Missing or invalid export date." };
  }

  if (typeof obj.data !== "object" || obj.data === null) {
    return { valid: false, error: "Missing data in backup file." };
  }

  const data = obj.data as Record<string, unknown>;

  if (!Array.isArray(data.cars)) {
    return { valid: false, error: "Missing or invalid cars data." };
  }
  if (!Array.isArray(data.trips)) {
    return { valid: false, error: "Missing or invalid trips data." };
  }
  if (!Array.isArray(data.fillUps)) {
    return { valid: false, error: "Missing or invalid fill-ups data." };
  }
  if (typeof data.gasPrice !== "number" || isNaN(data.gasPrice)) {
    return { valid: false, error: "Missing or invalid gas price." };
  }

  // Validate required fields on each record
  for (const car of data.cars) {
    if (
      typeof (car as Car).id !== "string" ||
      typeof (car as Car).name !== "string"
    ) {
      return { valid: false, error: "Invalid car record found in backup." };
    }
  }
  for (const trip of data.trips) {
    if (
      typeof (trip as Trip).id !== "string" ||
      typeof (trip as Trip).carId !== "string"
    ) {
      return { valid: false, error: "Invalid trip record found in backup." };
    }
  }
  for (const fillUp of data.fillUps) {
    if (
      typeof (fillUp as FillUp).id !== "string" ||
      typeof (fillUp as FillUp).carId !== "string"
    ) {
      return { valid: false, error: "Invalid fill-up record found in backup." };
    }
  }

  const envelope: BackupEnvelope = {
    version: 1,
    exportedAt: obj.exportedAt as string,
    data: {
      cars: data.cars as Car[],
      trips: data.trips as Trip[],
      fillUps: data.fillUps as FillUp[],
      gasPrice: data.gasPrice as number,
    },
  };

  return { valid: true, envelope };
}

/* ── Summary line helper ── */

function SummaryLine({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string | number;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-sm ${
        isLast ? "" : "border-b border-hairline pb-1"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <span className="text-muted">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}

/* ── Component ── */

export function DataBackup() {
  const { state, dispatch } = useAppContext();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importState, setImportState] = useState<ImportState>({
    phase: "idle",
  });

  // Paste modal state
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);

  /* ── Export ── */

  function handleExport() {
    const blob = buildBackupBlob(state);
    const today = new Date().toISOString().slice(0, 10);
    downloadBlob(blob, `trip-calculator-backup-${today}.json`);
    addToast({ message: "Backup downloaded successfully.", duration: 4000 });
  }

  /* ── Import: file picker ── */

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleRawImport(event.target?.result as string);
    };
    reader.onerror = () => {
      addToast({ message: "Failed to read file.", duration: 4000 });
    };
    reader.readAsText(file);

    // Reset input so selecting the same file works again
    e.target.value = "";
  }

  /* ── Import: paste ── */

  function handleOpenPaste() {
    setPasteText("");
    setPasteError(null);
    setPasteOpen(true);
  }

  function handlePasteContinue() {
    const trimmed = pasteText.trim();
    if (!trimmed) {
      setPasteError("Please paste the backup data first.");
      return;
    }
    handleRawImport(trimmed);
  }

  function handlePasteClose() {
    setPasteOpen(false);
    setPasteText("");
    setPasteError(null);
  }

  /* ── Shared import logic ── */

  function handleRawImport(raw: string) {
    const result = validateBackup(raw);
    if (result.valid && result.envelope) {
      setPasteOpen(false);
      setPasteText("");
      setPasteError(null);
      const summary: ImportSummary = {
        cars: result.envelope.data.cars.length,
        trips: result.envelope.data.trips.length,
        fillUps: result.envelope.data.fillUps.length,
        gasPrice: result.envelope.data.gasPrice,
      };
      setImportState({
        phase: "confirming",
        envelope: result.envelope,
        summary,
      });
    } else {
      // If paste modal is open, show error inline; otherwise use toast
      if (pasteOpen) {
        setPasteError(result.error ?? "Invalid backup data.");
      } else {
        addToast({
          message: result.error ?? "Invalid backup file.",
          duration: 6000,
        });
      }
    }
  }

  /* ── Import: confirm ── */

  function handleConfirmImport() {
    if (importState.phase !== "confirming") return;
    setImportState({ phase: "importing" });

    const { envelope } = importState;

    // Step 1: auto-download safety backup of current state
    const safetyBlob = buildBackupBlob(state);
    const today = new Date().toISOString().slice(0, 10);
    downloadBlob(safetyBlob, `trip-calculator-safety-backup-${today}.json`);

    // Step 2: dispatch REPLACE_ALL
    dispatch({
      type: "REPLACE_ALL",
      state: envelope.data,
    });

    setImportState({ phase: "idle" });

    addToast({
      message: `Backup imported: ${envelope.data.cars.length} car(s), ${envelope.data.trips.length} trip(s), ${envelope.data.fillUps.length} fill-up(s).`,
      duration: 6000,
    });
  }

  function handleCancelImport() {
    setImportState({ phase: "idle" });
  }

  /* ── Render ── */

  return (
    <>
      <div className="surface-card rounded-lg p-5 sm:p-8">
        <h4 className="mb-2">Data Backup</h4>
        <p
          className="text-muted mb-6 text-sm"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Export your data to a file or import a previous backup. Data includes
          all cars, trips, fill-ups, and the current gas price.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={handleExport}
            className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Download Backup
          </button>

          <button
            onClick={handleImportClick}
            className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Import File
          </button>

          <button
            onClick={handleOpenPaste}
            className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Paste Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Paste backup modal */}
      {pasteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-canvas p-6 shadow-lg sm:p-8">
            <h3 className="mb-2">Paste Backup Data</h3>
            <p
              className="text-muted mb-4 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Paste the full contents of a backup file below.
            </p>

            <textarea
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                setPasteError(null);
              }}
              placeholder='{"version":1,"exportedAt":"...","data":{...}}'
              className="h-40 w-full resize-y rounded-md border border-hairline bg-canvas px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />

            {pasteError && (
              <p
                className="mt-2 text-sm text-error"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {pasteError}
              </p>
            )}

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handlePasteClose}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasteContinue}
                className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import confirmation modal */}
      {importState.phase === "confirming" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-canvas p-6 shadow-lg sm:p-8">
            <h3 className="mb-2">Import Backup?</h3>

            <p
              className="text-muted mb-4 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will replace all current data. A safety backup of your
              current data will be downloaded automatically.
            </p>

            <div className="mb-6 space-y-2">
              <SummaryLine label="Cars" value={importState.summary.cars} />
              <SummaryLine label="Trips" value={importState.summary.trips} />
              <SummaryLine
                label="Fill-Ups"
                value={importState.summary.fillUps}
              />
              <SummaryLine
                label="Gas Price"
                value={`₱${importState.summary.gasPrice.toFixed(2)}`}
                isLast
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancelImport}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Importing overlay (prevents double-click) */}
      {importState.phase === "importing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-canvas p-6 text-center shadow-lg sm:p-8">
            <p
              className="text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Importing…
            </p>
          </div>
        </div>
      )}
    </>
  );
}
