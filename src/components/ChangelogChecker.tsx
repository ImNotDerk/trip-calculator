import { useState, useEffect } from "react";
import { ChangelogModal } from "./ChangelogModal";
import type { VersionManifest, ChangelogEntry } from "../types";

const SEEN_VERSION_KEY = "trip-calc-seen-version";

export function ChangelogChecker() {
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(import.meta.env.BASE_URL + "version.json");
        if (!res.ok) return;

        const data: VersionManifest = await res.json();
        if (!data.version || !Array.isArray(data.entries)) return;

        const seen = (() => {
          try {
            return localStorage.getItem(SEEN_VERSION_KEY);
          } catch {
            return null;
          }
        })();

        if (data.version === seen) return;
        if (cancelled) return;

        setCurrentVersion(data.version);
        setEntries(data.entries);
        setShowModal(true);
      } catch {
        // Silently skip on network/parse errors
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDismiss = () => {
    try {
      if (currentVersion) {
        localStorage.setItem(SEEN_VERSION_KEY, currentVersion);
      }
    } catch {
      // localStorage unavailable — modal still closes
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return <ChangelogModal entries={entries} onClose={handleDismiss} />;
}
