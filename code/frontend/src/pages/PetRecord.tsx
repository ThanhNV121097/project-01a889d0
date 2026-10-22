import { Link, useParams } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection, useRecord } from "../data";
import { usePageMeta } from "../seo";
import { formatDate } from "../lib/format";
import { isOverdue, nextDue, type Appointment, type Pet, type Service, type Vaccination, type Vet } from "../lib/clinic";
import { Picture } from "../picture";
import Section from "../components/Section";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import RequireSession from "../components/RequireSession";

/** One pet: its details, what is due next, and every shot it has had. */
export default function PetRecord() {
  usePageMeta("pet.title");
  return (
    <RequireSession>
      <PetBody />
    </RequireSession>
  );
}

function PetBody() {
  const { id } = useParams();
  const { item: pet } = useRecord<Pet>("pets", id);
  const { items: vaccinations } = useCollection<Vaccination>("vaccinations", { pageSize: 100 });
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const { items: appointments } = useCollection<Appointment>("appointments", { pageSize: 100 });
  const { items: services } = useCollection<Service>("services", { pageSize: 20 });
  const columns = useContent<{ vaccine: string; given: string; due: string; by: string }>("pet.columns");
  const labels = useContent<{ species: string; breed: string; born: string; weight: string }>("pet");

  if (!pet) {
    return (
      <Section labelKey="pet.label">
        <T k="pet.missing" as="p" className="text-ink" />
        <Link to="/account" className="mt-5 inline-flex items-center gap-2 text-accent">
          <T k="pet.back.label" />
          <Icon name="arrow" size={16} />
        </Link>
      </Section>
    );
  }

  const mine = vaccinations.filter((v) => v.pet === pet.id).sort((a, b) => b.given.localeCompare(a.given));
  const due = nextDue(vaccinations, pet.id);
  const late = due ? isOverdue(due.due) : false;
  const vetName = (vid: string) => vets.find((v) => v.id === vid)?.name ?? "";

  return (
    <>
      <Section labelKey="pet.label">
        <Link to="/account" data-testid="pet-back" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
          <Icon name="back" size={16} />
          <T k="pet.back.label" />
        </Link>
        <div className="mt-4 flex items-start gap-5">
          <Picture src={pet.image} alt={pet.name} caption={`A photograph of ${pet.name}`} className="h-28 w-28 shrink-0 rounded-[var(--radius)] object-cover sm:h-32 sm:w-32" />
          <div className="min-w-0">
            <h1 className="text-[length:var(--size-h1)] text-ink">{pet.name}</h1>
            <p className="mt-1 text-ink-soft">
              {pet.species} · {pet.breed}
            </p>
          </div>
        </div>

        <div className="mt-[var(--space-8)] grid gap-[var(--space-8)] lg:grid-cols-[1fr_320px] lg:items-start">
          <dl className="border-t border-line">
            <Row label={labels.species} value={pet.species} />
            <Row label={labels.breed} value={pet.breed} />
            <Row label={labels.born} value={formatDate(pet.born)} figure />
            <Row label={labels.weight} value={`${pet.weightKg} kg`} figure />
          </dl>
          {due && (
            <div
              data-testid="next-due"
              className={`rounded-[var(--radius)] border p-[var(--space-6)] ${late ? "border-[var(--alert)] bg-[var(--alert-ground)]" : "border-line bg-surface"}`}
            >
              <T k="pet.nextDue" className="block text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
              <p className="mt-2 font-display text-2xl text-ink">{due.vaccine}</p>
              <p className="mt-1 font-display tabular-nums text-[length:var(--size-figure)] text-ink">{formatDate(due.due)}</p>
              {late && (
                <Flag tone="alert" className="mt-3">
                  <T k="pet.overdue" />
                </Flag>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section labelKey="pet.vaccinations" className="border-t border-line">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-[var(--space-6)] px-3 pb-2 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft sm:grid-cols-[1fr_110px_110px_110px]">
          <span>{columns.vaccine}</span>
          <span className="text-right">{columns.given}</span>
          <span className="text-right">{columns.due}</span>
          <span className="hidden text-right sm:block">{columns.by}</span>
        </div>
        <ul className="border-t border-line">
          {mine.map((v) => {
            const over = isOverdue(v.due);
            return (
              <li
                key={v.id}
                data-record={`vaccinations:${v.id}`}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-[var(--space-6)] gap-y-1 border-b border-line px-3 py-3 sm:grid-cols-[1fr_110px_110px_110px] ${
                  over ? "border-l-2 border-l-[var(--alert)] bg-[var(--alert-ground)]" : ""
                }`}
              >
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-ink">{v.vaccine}</span>
                  {over && (
                    <Flag tone="alert">
                      <T k="pet.overdue" />
                    </Flag>
                  )}
                </span>
                <span className="block text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink-soft">{formatDate(v.given)}</span>
                <span className={`block text-right font-display tabular-nums text-[length:var(--size-figure)] ${over ? "text-[var(--alert)]" : "text-ink"}`}>{formatDate(v.due)}</span>
                <span className="hidden text-right text-sm text-ink-soft sm:block">{vetName(v.vet)}</span>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

function Row({ label, value, figure = false }: { label: string; value: string; figure?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className={`text-right text-ink ${figure ? "font-display tabular-nums text-[length:var(--size-figure)]" : ""}`}>{value}</dd>
    </div>
  );
}
