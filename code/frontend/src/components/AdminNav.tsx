import { Link, useLocation } from "react-router-dom";
import { T } from "../editable";

/** The four staff tables, with the one being read marked. */
const TABS = [
  { href: "/admin", key: "admin.nav.day", testid: "admin-tab-day" },
  { href: "/admin/patients", key: "admin.nav.patients", testid: "admin-tab-patients" },
  { href: "/admin/services", key: "admin.nav.services", testid: "admin-tab-services" },
  { href: "/admin/hours", key: "admin.nav.hours", testid: "admin-tab-hours" },
];

export default function AdminNav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const here = pathname === t.href;
        return (
          <Link
            key={t.href}
            to={t.href}
            data-testid={t.testid}
            aria-current={here ? "page" : undefined}
            className={`whitespace-nowrap rounded-[var(--radius)] border px-4 py-2 text-sm transition-colors duration-[var(--duration-fast)] ${
              here ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink-soft hover:text-ink"
            }`}
          >
            <T k={t.key} />
          </Link>
        );
      })}
    </nav>
  );
}
