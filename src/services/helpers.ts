/**
 * Generate a unique ID using crypto.randomUUID when available,
 * falling back to a timestamp-based ID.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Round a number to 2 decimal places.
 */
export function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Compute estimated fuel usage in liters.
 *   estimated usage = distanceKm / fuelConsumptionKmL
 */
export function computeEstimatedUsage(
  distanceKm: number,
  fuelConsumptionKmL: number,
): number {
  if (!distanceKm || !fuelConsumptionKmL || fuelConsumptionKmL === 0) return 0;
  return roundTo2(distanceKm / fuelConsumptionKmL);
}
