import { useCallback, useEffect, useRef } from "react";

/**
 * Trampa de foco + devolución de foco para diálogos modales.
 * - Guarda el elemento activo antes de abrir.
 * - Mantiene el Tab / Shift+Tab dentro del contenedor.
 * - Cierra con Escape y devuelve el foco al cerrar.
 * - SSR-safe (no hace nada en servidor).
 */
export function useFocusTrap(
  active: boolean,
  onClose: () => void,
  options?: { labelledBy?: string }
): React.RefObject<HTMLDivElement | null> {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousActive = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const focusables = useCallback((): HTMLElement[] => {
    const root = panelRef.current;
    if (!root) return [];
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
    );
  }, []);

  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    previousActive.current = document.activeElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !panelRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !panelRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey, true);

    // Foco inicial: primer focuseable o el propio panel
    const t = window.setTimeout(() => {
      const items = focusables();
      if (items.length > 0) items[0].focus();
      else panelRef.current?.focus();
    }, 30);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      const prev = previousActive.current as HTMLElement | null;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus();
        } catch {
          /* el elemento previo puede haberse desmontado */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Etiquetado accesible opcional
  useEffect(() => {
    if (!active || !options?.labelledBy || !panelRef.current) return;
    panelRef.current.setAttribute("aria-labelledby", options.labelledBy);
  }, [active, options?.labelledBy]);

  return panelRef;
}
