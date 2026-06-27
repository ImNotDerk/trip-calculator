import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/Toast";
import { EditCarModal } from "../components/EditCarModal";
import { TripTable } from "../components/TripTable";
import { FillUpButton } from "../components/FillUpButton";
import { GasPriceInput } from "../components/GasPriceInput";

export function CarDetailPage() {
  const { carId } = useParams<{ carId: string }>();
  const { state, dispatch } = useAppContext();
  const { addToast } = useToast();
  const [confirmUndo, setConfirmUndo] = useState(false);
  const [editingCar, setEditingCar] = useState(false);

  const car = state.cars.find((c) => c.id === carId);

  if (!car) {
    return (
      <div className="surface-card rounded-lg p-12 text-center">
        <p className="text-muted text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
          Car not found.
        </p>
        <Link
          to="/cars"
          className="mt-4 inline-block text-primary text-sm font-medium"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← Back to Cars
        </Link>
      </div>
    );
  }

  const activeTrips = state.trips
    .filter((t) => t.carId === car.id && t.status === "active")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const fillUps = state.fillUps
    .filter((f) => f.carId === car.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastFillUp = fillUps.length > 0 ? fillUps[0] : null;

  return (
    <div>
      {/* Breadcrumb + header */}
      <div className="mb-2">
        <Link
          to="/"
          className="text-sm text-muted no-underline hover:text-ink transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1>
            {car.name}
            {car.plateNumber && (
              <span className="ml-2.5 text-muted font-normal text-2xl sm:text-3xl" style={{ fontFamily: "Inter, sans-serif" }}>
                {car.plateNumber}
              </span>
            )}
            <button
              onClick={() => setEditingCar(true)}
              className="ml-3 inline-block align-middle rounded-md border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-ink hover:border-ink/30"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Edit
            </button>
          </h1>
          <p className="mt-2 text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
            {activeTrips.length} active trip
            {activeTrips.length !== 1 ? "s" : ""} in current tank
          </p>
        </div>
        <div className="flex flex-wrap items-start sm:items-end gap-3 sm:gap-4">
          <GasPriceInput />
          <Link
            to={`/cars/${car.id}/analytics`}
            className="rounded-md border border-hairline bg-canvas px-4 py-3 text-sm font-medium text-ink no-underline transition-colors hover:bg-surface-soft"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Analytics
          </Link>
          <Link
            to={`/cars/${car.id}/history`}
            className="rounded-md border border-hairline bg-canvas px-4 py-3 text-sm font-medium text-ink no-underline transition-colors hover:bg-surface-soft"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            History
          </Link>
        </div>
      </div>

      {/* Last Fill-Up summary */}
      {lastFillUp && (
        <div className="surface-card rounded-lg p-6 mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h4
              className="text-xs font-semibold uppercase tracking-wider text-muted-soft"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Last Fill-Up
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirmUndo) {
                    const tripCount = lastFillUp.tripIds.length;
                    dispatch({ type: "UNDO_FILL_UP", carId: car.id });
                    setConfirmUndo(false);
                    addToast({
                      message: `Fill-up undone. ${tripCount} trip${tripCount !== 1 ? "s" : ""} restored.`,
                      duration: 5000,
                    });
                  } else {
                    setConfirmUndo(true);
                    setTimeout(() => setConfirmUndo(false), 4000);
                  }
                }}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  confirmUndo
                    ? "bg-primary text-on-primary"
                    : "text-accent-teal hover:underline"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {confirmUndo ? "Confirm undo?" : "Undo"}
              </button>
              <span
                className="text-sm text-muted-soft"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {new Date(lastFillUp.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            <MiniStat label="Distance" value={`${lastFillUp.totalDistanceKm} km`} />
            <MiniStat label="Fuel" value={`${lastFillUp.totalFuelL} L`} />
            <MiniStat label="Fuel Cost" value={`₱${lastFillUp.totalFuelCost.toFixed(2)}`} />
            <MiniStat label="Tolls" value={`₱${lastFillUp.totalTollCost.toFixed(2)}`} />
            <MiniStat label="Grand Total" value={`₱${lastFillUp.grandTotal.toFixed(2)}`} highlight />
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          to={`/cars/${car.id}/trips/new`}
          className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary no-underline transition-colors hover:bg-primary-active"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          + Log Trip
        </Link>
        <FillUpButton carId={car.id} />
      </div>

      {/* Edit car modal */}
      {editingCar && (
        <EditCarModal
          car={car}
          onClose={() => setEditingCar(false)}
          onSave={(name, plateNumber) => {
            dispatch({
              type: "UPDATE_CAR",
              carId: car.id,
              name,
              plateNumber,
            });
            setEditingCar(false);
          }}
        />
      )}

      {/* Active trips */}
      {activeTrips.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <p className="text-muted mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            No active trips for this tank.
          </p>
          {fillUps.length > 0 ? (
            <p className="text-muted-soft text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Log a new trip or view past fill-ups.
            </p>
          ) : (
            <p className="text-muted-soft text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Log your first trip to get started.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to={`/cars/${car.id}/trips/new`}
              className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary no-underline text-center"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              + Log Trip
            </Link>
            {fillUps.length > 0 && (
              <Link
                to={`/cars/${car.id}/history`}
                className="rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink no-underline transition-colors hover:bg-surface-soft text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                View History
              </Link>
            )}
          </div>
        </div>
      ) : (
        <TripTable trips={activeTrips} />
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div
        className="text-xs uppercase tracking-wider text-muted-soft mb-0.5"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        {label}
      </div>
      <div
        className={`text-base font-semibold ${highlight ? "text-primary" : "text-ink"}`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {value}
      </div>
    </div>
  );
}
