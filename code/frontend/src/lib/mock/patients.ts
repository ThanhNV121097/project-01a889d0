import type { Pet, Vaccination } from "../clinic";

/**
 * Whose pets a signed-in visitor sees. The design has no accounts behind it,
 * so a visitor who signs in with an address that is not on any record is
 * shown the demo owner's file — the whole point of the page is that the
 * owner can read a real vaccination history on it. The backend story replaces
 * this with the signed-in owner's own records.
 */
export const DEMO_OWNER_EMAIL = "owner@bonchan.example";

export function petsOf(pets: Pet[], email: string): Pet[] {
  const mine = pets.filter((p) => p.ownerEmail === email);
  return mine.length > 0 ? mine : pets.filter((p) => p.ownerEmail === DEMO_OWNER_EMAIL);
}

export function vaccinationsOf(rows: Vaccination[], pets: Pet[]): Vaccination[] {
  const ids = new Set(pets.map((p) => p.id));
  return rows.filter((v) => ids.has(v.pet));
}
