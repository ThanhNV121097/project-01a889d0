import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { signIn } from "../lib/session";
import Section from "../components/Section";
import Icon from "../components/Icon";

/** One door for everyone: an owner lands on their pets, staff on the day. */
export default function SignIn() {
  usePageMeta("signin.title");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const alt = useContent("signin.photoAlt");
  const field = "w-full rounded-[var(--radius)] border border-field bg-surface px-4 py-3 text-ink";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email.trim());
    navigate("/account");
  }

  return (
    <Section labelKey="signin.label">
      <div className="grid gap-[var(--space-12)] lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
        <div>
          <T k="signin.heading" as="h1" className="text-[length:var(--size-h1)] text-ink" />
          <T k="signin.sub" as="p" className="mt-3 text-ink-soft" />
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <T k="signin.email" className="text-ink-soft" />
              <input id="signin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <T k="signin.password" className="text-ink-soft" />
              <input id="signin-password" type="password" autoComplete="current-password" className={field} />
            </label>
            <button type="submit" data-testid="signin-submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90">
              <Icon name="lock" size={18} />
              <T k="signin.submit" />
            </button>
          </form>
          <p className="mt-4 text-sm text-ink-soft">
            <T k="signin.toRegister.text" />{" "}
            <Link to="/register" data-testid="signin-to-register" className="text-accent">
              <T k="signin.toRegister.label" />
            </Link>
          </p>
          <p className="mt-2 inline-flex items-start gap-2 text-sm text-ink-soft">
            <Icon name="people" size={16} />
            <T k="signin.staff" />
          </p>
        </div>
        <img src="/images/puppy-check.jpg" alt="A puppy being checked at the clinic" className="h-[240px] w-full rounded-[var(--radius)] object-cover lg:h-[380px]" width={1280} height={914} />
      </div>
    </Section>
  );
}
