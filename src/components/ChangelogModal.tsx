import type { ChangelogEntry } from "../types";

interface ChangelogModalProps {
  entries: ChangelogEntry[];
  onClose: () => void;
}

export function ChangelogModal({ entries, onClose }: ChangelogModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-canvas p-6 shadow-lg sm:p-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="mb-0">What's New</h3>
          <button
            onClick={onClose}
            className="text-muted-soft hover:text-ink transition-colors p-1 -mr-1 -mt-1"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable entries list */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {entries.map((entry) => (
            <div key={entry.version}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display text-lg font-medium text-ink">
                  v{entry.version}
                </span>
                <span
                  className="text-xs text-muted"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {entry.date}
                </span>
              </div>
              {entry.title && (
                <p
                  className="text-sm font-medium text-body-strong mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {entry.title}
                </p>
              )}
              <ul className="space-y-1.5">
                {entry.changes.map((change, ci) => (
                  <li
                    key={ci}
                    className="flex items-start gap-2 text-sm text-body"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span className="text-primary mt-0.5 shrink-0">&mdash;</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer with dismiss button */}
        <div className="mt-6 pt-4 border-t border-hairline flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
