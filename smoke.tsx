import { renderToString } from "react-dom/server";
import App from "./src/App";

const html = renderToString(<App />);

const checks: Record<string, boolean> = {
  "H1 del hero": html.includes("Zaragoza no es"),
  "Subtítulo": html.includes("Ven solo/a o acompañado/a."),
  "Stats 83%": html.includes("acuden solos por primera vez"),
  "Manifiesto": html.includes("Cero presión social"),
  "Grid de talleres": html.includes("Sushimanía"),
  "Simulador LemonCoins": html.includes("A cuántos talleres vas al mes"),
  "Testimonio Elena": html.includes("Elena M."),
  "FAQ": html.includes("¿Puedo ir completamente solo/a?"),
  "Newsletter": html.includes("Lemon Letter"),
  "Footer legal": html.includes("Aviso legal"),
  "ids de anclas": ["inicio", "que-es", "talleres", "lemoncoins", "historias", "faq", "newsletter", "como-funciona"].every((id) => html.includes(`id="${id}"`)),
};

let failed = 0;
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} · ${name}`);
}

console.log(`\nHTML renderizado: ${html.length} caracteres`);
if (failed > 0) {
  console.error(`\n${failed} comprobaciones fallidas`);
  process.exit(1);
}
console.log("\nSmoke test superado ✔");
