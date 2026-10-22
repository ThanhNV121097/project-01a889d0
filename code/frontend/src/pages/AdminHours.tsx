import { T } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import { DAY_NAMES, type Vet } from "../lib/clinic";
import Section from "../components/Section";
import AdminNav from "../components/AdminNav";
import Flag from "../components/Flag";
import RequireSession from "../components/RequireSession";
import Icon from "../components/Icon";

/** Which days each vet works — what the booking page's day picker reads. */
export default function AdminHours() {
  usePageMeta("admin.hours.title");
  return (
    <RequireSession>
      <Body />
    </RequireSession>
  );
}

/** Monday first, as a working week is read. */
const WEEK = [...DAY_NAMES.slice(1), DAY_NAMES[0]];

function Body() {
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  return (
    <Section labelKey="admin.label">
      <AdminNav />
      <T k="admin.hours.heading" as="h1" className="mt-[var(--space-8)] text-[length:var(--size-h1)] text-ink" />
      <T k="admin.hours.note" as="p" className="mt-3 max-w-[56ch] text-ink-soft" />
      <p className="mt-4 inline-flex items-start gap-2 text-sm text-ink-soft">
        <Icon name="hours" size={16} />
        <T k="contact.hours" />
      </p>
      <img src="/images/puppy-check.jpg" alt="The consulting room at Bốn Chân" className="mt-[var(--space-8)] h-[220px] w-full rounded-[var(--radius)] object-cover" width={1280} height={914} />
      <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-8)]">
        {vets.map((v) => (
          <div key={v.id} data-record={`vets:${v.id}`}>
            <p className="flex flex-wrap items-center gap-3">
              <span className="font-display text-[17px] text-ink">{v.name}</span>
              {v.daysOff.length > 0 && (
                <Flag tone="accent">
                  <T k="book.noThursday" />
                </Flag>
              )}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {WEEK.map((day) => {
                const off = v.daysOff.includes(day);
                return (
                  <li
                    key={day}
                    data-testid={`hours-${v.id}-${day}`}
                    className={`rounded-[var(--radius)] border px-3 py-3 ${off ? "border-line bg-[var(--wait-ground)] text-ink-soft" : "border-line bg-surface text-ink"}`}
                  >
                    <span className="block text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft">{day.slice(0, 3)}</span>
                    <span className="mt-1 block text-sm">
                      <T k={off ? "admin.hours.off" : "admin.hours.works"} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
