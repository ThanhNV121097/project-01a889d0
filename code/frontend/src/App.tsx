import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { T, useContent, useList } from "./editable";
import { useSession, signOut } from "./lib/session";
import Logo from "./components/Logo";
import MenuToggle from "./components/MenuToggle";
import MobileMenu from "./components/MobileMenu";
import ContactDock from "./components/ContactDock";
import PhotoCredits from "./components/PhotoCredits";
import Icon from "./components/Icon";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Book from "./pages/Book";
import BookingConfirmed from "./pages/BookingConfirmed";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Account from "./pages/Account";
import PetRecord from "./pages/PetRecord";
import Clinic from "./pages/Clinic";
import Contact from "./pages/Contact";
import AdminDay from "./pages/AdminDay";
import AdminPatients from "./pages/AdminPatients";
import AdminServices from "./pages/AdminServices";
import AdminHours from "./pages/AdminHours";

/** Every page change starts at the top of the new page. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const links = useList<{ label: string; href: string }>("nav.links");
  return (
    <>
      {links.map((l, i) => (
        <Link
          key={l.href}
          to={l.href}
          onClick={onNavigate}
          data-testid={`nav-${l.href.replace("/", "")}`}
          className="transition-colors duration-[var(--duration-fast)] hover:text-ink"
        >
          <T k={`nav.links.${i}.label`} />
        </Link>
      ))}
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const cta = useContent<{ label: string; href: string }>("nav.cta");
  const name = useContent("site.name");
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/95 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-h)] max-w-page items-center justify-between px-[var(--gutter)]">
        <Link to="/" aria-label={name}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft lg:flex">
          <NavLinks />
          {session ? (
            <Link to="/account" data-testid="nav-account" className="inline-flex items-center gap-2 hover:text-ink">
              <Icon name="account" size={18} />
              <T k="nav.account" />
            </Link>
          ) : (
            <Link to="/signin" data-testid="nav-signin" className="inline-flex items-center gap-2 hover:text-ink">
              <Icon name="account" size={18} />
              <T k="nav.signin" />
            </Link>
          )}
          <Link
            to={cta.href}
            data-testid="nav-book-cta"
            className="rounded-[var(--radius)] bg-accent px-4 py-2 text-accent-ink transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
          >
            <T k="nav.cta.label" />
          </Link>
        </nav>
        <div className="flex items-center gap-1 lg:hidden">
          <MenuToggle open={open} onToggle={() => setOpen((o) => !o)} />
        </div>
      </div>
      <MobileMenu open={open} onClose={close}>
        <div className="flex flex-col gap-6 text-2xl text-ink">
          <NavLinks onNavigate={close} />
          <Link to={session ? "/account" : "/signin"} onClick={close} data-testid="nav-account-mobile">
            <T k={session ? "nav.account" : "nav.signin"} />
          </Link>
          <Link
            to={cta.href}
            onClick={close}
            className="rounded-[var(--radius)] bg-accent px-5 py-3 text-center text-lg text-accent-ink"
          >
            <T k="nav.cta.label" />
          </Link>
        </div>
      </MobileMenu>
    </header>
  );
}

function Footer() {
  const session = useSession();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-page gap-[var(--space-8)] px-[var(--gutter)] py-[var(--space-12)] lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <T k="footer.line" as="p" className="mt-4 text-sm text-ink-soft" />
          <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
            <Icon name="hours" size={18} className="mt-[2px]" />
            <T k="footer.hours" />
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
            <Icon name="info" size={18} className="mt-[2px]" />
            <T k="footer.scope" />
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-ink-soft">
          <T k="footer.columns.visit" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink" />
          <Link to="/services" className="hover:text-ink">
            <T k="nav.links.0.label" />
          </Link>
          <Link to="/clinic" className="hover:text-ink">
            <T k="nav.links.2.label" />
          </Link>
          <Link to="/contact" className="hover:text-ink">
            <T k="nav.links.3.label" />
          </Link>
        </nav>
        <nav className="flex flex-col gap-2 text-sm text-ink-soft">
          <T k="footer.columns.account" className="text-[length:var(--size-label)] uppercase tracking-[var(--tracking-label)] text-ink" />
          <Link to="/book" className="hover:text-ink">
            <T k="nav.cta.label" />
          </Link>
          {session ? (
            <>
              <Link to="/account" className="hover:text-ink">
                <T k="nav.account" />
              </Link>
              <button type="button" onClick={signOut} className="text-left hover:text-ink">
                <T k="nav.signout" />
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-ink">
                <T k="nav.signin" />
              </Link>
              <Link to="/register" className="hover:text-ink">
                <T k="register.submit" />
              </Link>
            </>
          )}
          <Link to="/admin" className="hover:text-ink">
            <T k="nav.admin" />
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-page px-[var(--gutter)] pb-[var(--space-8)]">
        <PhotoCredits />
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ground font-body text-ink">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<Book />} />
          <Route path="/booking/:id" element={<BookingConfirmed />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/pets/:id" element={<PetRecord />} />
          <Route path="/clinic" element={<Clinic />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDay />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/hours" element={<AdminHours />} />
        </Routes>
      </main>
      <Footer />
      <ContactDock />
    </div>
  );
}
