import { Link } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import { useSession, signOut } from "../lib/session";
import { formatDate } from "../lib/format";
import { isOverdue, nextDue, when, type Appointment, type Pet, type Service, type Vaccination, type Vet } from "../lib/clinic";
import { petsOf, vaccinationsOf } from "../lib/mock/patients";
import Section from "../components/Section";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import RequireSession from "../components/RequireSession";

/** An owner's own page: their pets, what is due, and their appointments. */
export default function Account() {
  usePageMeta("account.title");
  return (
    <RequireSession>
      <AccountBody />
    </RequireSession>
  );
}

function AccountBody() {
  const session = useSession();
  const { items: allPets } = useCollection<Pet>("pets", { pageSize: 50 });
  const { items: vaccinations } = useCollection<Vaccination>("vaccinations", { pageSize: 100 });
  const { items: appointments } = useCollection<Appointment>("appointments", { pageSize: 100 });
  const { items: services } = useCollection<Service>("services", { pageSize: 20 });
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const labels = useContent<{ pets: string; upcoming: string; due: string; overdue: string }>("account.summary");

  const pets = petsOf(allPets, session?.email ?? "");
  const mine = vaccinationsOf(vaccinations, pets);
  const ids = new Set(pets.map((p) => p.id));
  const theirs = appointments.filter((a) => ids.has(a.pet)).sort((a, b) => when(a).localeCompare(when(b)));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = theirs.filter((a) => a.date >= today);
  const past = theirs.filter((a) => a.date < today).reverse();
  const overdue = mine.filter((v) => isOverdue(v.due));
  const soonest = mine.filter((v) => !isOverdue(v.due)).sort((a, b) => a.due.localeCompare(b.due))[0];
  const nameOf = (list: { id: string; name: string }[], id: string) => list.find((x) => x.id === id)?.name ?? "";

  return (
    <>
      <Section labelKey="account.label">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <T k="account.heading" as="h1" className="max-w-[20ch] text-[length:var(--size-h1)] text-ink" />
          <button type="button" onClick={signOut} data-testid="account-signout" className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-line px-4 py-2 text-sm text-ink-soft hover:bg-surface">
            <Icon name="logout" size={16} />
            <T k="account.signout" />
          </button>
        </div>
        <dl className="mt-[var(--space-8)] grid grid-cols-2 gap-px border border-line bg-[var(--line)] lg:grid-cols-4">
          <Cell label={labels.pets} value={String(pets.length)} />
          <Cell label={labels.upcoming} value={String(upcoming.length)} />
          <Cell label={labels.due} value={soonest ? formatDate(soonest.due) : "—"} />
          <Cell label={labels.overdue} value={String(overdue.length)} tone={overdue.length > 0 ? "alert" : "plain"} />
        </dl>
      </Section>

      <Section labelKey="account.pets" className="border-t border-line">
        <ul className="border-t border-line">
          {pets.map((p) => {
            const due = nextDue(mine, p.id);
            const late = due ? isOverdue(due.due) : false;
            return (
              <li key={p.id} data-record={`pets:${p.id}`} className="border-b border-line">
                <Link
                  to={`/account/pets/${p.id}`}
                  data-testid={`pet-${p.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-3 py-4 transition-colors duration-[var(--duration-fast)] hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-[17px] text-ink">{p.name}</span>
                    <span className="mt-1 block text-sm text-ink-soft">
                      {p.species} · {p.breed}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-right">
                    {due && (
                      <span className="font-display tabular-nums text-[length:var(--size-figure)] text-ink">{formatDate(due.due)}</span>
                    )}
                    {late && <Flag tone="alert"><T k="account.overdue" /></Flag>}
                    <Icon name="next" size={18} className="text-ink-soft" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <T k="account.addPetNote" as="p" className="mt-4 max-w-[52ch] text-sm text-ink-soft" />
      </Section>

      <Section labelKey="account.upcoming" className="border-t border-line">
        {upcoming.length === 0 ? (
          <T k="account.none" as="p" className="text-ink-soft" />
        ) : (
          <ul className="border-t border-line">
            {upcoming.map((a) => (
              <li key={a.id} data-record={`appointments:${a.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-3 py-4">
                <span className="min-w-0">
                  <span className="block font-display text-[17px] text-ink">{nameOf(services, a.service)}</span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {nameOf(allPets, a.pet)} · {nameOf(vets, a.vet)}
                  </span>
                </span>
                <span className="block text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink">
                  {formatDate(a.date)} · {a.time}
                </span>
              </li>
            ))}
          </ul>
        )}
        <T k="account.change" as="p" className="mt-4 max-w-[52ch] text-sm text-ink-soft" />
        <Link to="/book" data-testid="account-book" className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink hover:opacity-90">
          <Icon name="date" size={18} />
          <T k="account.book.label" />
        </Link>
      </Section>

      {past.length > 0 && (
        <Section labelKey="account.past" className="border-t border-line">
          <ul className="border-t border-line">
            {past.map((a) => (
              <li key={a.id} data-record={`appointments:${a.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-3 py-3">
                <span className="min-w-0 text-ink-soft">
                  {nameOf(services, a.service)} · {nameOf(allPets, a.pet)}
                </span>
                <span className="block text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink-soft">{formatDate(a.date)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

function Cell({ label, value, tone = "plain" }: { label: string; value: string; tone?: "plain" | "alert" }) {
  return (
    <div className={`px-[var(--space-6)] py-[var(--space-6)] ${tone === "alert" ? "bg-[var(--alert-ground)]" : "bg-surface"}`}>
      <dt className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft">{label}</dt>
      <dd className={`mt-2 font-display tabular-nums text-2xl ${tone === "alert" ? "text-[var(--alert)]" : "text-ink"}`}>{value}</dd>
    </div>
  );
}
