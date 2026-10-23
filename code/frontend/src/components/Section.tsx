import type { ReactNode } from "react";
import { T } from "../editable";
import Reveal from "./Reveal";

/**
 * A section of a page. Its small-caps label sits in a left margin column
 * beside the content from 1024px up, and folds above it below that — one of
 * the design's commitments. Everything shares the one left edge.
 */
export default function Section({
  labelKey,
  id,
  children,
  className = "",
}: {
  labelKey?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-page px-[var(--gutter)] py-[var(--space-16)] ${className}`}>
      <Reveal>
        <div className="grid gap-[var(--space-6)] lg:grid-cols-[var(--margin-col)_1fr] lg:gap-[var(--space-12)]">
          <div>
            {labelKey && (
              <T
                k={labelKey}
                className="block text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft"
              />
            )}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}
