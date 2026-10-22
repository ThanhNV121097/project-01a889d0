import { useState } from "react";
import { T, useContent } from "../editable";
import { useCollection, setCollection, type Row } from "../data";
import { usePageMeta } from "../seo";
import { formatPrice } from "../lib/format";
import type { Service } from "../lib/clinic";
import Section from "../components/Section";
import AdminNav from "../components/AdminNav";
import RequireSession from "../components/RequireSession";

/** The prices, which change. What is here is what the booking page shows. */
export default function AdminServices() {
  usePageMeta("admin.servicesPage.title");
  return (
    <RequireSession>
      <Body />
    </RequireSession>
  );
}

function Body() {
  const { items } = useCollection<Service>("services", { pageSize: 20 });
  const [editing, setEditing] = useState("");
  const [value, setValue] = useState("");
  const columns = useContent<{ service: string; duration: string; price: string }>("services.columns");

  function save(id: string) {
    const price = Number(value);
    if (Number.isFinite(price) && price > 0) {
      setCollection("services", items.map((s) => (s.id === id ? { ...s, price } : s)) as unknown as Row[]);
    }
    setEditing("");
  }

  return (
    <Section labelKey="admin.label">
      <AdminNav />
      <T k="admin.servicesPage.heading" as="h1" className="mt-[var(--space-8)] text-[length:var(--size-h1)] text-ink" />
      <T k="admin.servicesPage.note" as="p" className="mt-3 max-w-[52ch] text-ink-soft" />
      <div className="mt-[var(--space-8)] grid grid-cols-[1fr_auto_auto] gap-x-[var(--space-6)] px-3 pb-2 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft">
        <span>{columns.service}</span>
        <span className="text-right">{columns.duration}</span>
        <span className="text-right">{columns.price}</span>
      </div>
      <ul className="border-t border-line">
        {items.map((s) => (
          <li key={s.id} data-record={`services:${s.id}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-[var(--space-6)] border-b border-line px-3 py-3">
            <span className="min-w-0 text-ink">{s.name}</span>
            <span className="block text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink-soft">{s.durationLabel}</span>
            {editing === s.id ? (
              <span className="flex items-center justify-end gap-2">
                <input
                  id={`price-${s.id}`}
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-36 rounded-[var(--radius)] border border-field bg-surface px-3 py-2 text-right font-display tabular-nums text-ink"
                />
                <button type="button" data-testid={`save-${s.id}`} onClick={() => save(s.id)} className="whitespace-nowrap rounded-[var(--radius)] bg-accent px-3 py-2 text-sm text-accent-ink">
                  <T k="admin.servicesPage.save" />
                </button>
              </span>
            ) : (
              <button
                type="button"
                data-testid={`edit-${s.id}`}
                onClick={() => { setEditing(s.id); setValue(String(s.price)); }}
                className="block text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink underline decoration-line underline-offset-4 hover:decoration-current"
              >
                {formatPrice(s.price)}
              </button>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
