import { memo, Suspense, lazy, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Timer } from "lucide-react";
import { CATEGORIES, EVENTS } from "../data/events";
import type { Category, LemonEvent } from "../data/events";
import { Reveal } from "./motion/Reveal";
import Atmosphere from "./ui/Atmosphere";
import Tilt from "./ui/Tilt";
import { setAtmo } from "../lib/atmo";
import type { AtmoTone } from "../lib/atmo";
import { cn } from "../lib/utils";
import { useSpots } from "../lib/spotStore";

const EventModal = lazy(() => import("./event-modal/EventModal"));
const AccountModal = lazy(() => import("./AccountModal"));

function ModalSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[110] grid place-items-center bg-ink/40 backdrop-blur-sm"
    >
      <div className="h-64 w-full max-w-xl animate-pulse rounded-[2rem] border-2 border-ink bg-cream shadow-hard" />
    </div>
  );
}

function spanClass(index: number) {
  return index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "";
}

/** Tono de halo asociado a cada categoría de la carta. */
function toneFor(category: Category): AtmoTone {
  switch (category) {
    case "Cocina":
      return "lemon";
    case "Arte":
      return "wine";
    case "Brunch":
      return "mint";
    case "Catas":
      return "wine";
    default:
      return "lemon";
  }
}

/* ------- Card memoizada: solo se re-renderiza si cambian sus props ------- */
const EventCard = memo(function EventCard({
  event,
  index,
  onOpen,
}: {
  event: LemonEvent;
  index: number;
  onOpen: (id: string) => void;
}) {
  const featured = index === 0;
  const liveSpots = useSpots(event.id);
  const urgent = liveSpots > 0 && liveSpots <= 3;
  const soldOut = liveSpots === 0;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(event.id)}
      onPointerEnter={() => setAtmo(toneFor(event.category))}
      onPointerLeave={() => setAtmo(null)}
      onFocus={() => setAtmo(toneFor(event.category))}
      onBlur={() => setAtmo(null)}
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] text-left [perspective:1200px] focus-visible:outline-none",
        spanClass(index)
      )}
      aria-label={`Ver detalle de ${event.title}`}
    >
      <Tilt className="flex h-full flex-col" max={featured ? 5 : 8}>
        <span className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-ink bg-white transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-hard group-focus-visible:-translate-y-1.5 group-focus-visible:shadow-hard">
          {/* Carátula estilizada */}
          <span
            className={cn(
              "relative block shrink-0 overflow-hidden bg-gradient-to-br",
              event.gradient,
              featured ? "h-52 sm:h-64 lg:h-auto lg:flex-1 lg:min-h-[16rem]" : "h-44"
            )}
          >
            <span className="absolute inset-0 pattern-dots opacity-40" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-[5.5rem] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            >
              {event.emoji}
            </span>

            {/* Badges */}
            <span className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              {event.badge ? (
                <span
                  className={cn(
                    "rounded-full border-2 border-ink px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide",
                    urgent ? "bg-blush text-ink" : "bg-lemon text-ink"
                  )}
                >
                  {event.badge}
                </span>
              ) : (
                <span className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide">
                  {event.category}
                </span>
              )}
              <span className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-lemon">
                {event.category}
              </span>
            </span>

            {/* Precio */}
            <span className="heading-display absolute bottom-3 right-3 rounded-xl border-2 border-ink bg-cream px-3 py-1 text-lg text-ink">
              {event.price}€
            </span>
          </span>

      {/* Contenido */}
      <span className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-wider text-ink/55">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {event.dateShort}
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" /> {event.time.split(" – ")[0]}
          </span>
        </span>

        <span
          className={cn(
            "heading-display mt-2 text-ink",
            featured ? "text-3xl sm:text-4xl" : "text-2xl"
          )}
        >
          {event.title}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-ink/65">{event.tagline}</span>

        <span className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-1.5 text-[0.7rem] font-bold text-ink/70">
            <MapPin className="h-3.5 w-3.5" /> {event.place}
          </span>
          <span className="rounded-full bg-cream-deep px-3 py-1.5 text-[0.7rem] font-bold text-ink/70">
            {event.level}
          </span>
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.7rem] font-bold",
              soldOut
                ? "bg-mint text-ink"
                : urgent
                  ? "bg-blush text-ink"
                  : "bg-mint text-ink"
            )}
            aria-live="polite"
          >
            {soldOut ? (
              <>
                <span aria-hidden="true">⚡</span> 0 plazas · lista de espera
              </>
            ) : (
              <>
                {liveSpots} {liveSpots === 1 ? "plaza" : "plazas"}
              </>
            )}
          </span>
        </span>

        <span className="mt-4 inline-flex items-center gap-1.5 border-t-2 border-dashed border-ink/15 pt-3 text-xs font-bold uppercase tracking-wider text-ink transition group-hover:text-ink/60">
          Ver carta de la experiencia
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </span>
        </span>
      </Tilt>
    </motion.button>
  );
});

