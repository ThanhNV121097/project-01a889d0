import { Link } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import type { Service } from "../lib/clinic";
import ServiceTable, { ServiceHead } from "../components/ServiceTable";
import Section from "../components/Section";
import Icon from "../components/Icon";

/** Every service with the time it takes and what it costs, before any date. */
export default function Services() {
  usePageMeta("services.title");
  const { items, total, loading } = useCollection<Service>("services", { pageSize: 20 });
  const alt = useContent("services.alt");
  return (
    <>
      <Section labelKey="services.label">
        <T k="services.heading" as="h1" className="max-w-[22ch] text-[length:var(--size-h1)] text-ink" />
        <T k="services.sub" as="p" className="mt-3 max-w-[56ch] text-ink-soft" />
        <div className="mt-[var(--space-8)]">
          <ServiceHead />
          {loading ? (
            <T k="common.loading" as="p" className="border-t border-line py-6 text-ink-soft" />
          ) : (
            <ServiceTable items={items} />
          )}
          <p className="mt-3 text-sm text-ink-soft tabular-nums" data-testid="services-count">
            {total} <T k="services.label" />
          </p>
        </div>
        <Link
          to="/book"
          data-testid="services-book"
          className="mt-[var(--space-8)] inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
        >
          <Icon name="date" size={18} />
          <T k="services.cta.label" />
        </Link>
      </Section>
      <img src="/images/ear-check.jpg" alt={alt} className="h-[280px] w-full object-cover lg:h-[400px]" width={1280} height={853} />
    </>
  );
}
