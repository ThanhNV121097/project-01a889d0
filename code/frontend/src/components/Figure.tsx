/**
 * A number the reader lines up with the one above it: tabular, right-aligned,
 * in the display face. Every duration, price and weight on the site.
 */
export default function Figure({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block text-right font-display tabular-nums text-[length:var(--size-figure)] ${className}`}>{children}</span>
  );
}
