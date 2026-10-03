# 🍋 Lemon Club Zaragoza

Landing page interactiva, vibrante y **100% estática** para Lemon Club Zaragoza: comunidad y club de
experiencias sociales en Zaragoza (talleres creativos, catas, brunchs y planes para hacer amigos sin
timidez).

## ⚙️ Stack

| Capa | Tecnología |
| --- | --- |
| Build | Vite 8 + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (`@theme` design tokens) |
| Animaciones | Framer Motion (scroll reveal, layout, carousel, confeti) |
| Iconos | lucide-react |
| Salida | `dist/` estático, sin backend |

## 🚀 Comandos

```bash
npm install        # dependencias
npm run dev        # servidor de desarrollo
npm run build      # type-check (tsc) + build de producción en dist/
npm run preview    # sirve dist/ en local
npm run smoke      # smoke test: renderiza la app en SSR y verifica secciones/ids
```

## 📁 Estructura

```
index.html               SEO local + JSON-LD (LocalBusiness, FAQPage, ItemList de eventos)
src/
  index.css              Design tokens Tailwind v4 + utilidades (btn glow, glass, marquee, slider)
  App.tsx                Composición de secciones
  data/                  events.ts · testimonials.ts · faqs.ts · coins.ts
  lib/utils.ts           cn() · scrollToId() · formatCoins()
  components/
    Nav.tsx              Nav fija glassmorphism (contraste dinámico sobre hero oscuro)
    Hero.tsx             H1 animado + stats con contador + marquee editorial
    Manifesto.tsx        "¿Qué es Lemon Club?" + Cómo funciona (3 pasos)
    Events.tsx           Bento Grid + filtros animados + modal
    EventModal.tsx       Portal: programa, satisfacción, reserva simulada + confeti
    LemonCoins.tsx       Gamificación + simulador con slider y confeti
    Testimonials.tsx     Carrusel con autoplay, estrellas y perfiles
    Faq.tsx              Acordeón accesible
    Footer.tsx           Lemon Letter (newsletter) + enlaces SEO locales + legal
    motion/Reveal.tsx    Reveal / Stagger / StaggerItem
    ui/Confetti.tsx      Confeti sin dependencias (portal a <body>)
```

## 🔍 SEO local incluido

- `lang="es"`, title/description orientados a *“planes diferentes Zaragoza”*,
  *“conocer gente en Zaragoza”*, *“talleres de fin de semana Zaragoza”*, *“hacer amigos sin timidez”*.
- Metadatos geográficos (`geo.region` ES-AR, `geo.placename` Zaragoza), canonical, Open Graph y Twitter Card.
- **Rich Snippets JSON-LD**: `LocalBusiness` (con `aggregateRating` y `geo`), `FAQPage` y `ItemList` de `Event`.
- HTML semántico: un único `H1`, `H2` por sección, `section`, `article`, `figure/blockquote`, `nav` etiquetados.

## 📦 Despliegue

**Cloudflare Pages**
- *Build command*: `npm run build`
- *Build output directory*: `dist`

**Render (Static Site)**
- *Build command*: `npm run build`
- *Publish directory*: `dist`

No necesita variables de entorno ni backend: las reservas y la suscripción son **simuladas en cliente**.
