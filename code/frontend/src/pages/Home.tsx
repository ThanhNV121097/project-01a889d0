import { Link } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import type { Service, Vet } from "../lib/clinic";
import ServiceTable, { ServiceHead } from "../components/ServiceTable";
import VetCard from "../components/VetCard";
import Section from "../components/Section";
import Icon from "../components/Icon";

/**
 * The home page: a band of two clinic photographs with the booking panel
 * lifted 64px into it, holding the seven services with their times and
 * prices and the two vets with the days they work. Everything a caller used
 * to telephone to ask is on this first screen.
 */
export default function Home() {
  usePageMeta("site.name");
  const { items: services } = useCollection<Service>("services", { pageSize: 20 });
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const alt = useContent<{ left: string; right: string }>("hero.alt");
  const catAlt = useContent<{ cat: string; room: string }>("clinic.alt");

  return (
    <>
      <section className="relative">
        <div className="grid h-[240px] grid-cols-[1.6fr_1fr] gap-1 sm:h-[300px] lg:h-[340px]">
          <img src="/images/exam-room.jpg" alt={alt.left} className="h-full w-full object-cover" width={1280} height={1024} />
          <img src="/images/puppy-check.jpg" alt={alt.right} className="h-full w-full object-cover" width={1280} height={914} />
        </div>
        <div className="load-settle mx-auto -mt-16 max-w-page px-[var(--gutter)]">
          <div className="rounded-[var(--radius)] border border-line bg-surface px-[var(--space-6)] py-[var(--space-8)] shadow-[var(--shadow-md)] lg:px-[var(--space-12)]">
            <T k="hero.eyebrow" as="p" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
            <T k="hero.headline" as="h1" className="mt-3 max-w-[20ch] text-[length:var(--size-h1)] text-ink" />
            <T k="hero.sub" as="p" className="mt-3 max-w-[56ch] text-ink-soft" />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/book"
                data-testid="hero-book"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
              >
                <Icon name="date" size={18} />
                <T k="hero.cta.label" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] border border-line px-5 py-3 text-ink transition-colors duration-[var(--duration-fast)] hover:bg-ground"
              >
                <T k="hero.second.label" />
                <Icon name="arrow" size={18} />
              </Link>
            </div>
            <div className="mt-[var(--space-8)] grid gap-[var(--space-8)] border-t border-line pt-[var(--space-8)] lg:grid-cols-[1.5fr_1fr] lg:gap-[var(--space-12)]">
              <div>
                <T k="hero.panel.services" as="h2" className="mb-3 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                <ServiceHead />
                <ServiceTable items={services} compact />
              </div>
              <div>
                <T k="hero.panel.vets" as="h2" className="mb-3 text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
                <div className="border-t border-line">
                  {vets.map((v) => (
                    <VetCard key={v.id} vet={v} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section labelKey="home.hours.label">
        <T k="home.hours.heading" as="h2" className="max-w-[22ch] text-[length:var(--size-h2)] text-ink" />
        <ul className="mt-5 max-w-[46ch] border-t border-line">
          <li className="flex items-center justify-between gap-6 border-b border-line py-3">
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <Icon name="hours" size={18} />
              <T k="contact.hoursWeek" />
            </span>
          </li>
          <li className="flex items-center justify-between gap-6 border-b border-line py-3">
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <Icon name="hours" size={18} />
              <T k="contact.hoursSunday" />
            </span>
          </li>
          <li className="flex items-center justify-between gap-6 border-b border-line py-3">
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <Icon name="address" size={18} />
              <T k="contact.address" />
            </span>
          </li>
        </ul>
        <T k="home.hours.note" as="p" className="mt-4 max-w-[52ch] text-sm text-ink-soft" />
      </Section>

      <Section labelKey="home.honest.label" className="border-t border-line">
        <T k="home.honest.heading" as="h2" className="max-w-[24ch] text-[length:var(--size-h2)] text-ink" />
        <ul className="mt-5 grid gap-[var(--space-6)] sm:grid-cols-2">
          <li className="flex gap-3">
            <Icon name="cash" size={20} className="mt-1 text-ink-soft" />
            <T k="home.honest.price" as="p" className="max-w-[44ch] text-ink-soft" />
          </li>
          <li className="flex gap-3">
            <Icon name="info" size={20} className="mt-1 text-ink-soft" />
            <T k="home.honest.scope" as="p" className="max-w-[44ch] text-ink-soft" />
          </li>
          <li className="flex gap-3">
            <Icon name="store" size={20} className="mt-1 text-ink-soft" />
            <T k="home.honest.pay" as="p" className="max-w-[44ch] text-ink-soft" />
          </li>
        </ul>
      </Section>

      <Section labelKey="home.account.label" className="border-t border-line">
        <div className="grid gap-[var(--space-8)] lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <T k="home.account.heading" as="h2" className="max-w-[24ch] text-[length:var(--size-h2)] text-ink" />
            <T k="home.account.sub" as="p" className="mt-3 max-w-[52ch] text-ink-soft" />
            <Link
              to="/register"
              data-testid="home-register"
              className="mt-6 inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
            >
              <T k="home.account.cta.label" />
              <Icon name="arrow" size={18} />
            </Link>
          </div>
          <img src="/images/cat-portrait.jpg" alt={catAlt.cat} className="h-[260px] w-full rounded-[var(--radius)] object-cover" width={861} height={1280} />
        </div>
      </Section>
    </>
  );
}
