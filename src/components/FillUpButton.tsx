import { useState } from "react";
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
  const [showModal, setShowModal] = useState(false);

  const activeTrips = state.trips.filter(
    (t) => t.carId === carId && t.status === "active",
  );

  const totalDistance = roundTo2(activeTrips.reduce((s, t) => s + t.distanceKm, 0));
  const totalFuel = roundTo2(activeTrips.reduce((s, t) => s + t.estimatedUsageL, 0));
  const totalTolls = roundTo2(activeTrips.reduce((s, t) => s + t.tollCost, 0));
  const fuelCost = roundTo2(totalFuel * state.gasPrice);
  const grandTotal = roundTo2(fuelCost + totalTolls);

  const handleFillUp = () => {
    dispatch({ type: "FILL_UP", carId, gasPrice: state.gasPrice });
    setShowModal(false);
    addToast({
      message: `Fill-up recorded. ${activeTrips.length} trip${activeTrips.length !== 1 ? "s" : ""} archived.`,
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
            setShowModal(true);
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

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="mx-4 w-full max-w-md rounded-lg bg-canvas p-8 shadow-lg">
            <h3 className="mb-2" style={{ fontSize: "22px" }}>
              Confirm Fill-Up
            </h3>
            <p
              className="mb-6 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will archive {activeTrips.length} active trip
              {activeTrips.length !== 1 ? "s" : ""} with the current gas price
              and reset the active list.
            </p>

            {/* Cost summary */}
            <div className="surface-card rounded-lg p-5 mb-6">
              <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <tbody>
                  <CostRow label="Gas Price" value={`₱${state.gasPrice}/L`} />
                  <CostRow label="Total Distance" value={`${totalDistance} km`} />
                  <CostRow label="Total Fuel" value={`${totalFuel} L`} />
                  <CostRow label="Fuel Cost" value={`₱${fuelCost}`} />
                  <CostRow label="Tolls" value={`₱${totalTolls}`} />
                  <CostRow
                    label="Grand Total"
                    value={`₱${grandTotal}`}
                    bold
                  />
                </tbody>
              </table>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
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
