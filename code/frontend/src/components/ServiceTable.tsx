import { T } from "../editable";
import { formatPrice } from "../lib/format";
import type { Service } from "../lib/clinic";
import Figure from "./Figure";

/**
 * The seven services as a hairline table — name, what it is for, how long it
 * takes, what it costs. Never a card grid: a price list is read down a
 * column. Used on the home page, /services, /book and /admin/services.
 */
export default function ServiceTable({
  items,
  onPick,
  selected,
  compact = false,
}: {
  items: Service[];
  onPick?: (s: Service) => void;
  selected?: string;
  compact?: boolean;
}) {
  return (
    <ul className="w-full border-t border-line">
      {items.map((s) => {
        const picked = selected === s.id;
        const body = (
          <>
            <span className="min-w-0">
              <span className="block font-display text-[17px] leading-snug text-ink">{s.name}</span>
              {!compact && <span className="mt-1 block text-sm text-ink-soft">{s.forWhat}</span>}
            </span>
            <Figure className="text-ink-soft">{s.durationLabel}</Figure>
            <span className="text-right">
              <Figure className="text-ink">{formatPrice(s.price)}</Figure>
              {s.priceNote && <span className="mt-1 block text-xs text-ink-soft">{s.priceNote}</span>}
            </span>
          </>
        );
        const grid = "grid w-full grid-cols-[1fr_auto] items-start gap-x-[var(--space-6)] gap-y-1 sm:grid-cols-[1fr_84px_minmax(120px,auto)]";
        return (
          <li key={s.id} data-record={`services:${s.id}`} className="border-b border-line">
            {onPick ? (
              <button
                type="button"
                data-testid={`service-${s.id}`}
                onClick={() => onPick(s)}
                aria-pressed={picked}
                className={`${grid} px-3 py-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-ground ${picked ? "bg-accent text-accent-ink" : ""}`}
              >
                {body}
              </button>
            ) : (
              <div className={`${grid} px-3 py-4`} data-testid={`service-row-${s.id}`}>
                <span className="min-w-0">
                  <span className="block font-display text-[17px] leading-snug text-ink">{s.name}</span>
                  {!compact && <span className="mt-1 block text-sm text-ink-soft">{s.forWhat}</span>}
                </span>
                <Figure className="text-ink-soft">{s.durationLabel}</Figure>
                <span className="text-right" data-testid={`service-price-${s.id}`}>
                  <Figure className="text-ink">{formatPrice(s.price)}</Figure>
                  {s.priceNote && <span className="mt-1 block text-xs text-ink-soft">{s.priceNote}</span>}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The table's own column heads, where a page wants them. */
export function ServiceHead() {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-[var(--space-6)] px-3 pb-2 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft sm:grid-cols-[1fr_84px_minmax(120px,auto)]">
      <T k="services.columns.service" />
      <T k="services.columns.duration" className="block text-right" />
      <T k="services.columns.price" className="hidden text-right sm:block" />
    </div>
  );
}
