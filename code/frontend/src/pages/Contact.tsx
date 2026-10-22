import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import Section from "../components/Section";
import Icon from "../components/Icon";
import MapEmbed from "../components/MapEmbed";
import ContactForm from "../components/ContactForm";

/** Where the clinic is, when it is open, and a message that reaches them. */
export default function Contact() {
  usePageMeta("contact.title");
  const alt = useContent("contact.alt");
  const phone = useContent("contact.phone");
  return (
    <>
      <Section labelKey="contact.label">
        <div className="grid gap-[var(--space-8)] lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <T k="contact.heading" as="h1" className="max-w-[20ch] text-[length:var(--size-h1)] text-ink" />
            <dl className="mt-6 max-w-[46ch] border-t border-line">
              <div className="border-b border-line py-3">
                <T k="contact.labels.address" as="dt" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                <dd className="mt-1 inline-flex items-start gap-2 text-ink">
                  <Icon name="address" size={18} />
                  <T k="contact.address" />
                </dd>
              </div>
              <div className="border-b border-line py-3" data-testid="opening-hours">
                <T k="contact.labels.hours" as="dt" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                <dd className="mt-1 inline-flex items-start gap-2 text-ink">
                  <Icon name="hours" size={18} />
                  <T k="contact.hours" />
                </dd>
              </div>
              {phone && (
                <div className="border-b border-line py-3">
                  <T k="contact.labels.phone" as="dt" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                  <dd className="mt-1 inline-flex items-start gap-2 text-ink">
                    <Icon name="phone" size={18} />
                    <a href={`tel:${phone}`}>{phone}</a>
                  </dd>
                </div>
              )}
              <div className="border-b border-line py-3">
                <T k="contact.labels.scope" as="dt" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                <dd className="mt-1 inline-flex items-start gap-2 text-ink">
                  <Icon name="info" size={18} />
                  <T k="contact.scope" />
                </dd>
              </div>
            </dl>
          </div>
          <img src="/images/exam-room.jpg" alt={alt} className="h-[260px] w-full rounded-[var(--radius)] object-cover" width={1280} height={1024} />
        </div>
      </Section>

      <Section className="border-t border-line">
        <MapEmbed className="h-[320px]" />
      </Section>

      <Section labelKey="contact.label" className="border-t border-line">
        <T k="contact.formHeading" as="h2" className="text-[length:var(--size-h2)] text-ink" />
        <ContactForm className="mt-6 max-w-[46ch]" fields={[{ key: "pet" }, { key: "day", type: "date" }]} />
      </Section>
    </>
  );
}
