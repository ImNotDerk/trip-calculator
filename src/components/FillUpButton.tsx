import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";
import { roundTo2 } from "../services/helpers";

interface FillUpButtonProps {
  carId: string;
}

export function FillUpButton({ carId }: FillUpButtonProps) {
  const { state, dispatch } = useAppContext();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);

  const activeTrips = useMemo(
    () => state.trips.filter((t) => t.carId === carId && t.status === "active"),
    [state.trips, carId],
  );

  // Initialize selection to all active trips when opening the selection modal
  const openSelectionModal = () => {
    setSelectedTripIds(activeTrips.map((t) => t.id));
    setShowSelectionModal(true);
  };

  // Dismiss selection modal if active trips change while it's open (prevents stale selections)
  useEffect(() => {
    if (showSelectionModal) {
      setShowSelectionModal(false);
      setShowConfirmModal(false);
    }
    // Only fire when activeTrips identity changes (trips added/deleted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrips.length]);

  const selectedTrips = useMemo(
    () => activeTrips.filter((t) => selectedTripIds.includes(t.id)),
    [activeTrips, selectedTripIds],
  );

  const totals = useMemo(() => {
    const totalDistance = roundTo2(
      selectedTrips.reduce((s, t) => s + t.distanceKm, 0),
    );
    const totalFuel = roundTo2(
      selectedTrips.reduce((s, t) => s + t.estimatedUsageL, 0),
    );
    const totalTolls = roundTo2(
      selectedTrips.reduce((s, t) => s + t.tollCost, 0),
    );
    const fuelCost = roundTo2(totalFuel * state.gasPrice);
    const grandTotal = roundTo2(fuelCost + totalTolls);
    return { totalDistance, totalFuel, totalTolls, fuelCost, grandTotal };
  }, [selectedTrips, state.gasPrice]);

  const toggleTrip = (tripId: string) => {
    setSelectedTripIds((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId],
    );
  };

  const selectAll = () => setSelectedTripIds(activeTrips.map((t) => t.id));
  const deselectAll = () => setSelectedTripIds([]);

  const allSelected = selectedTripIds.length === activeTrips.length && activeTrips.length > 0;
  const hasSelection = selectedTripIds.length > 0;

  const handleFillUp = () => {
    dispatch({
      type: "FILL_UP",
      carId,
      gasPrice: state.gasPrice,
      tripIds: selectedTripIds,
    });
    setShowConfirmModal(false);
    addToast({
      message: `Fill-up recorded. ${selectedTripIds.length} trip${selectedTripIds.length !== 1 ? "s" : ""} archived.`,
      action: {
        label: "Undo",
        onClick: () => dispatch({ type: "UNDO_FILL_UP", carId }),
      },
      duration: 10000,
    });
    navigate(`/cars/${carId}/history`);
  };

  const hasTrips = activeTrips.length > 0;
  const hasGasPrice = state.gasPrice > 0;
  const canFillUp = hasTrips && hasGasPrice;

  const disabledReason = !hasTrips
    ? "No active trips to fill up"
    : !hasGasPrice
      ? "Set a gas price before filling up"
      : null;

  return (
    <>
      <button
        onClick={() => {
          if (canFillUp) {
            openSelectionModal();
          }
        }}
        disabled={!canFillUp}
        className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors ${
          canFillUp
            ? "bg-primary text-on-primary hover:bg-primary-active"
            : "bg-primary-disabled text-muted cursor-not-allowed"
        }`}
        style={{ fontFamily: "Inter, sans-serif" }}
        title={disabledReason ?? undefined}
      >
        ⛽ Fill Up
      </button>
      {!hasGasPrice && hasTrips && (
        <span className="text-xs text-muted-soft ml-2" style={{ fontFamily: "Inter, sans-serif" }}>
          Set a gas price first
        </span>
      )}

      {/* Selection modal */}
      {showSelectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="mx-4 w-full max-w-lg rounded-lg bg-canvas p-8 shadow-lg flex flex-col max-h-[85vh]">
            <h3 className="mb-2" style={{ fontSize: "22px" }}>
              Select Trips to Fill Up
            </h3>
            <p
              className="mb-4 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Choose which active trips to include in this fill-up. Unselected
              trips will remain in the active list.
            </p>

            {/* Select All / Deselect All toggle */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={allSelected ? deselectAll : selectAll}
                className="text-xs font-medium text-primary hover:underline"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
              <span
                className="text-xs text-muted"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {selectedTripIds.length} of {activeTrips.length} selected
              </span>
            </div>

            {/* Trip list with checkboxes */}
            <div className="surface-card rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <thead>
                  <tr className="border-b border-hairline text-left text-xs text-muted">
                    <th className="py-2 pl-3 pr-1 w-8"></th>
                    <th className="py-2 pr-3 font-medium">Trip</th>
                    <th className="py-2 pr-3 text-right font-medium">Dist</th>
                    <th className="py-2 pr-3 text-right font-medium">Fuel</th>
                    <th className="py-2 pr-3 text-right font-medium">Toll</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {activeTrips.map((trip) => {
                    const checked = selectedTripIds.includes(trip.id);
                    return (
                      <tr
                        key={trip.id}
                        onClick={() => toggleTrip(trip.id)}
                        className={`border-b border-hairline cursor-pointer transition-colors hover:bg-surface-soft ${
                          checked ? "" : "opacity-50"
                        }`}
                      >
                        <td className="py-2 pl-3 pr-1">
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTrip(trip.id);
                            }}
                            className="w-4 h-4 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <span className="text-ink">{trip.label || "—"}</span>
                          <span
                            className={`ml-1.5 text-xs ${
                              trip.direction === "to"
                                ? "text-accent-teal"
                                : trip.direction === "from"
                                  ? "text-accent-amber"
                                  : "text-muted"
                            }`}
                          >
                            {trip.direction === "to" ? "→" : trip.direction === "from" ? "←" : "·"}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-ink">
                          {trip.distanceKm} km
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-ink">
                          {trip.estimatedUsageL} L
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-ink">
                          ₱{trip.tollCost}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Running totals footer for selected trips only */}
            <div className="surface-card rounded-lg p-4 mb-6">
              <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <tbody>
                  <CostRow label="Selected Distance" value={`${totals.totalDistance} km`} />
                  <CostRow label="Selected Fuel" value={`${totals.totalFuel} L`} />
                  <CostRow label="Selected Tolls" value={`₱${totals.totalTolls}`} />
                  <CostRow
                    label="Est. Fuel Cost"
                    value={`₱${totals.fuelCost}`}
                    bold
                  />
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            {!hasSelection && (
              <p
                className="text-xs text-primary mb-3 text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Select at least one trip to continue
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowSelectionModal(false)}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSelectionModal(false);
                  setShowConfirmModal(true);
                }}
                disabled={!hasSelection}
                className={`w-full rounded-md px-5 py-3 text-sm font-medium transition-colors sm:w-auto ${
                  hasSelection
                    ? "bg-primary text-on-primary hover:bg-primary-active"
                    : "bg-primary-disabled text-muted cursor-not-allowed"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="mx-4 w-full max-w-md rounded-lg bg-canvas p-8 shadow-lg">
            <h3 className="mb-2" style={{ fontSize: "22px" }}>
              Confirm Fill-Up
            </h3>
            <p
              className="mb-6 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will archive {selectedTrips.length} selected trip
              {selectedTrips.length !== 1 ? "s" : ""} with the current gas price
              and reset the active list.
            </p>

            {/* Cost summary */}
            <div className="surface-card rounded-lg p-5 mb-6">
              <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <tbody>
                  <CostRow label="Gas Price" value={`₱${state.gasPrice}/L`} />
                  <CostRow label="Total Distance" value={`${totals.totalDistance} km`} />
                  <CostRow label="Total Fuel" value={`${totals.totalFuel} L`} />
                  <CostRow label="Fuel Cost" value={`₱${totals.fuelCost}`} />
                  <CostRow label="Tolls" value={`₱${totals.totalTolls}`} />
                  <CostRow
                    label="Grand Total"
                    value={`₱${totals.grandTotal}`}
                    bold
                  />
                </tbody>
              </table>
            </div>

            {/* Per-trip breakdown of selected trips */}
            <div className="mb-6">
              <p
                className="text-xs text-muted mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Selected trips ({selectedTrips.length})
              </p>
              <div className="space-y-1.5">
                {selectedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span className="text-ink truncate mr-2">
                      {trip.label || "—"}
                      <span
                        className={`ml-1 ${
                          trip.direction === "to"
                            ? "text-accent-teal"
                            : trip.direction === "from"
                              ? "text-accent-amber"
                              : "text-muted"
                        }`}
                      >
                        {trip.direction === "to" ? "→" : trip.direction === "from" ? "←" : "·"}
                      </span>
                    </span>
                    <span className="text-muted tabular-nums shrink-0">
                      {trip.distanceKm} km · {trip.estimatedUsageL} L · ₱{trip.tollCost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowSelectionModal(true);
                }}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Back
              </button>
              <button
                onClick={handleFillUp}
                className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Fill-Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CostRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <tr className={`${bold ? "border-t border-hairline" : ""}`}>
      <td
        className={`py-1.5 pr-4 ${bold ? "text-ink font-semibold pt-3" : "text-muted"}`}
      >
        {label}
      </td>
      <td className={`py-1.5 text-right tabular-nums ${bold ? "text-ink font-semibold pt-3" : "text-ink"}`}>
        {value}
      </td>
    </tr>
  );
}
