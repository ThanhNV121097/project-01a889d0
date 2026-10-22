/**
 * Bookings made in this browser, for the design. The booking page writes one
 * here and the confirmation page reads it back by reference; after approval
 * the backend story replaces this module with the clinic's own API behind
 * the same two functions.
 */

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  vetId: string;
  vetName: string;
  /** ISO day, "2026-02-16". */
  date: string;
  /** "08:30", or "" for a half-day block. */
  time: string;
  /** What the slot button read: a time, "Morning" or "Afternoon". */
  slotLabel: string;
  petName: string;
}

const KEY = "bonchan:bookings";

function all(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    const rows = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(rows) ? (rows as Booking[]) : [];
  } catch {
    return [];
  }
}

/** A reference an owner can read out at the desk. */
function reference(): string {
  return "b-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function createBooking(b: Omit<Booking, "id">): Booking {
  const booking: Booking = { ...b, id: reference() };
  try {
    localStorage.setItem(KEY, JSON.stringify([...all(), booking]));
  } catch {
    // Storage refused: the confirmation still shows this one booking.
  }
  lastMade = booking;
  return booking;
}

/** The booking just made, when storage is refused and the id cannot be found. */
let lastMade: Booking | null = null;

export function getBooking(id: string | undefined): Booking | null {
  if (!id) return null;
  return all().find((b) => b.id === id) ?? (lastMade && lastMade.id === id ? lastMade : null);
}
