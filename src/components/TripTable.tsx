import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { TripRow } from "./TripRow";
import { roundTo2, computeEstimatedUsage } from "../services/helpers";
import type { Trip, TripDirection } from "../types";

interface TripTableProps {
  trips: Trip[];
  showCar?: boolean;
}

export function TripTable({ trips, showCar = false }: TripTableProps) {
  if (trips.length === 0) return null;

  const totalDistance = roundTo2(trips.reduce((s, t) => s + t.distanceKm, 0));
  const totalUsage = roundTo2(trips.reduce((s, t) => s + t.estimatedUsageL, 0));
  const totalToll = roundTo2(trips.reduce((s, t) => s + t.tollCost, 0));

  return (
    <div>
      {/* ── Desktop: scrollable table (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr className="border-b border-hairline bg-surface-soft">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">Date</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">Dir</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">Label</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">Dist (km)</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">Cons (km/L)</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">Usage (L)</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">Toll</th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-muted-soft font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <TripRow key={trip.id} trip={trip} showCar={showCar} />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-hairline bg-surface-soft">
              <td className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-semibold">Totals</td>
              <td />
              <td />
              <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">{totalDistance}</td>
              <td />
              <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">{totalUsage.toFixed(2)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">{totalToll > 0 ? `₱${totalToll}` : "—"}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Mobile: stacked cards (hidden on desktop) ── */}
      <div className="sm:hidden space-y-3">
        {trips.map((trip) => (
          <MobileTripCard key={trip.id} trip={trip} />
        ))}
        {/* Mobile totals summary */}
        <div className="surface-card rounded-lg border border-hairline p-5">
          <div className="mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-soft font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>Totals</span>
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            <div>
              <span className="text-muted-soft text-xs">Distance</span>
              <p className="text-ink font-semibold mt-0.5">{totalDistance} km</p>
            </div>
            <div>
              <span className="text-muted-soft text-xs">Fuel</span>
              <p className="text-ink font-semibold mt-0.5">{totalUsage.toFixed(2)} L</p>
            </div>
            <div>
              <span className="text-muted-soft text-xs">Tolls</span>
              <p className="text-ink font-semibold mt-0.5">{totalToll > 0 ? `₱${totalToll}` : "—"}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Mobile Trip Card ── */

function MobileTripCard({ trip }: { trip: Trip }) {
  const { dispatch } = useAppContext();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit form state
  const [date, setDate] = useState(trip.date.slice(0, 10));
  const [direction, setDirection] = useState<TripDirection>(trip.direction);
  const [label, setLabel] = useState(trip.label);
  const [distanceKm, setDistanceKm] = useState(trip.distanceKm.toString());
  const [fuelConsumptionKmL, setFuelConsumptionKmL] = useState(trip.fuelConsumptionKmL.toString());
  const [tollCost, setTollCost] = useState(trip.tollCost.toString());

  const estimatedUsage = computeEstimatedUsage(parseFloat(distanceKm) || 0, parseFloat(fuelConsumptionKmL) || 0);
  const isActive = trip.status === "active";

  const handleSave = () => {
    dispatch({
      type: "UPDATE_TRIP",
      tripId: trip.id,
      updates: {
        date: new Date(date).toISOString(),
        direction,
        label,
        distanceKm: parseFloat(distanceKm) || 0,
        fuelConsumptionKmL: parseFloat(fuelConsumptionKmL) || 0,
        tollCost: parseFloat(tollCost) || 0,
      },
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setDate(trip.date.slice(0, 10));
    setDirection(trip.direction);
    setLabel(trip.label);
    setDistanceKm(trip.distanceKm.toString());
    setFuelConsumptionKmL(trip.fuelConsumptionKmL.toString());
    setTollCost(trip.tollCost.toString());
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      dispatch({ type: "DELETE_TRIP", tripId: trip.id });
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const dirColors: Record<string, string> = {
    to: "bg-accent-teal/15 text-accent-teal",
    from: "bg-accent-amber/15 text-accent-amber",
    other: "bg-surface-card text-muted",
  };

  return (
    <div>
      {/* Display card */}
      <div className={`surface-card rounded-lg border border-hairline p-5 ${editing ? "ring-2 ring-primary/20" : ""}`}>
        {/* Header row: date + direction badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-ink font-semibold" style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}>
              {new Date(trip.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${dirColors[trip.direction]}`}>
              {trip.direction}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-md px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${confirmDelete ? "bg-error text-white" : "text-muted hover:text-error"}`}
                >
                  {confirmDelete ? "Confirm?" : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Label */}
        {trip.label && (
          <p className="text-sm text-muted mb-4" style={{ fontFamily: "Inter, sans-serif" }}>{trip.label}</p>
        )}

        {/* Stats grid */}
        <div className="border-t border-hairline pt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="flex justify-between">
            <span className="text-muted-soft">Distance</span>
            <span className="text-ink font-medium tabular-nums">{trip.distanceKm} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-soft">Consumption</span>
            <span className="text-ink font-medium tabular-nums">{trip.fuelConsumptionKmL} km/L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-soft">Fuel Used</span>
            <span className="text-ink font-medium tabular-nums">{trip.estimatedUsageL.toFixed(2)} L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-soft">Toll</span>
            <span className="text-ink font-medium tabular-nums">{trip.tollCost > 0 ? `₱${trip.tollCost}` : "—"}</span>
          </div>
        </div>
      </div>

      {/* Edit form — inline right below the card */}
      {editing && (
        <div className="surface-card rounded-lg border border-hairline p-5 mt-3">
          <h4 className="mb-4">Edit Trip</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as TripDirection)}
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
              >
                <option value="to">To</option>
                <option value="from">From</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Optional"
                className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Dist (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="0" min="0" step="0.1"
                  className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Cons (km/L)</label>
                <input
                  type="number"
                  value={fuelConsumptionKmL}
                  onChange={(e) => setFuelConsumptionKmL(e.target.value)}
                  placeholder="0" min="0" step="0.1"
                  className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Est. Usage</label>
              <div className="h-11 flex items-center px-3.5 rounded-md bg-surface-soft text-ink text-sm tabular-nums">{estimatedUsage.toFixed(2)} L</div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-soft mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Toll Cost</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft text-sm">₱</span>
                <input
                  type="number"
                  value={tollCost}
                  onChange={(e) => setTollCost(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full h-11 rounded-md border border-hairline bg-canvas pl-8 pr-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 h-11 rounded-md bg-primary text-sm font-medium text-on-primary transition-colors hover:bg-primary-active" style={{ fontFamily: "Inter, sans-serif" }}>Save</button>
              <button onClick={handleCancel} className="flex-1 h-11 rounded-md border border-hairline bg-canvas text-sm font-medium text-ink transition-colors hover:bg-surface-soft" style={{ fontFamily: "Inter, sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}