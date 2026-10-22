import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import { formatDate, formatPrice } from "../lib/format";
import { nextDays, slotsFor, type Service, type Vet } from "../lib/clinic";
import { createBooking } from "../lib/mock/bookings";
import ServiceTable, { ServiceHead } from "../components/ServiceTable";
import VetCard from "../components/VetCard";
import Section from "../components/Section";
import Icon from "../components/Icon";
import { DayPicker, SlotPicker } from "../components/DaySlotPickers";

/**
 * Booking: the service first, so the owner reads the length and the price
 * before a date exists; then the vet, then the day — Dr Quân's Thursday is
 * disabled — then a time laid out in that service's own steps.
 */
export default function Book() {
  usePageMeta("book.title");
  const navigate = useNavigate();
  const { items: services } = useCollection<Service>("services", { pageSize: 20 });
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const [serviceId, setServiceId] = useState("");
  const [vetId, setVetId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [petName, setPetName] = useState("");

  const service = services.find((s) => s.id === serviceId);
  const vet = vets.find((v) => v.id === vetId);
  const days = useMemo(() => nextDays(7), []);
  const chosen = date ? new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))) : null;
  const slots = chosen && service ? slotsFor(service, chosen) : [];
  const ready = Boolean(service && vet && date && slot && petName.trim());
  // A half day's words are the clinic's own, in content.json; a timed slot is
  // its own clock reading.
  const half = useContent<Record<string, string>>("book.half");
  const pickedSlot = slots.find((s) => s.id === slot);
  const slotLabel = pickedSlot ? (pickedSlot.labelKey ? (half[pickedSlot.id] ?? "") : pickedSlot.time) : "";

  function confirm() {
    if (!service || !vet || !ready || !pickedSlot) return;
    const booking = createBooking({
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      vetId: vet.id,
      vetName: vet.name,
      date,
      time: pickedSlot.time,
      slotLabel,
      petName: petName.trim(),
    });
    navigate(`/booking/${booking.id}`);
  }

  const stepHead = "text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft";

  return (
    <>
      <Section labelKey="book.label">
        <T k="book.heading" as="h1" className="max-w-[22ch] text-[length:var(--size-h1)] text-ink" />
        <T k="book.sub" as="p" className="mt-3 max-w-[56ch] text-ink-soft" />
      </Section>

      <Section className="border-t border-line !pt-0">
        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="flex flex-col gap-[var(--space-8)]">
            <div>
              <T k="book.steps.service" as="h2" className={stepHead} />
              <div className="mt-3">
                <ServiceHead />
                <ServiceTable items={services} onPick={(s) => { setServiceId(s.id); setSlot(""); }} selected={serviceId} />
              </div>
            </div>

            <div>
              <T k="book.steps.vet" as="h2" className={stepHead} />
              <div className="mt-3 border-t border-line">
                {vets.map((v) => (
                  <VetCard key={v.id} vet={v} onPick={(x) => { setVetId(x.id); setDate(""); setSlot(""); }} selected={vetId === v.id} />
                ))}
              </div>
            </div>

            <div>
              <T k="book.steps.day" as="h2" className={stepHead} />
              <div className="mt-3">
                <DayPicker days={days} vet={vet} value={date} onPick={(iso) => { setDate(iso); setSlot(""); }} />
              </div>
            </div>

            <div>
              <T k="book.steps.slot" as="h2" className={stepHead} />
              <div className="mt-3">
                {!service || !date ? (
                  <T k="book.pick" as="p" className="text-ink-soft" />
                ) : (
                  <>
                    <SlotPicker slots={slots} value={slot} onPick={setSlot} />
                    {service.halfDay && <T k="book.halfDay" as="p" className="mt-3 text-sm text-ink-soft" />}
                  </>
                )}
              </div>
            </div>

            <div>
              <T k="book.steps.pet" as="h2" className={stepHead} />
              <label className="mt-3 flex max-w-[32ch] flex-col gap-2 text-sm">
                <T k="book.pet.name" className="text-ink-soft" />
                <input
                  id="pet-name"
                  data-testid="pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-field bg-surface px-4 py-3 text-ink"
                />
              </label>
              <T k="book.pet.note" as="p" className="mt-2 max-w-[44ch] text-sm text-ink-soft" />
            </div>
          </div>

          <aside className="rounded-[var(--radius)] border border-line bg-surface p-[var(--space-6)] lg:sticky lg:top-[calc(var(--header-h)+16px)]">
            <T k="book.steps.summary" as="h2" className={stepHead} />
            <dl className="mt-4 border-t border-line text-sm">
              <Row label={useContent("booking.service")} value={service ? service.name : "—"} />
              <Row label={useContent("booking.vet")} value={vet ? vet.name : "—"} />
              <Row label={useContent("booking.when")} value={date ? `${formatDate(date)}${slot ? ` · ${slot}` : ""}` : "—"} />
              <Row label={useContent("booking.price")} value={service ? formatPrice(service.price) : "—"} figure />
            </dl>
            <button
              type="button"
              data-testid="confirm-booking"
              disabled={!ready}
              onClick={confirm}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-40"
            >
              <Icon name="check" size={18} />
              <T k="book.confirm" />
            </button>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value, figure = false }: { label: string; value: string; figure?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`text-right text-ink ${figure ? "font-display tabular-nums text-[length:var(--size-figure)]" : ""}`}>{value}</dd>
    </div>
  );
}
