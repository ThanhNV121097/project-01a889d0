import { useSyncExternalStore } from "react";

/**
 * The design's mock session: who is signed in, on this browser.
 *
 * For the design only. The design is the frontend on mock data, so a page
 * for a signed-in visitor — an account, a checkout, a booking's confirmation
 * — reads the visitor from here, and the sign-in form calls signIn with what
 * was typed (no password is checked). After approval the backend story
 * replaces this file with real sign-in behind the same three names, so the
 * pages do not change.
 *
 * Use it; never write another session. A page design/pages.json marks
 * "auth": true is shown in the Studio signed in, as a demo visitor, by
 * writing this key before the page starts (src/canvas-mode.ts in the Studio's
 * frame, the workspace when it draws the pages); a session kept anywhere else
 * is never signed in there, and the owner sees only a sign-in prompt.
 *
 *   useSession()          the visitor signed in, or null. Every component
 *                         that reads it draws again the moment it changes,
 *                         in this tab or another.
 *   signIn(email, name?)  signs in; the name defaults to the email's first part.
 *   signOut()
 *
 * Kept as JSON — {"email": …, "name": …} — in localStorage under
 * "agentteam:session".
 */

export interface Session {
  email: string;
  name: string;
}

const KEY = "agentteam:session";

/** Where the session is kept when the browser refuses storage: this page only. */
let memory: string | null = null;

function load(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function store(raw: string | null) {
  memory = raw;
  try {
    if (raw === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, raw);
  } catch {
    // Storage refused (a private window, a sandbox): the session lasts this page.
  }
}

/** "lan.tran@example.com" → "Lan Tran": a name to greet with when none was given. */
function nameFrom(email: string): string {
  const words = email.split("@")[0].split(/[._-]+/).filter(Boolean);
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || email;
}

function parse(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { email?: unknown; name?: unknown } | null;
    const email = typeof v?.email === "string" ? v.email.trim() : "";
    if (!email) return null;
    const name = typeof v?.name === "string" ? v.name.trim() : "";
    return { email, name: name || nameFrom(email) };
  } catch {
    return null;
  }
}

// The session as read last, kept while its text is the same: React asks for
// it on every render and must get the same object back when nothing changed.
let lastRaw: string | null | undefined;
let last: Session | null = null;

function read(): Session | null {
  const raw = load();
  if (raw !== lastRaw) {
    lastRaw = raw;
    last = parse(raw);
  }
  return last;
}

const listeners = new Set<() => void>();

function changed() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab signing in or out, or the Studio's frame setting the visitor.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The visitor signed in, or null. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Signs the visitor in as email — any address: this is the design's mock. */
export function signIn(email: string, name?: string): void {
  const address = email.trim();
  if (!address) return;
  const session: Session = { email: address, name: name?.trim() || nameFrom(address) };
  store(JSON.stringify(session));
  changed();
}

/** Signs the visitor out. */
export function signOut(): void {
  store(null);
  changed();
}
