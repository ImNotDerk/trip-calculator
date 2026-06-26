import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../hooks/useTheme";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsPage() {
  const { carId } = useParams<{ carId: string }>();
  const { state } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const car = state.cars.find((c) => c.id === carId);

  if (!car) {
    return (
      <div className="surface-card rounded-lg p-12 text-center">
        <p
          className="text-muted text-lg"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Car not found.
        </p>
        <Link
          to="/cars"
          className="mt-4 inline-block text-sm font-medium text-primary"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← Back to Cars
        </Link>
      </div>
    );
  }

  // All trips (active + filled) for this car
  const allTrips = state.trips
    .filter((t) => t.carId === car.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // All fill-ups for this car
  const allFillUps = state.fillUps
    .filter((f) => f.carId === car.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const hasData = allTrips.length > 0 || allFillUps.length > 0;

  // Chart colors
  const colors = {
    grid: isDark ? "#2a2824" : "#e6dfd8",
    text: isDark ? "#a09d96" : "#6c6a64",
    tooltipBg: isDark ? "#252320" : "#ffffff",
    tooltipBorder: isDark ? "#2a2824" : "#e6dfd8",
    tooltipText: isDark ? "#f5f0e8" : "#141413",
    primary: "#cc785c",
    teal: "#5db8a6",
    amber: "#e8a55a",
  };

  const chartStyle = { fontFamily: "Inter, sans-serif" };

  /* ── Chart Data ── */

  const efficiencyData = allTrips.map((t) => ({
    date: new Date(t.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    efficiency: t.fuelConsumptionKmL,
  }));

  const fillUpCostData = allFillUps.map((f) => ({
    date: new Date(f.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    cost: f.grandTotal,
  }));

  const fillUpDistanceData = allFillUps.map((f) => ({
    date: new Date(f.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    distance: f.totalDistanceKm,
  }));

  const fuelPriceData = allFillUps.map((f) => ({
    date: new Date(f.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    price: f.gasPricePerLiter,
  }));

  /* ── Shared tooltip style ── */

  const tooltipStyle = {
    backgroundColor: colors.tooltipBg,
    border: `1px solid ${colors.tooltipBorder}`,
    borderRadius: "8px",
    color: colors.tooltipText,
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-2">
        <Link
          to={`/cars/${car.id}`}
          className="text-sm text-muted no-underline hover:text-ink transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← {car.name}
        </Link>
      </div>
      <div className="mb-8">
        <h1>Analytics</h1>
        <p
          className="mt-2 text-muted"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Trip efficiency and fill-up cost trends for {car.name}.
        </p>
      </div>

      {!hasData ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <p
            className="text-muted mb-4"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            No data yet. Log some trips and perform a fill-up to see analytics.
          </p>
          <Link
            to={`/cars/${car.id}/trips/new`}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary no-underline"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            + Log Trip
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart 1: Trip Efficiency */}
          <ChartCard title="Trip Efficiency (km/L)">
            {efficiencyData.length === 0 ? (
              <EmptyMessage />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={efficiencyData} style={chartStyle}>
                  <CartesianGrid
                    stroke={colors.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <YAxis
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, r: 3 }}
                    activeDot={{ r: 5 }}
                    name="km/L"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Chart 2: Fill-Up Costs */}
          <ChartCard title="Fill-Up Costs (₱)">
            {fillUpCostData.length === 0 ? (
              <EmptyMessage />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={fillUpCostData} style={chartStyle}>
                  <CartesianGrid
                    stroke={colors.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <YAxis
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="cost"
                    fill={colors.primary}
                    radius={[4, 4, 0, 0]}
                    name="Grand Total"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Chart 3: Distance Per Fill-Up */}
          <ChartCard title="Distance Per Fill-Up (km)">
            {fillUpDistanceData.length === 0 ? (
              <EmptyMessage />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={fillUpDistanceData} style={chartStyle}>
                  <CartesianGrid
                    stroke={colors.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <YAxis
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="distance"
                    fill={colors.teal}
                    radius={[4, 4, 0, 0]}
                    name="Distance"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Chart 4: Fuel Price Trend */}
          <ChartCard title="Fuel Price Trend (₱/L)">
            {fuelPriceData.length === 0 ? (
              <EmptyMessage />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={fuelPriceData} style={chartStyle}>
                  <CartesianGrid
                    stroke={colors.grid}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <YAxis
                    tick={{ fill: colors.text, fontSize: 12 }}
                    stroke={colors.grid}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={colors.amber}
                    strokeWidth={2}
                    dot={{ fill: colors.amber, r: 3 }}
                    activeDot={{ r: 5 }}
                    name="₱/L"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card rounded-lg p-6">
      <h4 className="mb-4">{title}</h4>
      {children}
    </div>
  );
}

function EmptyMessage() {
  return (
    <div className="flex h-[280px] items-center justify-center">
      <p
        className="text-sm text-muted-soft"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        No data available yet.
      </p>
    </div>
  );
}
