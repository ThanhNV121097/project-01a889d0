import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { usePageMeta } from "../seo";
import type { Vet } from "../lib/clinic";
import { Picture } from "../picture";
import VetCard from "../components/VetCard";
import Section from "../components/Section";

interface Testimonial { id: string; quote: string; who: string }

/** Who is behind the clinic: the story, the two vets, and what owners say. */
export default function Clinic() {
  usePageMeta("clinic.title");
  const { items: vets } = useCollection<Vet>("vets", { pageSize: 10 });
  const { items: says } = useCollection<Testimonial>("testimonials", { pageSize: 10 });
  const alt = useContent<{ cat: string; room: string }>("clinic.alt");
  const written = says.filter((t) => t.quote.trim() !== "");
  return (
    <>
      <Section labelKey="clinic.label">
        <div className="grid gap-[var(--space-8)] lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <T k="clinic.heading" as="h1" className="max-w-[20ch] text-[length:var(--size-h1)] text-ink" />
            <T k="clinic.story" as="p" className="mt-5 max-w-[62ch] text-ink-soft" />
          </div>
          <img src="/images/exam-room.jpg" alt={alt.room} className="h-[240px] w-full rounded-[var(--radius)] object-cover" width={1280} height={1024} />
        </div>
      </Section>

      <Section labelKey="clinic.vets.label" className="border-t border-line">
        <T k="clinic.vets.heading" as="h2" className="text-[length:var(--size-h2)] text-ink" />
        <div className="mt-5 grid gap-[var(--space-8)] lg:grid-cols-2">
          {vets.map((v) => (
            <div key={v.id} data-record={`vets:${v.id}`}>
              <Picture src={v.image} alt={v.name} caption={`A photograph of ${v.name}`} className="h-[220px] w-full rounded-[var(--radius)] object-cover" />
              <div className="mt-4 border-t border-line">
                <VetCard vet={v} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {written.length > 0 && (
        <Section labelKey="clinic.says.label" className="border-t border-line">
          <T k="clinic.says.heading" as="h2" className="text-[length:var(--size-h2)] text-ink" />
          <ul className="mt-5 border-t border-line">
            {written.map((t) => (
              <li key={t.id} data-record={`testimonials:${t.id}`} className="border-b border-line py-5">
                <p className="max-w-[62ch] text-ink">{t.quote}</p>
                <p className="mt-2 text-sm text-ink-soft">{t.who}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <img src="/images/ear-check.jpg" alt={alt.cat} className="h-[320px] w-full object-cover lg:h-[420px]" width={1280} height={853} />
    </>
  );
}
