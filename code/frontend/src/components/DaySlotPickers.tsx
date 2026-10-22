import { T } from "../editable";
import { formatDate } from "../lib/format";
import { DAY_NAMES, isOpen, vetWorks, type Slot, type Vet } from "../lib/clinic";

/**
 * The day picker and the time picker. A day the clinic is closed, or the
 * chosen vet does not work — Dr Quân's Thursday — is visibly disabled, not
 * hidden: the reader has to see why it cannot be chosen.
 */
export function DayPicker({ days, vet, value, onPick }: { days: Date[]; vet?: Vet; value: string; onPick: (iso: string) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d, i) => {
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const open = isOpen(d);
        const works = vetWorks(vet, d);
        const can = open && works;
        const picked = value === iso;
        return (
          <li key={iso}>
            <button
              type="button"
              data-testid={`day-${i}`}
              disabled={!can}
              onClick={() => onPick(iso)}
              aria-pressed={picked}
              className={`w-full rounded-[var(--radius)] border px-3 py-3 text-left transition-colors duration-[var(--duration-fast)] ${
                picked ? "border-accent bg-accent text-accent-ink" : can ? "border-line bg-surface hover:bg-ground" : "border-line bg-[var(--wait-ground)] text-ink-soft"
              }`}
            >
              <span className="block text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)]">{DAY_NAMES[d.getDay()].slice(0, 3)}</span>
              <span className="mt-1 block font-display tabular-nums text-[length:var(--size-figure)]">{formatDate(d)}</span>
              {!can && (
                <span className="mt-1 block text-xs">
                  <T k={works ? "book.closed" : "book.noThursday"} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function SlotPicker({ slots, value, onPick }: { slots: Slot[]; value: string; onPick: (label: string) => void }) {
  if (slots.length === 0) return <T k="book.none" as="p" className="text-ink-soft" />;
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
      {slots.map((s, i) => {
        const picked = value === s.label;
        return (
          <li key={s.label}>
            <button
              type="button"
              data-testid={`slot-${i}`}
              onClick={() => onPick(s.label)}
              aria-pressed={picked}
              className={`w-full rounded-[var(--radius)] border px-2 py-2 text-center font-display tabular-nums text-sm transition-colors duration-[var(--duration-fast)] ${
                picked ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface hover:bg-ground"
              }`}
            >
              {s.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
