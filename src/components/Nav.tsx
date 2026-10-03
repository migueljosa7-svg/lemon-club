import { useEffect, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Citrus, Wallet } from "lucide-react";
import { cn, formatCoins, scrollToId } from "../lib/utils";
import { useLemonProfile } from "../lib/lemonStore";

const AccountModal = lazy(() => import("./AccountModal"));


const LINKS = [
  { id: "que-es", label: "Qué es" },
  { id: "talleres", label: "Talleres" },
  { id: "lemoncoins", label: "LemonCoins" },
  { id: "historias", label: "Historias" },
  { id: "faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const profile = useLemonProfile();
  const coins = profile?.coins ?? 0;
  const onDark = !scrolled; // sin scroll la nav queda sobre el hero negro

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[90] px-3 pt-3 sm:px-5 sm:pt-4">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-lemon focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        Saltar al contenido principal
      </a>
      <nav
        aria-label="Navegacion principal"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6",
          scrolled
            ? "glass-light shadow-[0_10px_40px_-18px_rgba(11,11,11,0.55)]"
            : "border border-transparent bg-transparent"
        )}
      >
        {/* Logo */}
        <button
          onClick={() => go("inicio")}
          className="group flex items-center gap-2.5"
          aria-label="Lemon Club Zaragoza — inicio"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-lemon transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
            <Citrus className="h-5 w-5 text-ink" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className={cn("heading-display text-lg", onDark ? "text-cream" : "text-ink")}>
              Lemon <span className={onDark ? "text-cream/55" : "text-ink/55"}>Club</span>
            </span>
            <span className={cn("eyebrow text-[0.55rem]", onDark ? "text-lemon/80" : "text-ink/60")}>
              Zaragoza
            </span>
          </span>
        </button>

        {/* Links escritorio */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  onDark
                    ? "text-cream/80 hover:bg-lemon hover:text-ink"
                    : "text-ink/75 hover:bg-ink hover:text-lemon"
                )}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAccountOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={accountOpen}
            aria-controls="lemon-account-dialog"
            className={cn(
              "hidden items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold transition sm:inline-flex",
              onDark
                ? "border-lemon/60 text-lemon hover:bg-lemon hover:text-ink"
                : "border-ink bg-cream text-ink hover:bg-lemon"
            )}
            aria-label="Abrir mi Lemon Account"
          >
            <Wallet className="h-4 w-4" strokeWidth={2.5} />
            Mi cuenta
            {coins > 0 && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-lemon">
                {formatCoins(coins)} <span aria-hidden="true">🍋</span>
              </span>
            )}
          </button>
          <button
            onClick={() => go("talleres")}
            className="btn btn-lemon hidden !px-5 !py-2.5 text-sm sm:inline-flex"
          >
            Reservar plaza
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-ink lg:hidden"
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border-2 border-ink bg-cream p-3 shadow-hard lg:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold text-ink transition hover:bg-lemon"
                  >
                    {l.label}
                    <span className="text-ink/40">→</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setOpen(false);
                setAccountOpen(true);
              }}
              className="btn btn-ink mt-2 w-full"
            >
              <Wallet className="h-4 w-4" aria-hidden="true" /> Mi cuenta
              {coins > 0 && (
                <span>
                  · {formatCoins(coins)} <span aria-hidden="true">🍋</span>
                </span>
              )}
            </button>
            <button onClick={() => go("talleres")} className="btn btn-lemon mt-2 w-full">
              <span aria-hidden="true">🍋</span> Reservar plaza
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}><AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} /></Suspense>
    </header>
  );
}
