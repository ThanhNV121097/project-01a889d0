import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { signIn } from "../lib/session";
import Section from "../components/Section";
import Icon from "../components/Icon";

/** An account, and plainly what it gives: the shots, the dates, the file. */
export default function Register() {
  usePageMeta("register.title");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const alt = useContent("register.alt");
  const field = "w-full rounded-[var(--radius)] border border-field bg-surface px-4 py-3 text-ink";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email.trim(), name.trim() || undefined);
    navigate("/account");
  }

  return (
    <Section labelKey="register.label">
      <div className="grid gap-[var(--space-12)] lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
        <div>
          <T k="register.heading" as="h1" className="text-[length:var(--size-h1)] text-ink" />
          <T k="register.sub" as="p" className="mt-3 text-ink-soft" />
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <T k="register.name" className="text-ink-soft" />
              <input id="register-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <T k="register.email" className="text-ink-soft" />
              <input id="register-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <T k="register.password" className="text-ink-soft" />
              <input id="register-password" type="password" autoComplete="new-password" className={field} />
            </label>
            <button type="submit" data-testid="register-submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90">
              <Icon name="account" size={18} />
              <T k="register.submit" />
            </button>
          </form>
          <p className="mt-4 text-sm text-ink-soft">
            <T k="register.toSignin.text" />{" "}
            <Link to="/signin" data-testid="register-to-signin" className="text-accent">
              <T k="register.toSignin.label" />
            </Link>
          </p>
        </div>
        <div>
          <img src="/images/exam-room.jpg" alt={alt} className="h-[240px] w-full rounded-[var(--radius)] object-cover" width={1280} height={1024} />
          <ul className="mt-5 border-t border-line">
            <li className="flex items-start gap-3 border-b border-line py-3">
              <Icon name="people" size={18} className="mt-1 text-ink-soft" />
              <T k="register.gives.pets" as="span" className="text-ink-soft" />
            </li>
            <li className="flex items-start gap-3 border-b border-line py-3">
              <Icon name="date" size={18} className="mt-1 text-accent" />
              <T k="register.gives.due" as="span" className="text-ink-soft" />
            </li>
            <li className="flex items-start gap-3 border-b border-line py-3">
              <Icon name="hours" size={18} className="mt-1 text-accent" />
              <T k="register.gives.appointments" as="span" className="text-ink-soft" />
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
