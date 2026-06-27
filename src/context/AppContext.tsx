import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Car, Trip, FillUp } from "../types";
import { computeEstimatedUsage, generateId, roundTo2 } from "../services/helpers";
import {
  getCars,
  saveCars,
  getTrips,
  saveTrips,
  getFillUps,
  saveFillUps,
  getGasPrice,
  saveGasPrice,
} from "../services/storage";

/* ── State ── */

export interface AppState {
  cars: Car[];
  trips: Trip[];
  fillUps: FillUp[];
  gasPrice: number;
  selectedCarId: string | null;
}

const initialState: AppState = {
  cars: getCars(),
  trips: getTrips(),
  fillUps: getFillUps(),
  gasPrice: getGasPrice(),
  selectedCarId: null,
};

/* ── Actions ── */

export type AppAction =
  | { type: "ADD_CAR"; name: string; plateNumber?: string }
  | { type: "REMOVE_CAR"; carId: string }
  | { type: "SELECT_CAR"; carId: string }
  | { type: "ADD_TRIP"; carId: string; trip: Omit<Trip, "id" | "carId" | "estimatedUsageL" | "status" | "fillUpId"> }
  | { type: "UPDATE_TRIP"; tripId: string; updates: Partial<Omit<Trip, "id" | "carId" | "status" | "fillUpId">> }
  | { type: "DELETE_TRIP"; tripId: string }
  | { type: "FILL_UP"; carId: string; gasPrice: number }
  | { type: "DELETE_FILL_UP"; fillUpId: string }
  | { type: "UNDO_FILL_UP"; carId: string }
  | { type: "SET_GAS_PRICE"; price: number }
  | { type: "UPDATE_CAR"; carId: string; name: string; plateNumber?: string }
  | {
      type: "REPLACE_ALL";
      state: { cars: Car[]; trips: Trip[]; fillUps: FillUp[]; gasPrice: number };
    };

/* ── Reducer ── */

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_CAR": {
      const car: Car = {
        id: generateId(),
        name: action.name.trim(),
        plateNumber: action.plateNumber?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      return { ...state, cars: [...state.cars, car], selectedCarId: car.id };
    }

    case "REMOVE_CAR": {
      return {
        ...state,
        cars: state.cars.filter((c) => c.id !== action.carId),
        trips: state.trips.filter((t) => t.carId !== action.carId),
        fillUps: state.fillUps.filter((f) => f.carId !== action.carId),
        selectedCarId:
          state.selectedCarId === action.carId ? null : state.selectedCarId,
      };
    }

    case "SELECT_CAR": {
      return { ...state, selectedCarId: action.carId };
    }

    case "ADD_TRIP": {
      const { trip } = action;
      const estimatedUsageL = computeEstimatedUsage(
        trip.distanceKm,
        trip.fuelConsumptionKmL,
      );
      const newTrip: Trip = {
        ...trip,
        id: generateId(),
        carId: action.carId,
        estimatedUsageL,
        status: "active",
        fillUpId: null,
      };
      return { ...state, trips: [...state.trips, newTrip] };
    }

    case "UPDATE_TRIP": {
      return {
        ...state,
        trips: state.trips.map((t) => {
          if (t.id !== action.tripId) return t;
          const merged = { ...t, ...action.updates };
          // Recalculate if distance or consumption changed
          if (
            "distanceKm" in action.updates ||
            "fuelConsumptionKmL" in action.updates
          ) {
            merged.estimatedUsageL = computeEstimatedUsage(
              merged.distanceKm,
              merged.fuelConsumptionKmL,
            );
          }
          return merged;
        }),
      };
    }

    case "DELETE_TRIP": {
      return {
        ...state,
        trips: state.trips.filter((t) => t.id !== action.tripId),
      };
    }

    case "FILL_UP": {
      const activeTrips = state.trips.filter(
        (t) => t.carId === action.carId && t.status === "active",
      );
      if (activeTrips.length === 0) return state;

      const totalDistanceKm = roundTo2(
        activeTrips.reduce((s, t) => s + t.distanceKm, 0),
      );
      const totalFuelL = roundTo2(
        activeTrips.reduce((s, t) => s + t.estimatedUsageL, 0),
      );
      const totalFuelCost = roundTo2(totalFuelL * action.gasPrice);
      const totalTollCost = roundTo2(
        activeTrips.reduce((s, t) => s + t.tollCost, 0),
      );
      const grandTotal = roundTo2(totalFuelCost + totalTollCost);

      const fillUpId = generateId();
      const fillUp: FillUp = {
        id: fillUpId,
        carId: action.carId,
        date: new Date().toISOString(),
        gasPricePerLiter: action.gasPrice,
        totalDistanceKm,
        totalFuelL,
        totalFuelCost,
        totalTollCost,
        grandTotal,
        tripIds: activeTrips.map((t) => t.id),
      };

      return {
        ...state,
        trips: state.trips.map((t) =>
          t.carId === action.carId && t.status === "active"
            ? { ...t, status: "filled" as const, fillUpId }
            : t,
        ),
        fillUps: [...state.fillUps, fillUp],
      };
    }

    case "DELETE_FILL_UP": {
      const fillUp = state.fillUps.find((f) => f.id === action.fillUpId);
      if (!fillUp) return state;
      return {
        ...state,
        fillUps: state.fillUps.filter((f) => f.id !== action.fillUpId),
        trips: state.trips.filter((t) => t.fillUpId !== action.fillUpId),
      };
    }

    case "UNDO_FILL_UP": {
      const carFillUps = state.fillUps
        .filter((f) => f.carId === action.carId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (carFillUps.length === 0) return state;
      const latestFillUp = carFillUps[0];
      return {
        ...state,
        fillUps: state.fillUps.filter((f) => f.id !== latestFillUp.id),
        trips: state.trips.map((t) =>
          t.fillUpId === latestFillUp.id
            ? { ...t, status: "active" as const, fillUpId: null }
            : t,
        ),
      };
    }

    case "SET_GAS_PRICE": {
      return { ...state, gasPrice: action.price };
    }

    case "UPDATE_CAR": {
      const trimmedName = action.name.trim();
      if (!trimmedName) return state;
      return {
        ...state,
        cars: state.cars.map((c) =>
          c.id === action.carId
            ? {
                ...c,
                name: trimmedName,
                plateNumber: action.plateNumber?.trim() || undefined,
              }
            : c,
        ),
      };
    }

    case "REPLACE_ALL": {
      return {
        ...state,
        cars: action.state.cars,
        trips: action.state.trips,
        fillUps: action.state.fillUps,
        gasPrice: action.state.gasPrice,
        selectedCarId: null,
      };
    }

    default:
      return state;
  }
}

/* ── Context ── */

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Write-through persistence
  useEffect(() => {
    saveCars(state.cars);
  }, [state.cars]);

  useEffect(() => {
    saveTrips(state.trips);
  }, [state.trips]);

  useEffect(() => {
    saveFillUps(state.fillUps);
  }, [state.fillUps]);

  useEffect(() => {
    saveGasPrice(state.gasPrice);
  }, [state.gasPrice]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
}
