import { Suspense, lazy, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Calendar, Check, Clock, MapPin, Star, Ticket, Users, X, UtensilsCrossed } from "lucide-react";
import type { LemonEvent } from "../../data/events";
import { galleryFor } from "../../data/galleries";
import { addAttendance, useLemonProfile } from "../../lib/lemonStore";
import {
  joinWaitlist,
  reserveSpot,
  useSpots,
  useWaitlisted,
  useWaitPosition,
} from "../../lib/spotStore";
import { useFocusTrap } from "../../lib/useFocusTrap";
import Confetti from "../ui/Confetti";

const GalleryLoop = lazy(() => import("./GalleryLoop"));

interface Props {
  event: LemonEvent | null;
  onClose: () => void;
  onAccount: () => void;
}

export default function EventModal({ event, onClose, onAccount }: Props) {
  const [reserved, setReserved] = useState(false);
  const [joined, setJoined] = useState(false);
  const [burst, setBurst] = useState(0);
  const profile = useLemonProfile();
  const memberCode = profile?.memberCode ?? null;
  const eventId = event?.id ?? "";
  const liveSpots = useSpots(eventId);
  const onWaitlist = useWaitlisted(eventId, memberCode);
  const waitPos = useWaitPosition(eventId, memberCode);

  // Reinicia el estado cada vez que cambia el evento
  useEffect(() => {
    setReserved(false);
    setJoined(false);
  }, [event?.id]);

  const panelRef = useFocusTrap(Boolean(event), onClose);

  // Bloqueo de scroll
  useEffect(() => {
    if (!event) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [event]);

  const reserve = () => {
    if (!event || reserved) return;
    const ok = reserveSpot(event.id);
    if (!ok) return; // se agotó entre render y click → la UI ya muestra lista de espera
    setReserved(true);
    setBurst((b) => b + 1);
    addAttendance({ eventId: event.id, title: event.title, date: event.date, coins: 10 });
  };

  const joinWait = () => {
    if (!event || joined || onWaitlist) return;
    joinWaitlist(event.id, memberCode ?? "INVITADO");
    setJoined(true);
  };

  const waiting = joined || onWaitlist;
  const soldOut = liveSpots === 0;

  return (
    <>
      <Confetti trigger={burst} />
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {event && (
              <motion.div
                className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
                  onClick={onClose}
                  aria-hidden="true"
                />

                {/* Panel: Carta / Menú desplegable */}
                <motion.div
                  ref={panelRef}
                  tabIndex={-1}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${event.title}, carta de la experiencia`}
                  initial={{ y: 60, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border-2 border-ink bg-cream shadow-hard sm:rounded-[2rem]"
                >
                  {/* Cabecera de carta */}
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${event.gradient} px-6 pb-7 pt-14 sm:px-8`}
                  >
                    <div className="absolute inset-0 pattern-dots opacity-40" />
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-ink transition hover:rotate-90 hover:bg-lemon"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="relative flex items-end gap-4">
                      <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-cream text-3xl shadow-hard">
                        {event.emoji}
                      </span>
                      <div>
                        <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-ink/30 bg-ink/85 px-3 py-1 text-cream">
                          <UtensilsCrossed className="h-3 w-3" /> Carta de la experiencia
                        </span>
                        <h3 className="heading-display mt-2 text-[clamp(1.7rem,4.5vw,2.9rem)] text-ink">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 px-6 py-7 sm:px-8">
                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      {[
                        { icon: Calendar, t: event.date },
                        { icon: Clock, t: event.time },
                        { icon: MapPin, t: event.place },
                        { icon: Users, t: event.level },
                        {
                          icon: Ticket,
                          t: soldOut
                            ? "Sin plazas · lista de espera"
                            : `${liveSpots} plazas libres`,
                        },
                      ].map(({ icon: Icon, t }, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-ink/75"
                        >
                          <Icon className="h-3.5 w-3.5" /> {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-[0.95rem] leading-relaxed text-ink/75">
                      {event.description}
                    </p>

                    {/* Galería en bucle de eventos pasados */}
                    <Suspense
                      fallback={
                        <div
                          aria-hidden="true"
                          className="h-52 w-full animate-pulse rounded-3xl border-2 border-dashed border-ink/25 bg-white/60"
                        />
                      }
                    >
                      <GalleryLoop eventId={event.id} title={event.title} />
                    </Suspense>

                    {/* Menú / programa */}
                    <section aria-label={`Programa de ${event.title}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="heading-display text-xl text-ink">
                          <span className="mr-2 inline-flex items-center gap-1.5 align-middle">
                            <BookOpenText className="h-5 w-5" />
                          </span>
                          Menú del evento
                        </h4>
                        <span className="eyebrow text-ink/45">Paso a paso</span>
                      </div>
                      <ol className="mt-4 space-y-3 border-l-2 border-dashed border-ink/25 pl-5">
                        {event.program.map((step) => (
                          <li key={step.time} className="relative">
                            <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-lemon" />
                            <p className="flex flex-wrap items-baseline gap-2">
                              <span className="heading-display text-sm text-ink/45">{step.time}</span>
                              <span className="font-bold text-ink">{step.title}</span>
                            </p>
                            <p className="text-sm text-ink/65">{step.desc}</p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    {/* Voces de la actividad */}
                    <TestimonyStrip eventId={event.id} title={event.title} />

                    {/* Métricas de satisfacción */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border-2 border-ink bg-lemon p-4 text-center">
                        <p className="heading-display text-3xl">{event.friendsAfter}%</p>
                        <p className="mt-1 text-[0.7rem] font-semibold leading-tight text-ink/75">
                          se hicieron amigos en redes tras este evento
                        </p>
                      </div>
                      <div className="rounded-2xl border-2 border-ink bg-white p-4 text-center">
                        <p className="heading-display text-3xl">{event.satisfaction}%</p>
                        <p className="mt-1 text-[0.7rem] font-semibold leading-tight text-ink/75">
                          de satisfacción con el taller
                        </p>
                      </div>
                      <div className="rounded-2xl border-2 border-ink bg-white p-4 text-center">
                        <p className="heading-display flex items-center justify-center gap-1 text-3xl">
                          {event.rating}
                          <Star className="h-5 w-5 fill-ink text-ink" />
                        </p>
                        <p className="mt-1 text-[0.7rem] font-semibold leading-tight text-ink/75">
                          valoración media de la comunidad
                        </p>
                      </div>
                    </div>

                    {/* Reserva en tiempo real */}
                    <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-ink p-5 text-cream sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="flex flex-wrap items-center gap-2 text-sm text-cream/70">
                          <Ticket className="h-4 w-4 text-lemon" />
                          {soldOut ? (
                            <span aria-hidden="true">⚡</span>
                          ) : null}
                          <span aria-live="polite">
                            {soldOut
                              ? "Quedan 0 plazas disponibles"
                              : `${liveSpots} ${liveSpots === 1 ? "plaza disponible" : "plazas disponibles"}`}
                          </span>
                          · <strong className="text-lemon">{event.price}€</strong> · +10 LemonCoins
                        </p>
                        <p className="mt-1 text-xs text-cream/50">
                          Cancelación gratuita hasta 48 h antes.
                        </p>
                      </div>
                      {!soldOut ? (
                        <button
                          onClick={reserve}
                          disabled={reserved}
                          className="btn btn-lemon w-full shrink-0 disabled:cursor-not-allowed disabled:bg-mint sm:w-auto"
                        >
                          {reserved ? (
                            <>
                              <Check className="h-4 w-4" strokeWidth={3} /> Plaza reservada
                            </>
                          ) : (
                            "Reservar mi plaza"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={joinWait}
                          disabled={waiting}
                          className="btn w-full shrink-0 border-2 border-ink bg-mint text-ink shadow-hard disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
                        >
                          {waiting ? (
                            <>
                              <Check className="h-4 w-4" strokeWidth={3} /> Estás en la lista
                            </>
                          ) : (
                            "Unirme a la lista de espera"
                          )}
                        </button>
                      )}
                    </div>

                    {soldOut && !waiting && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="status"
                        className="rounded-2xl border-2 border-ink bg-mint px-4 py-3 text-center text-sm font-bold text-ink"
                      >
                        <span aria-hidden="true">⚡</span> Quedan 0 plazas disponibles · únete a
                        la lista de espera
                      </motion.p>
                    )}

                    {waiting && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="status"
                        className="rounded-2xl border-2 border-dashed border-ink/40 bg-mint/60 p-4 text-center"
                      >
                        <p className="text-sm font-semibold text-ink">
                          ¡Estás en cabeza{waitPos > 0 ? ` (posición ${waitPos})` : ""}! Te
                          avisaremos por email en cuanto se libere una plaza para este miércoles.
                        </p>
                        <button
                          onClick={onAccount}
                          className="mt-2 text-sm font-bold text-ink underline decoration-dotted underline-offset-4 hover:text-ink/70"
                        >
                          Ver mi Lemon Account →
                        </button>
                      </motion.div>
                    )}

                    {reserved && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border-2 border-dashed border-ink/30 bg-mint/50 p-4 text-center"
                      >
                        <p className="text-sm font-semibold text-ink">
                          <span aria-hidden="true">🍋</span> Simulación: te hemos preapuntado.{" "}
                          <strong>+10 LemonCoins</strong> acreditadas en tu cuenta.
                        </p>
                        <button
                          onClick={onAccount}
                          className="mt-2 text-sm font-bold text-ink underline decoration-dotted underline-offset-4 hover:text-ink/70"
                        >
                          Ver mi Lemon Account →
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function TestimonyStrip({ eventId, title }: { eventId: string; title: string }) {
  const { quotes } = galleryFor(eventId);
  if (quotes.length === 0) return null;
  return (
    <section aria-label={`Testimonios de ${title}`}>
      <h4 className="heading-display text-xl text-ink">Lo que dicen de esta actividad</h4>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {quotes.map((q) => (
          <figure
            key={q.author}
            className="rounded-2xl border-2 border-ink bg-white p-4 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-ink text-ink" />
              ))}
            </div>
            <blockquote className="mt-2 font-serif text-base italic leading-snug text-ink">
              “{q.text}”
            </blockquote>
            <figcaption className="mt-2 text-xs font-bold text-ink/60">
              {q.author} · {q.event}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
