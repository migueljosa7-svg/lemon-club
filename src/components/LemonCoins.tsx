import { useEffect, useMemo, useRef, useState } from "react";
import { Coins, Gift, Sparkles, Trophy, UserPlus } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./motion/Reveal";
import Confetti from "./ui/Confetti";
import {
  COINS_PER_FRIEND,
  COINS_PER_WORKSHOP,
  COIN_TIERS,
  MAX_WORKSHOPS,
  nextTier,
  tierFor,
} from "../data/coins";
import { formatCoins } from "../lib/utils";

const RULES = [
  {
    icon: Coins,
    kind: "Gana",
    title: "Gana LemonCoins",
    items: [
      `+${COINS_PER_WORKSHOP} 🍋 por cada taller al que asistas`,
      `+${COINS_PER_FRIEND} 🍋 extra por traer a un amigo shy`,
      "Bonus sorpresa por traer a gente nueva a Zaragoza",
    ],
    accent: "bg-lemon",
  },
  {
    icon: Gift,
    kind: "Canjea",
    title: "Canjea lo que quieras",
    items: [
      "Descuentos directos en tus entradas",
      "Merch oficial: tazas y totebags Lemon Club",
      "Un taller privado gratuito para ti y tu grupo",
    ],
    accent: "bg-mint",
  },
  {
    icon: Trophy,
    kind: "Sube de nivel",
    title: "Desbloquea rangos",
    items: [
      "Prioridad de reserva cuando se agotan plazas",
      "Acceso VIP a estrenos y catas exclusivas",
      "Invitaciones a eventos solo para socios",
    ],
    accent: "bg-cream",
  },
];

