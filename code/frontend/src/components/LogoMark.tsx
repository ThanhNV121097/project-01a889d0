/**
 * Bốn Chân — four legs. Three toes and a pad, drawn as geometry in
 * currentColor, never a picture. public/favicon.svg is the same mark.
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="11" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="24" cy="11" r="3" />
      <path d="M9 22.5c0-4 3.1-6.5 7-6.5s7 2.5 7 6.5c0 2.6-2.1 4-4.4 3.3-1.7-.5-3.5-.5-5.2 0C11.1 26.5 9 25.1 9 22.5Z" />
    </svg>
  );
}
