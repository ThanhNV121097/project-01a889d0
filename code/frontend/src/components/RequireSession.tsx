import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../lib/session";
import { T, useContent } from "../editable";
import Section from "./Section";
import Icon from "./Icon";

/**
 * A page only a signed-in visitor sees — the account, a pet's record, the
 * staff area. Reads the scaffold's session and sends anyone else to sign in.
 */
export default function RequireSession({ children }: { children: ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      navigate("/signin", { replace: true });
    }
  }, [session, navigate]);
  if (!session) {
    return <SignedOut />;
  }
  return <>{children}</>;
}

/** What a page behind the sign-in shows while the visitor is being sent there. */
function SignedOut() {
  const alt = useContent("signin.alt");
  return (
    <Section labelKey="signin.label">
      <div className="grid gap-[var(--space-8)] lg:grid-cols-[minmax(0,46ch)_1fr] lg:items-start">
        <div>
          <T k="signin.heading" as="h1" className="text-[length:var(--size-h1)] text-ink" />
          <T k="signin.sub" as="p" className="mt-3 text-ink-soft" />
          <Link
            to="/signin"
            data-testid="signedout-signin"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-5 py-3 text-accent-ink"
          >
            <T k="signin.submit" />
            <Icon name="arrow" size={16} />
          </Link>
          <p className="mt-5 text-sm text-ink-soft">
            <T k="signin.toRegister.text" />{" "}
            <Link to="/register" className="text-accent">
              <T k="signin.toRegister.label" />
            </Link>
          </p>
        </div>
        <img
          src="/images/cat-portrait.jpg"
          alt={alt}
          className="h-[280px] w-full rounded-[var(--radius)] object-cover lg:h-[360px]"
          width={861}
          height={1280}
        />
      </div>
    </Section>
  );
}
