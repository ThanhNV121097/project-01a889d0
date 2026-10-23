import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import Section from "../components/Section";
import Icon from "../components/Icon";
import MapEmbed from "../components/MapEmbed";
import ContactForm from "../components/ContactForm";

/**
 * Where the clinic is, when it is open, and a message that reaches them.
 *
 * The first screen answers the two questions a worried owner opens this page
 * with — where, and are they open — and shows the map beside them, so nothing
 * below the fold is needed to act.
 */
export default function Contact() {
  usePageMeta("contact.title");
  const alt = useContent("contact.alt");
  const phone = useContent("contact.phone");
  const dt = "text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft";
  return (
    <>
      <Section labelKey="contact.label">
        <div className="grid gap-[var(--space-8)] lg:grid-cols-[minmax(0,42ch)_1fr] lg:items-start lg:gap-[var(--space-12)]">
          <div>
            <T k="contact.heading" as="h1" className="max-w-[20ch] text-[length:var(--size-h1)] text-ink" />
            <dl className="mt-6 border-t border-line">
              <div className="border-b border-line py-3">
                <T k="contact.labels.address" as="dt" className={dt} />
                <dd className="mt-1 grid grid-cols-[18px_1fr] items-start gap-2 text-ink">
                  <Icon name="address" size={18} />
                  <T k="contact.address" />
                </dd>
              </div>
              <div className="border-b border-line py-3" data-testid="opening-hours">
                <T k="contact.labels.hours" as="dt" className={dt} />
                <dd className="mt-1 grid grid-cols-[18px_1fr] items-start gap-2 text-ink">
                  <Icon name="hours" size={18} />
                  <T k="contact.hoursWeek" />
                </dd>
                <dd className="mt-2 grid grid-cols-[18px_1fr] items-start gap-2 text-ink">
                  <Icon name="hours" size={18} />
                  <T k="contact.hoursSunday" />
                </dd>
              </div>
              {phone && (
                <div className="border-b border-line py-3">
                  <T k="contact.labels.phone" as="dt" className={dt} />
                  <dd className="mt-1 grid grid-cols-[18px_1fr] items-start gap-2 text-ink">
                    <Icon name="phone" size={18} />
                    <a href={`tel:${phone}`}>{phone}</a>
                  </dd>
                </div>
              )}
              <div className="border-b border-line py-3">
                <T k="contact.labels.scope" as="dt" className={dt} />
                <dd className="mt-1 grid grid-cols-[18px_1fr] items-start gap-2 text-ink">
                  <Icon name="info" size={18} />
                  <T k="contact.scope" />
                </dd>
              </div>
            </dl>
            <T k="contact.formHeading" as="h2" className="mt-[var(--space-12)] text-[length:var(--size-h2)] text-ink" />
            <ContactForm className="mt-5" fields={[{ key: "pet" }, { key: "day", type: "date" }]} />
          </div>
          <img
            src="/images/exam-room.jpg"
            alt={alt}
            className="h-[280px] w-full rounded-[var(--radius)] object-cover lg:h-[640px]"
            width={1280}
            height={1024}
          />
        </div>
      </Section>

      <Section labelKey="contact.mapLabel" className="border-t border-line">
        <MapEmbed className="h-[360px]" />
      </Section>
    </>
  );
}
