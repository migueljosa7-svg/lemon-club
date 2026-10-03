import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { LEGAL_DOCS } from "../data/legal";
import type { LegalId } from "../data/legal";
import { ATTRIBUTIONS } from "../data/attributions";
import { useFocusTrap } from "../lib/useFocusTrap";

const TABS: Array<{ id: LegalId; label: string }> = [
  { id: "aviso", label: "Aviso legal" },
  { id: "privacidad", label: "Privacidad" },
  { id: "cookies", label: "Cookies" },
  { id: "reservas", label: "Reservas" },
  { id: "creditos", label: "Creditos" },
];

export default function LegalModal() {
  const [tab, setTab] = useState<LegalId | null>(null);
  const open = tab !== null;
  const panelRef = useFocusTrap(open, () => setTab(null));
  const doc = LEGAL_DOCS.find((d) => d.id === tab) ?? LEGAL_DOCS[0];

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<LegalId>).detail;
      if (d) setTab(d);
    };
    window.addEventListener("lemon:open-legal", onOpen);
    return () => window.removeEventListener("lemon:open-legal", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setTab(null);

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="legal-title"
                  tabIndex={-1}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border-2 border-ink bg-cream shadow-hard sm:rounded-[2rem]"
                >
                  <div className="sticky top-0 border-b-2 border-ink bg-lemon px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-bold text-ink">
                        <Scale className="h-5 w-5" />
                        <span id="legal-title">{doc.title}</span>
                      </p>
                      <button onClick={close} aria-label="Cerrar aviso legal" className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-ink">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Documentos legales">
                      {TABS.map((t) => (
                        <button key={t.id} role="tab" aria-selected={tab === t.id} aria-controls="legal-panel" onClick={() => setTab(t.id)} className="rounded-full border-2 px-3 py-1.5 text-xs font-bold">
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div id="legal-panel" role="tabpanel" className="space-y-5 px-6 py-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-ink/45">Actualizado {doc.updated}</p>
                    <p className="text-sm leading-relaxed text-ink/75">{doc.intro}</p>
                    {doc.sections.map((s) => (
                      <section key={s.h}>
                        <h3 className="heading-display text-lg text-ink">{s.h}</h3>
                        {s.p.map((par, i) => (
                          <p key={i} className="mt-2 text-sm leading-relaxed text-ink/75">{par}</p>
                        ))}
                      </section>
                    ))}
                    {tab === "creditos" && (
                      <ul className="space-y-2">
                        {ATTRIBUTIONS.map((a) => (
                          <li key={a.id} className="rounded-2xl border border-ink/15 bg-white px-4 py-3 text-xs text-ink/75">
                            <strong className="text-ink">{a.page}</strong> Foto {a.author} / {a.source} ·{" "}
                            <a href={a.licenseUrl} target="_blank" rel="noreferrer noopener" className="font-bold underline decoration-dotted underline-offset-4 hover:text-ink">
                              {a.license}
                            </a>
                          </li>
                        ))}
                      </ul>
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
