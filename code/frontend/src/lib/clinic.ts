/**
 * The clinic's own rules, in one place: how long a slot is, which days a vet
 * works, and when a vaccination is overdue. The booking page, the account and
 * the admin tables all read from here, so the opening hours and the slot
 * lengths are stated once.
 *
 * Opening hours are the owner's: 8:00–19:00 Monday to Saturday, 8:00–12:00
 * Sunday. A half-day service (a dental, a neutering) has no clock boundary in
 * the brief, so it offers the morning and the afternoon as blocks and the
 * desk agrees the hour.
 */

export interface Service {
  id: string;
  name: string;
  forWhat: string;
  minutes: number;
  durationLabel: string;
  price: number;
  priceNote: string;
  halfDay: boolean;
}

export interface Vet {
  id: string;
  name: string;
  years: number;
  forWhat: string;
  daysOff: string[];
  image: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  born: string;
  weightKg: number;
  owner: string;
  ownerEmail: string;
  image: string;
}

export interface Vaccination {
  id: string;
  pet: string;
  vaccine: string;
  given: string;
  due: string;
  vet: string;
}

export interface Appointment {
  id: string;
  pet: string;
  service: string;
  vet: string;
  date: string;
  time: string;
  status: string;
  /** The desk has telephoned or the owner has answered: the row is agreed. */
  confirmed?: boolean;
  ownerEmail: string;
}

/** A day as the records write it: "2026-10-22". */
export function isoDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Opening hours in minutes from midnight: Sunday closes at noon. */
function openHours(date: Date): { from: number; to: number } | null {
  const day = date.getDay();
  if (day === 0) return { from: 8 * 60, to: 12 * 60 };
  return { from: 8 * 60, to: 19 * 60 };
}

/** The clinic is open on this day. */
export function isOpen(date: Date): boolean {
  return openHours(date) !== null;
}

/** The vet works on this day — Dr Quân does not work Thursdays. */
export function vetWorks(vet: Vet | undefined, date: Date): boolean {
  if (!vet) return true;
  return !vet.daysOff.includes(DAY_NAMES[date.getDay()]);
}

/** The next `count` days from today, whatever they are: the picker disables the rest. */
export function nextDays(count: number, from: Date = new Date()): Date[] {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    out.push(d);
  }
  return out;
}

/** "08:30" from minutes past midnight. */
function clock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface Slot {
  /** What identifies the slot: "08:30", or "morning" / "afternoon". */
  id: string;
  /** "08:30", or "" for a half-day block whose hour the desk agrees. */
  time: string;
  /**
   * For a half-day block, the content.json key its words come from — the
   * clinic's own copy lives there, never in this file.
   */
  labelKey?: string;
}

/**
 * The times a service offers on a day. A 30-minute consultation lays the day
 * out in 30-minute steps, a 15-minute vaccination in 15; a half-day service
 * gives the morning and, where the clinic is open past noon, the afternoon.
 */
export function slotsFor(service: Service | undefined, date: Date): Slot[] {
  const hours = openHours(date);
  if (!service || !hours) return [];
  if (service.halfDay) {
    const blocks: Slot[] = [{ id: "morning", time: "", labelKey: "book.half.morning" }];
    if (hours.to > 13 * 60) blocks.push({ id: "afternoon", time: "", labelKey: "book.half.afternoon" });
    return blocks;
  }
  const out: Slot[] = [];
  for (let t = hours.from; t + service.minutes <= hours.to; t += service.minutes) {
    // The clinic's lunch, the one hour the owner's hours leave implied by the
    // Sunday close: kept bookable on purpose — the brief names no break.
    out.push({ id: clock(t), time: clock(t) });
  }
  return out;
}

/** The day a picker's ISO value stands for, or null while none is chosen. */
export function dayFromIso(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/**
 * What a chosen slot reads as: a timed slot is its own clock reading, a
 * half-day block takes the clinic's words from content.json.
 */
export function slotLabelOf(slot: Slot | undefined, half: Record<string, string>): string {
  if (!slot) return "";
  if (slot.labelKey) return half[slot.id] ?? "";
  return slot.time;
}

/** A due date already past: the row the clinic filters on. */
export function isOverdue(due: string, today: Date = new Date()): boolean {
  if (!due) return false;
  const [y, m, d] = due.split("-").map(Number);
  if (!y || !m || !d) return false;
  return new Date(y, m - 1, d).getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
}

/** The soonest vaccination still to come for a pet, or the oldest overdue one. */
export function nextDue(rows: Vaccination[], petId: string): Vaccination | undefined {
  const mine = rows.filter((v) => v.pet === petId && v.due);
  if (mine.length === 0) return undefined;
  const overdue = mine.filter((v) => isOverdue(v.due)).sort((a, b) => a.due.localeCompare(b.due));
  if (overdue.length > 0) return overdue[0];
  return mine.sort((a, b) => a.due.localeCompare(b.due))[0];
}

/** An appointment's day and time as one ISO moment, for sorting and formatting. */
export function when(a: { date: string; time: string }): string {
  return a.time ? `${a.date}T${a.time}` : a.date;
}

/** Rows to a CSV file the clinic can open in a spreadsheet. */
export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const cell = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\n");
}

/** Hands the browser a CSV file to save. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