export default function LemonCoins() {
  const [workshops, setWorkshops] = useState(2);
  const [bringFriend, setBringFriend] = useState(false);
  const [burst, setBurst] = useState(0);

  const perWorkshop = COINS_PER_WORKSHOP + (bringFriend ? COINS_PER_FRIEND : 0);
  const coins = workshops * perWorkshop;
  const { tier, index } = useMemo(() => tierFor(coins), [coins]);
  const next = useMemo(() => nextTier(coins), [coins]);

  // Confeti cada vez que se desbloquea un rango superior
  const prevIndex = useRef(index);
  useEffect(() => {
    if (index > prevIndex.current) setBurst((b) => b + 1);
    prevIndex.current = index;
  }, [index]);

  const progress = next
    ? Math.min(100, ((coins - tier.min) / (next.min - tier.min)) * 100)
    : 100;

  return (
    <section id="lemoncoins" className="relative scroll-mt-24 overflow-hidden bg-lemon py-24 text-ink sm:py-32">
      <Confetti trigger={burst} />
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-70" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-sun blur-[110px]" />
      <span className="pointer-events-none absolute left-6 top-16 hidden text-7xl float-slow md:block" aria-hidden="true">🍋</span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 py-1.5 text-lemon">
                Sistema de gamificación
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-display mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
                LemonCoins
                <span aria-hidden="true" className="ml-3 inline-block">🍋</span>
                <span className="block font-serif italic normal-case text-ink/50">
                  planear también puntúa
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14}>
            <p className="max-w-sm text-ink/70">
              Cuanto más sales, menos pagas. Acumula monedas asistiendo a talleres y canjéalas por
              descuentos, merch o un taller privado gratis.
            </p>
          </Reveal>
        </div>

        {/* Tarjetas ilustradas */}
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {RULES.map((r) => (
            <StaggerItem key={r.kind}>
              <article className="group relative h-full overflow-hidden rounded-[2rem] border-2 border-ink bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-hard">
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink transition-transform duration-300 group-hover:-rotate-12 ${r.accent}`}
                  >
                    <r.icon className="h-6 w-6" strokeWidth={2.3} />
                  </span>
                  <span className="eyebrow rounded-full border border-ink/20 px-3 py-1 text-ink/50">
                    {r.kind}
                  </span>
                </div>
                <h3 className="heading-display mt-5 text-2xl">{r.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-ink/75">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ink/50" />
                      {it}
                    </li>
                  ))}
                </ul>
                <span aria-hidden="true" className="absolute -bottom-7 -right-5 text-8xl opacity-10 transition-transform duration-500 group-hover:-rotate-12">
                  🍋
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ---------- SIMULADOR ---------- */}
        <Reveal delay={0.1}>
          <div
            id="simulador"
            className="mt-14 overflow-hidden rounded-[2.25rem] border-2 border-ink bg-ink text-cream shadow-hard"
          >
            <div className="flex flex-col gap-10 p-6 sm:p-9 lg:flex-row lg:gap-12">
              {/* Controles */}
              <div className="flex-1">
                <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-lemon/40 px-3 py-1 text-lemon">
                  Calculadora / simulador
                </span>
                <h3 className="heading-display mt-4 text-[clamp(1.7rem,3.4vw,2.6rem)]">
                  ¿A cuántos talleres vas al mes?
                </h3>

                <div className="mt-7">
                  <div className="flex items-end justify-between gap-4">
                    <label htmlFor="ws-range" className="text-sm font-semibold text-cream/70">
                      Mueve el control y mira tu saldo
                    </label>
                    <span className="heading-display shrink-0 text-3xl text-lemon">
                      {workshops} {workshops === 1 ? "taller" : "talleres"}
                    </span>
                  </div>
                  <input
                    id="ws-range"
                    type="range"
                    min={0}
                    max={MAX_WORKSHOPS}
                    step={1}
                    value={workshops}
                    onChange={(e) => setWorkshops(Number(e.target.value))}
                    className="lemon-range mt-4"
                    style={{ "--pct": `${(workshops / MAX_WORKSHOPS) * 100}%` } as React.CSSProperties}
                    aria-valuetext={`${workshops} talleres al mes`}
                  />
                  <div className="mt-3 flex justify-between text-xs font-bold text-cream/45">
                    {Array.from({ length: MAX_WORKSHOPS + 1 }, (_, i) => (
                      <span key={i}>{i}</span>
                    ))}
                  </div>
                </div>

                {/* Toggle: traer a un amigo shy */}
                <button
                  type="button"
                  onClick={() => setBringFriend((v) => !v)}
                  aria-pressed={bringFriend}
                  className={`mt-7 flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition ${
                    bringFriend ? "border-lemon bg-lemon/15" : "border-cream/20 hover:border-cream/50"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition ${
                      bringFriend ? "border-lemon bg-lemon" : "border-cream/40"
                    }`}
                  >
                    {bringFriend && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-ink"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <UserPlus className={`h-5 w-5 ${bringFriend ? "text-lemon" : "text-cream/50"}`} />
                  <span className="text-sm">
                    <strong className="block text-cream">¿Vienes con un amigo shy?</strong>
                    <span className="text-cream/60">
                      +{COINS_PER_FRIEND} 🍋 extra por cada taller traído
                    </span>
                  </span>
                </button>

                {/* Rangos */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {COIN_TIERS.map((t, i) => (
                    <span
                      key={t.id}
                      className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
                        i === index
                          ? "border-lemon bg-lemon text-ink"
                          : i < index
                            ? "border-mint/50 text-mint"
                            : "border-cream/20 text-cream/45"
                      }`}
                    >
                      {t.emoji} {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resultado */}
              <div className="flex w-full flex-col justify-between rounded-[1.75rem] border-2 border-lemon bg-lemon p-6 text-ink lg:w-[22rem] lg:shrink-0">
                <div>
                  <span className="eyebrow text-ink/55">Tu saldo mensual</span>
                  <p className="heading-display mt-2 flex items-baseline gap-2 text-[4.2rem] leading-none">
                    <Coins className="h-9 w-9 shrink-0" strokeWidth={2.4} />
                    {formatCoins(coins)}
                  </p>
                  <p className="text-sm font-semibold text-ink/70">
                    {workshops} × {perWorkshop} LemonCoins
                    {bringFriend && " (incluye bonus de amigo)"}
                  </p>

                  <div className="mt-6">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-ink/70">
                      <span>{tier.name}</span>
                      <span>
                        {next
                          ? `${formatCoins(next.min - coins)} para ${next.name}`
                          : "Máximo alcanzado"}
                      </span>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-ink bg-cream">
                      <div
                        className="h-full bg-ink transition-[width] duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border-2 border-ink bg-cream p-4">
                  <p className="eyebrow text-ink/50">Recompensa desbloqueada</p>
                  <p className="heading-display mt-1.5 text-xl">{tier.reward}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{tier.blurb}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setBurst((b) => b + 1)}
                  className="btn btn-ink mt-5 w-full !py-3 text-sm"
                >
                  <span aria-hidden="true">🎉</span> Reclamar con confeti
                </button>
              </div>
            </div>

            {/* Franja legal / tono */}
            <div className="border-t-2 border-cream/10 bg-ink-soft px-6 py-4 text-center text-xs leading-relaxed text-cream/55 sm:px-9">
              Las LemonCoins se acreditan al confirmar la asistencia y caducan a los 12 meses. No son
              dinero real, pero compran risas, tazas y talleres. <span aria-hidden="true">🍋</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
