import { TripRow } from "./TripRow";
import { roundTo2 } from "../services/helpers";
import type { Trip } from "../types";

interface TripTableProps {
  trips: Trip[];
  showCar?: boolean;
}

export function TripTable({ trips, showCar = false }: TripTableProps) {
  if (trips.length === 0) return null;

  const totalDistance = roundTo2(trips.reduce((s, t) => s + t.distanceKm, 0));
  const totalUsage = roundTo2(trips.reduce((s, t) => s + t.estimatedUsageL, 0));
  const totalToll = roundTo2(trips.reduce((s, t) => s + t.tollCost, 0));

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        <thead>
          <tr className="border-b border-hairline bg-surface-soft">
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">
              Dir
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-medium">
              Label
            </th>
            <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">
              Dist (km)
            </th>
            <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">
              Cons (km/L)
            </th>
            <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">
              Usage (L)
            </th>
            <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-soft font-medium">
              Toll
            </th>
            <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-muted-soft font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <TripRow key={trip.id} trip={trip} showCar={showCar} />
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-hairline bg-surface-soft">
            <td className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-soft font-semibold">
              Totals
            </td>
            <td />
            <td />
            <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">
              {totalDistance}
            </td>
            <td />
            <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">
              {totalUsage.toFixed(2)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-xs text-ink font-semibold">
              {totalToll > 0 ? `₱${totalToll}` : "—"}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
