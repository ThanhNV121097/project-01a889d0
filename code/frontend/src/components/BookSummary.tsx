import { useContent, T } from "../editable";
import { formatDate, formatPrice } from "../lib/format";
import type { Service, Vet } from "../lib/clinic";
import Icon from "./Icon";

/**
 * The booking summary: what has been chosen so far, and the one button that
 * ends the page. It lives beside the steps from 1024px up and reads only
 * what the steps have set, so the page itself stays a list of steps.
 */
export default function BookSummary({
  service,
  vet,
  date,
  slotLabel,
  ready,
  onConfirm,
}: {
  service?: Service;
  vet?: Vet;
  date: string;
  slotLabel: string;
  ready: boolean;
  onConfirm: () => void;
}) {
  const labels = useContent<{ service: string; vet: string; when: string; price: string }>("booking");
  const none = useContent("book.notChosen");
  const when = whenLine(date, slotLabel, none);
  const headClass = "text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft";
  return (
    <aside className="rounded-[var(--radius)] border border-line bg-surface p-[var(--space-6)] lg:sticky lg:top-[calc(var(--header-h)+16px)]">
      <T k="book.steps.summary" as="h2" className={headClass} />
      <dl className="mt-4 border-t border-line text-sm">
        <Row label={labels.service} value={service?.name ?? none} />
        <Row label={labels.vet} value={vet?.name ?? none} />
        <Row label={labels.when} value={when} />
        <Row label={labels.price} value={service ? formatPrice(service.price) : none} figure />
      </dl>
      <button
        type="button"
        data-testid="confirm-booking"
        disabled={!ready}
        onClick={onConfirm}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-40"
      >
        <Icon name="check" size={18} />
        <T k="book.confirm" />
      </button>
    </aside>
  );
}

/** "16/02/2026 · 08:30", or the day alone until a time is picked. */
function whenLine(date: string, slotLabel: string, none: string): string {
  if (!date) return none;
  return slotLabel ? `${formatDate(date)} · ${slotLabel}` : formatDate(date);
}

function Row({ label, value, figure = false }: { label: string; value: string; figure?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`text-right text-ink ${figure ? "font-display tabular-nums text-[length:var(--size-figure)]" : ""}`}>{value}</dd>
    </div>
  );
}
