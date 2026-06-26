import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./components/Toast";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { CarManagementPage } from "./pages/CarManagementPage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { AddTripPage } from "./pages/AddTripPage";
import { FillUpHistoryPage } from "./pages/FillUpHistoryPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";

export function App() {
  return (
    <BrowserRouter basename="/trip-calculator">
      <AppProvider>
        <ThemeProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/cars" element={<CarManagementPage />} />
                <Route path="/cars/:carId" element={<CarDetailPage />} />
                <Route path="/cars/:carId/trips/new" element={<AddTripPage />} />
                <Route path="/cars/:carId/history" element={<FillUpHistoryPage />} />
                <Route path="/cars/:carId/analytics" element={<AnalyticsPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
