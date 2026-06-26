import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { computeEstimatedUsage } from "../services/helpers";
import type { TripDirection } from "../types";

export function AddTripPage() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const car = state.cars.find((c) => c.id === carId);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [direction, setDirection] = useState<TripDirection>("to");
  const [label, setLabel] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [fuelConsumptionKmL, setFuelConsumptionKmL] = useState("");
  const [tollCost, setTollCost] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dist = parseFloat(distanceKm) || 0;
  const cons = parseFloat(fuelConsumptionKmL) || 0;
  const estimated = computeEstimatedUsage(dist, cons);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = "Date is required.";
    if (!distanceKm || dist <= 0) errs.distanceKm = "Distance must be greater than 0.";
    if (!fuelConsumptionKmL || cons <= 0) errs.fuelConsumptionKmL = "Fuel consumption must be greater than 0.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !carId) return;

    dispatch({
      type: "ADD_TRIP",
      carId,
      trip: {
        date: new Date(date).toISOString(),
        direction,
        label: label.trim(),
        distanceKm: dist,
        fuelConsumptionKmL: cons,
        tollCost: parseFloat(tollCost) || 0,
      },
    });

    navigate(`/cars/${carId}`);
  };

  if (!car) {
    return (
      <div className="surface-card rounded-lg p-12 text-center">
        <p className="text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
          Car not found.
        </p>
        <Link to="/cars" className="text-primary text-sm">← Back to Cars</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to={`/cars/${car.id}`}
          className="text-sm text-muted no-underline hover:text-ink transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← {car.name}
        </Link>
        <h1 className="mt-2">Log a Trip</h1>
        <p className="mt-2 text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
          Record a new trip for {car.name}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="surface-card rounded-lg p-8 max-w-xl"
      >
        {/* Date */}
        <Field label="Date" error={errors.date} required>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass(errors.date)}
          />
        </Field>

        {/* Direction */}
        <Field label="Direction" required>
          <div className="flex gap-2">
            {(["to", "from", "other"] as TripDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  direction === d
                    ? "bg-primary text-on-primary"
                    : "border border-hairline bg-canvas text-muted hover:text-ink"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>

        {/* Label */}
        <Field label="Label (optional)">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., grocery run"
            className={inputClass()}
          />
        </Field>

        {/* Distance */}
        <Field label="Distance (km)" error={errors.distanceKm} required>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            placeholder="26"
            min="0"
            step="0.1"
            className={inputClass(errors.distanceKm)}
          />
        </Field>

        {/* Fuel consumption */}
        <Field
          label="Fuel Consumption (km/L)"
          error={errors.fuelConsumptionKmL}
          required
        >
          <input
            type="number"
            value={fuelConsumptionKmL}
            onChange={(e) => setFuelConsumptionKmL(e.target.value)}
            placeholder="11.8"
            min="0"
            step="0.1"
            className={inputClass(errors.fuelConsumptionKmL)}
          />
        </Field>

        {/* Estimated usage (read-only) */}
        <Field label="Estimated Fuel Usage">
          <div className="h-10 flex items-center px-3.5 rounded-md bg-surface-soft text-ink text-sm tabular-nums">
            {estimated.toFixed(2)} L
          </div>
        </Field>

        {/* Toll */}
        <Field label="Toll Cost (optional)">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft text-sm">
              ₱
            </span>
            <input
              type="number"
              value={tollCost}
              onChange={(e) => setTollCost(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className={`pl-8 ${inputClass()}`}
            />
          </div>
        </Field>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Log Trip
          </button>
          <Link
            to={`/cars/${car.id}`}
            className="h-10 rounded-md border border-hairline bg-canvas px-5 flex items-center text-sm font-medium text-ink no-underline transition-colors hover:bg-surface-soft"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ── Helpers ── */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label
        className="block text-sm text-ink mb-1.5"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-error" style={{ fontFamily: "Inter, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(error?: string): string {
  const base =
    "w-full h-10 rounded-md border bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15";
  const border = error ? "border-error" : "border-hairline";
  return `${base} ${border}`;
}
