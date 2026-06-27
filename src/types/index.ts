/** Versioned backup envelope for import/export. */
export interface BackupEnvelope {
  version: 1;
  exportedAt: string; // ISO 8601
  data: {
    cars: Car[];
    trips: Trip[];
    fillUps: FillUp[];
    gasPrice: number;
  };
}

/** A car (vehicle) owned by the user. */
export interface Car {
  id: string;
  name: string;
  plateNumber?: string;
  createdAt: string; // ISO date string
}

/** Direction of a trip. */
export type TripDirection = "to" | "from" | "other";

/** Status of a trip: active (current tank) or filled (archived in a fill-up). */
export type TripStatus = "active" | "filled";

/** An individual trip logged by the user. */
export interface Trip {
  id: string;
  carId: string;
  date: string; // ISO date string
  direction: TripDirection;
  label: string;
  distanceKm: number;
  fuelConsumptionKmL: number;
  estimatedUsageL: number; // computed: distanceKm / fuelConsumptionKmL
  tollCost: number;
  status: TripStatus;
  fillUpId: string | null; // null when active, set when filled
}

/** A fill-up archives trips at a gas price and resets. */
export interface FillUp {
  id: string;
  carId: string;
  date: string; // ISO date string
  gasPricePerLiter: number;
  totalDistanceKm: number;
  totalFuelL: number;
  totalFuelCost: number;
  totalTollCost: number;
  grandTotal: number;
  tripIds: string[];
}
