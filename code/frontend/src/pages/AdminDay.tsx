import { useState } from "react";
import { T, useContent } from "../editable";
import { useCollection, setCollection, type Row } from "../data";
import { usePageMeta } from "../seo";
import { formatDate, formatPrice } from "../lib/format";
import { downloadCsv, toCsv, when, type Appointment, type Pet, type Service, type Vet } from "../lib/clinic";
import Section from "../components/Section";
import AdminNav from "../components/AdminNav";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import RequireSession from "../components/RequireSession";

const ORDER = ["booked", "arrived", "consulting", "done", "no-show"];

/** The day at the desk: who is coming, where each is, and what to do next. */
export default function AdminDay() {
  usePageMeta("admin.title");
  return (
    <RequireSession>
      <Body />
    </RequireSession>
  );
}

function Body() {
  const { items: appointments, total } = useCollection<Appointment>("appointments", { pageSize: 100 });
  const { items: pets } = useCollection<Pet>("pets", { pageSize: 50 });
  const { items: services } = useCollection<Service>("services", { pageSize: 20 });
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const [search, setSearch] = useState("");
  const [vetId, setVetId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const columns = useContent<{ time: string; pet: string; owner: string; service: string; vet: string; status: string; price: string }>("admin.columns");
  const statusWords = useContent<Record<string, string>>("admin.status");

  const petOf = (id: string) => pets.find((p) => p.id === id);
  const serviceOf = (id: string) => services.find((s) => s.id === id);
  const vetOf = (id: string) => vets.find((v) => v.id === id);
  const statusWord = (s: string) => statusWords[s.replace("-", "")] ?? s;

  const q = search.trim().toLowerCase();
  const rows = appointments
    .filter((a) => (vetId ? a.vet === vetId : true))
    .filter((a) => (serviceId ? a.service === serviceId : true))
    .filter((a) => {
      if (!q) return true;
      const pet = petOf(a.pet);
      return [pet?.name, pet?.owner].some((v) => (v ?? "").toLowerCase().includes(q));
    })
    .sort((a, b) => when(a).localeCompare(when(b)));

  function advance(a: Appointment) {
    const i = ORDER.indexOf(a.status);
    const next = ORDER[Math.min(i + 1, ORDER.length - 1)];
    setCollection("appointments", appointments.map((x) => (x.id === a.id ? { ...x, status: next } : x)) as unknown as Row[]);
  }

  function cancel(a: Appointment) {
    setCollection("appointments", appointments.filter((x) => x.id !== a.id) as unknown as Row[]);
  }

  function exportCsv() {
    const csv = toCsv(
      [columns.time, columns.pet, columns.owner, columns.service, columns.vet, columns.status, columns.price],
      rows.map((a) => [
        `${formatDate(a.date)} ${a.time}`,
        petOf(a.pet)?.name ?? "",
        petOf(a.pet)?.owner ?? "",
        serviceOf(a.service)?.name ?? "",
        vetOf(a.vet)?.name ?? "",
        statusWord(a.status),
        serviceOf(a.service)?.price ?? "",
      ]),
    );
    downloadCsv("bon-chan-appointments.csv", csv);
  }

  const field = "rounded-[var(--radius)] border border-field bg-surface px-3 py-2 text-sm text-ink";

  return (
    <Section labelKey="admin.label">
      <AdminNav />
      <T k="admin.heading" as="h1" className="mt-[var(--space-8)] text-[length:var(--size-h1)] text-ink" />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <Icon name="search" size={18} className="text-ink-soft" />
          <input id="admin-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={useContent("admin.search")} className={`${field} w-64`} />
        </label>
        <select id="admin-vet" value={vetId} onChange={(e) => setVetId(e.target.value)} className={field}>
          <option value="">{useContent("admin.filterVet")}</option>
          {vets.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <select id="admin-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={field}>
          <option value="">{useContent("admin.filterService")}</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button type="button" data-testid="admin-export" onClick={exportCsv} className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] border border-line px-4 py-2 text-sm text-ink hover:bg-surface">
          <Icon name="download" size={16} />
          <T k="admin.export" />
        </button>
        <span className="text-sm tabular-nums text-ink-soft" data-testid="admin-count">
          {total} <T k="admin.count" />
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft">
              <th className="py-2 pr-4 text-right font-normal">{columns.time}</th>
              <th className="py-2 pr-4 font-normal">{columns.pet}</th>
              <th className="py-2 pr-4 font-normal">{columns.owner}</th>
              <th className="py-2 pr-4 font-normal">{columns.service}</th>
              <th className="py-2 pr-4 font-normal">{columns.vet}</th>
              <th className="py-2 pr-4 font-normal">{columns.status}</th>
              <th className="py-2 pr-4 text-right font-normal">{columns.price}</th>
              <th className="py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} data-record={`appointments:${a.id}`} data-testid={`admin-row-${a.id}`} className="border-b border-line align-top">
                <td className="py-3 pr-4 text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink">
                  {a.time}
                  <span className="mt-1 block text-xs text-ink-soft">{formatDate(a.date)}</span>
                </td>
                <td className="py-3 pr-4 text-ink">{petOf(a.pet)?.name}</td>
                <td className="py-3 pr-4 text-ink-soft">{petOf(a.pet)?.owner}</td>
                <td className="py-3 pr-4 text-ink-soft">{serviceOf(a.service)?.name}</td>
                <td className="py-3 pr-4 text-ink-soft">{vetOf(a.vet)?.name}</td>
                <td className="py-3 pr-4">
                  <Flag tone={a.status === "done" ? "ok" : a.status === "no-show" ? "alert" : "quiet"}>{statusWord(a.status)}</Flag>
                </td>
                <td className="py-3 pr-4 text-right font-display tabular-nums text-[length:var(--size-figure)] text-ink">{formatPrice(serviceOf(a.service)?.price)}</td>
                <td className="py-3">
                  <span className="flex justify-end gap-2">
                    <button type="button" data-testid={`advance-${a.id}`} onClick={() => advance(a)} className="whitespace-nowrap rounded-[var(--radius)] border border-line px-3 py-1 text-xs text-ink hover:bg-ground">
                      <T k="admin.actions.advance" />
                    </button>
                    <button type="button" data-testid={`cancel-${a.id}`} onClick={() => cancel(a)} className="whitespace-nowrap rounded-[var(--radius)] border border-line px-3 py-1 text-xs text-ink-soft hover:bg-ground">
                      <T k="admin.actions.cancel" />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <T k="admin.empty" as="p" className="py-6 text-ink-soft" />}
      </div>
    </Section>
  );
}
