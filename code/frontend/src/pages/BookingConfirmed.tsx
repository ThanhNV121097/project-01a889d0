import { Link, useParams } from "react-router-dom";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { formatDate, formatPrice } from "../lib/format";
import { getBooking, type Booking } from "../lib/mock/bookings";
import { useDemo } from "../lib/demo";
import Section from "../components/Section";
import Flag from "../components/Flag";
import Icon from "../components/Icon";

const EXAMPLE: Booking = {
  id: "b-4K2QD",
  serviceId: "s-consult",
  serviceName: "Consultation",
  price: 250000,
  vetId: "v-linh",
  vetName: "Dr Linh",
  date: "2026-02-16",
  time: "08:30",
  slotLabel: "08:30",
  petName: "Mochi",
};

/** What the owner sees after confirming: the reference, and what they booked. */
export default function BookingConfirmed() {
  usePageMeta("booking.title");
  const { id } = useParams();
  const demo = useDemo();
  const made = getBooking(id);
  // A confirmation only exists after a visitor has booked. While the design
  // is being looked at, show a representative one so the page can be judged.
  const booking = made ?? (demo ? EXAMPLE : null);
  const labels = useContent<{ reference: string; service: string; vet: string; when: string; price: string }>("booking");
  const alt = useContent("booking.alt");
  if (!booking) {
    return (
      <Section labelKey="booking.label">
        <T k="booking.missing" as="p" className="max-w-[46ch] text-ink" />
        <Link to="/book" className="mt-5 inline-flex items-center gap-2 text-accent">
          <T k="nav.cta.label" />
          <Icon name="arrow" size={16} />
        </Link>
      </Section>
    );
  }
  return (
    <Section labelKey="booking.label">
      <Flag tone="ok">
        <T k="booking.label" />
      </Flag>
      <T k="booking.heading" as="h1" data-testid="booking-confirmed" className="mt-3 text-[length:var(--size-h1)] text-ink" />
      <T k="booking.sub" as="p" className="mt-3 max-w-[52ch] text-ink-soft" />
      <div className="mt-[var(--space-8)] grid gap-[var(--space-8)] lg:grid-cols-[minmax(0,46ch)_1fr] lg:items-start">
        <div>
          <dl className="border-t border-line">
            <Row label={labels.reference} value={booking.id} figure />
            <Row label={labels.service} value={booking.serviceName} />
            <Row label={labels.vet} value={booking.vetName} />
            <Row label={labels.when} value={`${formatDate(booking.date)} · ${booking.slotLabel}`} />
            <Row label={labels.price} value={formatPrice(booking.price)} figure />
          </dl>
          <T k="booking.change" as="p" className="mt-5 text-sm text-ink-soft" />
          <Link to="/account" data-testid="booking-account" className="mt-6 inline-flex items-center gap-2 text-accent">
            <T k="booking.account.label" />
            <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div>
          <img src="/images/puppy-check.jpg" alt={alt} className="h-[300px] w-full rounded-[var(--radius)] object-cover lg:h-[380px]" width={1280} height={914} />
          <div className="mt-[var(--space-6)] border-t border-line">
            <p className="grid grid-cols-[20px_1fr] items-start gap-3 border-b border-line py-3 text-sm text-ink-soft">
              <Icon name="address" size={20} />
              <T k="contact.address" />
            </p>
            <p className="grid grid-cols-[20px_1fr] items-start gap-3 border-b border-line py-3 text-sm text-ink-soft">
              <Icon name="hours" size={20} />
              <T k="contact.hours" />
            </p>
            <p className="grid grid-cols-[20px_1fr] items-start gap-3 py-3 text-sm text-ink-soft">
              <Icon name="info" size={20} />
              <T k="booking.payAtClinic" />
            </p>
          </div>
        </div>
      </div>
    </Section>
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
