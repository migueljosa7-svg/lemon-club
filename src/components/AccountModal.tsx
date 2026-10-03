import { Suspense, lazy, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Coins, History, IdCard, Pencil, QrCode, X } from "lucide-react";
import { backendLabel, renameMember, useLemonProfile } from "../lib/lemonStore";
import { formatCoins } from "../lib/utils";
import { useFocusTrap } from "../lib/useFocusTrap";

const QRCodeSVG = lazy(() => import("qrcode.react").then((m) => ({ default: m.QRCodeSVG })));

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AccountModal({ open, onClose }: Props) {
  const profile = useLemonProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const panelRef = useFocusTrap(open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && profile) setName(profile.name);
  }, [open, profile]);

  const saveName = (e: FormEvent) => {
    e.preventDefault();
    renameMember(name);
    setEditing(false);
  };

  const backend = backendLabel();

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && profile && (
              <motion.div
                className="fixed inset-0 z-[115] flex items-end justify-center sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
                  onClick={onClose}
                  aria-hidden="true"
                />
                <motion.div
                  ref={panelRef}
                  id="lemon-account-dialog"
                  tabIndex={-1}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mi Lemon Account"
                  initial={{ y: 60, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border-2 border-ink bg-cream shadow-hard sm:rounded-[2rem]"
                >
                  {/* Cabecera */}
                  <div className="relative overflow-hidden bg-ink px-6 pb-7 pt-12 text-cream sm:px-8">
                    <div className="absolute inset-0 pattern-dots-dark opacity-40" />
                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lemon/20 blur-[80px]" />
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-cream/30 bg-transparent text-cream transition hover:rotate-90 hover:border-lemon hover:text-lemon"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-lemon/40 bg-lemon/10 px-3 py-1 text-lemon">
                        <IdCard className="h-3 w-3" /> Mi Lemon Account
                      </span>
                      {editing ? (
                        <form onSubmit={saveName} className="mt-3 flex max-w-sm items-center gap-2">
                          <label htmlFor="member-name" className="sr-only">
                            Tu nombre
                          </label>
                          <input
                            id="member-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={40}
                            className="w-full rounded-xl border-2 border-lemon bg-transparent px-3 py-2 text-lg font-bold text-cream focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lemon text-ink"
                            aria-label="Guardar nombre"
                          >
                            <Check className="h-5 w-5" strokeWidth={3} />
                          </button>
                        </form>
                      ) : (
                        <h3 className="heading-display mt-3 flex flex-wrap items-center gap-3 text-[clamp(1.7rem,4vw,2.6rem)]">
                          {profile.name}
                          <button
                            onClick={() => setEditing(true)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-cream/30 text-cream/70 transition hover:border-lemon hover:text-lemon"
                            aria-label="Cambiar nombre"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </h3>
                      )}
                      <p className="mt-1 text-xs text-cream/55">
                        Miembro desde{" "}
                        {new Date(profile.memberSince).toLocaleDateString("es-ES", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · Zaragoza · Guardado en {backend}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 px-6 py-7 sm:px-8">
                    {/* Saldo + QR */}
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="rounded-2xl border-2 border-ink bg-lemon p-5">
                        <span className="eyebrow text-ink/55">Saldo actual</span>
                        <p className="heading-display mt-1 flex items-center gap-2 text-5xl text-ink">
                          <Coins className="h-8 w-8" strokeWidth={2.4} />
                          {formatCoins(profile.coins)}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-ink/65">
                          Código de miembro: {profile.memberCode}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-ink bg-white p-4">
                        <Suspense
                          fallback={
                            <span
                              aria-hidden="true"
                              className="grid h-[132px] w-[132px] animate-pulse place-items-center rounded-xl bg-ink/10"
                            >
                              <QrCode className="h-8 w-8 text-ink/40" />
                            </span>
                          }
                        >
                          <QRCodeSVG
                            value={`https://lemon-club.onrender.com/#/socio/${profile.memberCode}`}
                            size={132}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#0b0b0b"
                            aria-label={`Código QR del miembro ${profile.memberCode}. Abre el carnet de socio Lemon VIP`}
                          />
                        </Suspense>
                        <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-ink/60">
                          <QrCode className="h-3.5 w-3.5" aria-hidden="true" /> Enséñalo en el evento
                        </span>
                        <a
                          href={`#/socio/${profile.memberCode}`}
                          className="text-center text-[0.7rem] font-bold text-ink underline decoration-dotted underline-offset-4 hover:text-ink/70"
                        >
                          Ver mi Carnet de Socio Lemon VIP
                        </a>
                      </div>
                    </div>

                    {/* Historial */}
                    <section aria-label="Historial de asistencia">
                      <h4 className="heading-display flex items-center gap-2 text-xl text-ink">
                        <History className="h-5 w-5" /> Historial de asistencia
                      </h4>
                      {profile.attendance.length === 0 ? (
                        <p className="mt-3 rounded-2xl border-2 border-dashed border-ink/25 bg-white/60 p-5 text-sm text-ink/65">
                          Aún no hay asistencias registradas. Reserva tu primer taller y aquí
                          aparecerán tus +10 <span aria-hidden="true">🍋</span> por evento.
                        </p>
                      ) : (
                        <ol className="mt-3 space-y-2">
                          {profile.attendance.map((a) => (
                            <li
                              key={a.id}
                              className="flex items-center gap-3 rounded-2xl border border-ink/15 bg-white px-4 py-3"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lemon text-sm font-bold text-ink">
                                +{a.coins}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-bold text-ink">
                                  {a.title}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-ink/55">
                                  <Calendar className="h-3 w-3" /> {a.date}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </section>

                    <p className="text-center text-xs text-ink/50">
                      Sin Supabase configurado, la cuenta vive en este dispositivo. Añade
                      <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5">VITE_SUPABASE_URL</code> y
                      <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code>{" "}
                      para sincronizarla en la nube.
                    </p>
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
