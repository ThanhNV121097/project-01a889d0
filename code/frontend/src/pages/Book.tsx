import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import { dayFromIso, nextDays, slotLabelOf, slotsFor, type Service, type Vet } from "../lib/clinic";
import { createBooking } from "../lib/mock/bookings";
import ServiceTable, { ServiceHead } from "../components/ServiceTable";
import VetCard from "../components/VetCard";
import Section from "../components/Section";
import Step from "../components/Step";
import BookSummary from "../components/BookSummary";
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
  const chosenDay = dayFromIso(date);
  const slots = chosenDay ? slotsFor(service, chosenDay) : [];
  const pickedSlot = slots.find((s) => s.id === slot);
  // A half day's words are the clinic's own, in content.json; a timed slot is
  // its own clock reading.
  const half = useContent<Record<string, string>>("book.half");
  const slotLabel = slotLabelOf(pickedSlot, half);
  const ready = Boolean(service && vet && date && pickedSlot && petName.trim());

  function confirm() {
    if (!service || !vet || !pickedSlot || !petName.trim()) return;
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

  return (
    <>
      <Section labelKey="book.label">
        <T k="book.heading" as="h1" className="max-w-[22ch] text-[length:var(--size-h1)] text-ink" />
        <T k="book.sub" as="p" className="mt-3 max-w-[56ch] text-ink-soft" />
      </Section>

      <Section className="border-t border-line !pt-0">
        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="flex flex-col gap-[var(--space-8)]">
            <Step headingKey="book.steps.service">
              <ServiceHead />
              <ServiceTable items={services} onPick={(s) => { setServiceId(s.id); setSlot(""); }} selected={serviceId} />
            </Step>

            <Step headingKey="book.steps.vet">
              <div className="border-t border-line">
                {vets.map((v) => (
                  <VetCard key={v.id} vet={v} onPick={(x) => { setVetId(x.id); setDate(""); setSlot(""); }} selected={vetId === v.id} />
                ))}
              </div>
            </Step>

            <Step headingKey="book.steps.day">
              <DayPicker days={days} vet={vet} value={date} onPick={(iso) => { setDate(iso); setSlot(""); }} />
            </Step>

            <Step headingKey="book.steps.slot">
              <SlotStep service={service} date={date} slots={slots} value={slot} onPick={(id) => setSlot(id)} />
            </Step>

            <Step headingKey="book.steps.pet">
              <label className="flex max-w-[32ch] flex-col gap-2 text-sm">
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
            </Step>
          </div>

          <BookSummary service={service} vet={vet} date={date} slotLabel={slotLabel} ready={ready} onConfirm={confirm} />
        </div>
      </Section>
    </>
  );
}

/** The times, once a service and a day are both chosen. */
function SlotStep({
  service,
  date,
  slots,
  value,
  onPick,
}: {
  service?: Service;
  date: string;
  slots: ReturnType<typeof slotsFor>;
  value: string;
  onPick: (id: string) => void;
}) {
  if (!service || !date) return <T k="book.pick" as="p" className="text-ink-soft" />;
  return (
    <>
      <SlotPicker slots={slots} value={value} onPick={(s) => onPick(s.id)} />
      {service.halfDay && <T k="book.halfDay" as="p" className="mt-3 text-sm text-ink-soft" />}
    </>
  );
}
