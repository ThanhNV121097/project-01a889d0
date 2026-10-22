import { useState } from "react";
import { T, useContent } from "../editable";
import { useCollection, setCollection, type Row } from "../data";
import { usePageMeta } from "../seo";
import { formatDate } from "../lib/format";
import { downloadCsv, isOverdue, nextDue, toCsv, type Pet, type Vaccination } from "../lib/clinic";
import Section from "../components/Section";
import AdminNav from "../components/AdminNav";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import RequireSession from "../components/RequireSession";

/** The patient records: search, the overdue filter, add, edit, export. */
export default function AdminPatients() {
  usePageMeta("admin.patients.title");
  return (
    <RequireSession>
      <Body />
    </RequireSession>
  );
}

const BLANK = { name: "", species: "Dog", breed: "", born: "", weightKg: 0, owner: "", ownerEmail: "", image: "" };

function Body() {
  const { items: pets, total } = useCollection<Pet>("pets", { pageSize: 50 });
  const { items: vaccinations } = useCollection<Vaccination>("vaccinations", { pageSize: 100 });
  const [search, setSearch] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [draft, setDraft] = useState(BLANK);
  const columns = useContent<{ pet: string; species: string; breed: string; born: string; weight: string; owner: string; due: string }>("admin.patients.columns");

  const q = search.trim().toLowerCase();
  const rows = pets
    .filter((p) => (q ? [p.name, p.breed, p.owner].some((v) => v.toLowerCase().includes(q)) : true))
    .filter((p) => {
      if (!overdueOnly) return true;
      const due = nextDue(vaccinations, p.id);
      return due ? isOverdue(due.due) : false;
    });

  function save() {
    const name = draft.name.trim();
    if (!name) return;
    const row: Pet = { ...draft, id: editing ? editing.id : `p-${Date.now().toString(36)}`, name, weightKg: Number(draft.weightKg) || 0 };
    const next = editing ? pets.map((p) => (p.id === editing.id ? row : p)) : [...pets, row];
    setCollection("pets", next as unknown as Row[]);
    setEditing(null);
    setDraft(BLANK);
  }

  function exportCsv() {
    const csv = toCsv(
      [columns.pet, columns.species, columns.breed, columns.born, columns.weight, columns.owner, columns.due],
      rows.map((p) => {
        const due = nextDue(vaccinations, p.id);
        return [p.name, p.species, p.breed, p.born, p.weightKg, p.owner, due ? due.due : ""];
      }),
    );
    downloadCsv("bon-chan-patients.csv", csv);
  }

  const field = "rounded-[var(--radius)] border border-field bg-surface px-3 py-2 text-sm text-ink";

  return (
    <Section labelKey="admin.label">
      <AdminNav />
      <T k="admin.patients.heading" as="h1" className="mt-[var(--space-8)] text-[length:var(--size-h1)] text-ink" />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <Icon name="search" size={18} className="text-ink-soft" />
          <input id="patients-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={useContent("admin.patients.search")} className={`${field} w-72`} />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <input id="patients-overdue" type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} />
          <T k="admin.patients.overdue" />
        </label>
        <button type="button" data-testid="patients-add" onClick={() => { setEditing(null); setDraft(BLANK); setShowForm(true); }} className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-4 py-2 text-sm text-accent-ink hover:opacity-90">
          <Icon name="plus" size={16} />
          <T k="admin.patients.add" />
        </button>
        <button type="button" data-testid="patients-export" onClick={exportCsv} className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] border border-line px-4 py-2 text-sm text-ink hover:bg-surface">
          <Icon name="download" size={16} />
          <T k="admin.export" />
        </button>
        <span className="text-sm tabular-nums text-ink-soft" data-testid="patients-count">
          {total} <T k="admin.patients.count" />
        </span>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); save(); setShowForm(false); }}
          className="mt-6 grid gap-3 rounded-[var(--radius)] border border-line bg-surface p-[var(--space-6)] sm:grid-cols-3"
        >
          <Input id="pet-field-name" label={columns.pet} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Input id="pet-field-species" label={columns.species} value={draft.species} onChange={(v) => setDraft({ ...draft, species: v })} />
          <Input id="pet-field-breed" label={columns.breed} value={draft.breed} onChange={(v) => setDraft({ ...draft, breed: v })} />
          <Input id="pet-field-born" label={columns.born} value={draft.born} onChange={(v) => setDraft({ ...draft, born: v })} type="date" />
          <Input id="pet-field-weight" label={columns.weight} value={String(draft.weightKg)} onChange={(v) => setDraft({ ...draft, weightKg: Number(v) })} type="number" />
          <Input id="pet-field-owner" label={columns.owner} value={draft.owner} onChange={(v) => setDraft({ ...draft, owner: v })} />
          <div className="flex items-end gap-2">
            <button type="submit" data-testid="patients-save" className="whitespace-nowrap rounded-[var(--radius)] bg-accent px-4 py-2 text-sm text-accent-ink">
              <T k="admin.patients.save" />
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="whitespace-nowrap rounded-[var(--radius)] border border-line px-4 py-2 text-sm text-ink-soft">
              <T k="admin.patients.cancel" />
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft">
              <th className="py-2 pr-4 font-normal">{columns.pet}</th>
              <th className="py-2 pr-4 font-normal">{columns.species}</th>
              <th className="py-2 pr-4 font-normal">{columns.breed}</th>
              <th className="py-2 pr-4 text-right font-normal">{columns.born}</th>
              <th className="py-2 pr-4 text-right font-normal">{columns.weight}</th>
              <th className="py-2 pr-4 font-normal">{columns.owner}</th>
              <th className="py-2 pr-4 text-right font-normal">{columns.due}</th>
              <th className="py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const due = nextDue(vaccinations, p.id);
              const late = due ? isOverdue(due.due) : false;
              return (
                <tr key={p.id} data-record={`pets:${p.id}`} data-testid={`patient-row-${p.id}`} className={`border-b border-line ${late ? "border-l-2 border-l-[var(--alert)] bg-[var(--alert-ground)]" : ""}`}>
                  <td className="py-3 pr-4 text-ink">{p.name}</td>
                  <td className="py-3 pr-4 text-ink-soft">{p.species}</td>
                  <td className="py-3 pr-4 text-ink-soft">{p.breed}</td>
                  <td className="py-3 pr-4 text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink-soft">{formatDate(p.born)}</td>
                  <td className="py-3 pr-4 text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink-soft">{p.weightKg} kg</td>
                  <td className="py-3 pr-4 text-ink-soft">{p.owner}</td>
                  <td className="py-3 pr-4 text-right">
                    <span className="block font-display tabular-nums text-[length:var(--size-figure)] text-ink">{due ? formatDate(due.due) : "—"}</span>
                    {late && (
                      <Flag tone="alert" className="mt-1">
                        <T k="admin.patients.overdue" />
                      </Flag>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      data-testid={`patient-edit-${p.id}`}
                      onClick={() => { setEditing(p); setDraft({ ...p }); setShowForm(true); }}
                      className="whitespace-nowrap rounded-[var(--radius)] border border-line px-3 py-1 text-xs text-ink hover:bg-ground"
                    >
                      <T k="admin.patients.edit" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <T k="admin.empty" as="p" className="py-6 text-ink-soft" />}
      </div>
    </Section>
  );
}

function Input({ id, label, value, onChange, type = "text" }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-ink-soft">{label}</span>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-[var(--radius)] border border-field bg-surface px-3 py-2 text-ink" />
    </label>
  );
}
