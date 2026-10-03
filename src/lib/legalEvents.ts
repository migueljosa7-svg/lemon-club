import type { LegalId } from "../data/legal";

/** Abre el LegalModal (escuchado por App) sin importar su chunk de forma estática. */
export function openLegal(id: LegalId): void {
  window.dispatchEvent(new CustomEvent("lemon:open-legal", { detail: id }));
}
