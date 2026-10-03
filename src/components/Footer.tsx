import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Camera, Check, Mail, MapPin, Send } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import Confetti from "./ui/Confetti";
import { scrollToId } from "../lib/utils";

const SEO_LINKS = [
  { label: "Planes diferentes en Zaragoza", id: "talleres" },
  { label: "Conocer gente en Zaragoza", id: "que-es" },
  { label: "Talleres de fin de semana en Zaragoza", id: "talleres" },
  { label: "Hacer amigos sin timidez", id: "historias" },
  { label: "Catas y brunchs en Zaragoza", id: "talleres" },
];

const NAV_LINKS = [
  { label: "¿Qué es Lemon Club?", id: "que-es" },
  { label: "Próximos talleres", id: "talleres" },
  { label: "Sistema LemonCoins", id: "lemoncoins" },
  { label: "Historias reales", id: "historias" },
  { label: "Preguntas frecuentes", id: "faq" },
];

const SOCIALS = [
  { icon: Camera, label: "Instagram", href: "https://www.instagram.com/" },
  { icon: AtSign, label: "X / Twitter", href: "https://twitter.com/" },
  { icon: Mail, label: "Email", href: "mailto:hola@lemonclub.es" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [burst, setBurst] = useState(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setBurst((b) => b + 1);
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <Confetti trigger={burst} />
      <div className="pointer-events-none absolute inset-0 pattern-dots-dark opacity-40" />

      {/* ===== Lemon Letter / Newsletter ===== */}
      <div id="newsletter" className="relative mx-auto max-w-7xl scroll-mt-28 px-5 pt-20 sm:px-8 sm:pt-24">
        <Reveal>
          <div className="overflow-hidden rounded-[2.25rem] border-2 border-lemon bg-lemon/10 p-6 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-lemon/40 bg-lemon/10 px-3 py-1 text-lemon">
                  Newsletter
                </span>
                <h2 className="heading-display mt-4 text-[clamp(2rem,4.5vw,3.6rem)]">
                  Únete a la <span className="text-lemon">Lemon Letter</span>
                </h2>
                <p className="mt-3 max-w-md text-cream/70">
                  Recibe los talleres en tu email <strong className="text-cream">antes</strong> de que
                  se agoten las plazas. Un correo a la semana, sin spam y sin tonterías.
                </p>
              </div>

              <div>
                <AnimatePresence mode="wait">
                  {status === "done" ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 rounded-3xl border-2 border-lemon bg-lemon p-6 text-ink"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream">
                        <Check className="h-6 w-6" strokeWidth={3} />
                      </span>
                      <p className="text-sm font-semibold">
                        ¡Dentro! Revisa tu bandeja: te enviamos la bienvenida con{" "}
                        <strong>+10 LemonCoins</strong> de regalo.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={submit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      noValidate
                    >
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <label htmlFor="nl-email" className="sr-only">
                          Tu email
                        </label>
                        <input
                          id="nl-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === "error") setStatus("idle");
                          }}
                          placeholder="tu@email.com"
                          aria-invalid={status === "error"}
                          className={`w-full rounded-full border-2 bg-cream px-5 py-4 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-lemon ${
                            status === "error" ? "border-blush" : "border-ink"
                          }`}
                        />
                        <button type="submit" className="btn btn-lemon shrink-0">
                          Suscribirme <Send className="h-4 w-4" />
                        </button>
                      </div>
                      <p className={`mt-3 text-xs ${status === "error" ? "text-blush" : "text-cream/50"}`}>
                        {status === "error"
                          ? "Ese email no me cuadra. Revísalo y dale otra vez."
                          : "Al suscribirte aceptas recibir la Lemon Letter. Baja cuando quieras."}
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-lemon/15 blur-[130px]" />


      {/* ===== Enlaces ===== */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-lemon bg-lemon text-ink">
              🍋
            </span>
            <span className="heading-display text-xl">
              Lemon <span className="text-lemon">Club</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            Comunidad y club de experiencias sociales en Zaragoza. Talleres creativos, catas y brunchs
            para gente con ganas de conectar.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-cream/70">
            <MapPin className="h-4 w-4 text-lemon" /> Zaragoza, Aragón · España
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream/75 transition hover:border-lemon hover:bg-lemon hover:text-ink"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Planes SEO locales */}
        <nav aria-label="Planes en Zaragoza">
          <h3 className="eyebrow text-lemon">Planes en Zaragoza</h3>
          <ul className="mt-4 space-y-2.5">
            {SEO_LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollToId(l.id)}
                  className="text-left text-sm text-cream/60 transition hover:text-lemon"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navegación */}
        <nav aria-label="Secciones de la web">
          <h3 className="eyebrow text-lemon">El club</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollToId(l.id)}
                  className="text-left text-sm text-cream/60 transition hover:text-lemon"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal */}
        <nav aria-label="Información legal" id="legal">
          <h3 className="eyebrow text-lemon">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            {["Aviso legal", "Política de privacidad", "Política de cookies", "Condiciones de reserva"].map(
              (t) => (
                <li key={t}>
                  <a href="#legal" className="transition hover:text-lemon">
                    {t}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {/* ===== Wordmark gigante + copyright ===== */}
      <div className="relative border-t border-cream/12">
        <div className="mx-auto max-w-7xl overflow-hidden px-5 pt-8 sm:px-8">
          <p
            aria-hidden="true"
            className="heading-display select-none whitespace-nowrap text-[clamp(3rem,14vw,12rem)] leading-[0.8] text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(255,251,232,0.28)" }}
          >
            Lemon Club Zaragoza
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} Lemon Club Zaragoza. Todos los derechos reservados. Hecho con
            🍋 en Zaragoza.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#legal" className="transition hover:text-lemon">
              Aviso legal
            </a>
            <a href="#legal" className="transition hover:text-lemon">
              Privacidad
            </a>
            <a href="#legal" className="transition hover:text-lemon">
              Cookies
            </a>
            <button onClick={() => scrollToId("inicio")} className="transition hover:text-lemon">
              Volver arriba ↑
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
