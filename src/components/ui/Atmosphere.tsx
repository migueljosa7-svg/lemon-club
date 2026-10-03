import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAtmo } from "../../lib/atmo";
import type { AtmoTone } from "../../lib/atmo";

const BACKGROUNDS: Record<AtmoTone, string> = {
  lemon:
    "radial-gradient(52rem 52rem at 50% 38%, rgba(226,255,0,0.16), rgba(226,255,0,0.05) 45%, transparent 70%)",
  wine: "radial-gradient(52rem 52rem at 50% 38%, rgba(255,143,168,0.18), rgba(139,92,246,0.08) 45%, transparent 70%)",
  mint: "radial-gradient(52rem 52rem at 50% 38%, rgba(155,255,214,0.20), rgba(79,224,176,0.08) 45%, transparent 70%)",
};

const ORDER: AtmoTone[] = ["lemon", "wine", "mint"];

/**
 * Halo global de atmósfera: un layer por tono, solo opacity animada (GPU).
 * El suspenso de `AnimatePresence` no es necesario: las capas se funden al activarlas.
 */
export default function Atmosphere() {
  const tone = useAtmo();
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {ORDER.map((t) => (
          <motion.div
            key={t}
            className="absolute inset-0 will-change-[opacity]"
            style={{ background: BACKGROUNDS[t] }}
            initial={false}
            animate={{ opacity: tone === t ? 1 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
