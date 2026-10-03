import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface Piece {
  id: number;
  x: number;
  y: number;
  r: number;
  color: string;
  size: number;
  delay: number;
  round: boolean;
}

const COLORS = ["#E2FF00", "#FFE600", "#9BFFD6", "#FF8FA8", "#FFFBE8", "#C58BFF"];

/**
 * Confetti ligero sin dependencias externas.
 * Cada incremento de `trigger` lanza una nueva rafaga (portal al <body>
 * para que los transforms de ancestros no rompan el posicionamiento fixed).
 */
export default function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const burst: Piece[] = Array.from({ length: 64 }, (_, i) => ({
      id: trigger * 1000 + i,
      x: (Math.random() - 0.5) * 780,
      y: 180 + Math.random() * 560,
      r: Math.random() * 900 - 450,
      color: COLORS[i % COLORS.length],
      size: 7 + Math.random() * 11,
      delay: Math.random() * 0.3,
      round: Math.random() > 0.55,
    }));
    setPieces(burst);
    const t = window.setTimeout(() => setPieces([]), 2500);
    return () => window.clearTimeout(t);
  }, [trigger]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/3 block"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "999px" : "2px",
            }}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.r, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.3, delay: p.delay, ease: [0.12, 0.7, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
