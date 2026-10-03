import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, Citrus, Flame, Sparkles, Users } from "lucide-react";
import { formatCoins, scrollToId } from "../lib/utils";
import Tilt from "./ui/Tilt";

/* ---------- Contador animado ---------- */
function useCountUp(target: number, active: boolean, duration = 1700) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduce]);

  return value;
}

function Stat({
  icon: Icon,
  value,
  prefix = "",
  suffix = "",
  label,
  active,
}: {
  icon: typeof Flame;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  active: boolean;
}) {
  const n = useCountUp(value, active);
  return (
    <div className="glass-dark group flex items-start gap-3 rounded-3xl p-4 transition duration-300 hover:-translate-y-1 hover:border-lemon/50 hover:shadow-[0_0_46px_-10px_rgba(226,255,0,0.6)] sm:gap-4 sm:p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lemon text-ink transition-transform duration-300 group-hover:rotate-12">
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <p className="text-[0.78rem] leading-snug text-cream/80 sm:text-sm">
        <span className="heading-display block text-3xl text-lemon sm:text-4xl">
          {prefix}
          {formatCoins(n)}
          {suffix}
        </span>
        {label}
      </p>
    </div>
  );
}

/* ---------- Hero ---------- */
const TITLE_LINES: Array<Array<{ text: string; accent?: boolean }>> = [
  [{ text: "Zaragoza no es " }, { text: "aburrida.", accent: true }],
  [{ text: "Tú tampoco.", accent: true }],
];


export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-28 text-cream sm:pt-32"
    >
      {/* Fondos: glow lima + menta y trama de puntos */}
      <div className="pointer-events-none absolute inset-0 -z-10 pattern-dots-dark opacity-50" />
      <div className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-lemon/25 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-56 -right-32 -z-10 h-[36rem] w-[36rem] rounded-full bg-mint/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[7%] top-28 -z-10 hidden h-32 w-32 rounded-full border-2 border-dashed border-lemon/50 spin-slow lg:block" />
      <span className="pointer-events-none absolute right-[14%] top-44 -z-10 hidden text-7xl float-slow lg:block">
        🍋
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Columna principal */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-lemon/40 bg-lemon/10 px-4 py-1.5 text-xs font-semibold text-lemon backdrop-blur"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-lemon" />
              Comunidad antitimidez en Zaragoza · plazas abiertas
            </motion.div>

            <h1 className="heading-display text-[clamp(2.7rem,8.6vw,6.6rem)]">
              {TITLE_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, delay: 0.12 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line.map((chunk, j) => (
                      <span key={j} className={chunk.accent ? "text-lemon" : undefined}>
                        {chunk.text}
                      </span>
                    ))}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block text-[0.52em] text-mint"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Bienvenido a{" "}
                  <span className="font-serif italic normal-case tracking-normal text-lemon">
                    Lemon Club.
                  </span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
            >
              Planes, talleres y encuentros para gente con ganas de conectar, romper el hielo y salir de
              la rutina. <span className="text-cream">Ven solo/a o acompañado/a.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button onClick={() => scrollToId("talleres")} className="btn btn-lemon">
                🍋 Ver próximos talleres
                <ArrowDown className="h-4 w-4" strokeWidth={2.6} />
              </button>
              <button onClick={() => scrollToId("como-funciona")} className="btn btn-ghost text-cream">
                ¿Cómo funciona?
              </button>
            </motion.div>
          </div>

          {/* Tarjeta flotante con tilt 3D */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden [perspective:1200px] lg:col-span-4 lg:block"
          >
            <Tilt max={10}>
              <div className="rounded-[2rem] border-2 border-lemon bg-cream p-6 text-ink shadow-hard-lemon [transform:translateZ(24px)]">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-ink/50">Lemon Pass</span>
                  <Citrus className="h-6 w-6 text-ink" strokeWidth={2.4} />
                </div>
                <p className="heading-display mt-3 text-4xl">1 plan</p>
                <p className="mt-1 text-sm text-ink/70">
                  y sales con grupo nuevo. Sin compromiso, sin postureo, sin “luego quedamos”.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Cero timidez", "+10 🍋", "Nivel 1"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink/20 bg-lemon px-3 py-1 text-xs font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-dashed border-ink/25 pt-4 text-xs font-semibold text-ink/60">
                  <Users className="h-4 w-4" /> +1.200 personas ya pasaron por aquí
                </div>
              </div>
            </Tilt>
          </motion.aside>
        </div>

        {/* Stats bar animada */}
        <div ref={statsRef} className="mt-12 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <Stat
            icon={Flame}
            value={83}
            suffix="%"
            active={statsInView}
            label="acuden solos por primera vez y se van con grupo de WhatsApp."
          />
          <Stat
            icon={Citrus}
            value={1200}
            prefix="+"
            active={statsInView}
            label="LemonCoins entregadas en talleres de cocina, arte y brunch."
          />
          <Stat
            icon={Sparkles}
            value={98}
            suffix="%"
            active={statsInView}
            label="de repetidores en eventos de domingo en Zaragoza."
          />
        </div>
      </div>

      {/* Marquee editorial */}
      <div className="relative mt-14 -rotate-1 overflow-hidden border-y-2 border-ink bg-lemon py-3 text-ink">
        <div className="marquee">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={half === 1}>
              {[
                "Talleres de fin de semana",
                "Conocer gente en Zaragoza",
                "Catas a ciegas",
                "Brunchs del domingo",
                "Cero timidez",
                "Paint & wine",
              ].map((t, i) => (
                <span key={i} className="heading-display flex items-center gap-4 text-lg sm:text-xl">
                  {t}
                  <Citrus className="h-4 w-4" strokeWidth={2.6} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
