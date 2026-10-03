import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "lemonclub.cookies.v1";
export type Consent = "accepted" | "rejected";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function resetConsent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new CustomEvent("lemon:cookies-reset"));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      const t = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener("lemon:cookies-reset", reopen);
    return () => window.removeEventListener("lemon:cookies-reset", reopen);
  }, []);

  const choose = (v: Consent) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* modo privado */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="false"
          aria-live="polite"
          aria-label="Aviso de cookies"
          className="fixed inset-x-3 bottom-3 z-[130] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md"
        >
          <div className="rounded-3xl border-2 border-ink bg-cream p-5 shadow-hard">
            <p className="flex items-center gap-2 font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-lemon">
                <Cookie className="h-4 w-4" strokeWidth={2.5} />
              </span>
              Usamos pocas cookies, como el postre
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Solo guardamos tu cuenta Lemon y tu elección de cookies en este dispositivo. Sin
              rastreo publicitario.{" "}
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("lemon:open-legal", { detail: "cookies" }))
                }
                className="font-bold underline decoration-dotted underline-offset-4 hover:text-ink"
              >
                Leer política
              </button>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button onClick={() => choose("rejected")} className="btn btn-ghost flex-1 !py-2.5 text-sm text-ink">
                Rechazar
              </button>
              <button onClick={() => choose("accepted")} className="btn btn-lemon flex-1 !py-2.5 text-sm">
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
