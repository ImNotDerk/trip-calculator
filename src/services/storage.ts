import type { Car, Trip, FillUp } from "../types";

const CARS_KEY = "trip-calc-cars";
const TRIPS_KEY = "trip-calc-trips";
const FILLUPS_KEY = "trip-calc-fillups";
const GAS_PRICE_KEY = "trip-calc-gas-price";

/* ── Generic helpers ── */

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── Cars ── */

export function getCars(): Car[] {
  return getItem<Car[]>(CARS_KEY, []);
}

export function saveCars(cars: Car[]): void {
  setItem(CARS_KEY, cars);
}

/* ── Trips ── */

export function getTrips(): Trip[] {
  return getItem<Trip[]>(TRIPS_KEY, []);
}

export function saveTrips(trips: Trip[]): void {
  setItem(TRIPS_KEY, trips);
}

/* ── Fill-ups ── */

export function getFillUps(): FillUp[] {
  return getItem<FillUp[]>(FILLUPS_KEY, []);
}

export function saveFillUps(fillUps: FillUp[]): void {
  setItem(FILLUPS_KEY, fillUps);
}

/* ── Gas Price (shared across all cars) ── */

export function getGasPrice(): number {
  return getItem<number>(GAS_PRICE_KEY, 0);
}

export function saveGasPrice(price: number): void {
  setItem(GAS_PRICE_KEY, price);
}
