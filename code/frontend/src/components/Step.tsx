import type { ReactNode } from "react";
import { T } from "../editable";

/**
 * One numbered-by-order step of the booking page: a small-caps heading on the
 * page's left edge with its controls beneath it.
 */
export default function Step({ headingKey, children }: { headingKey: string; children: ReactNode }) {
  return (
    <div>
      <T k={headingKey} as="h2" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink-soft" />
      <div className="mt-3">{children}</div>
    </div>
  );
}