export default function Events() {
  const [filter, setFilter] = useState<Category | "Todos">("Todos");
  const [active, setActive] = useState<LemonEvent | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);

  const list = useMemo(
    () => (filter === "Todos" ? EVENTS : EVENTS.filter((e) => e.category === filter)),
    [filter]
  );

  const openById = useCallback(
    (id: string) => {
      const found = list.find((e) => e.id === id) ?? EVENTS.find((e) => e.id === id) ?? null;
      setActive(found);
    },
    [list]
  );

  return (
    <section id="talleres" className="grain relative scroll-mt-24 overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div className="pointer-events-none absolute inset-0 pattern-dots-dark opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-lemon/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-mint/15 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Encabezado + filtros */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-lemon/40 bg-lemon/10 px-4 py-1.5 text-lemon">
                Próximos talleres y eventos
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-display mt-6 text-[clamp(2.4rem,6vw,5rem)]">
                Planes que <span className="text-lemon">no son</span>
                <span className="block font-serif italic normal-case text-cream/45">
                  “quedamos por una caña”
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-lg text-cream/70">
                Talleres los miércoles en Zaragoza con plazas limitadas. Elige tema, reserva y ven
                solo/a: el resto lo hacemos nosotros.{" "}
                <span className="font-serif italic text-cream">
                  Un refugio para reconectar tras una etapa de cambio, hacer amigas y ampliar tu
                  círculo sin la presión de las apps de citas.
                </span>
              </p>
            </Reveal>
          </div>

          {/* Filtros */}
          <Reveal delay={0.12} className="shrink-0">
            <div
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
              role="tablist"
              aria-label="Filtrar talleres por categoría"
            >
              {CATEGORIES.map((c) => {
                const selected = filter === c;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(c)}
                    className={cn(
                      "relative shrink-0 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors duration-200",
                      selected
                        ? "border-ink text-ink"
                        : "border-cream/25 text-cream/70 hover:border-cream/60 hover:text-cream"
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-lemon"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {c}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Bento grid */}
        <motion.div
          layout
          className="mt-10 grid auto-rows-min gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(20rem,auto)] lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((e, i) => (
              <EventCard key={e.id} event={e} index={i} onOpen={openById} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-cream/55">
            ¿No encuentras tu plan? Cada miércoles abrimos talleres nuevos en Zaragoza centro, El
            Gancho, Depósito y La Paz; y los domingos, el Antidomingo.{" "}
            <button
              onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}
              className="font-bold text-lemon underline decoration-dotted underline-offset-4 hover:text-mint"
            >
              Apúntate a la Lemon Letter
            </button>{" "}
            y te avisamos antes de que se agoten.
          </p>
        </Reveal>
      </div>

      <Suspense fallback={active ? <ModalSkeleton /> : null}>
        <EventModal
          event={active}
          onClose={() => setActive(null)}
          onAccount={() => {
            setActive(null);
            setAccountOpen(true);
          }}
        />
      </Suspense>
      <Suspense fallback={accountOpen ? <ModalSkeleton /> : null}>
        <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      </Suspense>
      <Atmosphere />
    </section>
  );
}
