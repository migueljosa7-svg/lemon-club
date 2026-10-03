import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { FAQS } from "../data/faqs";
import { Reveal } from "./motion/Reveal";
import { scrollToId } from "../lib/utils";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-mint/45 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-50" />
      <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-lemon/50 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* Columna izquierda */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-4 py-1.5">
              Preguntas frecuentes
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="heading-display mt-6 text-[clamp(2.3rem,5.5vw,4.4rem)]">
              Dudas rápidas
              <span className="block font-serif italic normal-case text-ink/45">
                y respuestas sin filtro
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-md text-ink/70">
              Si te queda alguna duda, escríbenos: respondemos en menos de 24 h y casi siempre con
              alguna respuesta sarcástica incluida gratis.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => scrollToId("talleres")} className="btn btn-ink !py-3 text-sm">
                Ver talleres
              </button>
              <a href="mailto:hola@lemonclub.es" className="btn btn-ghost !py-3 text-sm text-ink">
                <Mail className="h-4 w-4" /> Escríbenos
              </a>
            </div>
          </Reveal>
        </div>

        {/* Acordeón */}
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.05, 0.25)}>
                <div
                  className={`overflow-hidden rounded-3xl border-2 transition-colors duration-300 ${
                    isOpen ? "border-ink bg-white shadow-hard" : "border-ink/20 bg-white/70 hover:border-ink/50"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex items-start gap-3">
                      <HelpCircle
                        className={`mt-0.5 h-5 w-5 shrink-0 transition-colors ${
                          isOpen ? "text-ink" : "text-ink/35"
                        }`}
                      />
                      <span className="font-bold leading-snug text-ink">{f.q}</span>
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                        isOpen ? "rotate-180 border-ink bg-lemon" : "border-ink/25 bg-cream"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4 text-ink" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-label={f.q}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 pl-[3.4rem] text-[0.95rem] leading-relaxed text-ink/75">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
