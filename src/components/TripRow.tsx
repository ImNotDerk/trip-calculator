import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { Trip } from "../types";
import { computeEstimatedUsage } from "../services/helpers";

interface TripRowProps {
  trip: Trip;
  showCar?: boolean;
}

export function TripRow({ trip, showCar: _showCar }: TripRowProps) {
  void _showCar;
  const { dispatch } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit form state
  const [date, setDate] = useState(trip.date.slice(0, 10));
  const [direction, setDirection] = useState(trip.direction);
  const [label, setLabel] = useState(trip.label);
  const [distanceKm, setDistanceKm] = useState(trip.distanceKm.toString());
  const [fuelConsumptionKmL, setFuelConsumptionKmL] = useState(trip.fuelConsumptionKmL.toString());
  const [tollCost, setTollCost] = useState(trip.tollCost.toString());

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

  const isActive = trip.status === "active";
  const estimatedUsage = computeEstimatedUsage(parseFloat(distanceKm) || 0, parseFloat(fuelConsumptionKmL) || 0);

  if (editing) {
    return (
      <tr className="border-b border-hairline-soft bg-surface-soft">
        <td className="px-4 py-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-[130px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink"
          />
        </td>
        <td className="px-4 py-2">
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as Trip["direction"])}
            className="w-full min-w-[70px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink"
          >
            <option value="to">To</option>
            <option value="from">From</option>
            <option value="other">Other</option>
          </select>
        </td>
        <td className="px-4 py-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional"
            className="w-full min-w-[90px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink"
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            className="w-full min-w-[75px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink text-right"
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={fuelConsumptionKmL}
            onChange={(e) => setFuelConsumptionKmL(e.target.value)}
            className="w-full min-w-[80px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink text-right"
          />
        </td>
        <td className="px-4 py-2 text-right tabular-nums text-sm text-ink">
          {estimatedUsage.toFixed(2)} L
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={tollCost}
            onChange={(e) => setTollCost(e.target.value)}
            className="w-full min-w-[75px] rounded-md border border-hairline bg-canvas px-2 py-1.5 text-sm text-ink text-right"
          />
        </td>
        <td className="px-4 py-2">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={handleSave}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-xs font-medium text-muted"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-hairline-soft hover:bg-surface-soft/50 transition-colors">
      <td className="px-4 py-3 text-ink">{new Date(trip.date).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <DirectionBadge direction={trip.direction} />
      </td>
      <td className="px-4 py-3 text-muted">{trip.label || "—"}</td>
      <td className="px-4 py-3 text-right tabular-nums">{trip.distanceKm}</td>
      <td className="px-4 py-3 text-right tabular-nums">{trip.fuelConsumptionKmL}</td>
      <td className="px-4 py-3 text-right tabular-nums">{trip.estimatedUsageL.toFixed(2)}</td>
      <td className="px-4 py-3 text-right tabular-nums">
        {trip.tollCost > 0 ? `₱${trip.tollCost}` : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          {isActive && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-md px-2 py-1 text-xs font-medium text-muted hover:text-ink transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  confirmDelete
                    ? "bg-error text-white"
                    : "text-muted hover:text-error"
                }`}
              >
                {confirmDelete ? "Confirm?" : "Delete"}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function DirectionBadge({ direction }: { direction: Trip["direction"] }) {
  const colors: Record<string, string> = {
    to: "bg-accent-teal/15 text-accent-teal",
    from: "bg-accent-amber/15 text-accent-amber",
    other: "bg-surface-card text-muted",
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[direction]}`}
    >
      {direction}
    </span>
  );
}