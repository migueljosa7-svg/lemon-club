import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación en cada eje. */
  max?: number;
  style?: CSSProperties;
}

/**
 * Tilt 3D con perspectiva controlado por puntero.
 * - Solo transforms GPU (rotateX/rotateY) + springs de Framer Motion.
 * - Sin re-renders: todo via motion values.
 * - Desactivado en táctil, puntero grueso o `prefers-reduced-motion`.
 */
export default function Tilt({ children, className, max = 9, style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 24, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 260, damping: 24, mass: 0.6 });

  const finePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const enabled = finePointer && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      const py = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      ry.set(px * max * 2);
      rx.set(-py * max * 2);
    };
    const onLeave = () => {
      rx.set(0);
      ry.set(0);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, max, rx, ry]);

  if (!enabled) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1100, ...(style ?? {}) }}
    >
      <motion.div
        className="will-change-transform"
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          height: "100%",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
