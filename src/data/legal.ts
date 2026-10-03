export type LegalId = "aviso" | "privacidad" | "cookies" | "reservas" | "creditos";

export interface LegalDoc {
  id: LegalId;
  title: string;
  updated: string;
  intro: string;
  sections: Array<{ h: string; p: string[] }>;
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "aviso",
    title: "Aviso legal",
    updated: "Octubre 2026",
    intro:
      "Información general del prestador de servicios de la sociedad de la información (art. 10 LSSI-CE, Ley 34/2002).",
    sections: [
      {
        h: "1. Titular de la web",
        p: [
          "Lemon Club Zaragoza · Proyecto comunitario de ocio y talleres en Zaragoza, Aragón (España).",
          "Contacto: hola@lemonclub.es · Domicilio a efectos de notificaciones: Calle de la Independencia, 50004 Zaragoza.",
          "Esta web es un prototipo funcional en fase de lanzamiento: los contenidos de talleres y plazas son simulados hasta la apertura oficial.",
        ],
      },
      {
        h: "2. Objeto y uso",
        p: [
          "La web informa sobre talleres, catas y brunchs en Zaragoza y permite simular reservas y gestionar el sistema de puntos LemonCoins.",
          "Te comprometes a usarla de forma lícita, sin introducir contenidos ilícitos ni intentar vulnerar su seguridad.",
        ],
      },
      {
        h: "3. Propiedad intelectual",
        p: [
          "Textos, diseño y marca Lemon Club pertenecen a su titular salvo las fotografías de terceros, acreditadas en la sección de Créditos con su licencia Creative Commons o CC0.",
          "Puedes compartir enlaces a la web citando la fuente; cualquier reutilización comercial requiere autorización previa.",
        ],
      },
    ],
  },
  {
    id: "privacidad",
    title: "Politica de privacidad",
    updated: "Octubre 2026",
    intro:
      "Tratamos tus datos conforme al RGPD (UE 2016/679) y la LOPDGDD 3/2018. Responsable: Lemon Club Zaragoza (hola@lemonclub.es).",
    sections: [
      {
        h: "1. Datos que tratamos",
        p: [
          "Cuenta local: nombre visible, código de miembro, saldo de LemonCoins e historial de asistencias (guardados en tu navegador mediante localStorage).",
          "Newsletter: tu email solo si te suscribes a la Lemon Letter. No hay registro de usuarios con contraseña en esta fase.",
        ],
      },
      {
        h: "2. Finalidades y base juridica",
        p: [
          "Prestar la experiencia (mostrar tu cuenta y puntos): ejecución de la relación solicitada por ti (art. 6.1.b RGPD).",
          "Enviar la newsletter: tu consentimiento (art. 6.1.a RGPD), revocable en cada correo con el enlace de baja.",
        ],
      },
      {
        h: "3. Conservacion y derechos",
        p: [
          "Los datos locales viven en tu dispositivo hasta que los borres (limpiar datos del navegador). El email de newsletter se conserva hasta que te des de baja.",
          "Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a hola@lemonclub.es. También puedes reclamar ante la AEPD (www.aepd.es).",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Politica de cookies",
    updated: "Octubre 2026",
    intro:
      "Usamos solo almacenamiento técnico local. Sin cookies de terceros salvo que aceptes analítica en el futuro (art. 22.2 LSSI).",
    sections: [
      {
        h: "1. Que guardamos",
        p: [
          "lemonclub.profile.v1: tu cuenta Lemon (nombre, puntos, asistencias). Necesaria para que la web funcione.",
          "lemonclub.cookies.v1: tu elección sobre cookies (aceptar / rechazar). Necesaria para recordar tu consentimiento.",
        ],
      },
      {
        h: "2. Lo que NO hacemos",
        p: [
          "No usamos cookies publicitarias, de seguimiento entre sitios ni de redes sociales en esta versión.",
          "Las fotos de galerías se cargan desde Flickr / Wikimedia / Rawpixel: esos servicios pueden aplicar sus propias políticas al mostrar la imagen.",
        ],
      },
      {
        h: "3. Cambiar tu eleccion",
        p: [
          "Puedes cambiar o retirar tu consentimiento cuando quieras pulsando el botón Cookies del pie de página o borrando los datos del sitio en tu navegador.",
        ],
      },
    ],
  },
  {
    id: "reservas",
    title: "Condiciones de reserva",
    updated: "Octubre 2026",
    intro: "Condiciones generales de contratación de talleres (RDL 1/2007). Reserva simulada en fase prototipo.",
    sections: [
      {
        h: "1. Reserva y precio",
        p: [
          "El precio mostrado incluye IVA. La reserva se confirma al completar el pago (actualmente simulado: sin cargo real).",
          "Plazas limitadas: se asignan por orden de reserva. Recibirás la dirección exacta por email de confirmación.",
        ],
      },
      {
        h: "2. Cancelacion",
        p: [
          "Cancelación gratuita hasta 48 h antes: cambio de fecha o reembolso íntegro.",
          "Si no avisas (no-show), la plaza se libera a lista de espera y los puntos asociados no se acreditan.",
        ],
      },
    ],
  },
  {
    id: "creditos",
    title: "Creditos fotograficos",
    updated: "Octubre 2026",
    intro:
      "Agradecemos a la comunidad Creative Commons. Cada foto indica autor, fuente y licencia. Consulta el detalle completo en la sección de créditos del pie de página.",
    sections: [
      {
        h: "Como reutilizar",
        p: [
          "Respeta la licencia indicada (BY exige atribución, NC prohíbe uso comercial, SA exige compartir igual, ND prohíbe derivadas).",
          "Las fotos remotas pertenecen a sus autores en Flickr, Wikimedia Commons y Rawpixel; la portada OG es ilustración propia.",
        ],
      },
    ],
  },
];
