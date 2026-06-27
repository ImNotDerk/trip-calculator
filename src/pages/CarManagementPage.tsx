import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function CarManagementPage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCarName, setNewCarName] = useState("");
  const [newPlateNumber, setNewPlateNumber] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const openAddModal = () => {
    setNewCarName("");
    setNewPlateNumber("");
    setError("");
    setShowAddModal(true);
  };

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCarName.trim();
    if (!name) {
      setError("Car name cannot be empty.");
      return;
    }
    dispatch({
      type: "ADD_CAR",
      name,
      plateNumber: newPlateNumber.trim() || undefined,
    });
    setShowAddModal(false);
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

      {/* Add car button */}
      <div className="mb-8">
        <button
          onClick={openAddModal}
          className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          + Add Car
        </button>
      </div>

      {/* Car list */}
      {state.cars.length === 0 ? (
        <div className="surface-card rounded-lg p-8 text-center sm:p-12">
          <p className="text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
            No cars yet. Add your first car to get started.
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
                  <p className="text-sm text-muted mt-1 break-words" style={{ fontFamily: "Inter, sans-serif" }}>
                    {car.plateNumber && (
                      <span className="mr-2">{car.plateNumber} ·</span>
                    )}
                    {tripCount(car.id)} trip{tripCount(car.id) !== 1 ? "s" : ""}
                    {" · "}
                    {fillUpCount(car.id)} fill-up
                    {fillUpCount(car.id) !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(car.id)}
                  className="rounded-md px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-error"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => navigate(`/cars/${car.id}`)}
                className="rounded-md border border-hairline bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add car modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-canvas p-6 shadow-lg sm:p-8">
            <h3 className="mb-4">Add a Car</h3>
            <form onSubmit={handleAddCar}>
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label
                    htmlFor="car-name"
                    className="block mb-1.5 text-sm font-medium text-ink"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Car Name
                  </label>
                  <input
                    id="car-name"
                    type="text"
                    value={newCarName}
                    onChange={(e) => {
                      setNewCarName(e.target.value);
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
                    htmlFor="car-plate"
                    className="block mb-1.5 text-sm font-medium text-ink"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Plate Number
                  </label>
                  <input
                    id="car-plate"
                    type="text"
                    value={newPlateNumber}
                    onChange={(e) => setNewPlateNumber(e.target.value)}
                    placeholder="e.g., ABC 1234"
                    className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>
              {error && (
                <p className="mb-4 text-sm text-error" style={{ fontFamily: "Inter, sans-serif" }}>
                  {error}
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink sm:w-auto"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active sm:w-auto"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Add Car
                </button>
              </div>
            </form>
          </div>
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
                className="w-full rounded-md border border-hairline bg-canvas px-5 py-3 text-sm font-medium text-ink sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
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
