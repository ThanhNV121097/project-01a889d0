import type { ReactNode } from "react";

/**
 * A small outlined flag carrying a fact about the row it sits in — Dr Quân's
 * "Not on Thursdays", a vaccination's "Overdue", an appointment's status.
 * Never decoration: a flag always says something the reader needs.
 */
export default function Flag({ children, tone = "accent", className = "" }: { children: ReactNode; tone?: "accent" | "alert" | "ok" | "quiet"; className?: string }) {
  const tones = {
    accent: "border-accent text-accent",
    alert: "border-[var(--alert)] text-[var(--alert)] bg-[var(--alert-ground)]",
    ok: "border-[var(--ok)] text-[var(--ok)] bg-[var(--ok-ground)]",
    quiet: "border-line text-ink-soft",
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-[var(--radius-sm)] border px-2 py-[2px] text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
