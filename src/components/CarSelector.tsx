import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ADD_CAR_VALUE = "__add_car__";

export function CarSelector() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, selectedCarId } = state;

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === ADD_CAR_VALUE) {
      setAdding(true);
      setNewName("");
    } else if (value) {
      dispatch({ type: "SELECT_CAR", carId: value });
      navigate(`/cars/${value}`);
    }
  };

  const handleAddCar = () => {
    const name = newName.trim();
    if (!name) return;
    dispatch({ type: "ADD_CAR", name });
    setAdding(false);
    setNewName("");
  };

  const handleCancelAdd = () => {
    setAdding(false);
    setNewName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCar();
    } else if (e.key === "Escape") {
      handleCancelAdd();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="car-select"
        className="hidden text-sm text-muted sm:inline"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px" }}
      >
        Car
      </label>

      {adding ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Car name…"
            autoFocus
            className="h-10 w-40 rounded-md border border-primary bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:ring-[3px] focus:ring-primary/15"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <button
            onClick={handleAddCar}
            disabled={!newName.trim()}
            className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
              newName.trim()
                ? "bg-primary text-on-primary hover:bg-primary-active"
                : "bg-primary-disabled text-muted cursor-not-allowed"
            }`}
            aria-label="Confirm add car"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={handleCancelAdd}
            className="h-10 w-10 rounded-md flex items-center justify-center text-muted hover:text-ink transition-colors"
            aria-label="Cancel add car"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <select
          id="car-select"
          value={selectedCarId ?? ""}
          onChange={handleChange}
          className="h-10 rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.name}
            </option>
          ))}
          <option disabled>──────────</option>
          <option value={ADD_CAR_VALUE}>+ Add Car</option>
        </select>
      )}
    </div>
  );
}
