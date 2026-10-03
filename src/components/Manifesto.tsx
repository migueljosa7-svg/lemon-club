import { Coins, Gift, Heart, MapPin, Utensils, Users, ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./motion/Reveal";
import { scrollToId } from "../lib/utils";

const PILLARS = [
  {
    emoji: "💛",
    icon: Heart,
    title: "Cero presión social",
    text: "Diseñado para que la timidez se quede en la puerta. Dinámicas rápidas, grupos mezclados y nadie te obliga a improvisar un discurso.",
    accent: "bg-[#FFF3B0]",
  },
  {
    emoji: "🍣",
    icon: Utensils,
    title: "Aprende algo nuevo",
    text: "Talleres desde cocina de autor (sushi, pasta fresca) hasta cerámica, pintura con vino, catas blind fold y brunchs.",
    accent: "bg-mint",
  },
  {
    emoji: "🤝",
    icon: Users,
    title: "Amigos de verdad",
    text: "Conecta con gente afín en Zaragoza en un ambiente acogedor. Se sale con grupo, no con tarjeta de visita.",
    accent: "bg-blush/60",
  },
];

const STEPS = [
  {
    n: "01",
    icon: MapPin,
    title: "Elige tu plan",
    text: "Taller, cata o brunch en Zaragoza. Filtra por día, tema y huecos libres.",
  },
  {
    n: "02",
    icon: Users,
    title: "Ven solo/a o acompañado/a",
    text: "Llegas, te mezclas en un equipo y en 5 minutos ya estás hablando con todo el mundo.",
  },
  {
    n: "03",
    icon: Coins,
    title: "Suma LemonCoins",
    text: "Cada asistencia son puntos canjeables por descuentos, merch y talleres gratis.",
  },
];

export default function Manifesto() {
  return (
    <section id="que-es" className="grain relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-60" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-lemon/40 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border-2 border-ink bg-lemon px-4 py-1.5 text-ink">
              ¿Qué es Lemon Club?
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="heading-display mt-6 text-[clamp(2.4rem,6vw,5rem)] text-ink">
              El manifiesto
              <span className="block font-serif italic normal-case text-ink/45">
                sin timidez, de miércoles
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Somos la comunidad de Zaragoza para quien quiere planes distintos, gente nueva y cero
              drama.{" "}
              <em className="font-serif text-ink">
                Ideal si acabas de separarte, si eres nueva en la ciudad o si tu grupo de siempre ya
                no sale los miércoles.
              </em>{" "}
              Aquí nadie llega con el grupo hecho:{" "}
              <strong className="text-ink">se hace en el sitio.</strong>
            </p>
          </Reveal>
        </div>

        {/* Tarjetas del manifiesto */}
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <article
                className={`group relative h-full overflow-hidden rounded-[2rem] border-2 border-ink p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-hard ${p.accent}`}
              >
                <div className="flex items-start justify-between">
                  <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-cream text-2xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                    {p.emoji}
                  </span>
                  <p.icon
                    className="h-6 w-6 text-ink/35 transition-all duration-300 group-hover:scale-125 group-hover:text-ink"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="heading-display mt-6 text-2xl text-ink">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.text}</p>
                <span aria-hidden="true" className="absolute -bottom-6 -right-4 text-8xl opacity-10 transition-transform duration-500 group-hover:-rotate-12">
                  🍋
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Cómo funciona */}
        <div id="como-funciona" className="mt-24 scroll-mt-28">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-dashed border-ink/25 pt-10 sm:flex-row sm:items-end">
              <h3 className="heading-display text-[clamp(1.9rem,4vw,3.2rem)] text-ink">
                ¿Cómo funciona? <span className="text-ink/40">3 pasos y listo.</span>
              </h3>
              <button onClick={() => scrollToId("talleres")} className="btn btn-ink !py-3 text-sm">
                Ver talleres <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>

          <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <StaggerItem key={s.n}>
                <div className="group relative h-full rounded-3xl border-2 border-ink bg-white p-6 transition duration-300 hover:bg-lemon">
                  <div className="flex items-center justify-between">
                    <span className="heading-display text-5xl text-ink/15 transition group-hover:text-ink/30">
                      {s.n}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-ink text-lemon transition-transform duration-300 group-hover:rotate-12">
                      <s.icon className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                  </div>
                  <h4 className="heading-display mt-5 text-xl text-ink">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-ink bg-ink px-7 py-6 text-cream">
              <p className="flex items-center gap-3 text-sm sm:text-base">
                <Gift className="h-5 w-5 shrink-0 text-lemon" />
                <span>
                  <strong className="text-lemon">Primer taller = +10 LemonCoins.</strong> Canjeables por
                  descuentos, tazas, totebags y talleres privados.
                </span>
              </p>
              <button onClick={() => scrollToId("lemoncoins")} className="btn btn-lemon !py-2.5 text-sm">
                Calcular mis coins
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
