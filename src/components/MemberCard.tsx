import { createPortal } from "react-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Citrus, ShieldCheck, X } from "lucide-react";
import { useFocusTrap } from "../lib/useFocusTrap";

export default function MemberCard({ code, onClose }: { code: string; onClose: () => void }) {
  const panelRef = useFocusTrap(true, onClose);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-5">
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="socio-title"
              tabIndex={-1}
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-2 border-ink bg-cream shadow-hard"
            >
              <div className="bg-ink px-6 pb-6 pt-10 text-cream">
                <button onClick={onClose} aria-label="Cerrar verificacion" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-cream/30 text-cream">
                  <X className="h-5 w-5" />
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-lemon/40 bg-lemon/10 px-3 py-1 text-xs font-bold text-lemon">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verificacion de socio
                </span>
                <h2 id="socio-title" className="heading-display mt-3 text-3xl">Carnet de Socio Lemon VIP</h2>
                <p className="mt-1 text-sm text-cream/60">Simulacion de verificacion · sin valor contractual</p>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-lemon p-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-cream">
                    <Citrus className="h-7 w-7 text-ink" />
                  </span>
                  <div>
                    <p className="eyebrow text-ink/55">Codigo de miembro</p>
                    <p className="heading-display text-3xl tracking-widest text-ink">{code}</p>
                  </div>
                </div>
                <p className="flex items-start gap-2 rounded-2xl border-2 border-dashed border-ink/25 bg-white p-4 text-sm text-ink/70">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                  <span><strong className="text-ink">Simulacion explicita:</strong> este carnet demuestra el flujo de verificacion por QR. En produccion el personal escanearia el codigo para validar la asistencia.</span>
                </p>
                <button onClick={onClose} className="btn btn-ink w-full">Volver a los talleres</button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}
