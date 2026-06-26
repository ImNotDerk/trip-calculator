import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function CarManagementPage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [newCarName, setNewCarName] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCarName.trim();
    if (!name) {
      setError("Car name cannot be empty.");
      return;
    }
    dispatch({ type: "ADD_CAR", name });
    setNewCarName("");
    setError("");
  };

  const handleDelete = (carId: string) => {
    dispatch({ type: "REMOVE_CAR", carId });
    setDeleteTarget(null);
  };

  const tripCount = (carId: string) =>
    state.trips.filter((t) => t.carId === carId).length;
  const fillUpCount = (carId: string) =>
    state.fillUps.filter((f) => f.carId === carId).length;

  return (
    <div>
      <div className="mb-8">
        <h1>Manage Cars</h1>
        <p className="mt-2 text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
          Add, select, or remove vehicles from your account.
        </p>
      </div>

      {/* Add car form */}
      <form
        onSubmit={handleAddCar}
        className="surface-card rounded-lg p-6 mb-8"
      >
        <h4 className="mb-4">Add a Car</h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newCarName}
            onChange={(e) => {
              setNewCarName(e.target.value);
              setError("");
            }}
            placeholder="e.g., Honda Civic"
            className="h-10 flex-1 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Add Car
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-error" style={{ fontFamily: "Inter, sans-serif" }}>
            {error}
          </p>
        )}
      </form>

      {/* Car list */}
      {state.cars.length === 0 ? (
        <div className="surface-card rounded-lg p-8 text-center sm:p-12">
          <p className="text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
            No cars yet. Add your first car above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.cars.map((car) => (
            <div
              key={car.id}
              className="surface-card rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4>{car.name}</h4>
                  <p className="text-sm text-muted mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {tripCount(car.id)} trip{tripCount(car.id) !== 1 ? "s" : ""}
                    {" · "}
                    {fillUpCount(car.id)} fill-up
                    {fillUpCount(car.id) !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(car.id)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-error"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => navigate(`/cars/${car.id}`)}
                className="rounded-md border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-canvas p-6 shadow-lg sm:p-8">
            <h3 className="mb-2">Delete Car?</h3>
            <p
              className="mb-6 text-muted text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              This will permanently delete the car, all its trips, and all its
              fill-ups. This cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-ink sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="w-full rounded-md bg-error px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
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
