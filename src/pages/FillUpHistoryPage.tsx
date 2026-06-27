import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/Toast";
import { TripTable } from "../components/TripTable";

export function FillUpHistoryPage() {
  const { carId } = useParams<{ carId: string }>();
  const { state, dispatch } = useAppContext();
  const { addToast } = useToast();

  const car = state.cars.find((c) => c.id === carId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [undoTarget, setUndoTarget] = useState<string | null>(null);

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

  const fillUps = state.fillUps
    .filter((f) => f.carId === car.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = () => {
    if (deleteTarget) {
      dispatch({ type: "DELETE_FILL_UP", fillUpId: deleteTarget });
      setDeleteTarget(null);
      setExpandedId(null);
    }
  };

  const handleUndo = () => {
    if (undoTarget && car) {
      const fillUp = state.fillUps.find((f) => f.id === undoTarget);
      const tripCount = fillUp ? fillUp.tripIds.length : 0;
      dispatch({ type: "UNDO_FILL_UP", carId: car.id });
      setUndoTarget(null);
      setExpandedId(null);
      addToast({
        message: `Fill-up undone. ${tripCount} trip${tripCount !== 1 ? "s" : ""} restored to active.`,
        duration: 5000,
      });
    }
  };

  // Only the latest fill-up can be undone (first in the sorted array)
  const latestFillUpId = fillUps.length > 0 ? fillUps[0].id : null;

  return (
    <div>
      <div className="mb-8">
        <Link
          to={`/cars/${car.id}`}
          className="text-sm text-muted no-underline hover:text-ink transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← {car.name}{car.plateNumber ? ` (${car.plateNumber})` : ""}
        </Link>
        <h1 className="mt-2">Fill-Up History</h1>
        <p className="mt-2 text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
          Past fill-ups for {car.name}{car.plateNumber ? ` (${car.plateNumber})` : ""}, newest first.
        </p>
      </div>

      {fillUps.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <p className="text-muted mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            No fill-ups yet. Log some trips and fill up to see history here.
          </p>
          <Link
            to={`/cars/${car.id}`}
            className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary no-underline"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Go to {car.name}{car.plateNumber ? ` (${car.plateNumber})` : ""}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {fillUps.map((fillUp) => {
            const isExpanded = expandedId === fillUp.id;
            const trips = state.trips
              .filter((t) => fillUp.tripIds.includes(t.id))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return (
              <div
                key={fillUp.id}
                className="surface-card rounded-lg overflow-hidden"
              >
                {/* Summary row — click to expand */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : fillUp.id)
                  }
                  className="w-full px-6 py-5 text-left transition-colors hover:bg-surface-soft/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-ink text-lg font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                        {new Date(fillUp.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="ml-3 text-muted text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        ₱{fillUp.gasPricePerLiter}/L
                      </span>
                    </div>
                    <span
                      className="text-muted-soft text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Cost breakdown line */}
                  <p className="text-sm text-body" style={{ fontFamily: "Inter, sans-serif" }}>
                    Fuel: ₱{fillUp.totalFuelCost.toFixed(2)}
                    {" + "}
                    Tolls: ₱{fillUp.totalTollCost.toFixed(2)}
                    {" = "}
                    <span className="font-semibold text-ink">
                      Grand Total: ₱{fillUp.grandTotal.toFixed(2)}
                    </span>
                  </p>

                  {/* Quick stats */}
                  <div className="flex gap-6 mt-3 text-xs text-muted-soft" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span>{fillUp.totalDistanceKm} km</span>
                    <span>{fillUp.totalFuelL} L</span>
                    <span>{trips.length} trip{trips.length !== 1 ? "s" : ""}</span>
                  </div>
                </button>

                {/* Expanded sub-table */}
                {isExpanded && trips.length > 0 && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-hairline pt-5">
                      <TripTable trips={trips} />
                    </div>
                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                      {fillUp.id === latestFillUpId && (
                        <button
                          onClick={() => setUndoTarget(fillUp.id)}
                          className="rounded-md px-3 py-2 text-xs font-medium text-accent-teal transition-colors hover:underline"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Undo — restore trips
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(fillUp.id)}
                        className="rounded-md px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-error"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Undo confirmation modal */}
      {undoTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-canvas p-8 shadow-lg">
            <h3 className="mb-2" style={{ fontSize: "22px" }}>
              Undo Fill-Up?
            </h3>
            <p
              className="mb-6 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will remove the fill-up record and restore all its trips
              back to active status. The trip data will not be lost.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setUndoTarget(null)}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleUndo}
                className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Undo Fill-Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-canvas p-8 shadow-lg">
            <h3 className="mb-2" style={{ fontSize: "22px" }}>
              Delete Fill-Up?
            </h3>
            <p
              className="mb-6 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will permanently delete the fill-up record and all trips
              linked to it. This cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full rounded-md bg-error px-5 py-3 text-sm font-medium text-white sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
