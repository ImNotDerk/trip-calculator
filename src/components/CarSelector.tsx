import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function CarSelector() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, selectedCarId } = state;

  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPlateNumber, setNewPlateNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCar = cars.find((c) => c.id === selectedCarId);

  // Sync selected car from URL on direct navigation
  useEffect(() => {
    const match = location.pathname.match(/^\/cars\/([^/]+)/);
    const carIdFromUrl = match ? match[1] : null;
    if (carIdFromUrl && carIdFromUrl !== selectedCarId) {
      dispatch({ type: "SELECT_CAR", carId: carIdFromUrl });
    }
  }, [location.pathname]);

  // Auto-select first car on mount if none selected
  useEffect(() => {
    if (!selectedCarId && cars.length > 0) {
      dispatch({ type: "SELECT_CAR", carId: cars[0].id });
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSelectCar = (carId: string) => {
    dispatch({ type: "SELECT_CAR", carId });
    navigate(`/cars/${carId}`);
    setOpen(false);
  };

  const handleOpenAddModal = () => {
    setNewName("");
    setNewPlateNumber("");
    setShowAddModal(true);
    setOpen(false);
  };

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    dispatch({
      type: "ADD_CAR",
      name,
      plateNumber: newPlateNumber.trim() || undefined,
    });
    setShowAddModal(false);
  };

  const displayName = selectedCar
    ? selectedCar.name + (selectedCar.plateNumber ? ` (${selectedCar.plateNumber})` : "")
    : "Select a car";

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      <label
        className="hidden text-sm text-muted sm:inline"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px" }}
      >
        Car
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-12 sm:h-10 rounded-md border border-hairline bg-canvas px-3.5 text-base sm:text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15 flex items-center gap-2 max-w-[180px] sm:max-w-[220px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <span className="truncate flex-1 text-left min-w-0">{displayName}</span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 sm:left-auto mt-1.5 z-40 min-w-[200px] max-w-[calc(100vw-2rem)] rounded-lg border border-hairline bg-canvas shadow-lg py-1.5 overflow-hidden">
          <div className="max-h-[280px] overflow-y-auto">
            {cars.map((car) => {
              const isSelected = car.id === selectedCarId;
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleSelectCar(car.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? "bg-surface-card text-ink font-medium"
                      : "text-ink hover:bg-surface-soft"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <span className="block truncate">{car.name}</span>
                  {car.plateNumber && (
                    <span className="block text-xs text-muted truncate">{car.plateNumber}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-hairline mx-2 my-1" />
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-surface-soft transition-colors font-medium"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            + Add Car
          </button>
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
                    htmlFor="car-selector-name"
                    className="block mb-1.5 text-sm font-medium text-ink"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Car Name
                  </label>
                  <input
                    id="car-selector-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Honda Civic"
                    autoFocus
                    className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="car-selector-plate"
                    className="block mb-1.5 text-sm font-medium text-ink"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Plate Number
                  </label>
                  <input
                    id="car-selector-plate"
                    type="text"
                    value={newPlateNumber}
                    onChange={(e) => setNewPlateNumber(e.target.value)}
                    placeholder="e.g., ABC 1234"
                    className="w-full h-11 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>
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
                  disabled={!newName.trim()}
                  className={`w-full rounded-md px-5 py-3 text-sm font-medium transition-colors sm:w-auto ${
                    newName.trim()
                      ? "bg-primary text-on-primary hover:bg-primary-active"
                      : "bg-primary-disabled text-muted cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Add Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
