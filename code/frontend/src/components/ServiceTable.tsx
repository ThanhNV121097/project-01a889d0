import type { ReactNode } from "react";
import { T } from "../editable";
import { formatPrice } from "../lib/format";
import type { Service } from "../lib/clinic";
import Figure from "./Figure";

/**
 * The seven services as a hairline table — name, what it is for, how long it
 * takes, what it costs. Never a card grid: a price list is read down a
 * column. Used on the home page, /services, /book and /admin/services.
 *
 * The head below and every row share the three class names under this
 * comment, so the Time and Price cells are the same fixed width in every row
 * and the digits line up down the column and under their head. A long price
 * note wraps inside the price cell: it can never widen the column, because
 * the column's width does not come from its content.
 */
const ROW = "flex w-full items-start gap-x-[var(--space-6)] px-3";
const NAME_CELL = "min-w-0 flex-1";
const FIGURES =
  "flex w-[var(--col-figure)] shrink-0 flex-col items-end gap-y-1 sm:w-auto sm:flex-row sm:items-start sm:gap-x-[var(--space-6)]";
const TIME_CELL = "w-full sm:w-[var(--col-time)]";
const PRICE_CELL = "w-full text-right sm:w-[var(--col-price)]";

function Row({ s, compact }: { s: Service; compact: boolean }) {
  return (
    <>
      <span className={NAME_CELL}>
        <span className="block font-display text-[17px] leading-snug text-ink">{s.name}</span>
        {!compact && <span className="mt-1 block text-sm text-ink-soft">{s.forWhat}</span>}
      </span>
      <span className={FIGURES}>
        <span className={TIME_CELL}>
          <Figure className="text-ink-soft">{s.durationLabel}</Figure>
        </span>
        <span className={PRICE_CELL} data-testid={`service-price-${s.id}`}>
          <Figure className="text-ink">{formatPrice(s.price)}</Figure>
          {s.priceNote && <span className="mt-1 block text-xs text-ink-soft">{s.priceNote}</span>}
        </span>
      </span>
    </>
  );
}

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
        const body: ReactNode = <Row s={s} compact={compact} />;
        return (
          <li key={s.id} data-record={`services:${s.id}`} className="border-b border-line">
            {onPick ? (
              <button
                type="button"
                data-testid={`service-${s.id}`}
                onClick={() => onPick(s)}
                aria-pressed={picked}
                className={`${ROW} py-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-ground ${picked ? "bg-accent text-accent-ink" : ""}`}
              >
                {body}
              </button>
            ) : (
              <div className={`${ROW} py-4`} data-testid={`service-row-${s.id}`}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The table's own column heads, on the same columns as the rows. */
export function ServiceHead() {
  return (
    <div className={`${ROW} pb-2 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft`}>
      <T k="services.columns.service" className={NAME_CELL} />
      <span className={FIGURES}>
        <T k="services.columns.duration" className={`${TIME_CELL} block text-right`} />
        <T k="services.columns.price" className={`${PRICE_CELL} hidden sm:block`} />
      </span>
    </div>
  );
}
