import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, QrCode, ScanLine, ShieldCheck, X } from "lucide-react";
import { EVENTS } from "../data/events";
import { addAttendance, backendLabel, useLemonProfile } from "../lib/lemonStore";
import { useFocusTrap } from "../lib/useFocusTrap";
import Confetti from "./ui/Confetti";

const STAFF_EVENT = EVENTS[0]; // taller de referencia para la demo de puerta

interface ScanResult {
  name: string;
  code: string;
  known: boolean;
}

/**
 * Modo Staff · escáner QR de puerta.
 * Valida cualquier código de socio (ej: LEMON-4829), acredita +10
 * LemonCoins de asistencia y lanza confeti de verificación.
 */
export default function StaffScannerModal() {
  const profile = useLemonProfile();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [burst, setBurst] = useState(0);
  const close = () => setOpen(false);
  const panelRef = useFocusTrap(open, close);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("lemon:open-staff", openIt);
    return () => window.removeEventListener("lemon:open-staff", openIt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setCode("");
      setError(null);
      setResult(null);
    }
  }, [open]);

  const validate = (e: FormEvent) => {
    e.preventDefault();
    const raw = code.trim().toUpperCase();
    if (!raw) {
      setError("Introduce o escanea un código de socio.");
      return;
    }
    if (raw.length < 4) {
      setError("Código demasiado corto. Ejemplo: LEMON-4829.");
      return;
    }
    const bare = raw.replace(/^LEMON-/, "");
    const isSelf = profile !== null && bare === profile.memberCode;
    const name = isSelf && profile ? profile.name : `Socio ${bare}`;
    if (isSelf && profile) {
      addAttendance({
        eventId: `${STAFF_EVENT.id}-puerta`,
        title: `${STAFF_EVENT.title} (puerta)`,
        date: STAFF_EVENT.date,
        coins: 10,
      });
    }
    setResult({ name, code: raw, known: isSelf });
    setError(null);
    setBurst((b) => b + 1);
  };

  return (
    <>
      <Confetti trigger={burst} />
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[145] flex items-end justify-center sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
                  onClick={close}
                  aria-hidden="true"
                />
                <motion.div
                  ref={panelRef}
                  tabIndex={-1}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="staff-title"
                  initial={{ y: 60, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-[2rem] border-[3px] border-ink bg-ink text-cream shadow-hard-lemon"
                >
                  {/* Cabecera estilo tarjeta de control */}
                  <div className="relative border-b-[3px] border-lemon bg-ink-soft px-6 pb-5 pt-12 sm:px-7">
                    <button
                      onClick={close}
                      aria-label="Cerrar escáner staff"
                      className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-cream/30 text-cream transition hover:rotate-90 hover:border-lemon hover:text-lemon"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-lemon/50 bg-lemon/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-lemon">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Staff Mode
                    </span>
                    <h2 id="staff-title" className="heading-display mt-3 text-3xl text-cream">
                      Escáner de puerta
                    </h2>
                    <p className="mt-1 text-sm text-cream/60">
                      Valida el carnet y acredita la asistencia en el sitio.
                    </p>
                  </div>


                  <div className="space-y-5 px-6 py-6 sm:px-7">
                    <form onSubmit={validate} className="space-y-3">
                      <label htmlFor="staff-code" className="eyebrow flex items-center gap-2 text-lemon">
                        <QrCode className="h-4 w-4" aria-hidden="true" /> Código de socio
                      </label>
                      <input
                        id="staff-code"
                        value={code}
                        onChange={(ev) => setCode(ev.target.value)}
                        placeholder="LEMON-4829"
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "staff-error" : undefined}
                        className="w-full rounded-2xl border-[3px] border-lemon bg-ink-soft px-4 py-3.5 font-mono text-lg font-bold uppercase tracking-widest text-lemon placeholder:text-cream/25 focus:outline-none"
                      />
                      {error && (
                        <p id="staff-error" role="alert" className="text-sm font-semibold text-blush">
                          {error}
                        </p>
                      )}
                      <button type="submit" className="btn btn-lemon w-full">
                        <ScanLine className="h-4 w-4" aria-hidden="true" /> Validar código
                      </button>
                    </form>

                    <AnimatePresence mode="wait">
                      {result && (
                        <motion.div
                          key={`${result.code}-${burst}`}
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          role="status"
                          className="rounded-2xl border-2 border-lemon bg-lemon p-4 text-center text-ink"
                        >
                          <BadgeCheck className="mx-auto h-8 w-8" strokeWidth={2.4} aria-hidden="true" />
                          <p className="heading-display mt-2 text-xl">¡Asistencia verificada!</p>
                          <p className="mt-1 text-sm font-bold">
                            +10 <span aria-hidden="true">🍋</span> sumadas a {result.name}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-ink/60">
                            {result.code} · {STAFF_EVENT.title} ·{" "}
                            {result.known ? "perfil local" : "socio demo (sin perfil en este dispositivo)"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="rounded-2xl border border-dashed border-cream/25 px-4 py-3 text-center text-[0.7rem] leading-relaxed text-cream/50">
                      Demo de impacto · Almacenamiento:{" "}
                      <strong className="text-cream/70">{backendLabel()}</strong>. En producción,
                      la validación escribe en <code>lemon_reservations.scanned_at</code>.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}