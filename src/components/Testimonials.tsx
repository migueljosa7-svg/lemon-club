import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../data/testimonials";
import { Reveal } from "./motion/Reveal";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const active = TESTIMONIALS[index];

  const go = useCallback((step: number) => {
    setDir(step);
    setIndex((i) => (i + step + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const jump = (i: number) => {
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };

  // Autoplay (se pausa al pasar el ratón o al enfocar)
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(t);
  }, [paused, go]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 90 : -90 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -90 : 90 }),
  };

  return (
    <section
      id="historias"
      className="relative scroll-mt-24 overflow-hidden bg-cream-deep py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-60" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-mint/50 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-4 py-1.5">
                Historias reales
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-display mt-6 text-[clamp(2.3rem,5.5vw,4.6rem)]">
                De desconocidos
                <span className="block font-serif italic normal-case text-ink/45">
                  a amigos de cañas
                </span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => go(-1)}
                aria-label="Testimonio anterior"
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-cream text-ink transition hover:bg-lemon"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Siguiente testimonio"
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-ink text-lemon transition hover:bg-lemon hover:text-ink"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Carrusel */}
        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] border-2 border-ink bg-white p-7 shadow-hard sm:min-h-[21rem] sm:p-10">
            <Quote className="absolute right-6 top-6 h-16 w-16 text-lemon/50" strokeWidth={2} />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={active.id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Estrellas */}
                <div className="flex gap-1" aria-label={`Valoración: ${active.stars} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={
                        i < active.stars ? "h-5 w-5 fill-ink text-ink" : "h-5 w-5 text-ink/20"
                      }
                    />
                  ))}
                </div>

                <blockquote className="mt-5 max-w-3xl font-serif text-[clamp(1.35rem,3vw,2.2rem)] italic leading-snug text-ink">
                  “{active.quote}”
                </blockquote>

                <figcaption className="mt-6 flex flex-wrap items-center gap-4">
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-ink text-lg font-bold ${active.color}`}
                  >
                    {active.initials}
                  </span>
                  <span>
                    <span className="block font-bold text-ink">
                      {active.name}, {active.age} · Zaragoza
                    </span>
                    <span className="text-sm text-ink/60">Vino a: {active.event}</span>
                  </span>
                  <span className="ml-auto hidden rounded-full border-2 border-ink bg-lemon px-4 py-1.5 text-xs font-bold sm:block">
                    Verificado ✓
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => jump(i)}
                aria-label={`Ir al testimonio de ${t.name}`}
                aria-current={i === index}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === index ? "w-9 bg-ink" : "w-3 bg-ink/25 hover:bg-ink/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
