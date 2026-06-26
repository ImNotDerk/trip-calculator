import { Link, Outlet, useLocation } from "react-router-dom";
import { CarSelector } from "./CarSelector";
import { useTheme } from "../hooks/useTheme";

export function Layout() {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/cars", label: "Cars" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Top nav — cream bar, 64px tall */}
      <header className="sticky top-0 z-50 h-16 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          {/* Left: brand + nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-display text-xl font-normal tracking-tight text-ink no-underline sm:text-2xl"
            >
              Trip Calculator
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                  || (link.to !== "/" && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-card text-ink"
                        : "text-muted hover:text-ink"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: car selector + theme toggle */}
          <div className="flex items-center gap-2">
            <CarSelector />
            <button
              onClick={toggle}
              className="ml-1 rounded-md p-2 text-muted transition-colors hover:text-ink hover:bg-surface-card"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={theme === "light" ? "Dark mode" : "Light mode"}
            >
              {theme === "light" ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer — dark navy */}
      <footer className="bg-surface-dark py-16 dark:border-t dark:border-surface-dark-elevated">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-on-dark-soft)" }}
          >
            Trip Calculator — track your car trips and fuel costs.
          </p>
        </div>
      </footer>
    </div>
  );
}
