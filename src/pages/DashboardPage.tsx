import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { GasPriceInput } from "../components/GasPriceInput";
import { SummaryCard } from "../components/SummaryCard";
import { DataBackup } from "../components/DataBackup";

export function DashboardPage() {
  const { state } = useAppContext();
  const { cars } = state;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="mt-2 text-muted" style={{ fontFamily: "Inter, sans-serif" }}>
            Track your active trips and estimated fuel costs.
          </p>
        </div>
        <GasPriceInput />
      </div>

      {/* No cars state */}
      {cars.length === 0 ? (
        <div className="surface-card rounded-lg p-8 text-center sm:p-12">
          <p
            className="text-muted mb-4 text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            No cars yet — add your first car to get started.
          </p>
          <Link
            to="/cars"
            className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active no-underline"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Add Car
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cars.map((car) => (
            <Link
              key={car.id}
              to={`/cars/${car.id}`}
              className="no-underline transition-transform hover:scale-[1.01]"
            >
              <SummaryCard car={car} />
            </Link>
          ))}
        </div>
      )}

      {/* Data backup section */}
      <hr className="my-8 border-hairline sm:my-12" />
      <DataBackup />
    </div>
  );
}
