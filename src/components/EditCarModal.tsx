import { useState, useEffect, useCallback } from "react";
import type { Car } from "../types";

interface EditCarModalProps {
  car: Car;
  onClose: () => void;
  onSave: (name: string, plateNumber?: string) => void;
}

export function EditCarModal({ car, onClose, onSave }: EditCarModalProps) {
  const [name, setName] = useState(car.name);
  const [plateNumber, setPlateNumber] = useState(car.plateNumber ?? "");
  const [error, setError] = useState("");
  const [confirmSave, setConfirmSave] = useState(false);

  // Reset form when car changes (e.g., switching between cars)
  useEffect(() => {
    setName(car.name);
    setPlateNumber(car.plateNumber ?? "");
    setError("");
  }, [car]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Car name cannot be empty.");
      return;
    }
    if (!confirmSave) {
      setConfirmSave(true);
      setTimeout(() => setConfirmSave(false), 4000);
      return;
    }
    onSave(trimmedName, plateNumber.trim() || undefined);
  };

  const isInvalid = !name.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-canvas p-6 shadow-lg sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4">Edit Car</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label
                htmlFor="edit-car-name"
                className="block mb-1.5 text-sm font-medium text-ink"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Car Name
              </label>
              <input
                id="edit-car-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="e.g., Honda Civic"
                autoFocus
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <div>
              <label
                htmlFor="edit-car-plate"
                className="block mb-1.5 text-sm font-medium text-ink"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Plate Number
              </label>
              <input
                id="edit-car-plate"
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="e.g., ABC 1234"
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          </div>
          {error && (
            <p
              className="mb-4 text-sm text-error"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink sm:w-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className={`w-full rounded-md px-5 py-3 text-sm font-medium transition-colors sm:w-auto ${
                confirmSave
                  ? "bg-primary text-on-primary"
                  : "bg-primary text-on-primary hover:bg-primary-active"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {confirmSave ? "Confirm save?" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
