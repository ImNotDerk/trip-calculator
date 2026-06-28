import { useAppContext } from "../context/AppContext";
import { roundTo2 } from "../services/helpers";
import type { Car } from "../types";

interface SummaryCardProps {
  car: Car;
}

export function SummaryCard({ car }: SummaryCardProps) {
  const { state } = useAppContext();
  const activeTrips = state.trips.filter(
    (t) => t.carId === car.id && t.status === "active",
  );

  const tripCount = activeTrips.length;
  const totalDistance = roundTo2(activeTrips.reduce((s, t) => s + t.distanceKm, 0));
  const totalFuel = roundTo2(activeTrips.reduce((s, t) => s + t.estimatedUsageL, 0));
  const totalTolls = roundTo2(activeTrips.reduce((s, t) => s + t.tollCost, 0));
  const estimatedCost = roundTo2(totalFuel * state.gasPrice);

  return (
    <div className="surface-card rounded-lg p-5 sm:p-8">
      <h4 className="mb-6 break-words">
        {car.name}
        {car.plateNumber && (
          <span className="ml-2 text-muted font-normal text-base" style={{ fontFamily: "Inter, sans-serif" }}>
            {car.plateNumber}
          </span>
        )}
      </h4>

      {tripCount === 0 ? (
        <p className="text-muted text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          No active trips
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Trips" value={tripCount.toString()} />
          <Stat label="Distance" value={`${totalDistance} km`} />
          <Stat label="Fuel Used" value={`${totalFuel} L`} />
          <Stat label="Tolls" value={`₱${totalTolls}`} />
          {state.gasPrice > 0 && (
            <Stat
              label="Est. Fuel Cost"
              value={`₱${estimatedCost}`}
              highlight
            />
          )}
        </div>
      )}
    </div>
  );
}

function Stat({
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
        className="text-xs uppercase tracking-wider text-muted-soft mb-1"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        {label}
      </div>
      <div
        className={`text-lg font-semibold ${highlight ? "text-primary" : "text-ink"}`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {value}
      </div>
    </div>
  );
}
