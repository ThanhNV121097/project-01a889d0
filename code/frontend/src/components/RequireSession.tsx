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
    return (
      <Section labelKey="signin.label">
        <T k="signin.heading" as="p" className="text-ink" />
      </Section>
    );
  }
  return <>{children}</>;
}
