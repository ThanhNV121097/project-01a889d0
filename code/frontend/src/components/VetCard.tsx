import { T } from "../editable";
import type { Vet } from "../lib/clinic";
import Flag from "./Flag";

/**
 * A vet: the name, what they are for, and — where they have one — the day
 * they do not work, as a flag beside the name on every page they appear on.
 */
export default function VetCard({ vet, onPick, selected }: { vet: Vet; onPick?: (v: Vet) => void; selected?: boolean }) {
  const inner = (
    <>
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-display text-[17px] text-ink">{vet.name}</span>
        {vet.daysOff.length > 0 && (
          <Flag tone={selected ? "quiet" : "accent"}>
            <T k="book.noThursday" />
          </Flag>
        )}
      </span>
      <span className={`mt-2 block text-sm ${selected ? "" : "text-ink-soft"}`}>{vet.forWhat}</span>
    </>
  );
  if (!onPick) {
    return (
      <div data-record={`vets:${vet.id}`} className="border-b border-line px-3 py-4">
        {inner}
      </div>
    );
  }
  return (
    <button
      type="button"
      data-record={`vets:${vet.id}`}
      data-testid={`vet-${vet.id}`}
      onClick={() => onPick(vet)}
      aria-pressed={selected}
      className={`block w-full border-b border-line px-3 py-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-ground ${selected ? "bg-accent text-accent-ink" : ""}`}
    >
      {inner}
    </button>
  );
}
