import type { GalleryPhoto, ActivityQuote } from "./gallery-types";

/** Consulta "eventos pasados" asociada a cada taller de la carta. */
export interface Gallery {
  photos: GalleryPhoto[];
  quotes: ActivityQuote[];
}

const FALLBACK_PHOTO: GalleryPhoto = {
  src: "",
  alt: "Foto de la comunidad Lemon Club",
  credit: "Lemon Club",
};

function ph(src: string, alt: string, credit: string): GalleryPhoto {
  return { src, alt, credit };
}

export const GALLERIES: Record<string, Gallery> = {
  "sushimania-sangria": {
    photos: [
      ph("https://live.staticflickr.com/16/20550048_55699cd470_b.jpg", "Dos manos enrollando makis en un taller de sushi", "sem · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/5580/14934583110_09994980ec_b.jpg", "Mesa con piezas de sushi recién preparadas", "Torley · CC BY-SA"),
      ph("https://live.staticflickr.com/2514/4111276509_e8a24ca49f_b.jpg", "Demostración de corte de sushi ante el grupo", "raider3_anime · CC BY-NC"),
      ph("https://live.staticflickr.com/1387/1202226736_e9a4490c1e_b.jpg", "Detalle de makis caseros listos para comer", "Alexandre Chang · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/6019/6340821169_e986e4d6f0.jpg", "Cocina entre amigos con copas sobre la mesa", "adactio · CC BY"),
    ],
    quotes: [
      { author: "Nora G.", text: "Nunca había tocado un maki y salí enrollando como una pro. El concurso final nos volvió locos de la risa.", event: "Sushimanía & Sangría" },
      { author: "Iván P.", text: "Fui escéptico y acabé intercambiando Instagram con media mesa. La sangría ayuda, pero el ambiente ayuda más.", event: "Sushimanía & Sangría" },
    ],
  },
  "paint-wine-night": {
    photos: [
      ph("https://live.staticflickr.com/4110/5192560439_03154da05f_b.jpg", "Participantes pintando juntos en una clase creativa", "DoNight · CC BY-NC"),
      ph("https://images.rawpixel.com/editor_1024/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTIzNzQ0NzUxNzktaW1hZ2UuanBn.jpg", "Manos pintando con pinceles en una sesión de arte", "Rawpixel · CC0"),
      ph("https://live.staticflickr.com/7167/6685355787_757e1a8a43.jpg", "Detalle de materiales y bocetos sobre la mesa", "rennes_i · CC BY"),
      ph("https://live.staticflickr.com/6019/6340821169_e986e4d6f0.jpg", "Brindis entre pinceladas con el grupo", "adactio · CC BY"),
      ph("https://upload.wikimedia.org/wikipedia/commons/9/94/Making_fresh_pasta.jpg", "Manos trabajando juntas en una dinámica creativa", "Sam Pullara · CC BY"),
    ],
    quotes: [
      { author: "Lucía F.", text: "Mi cuadro es horrible y es mi posesión más preciada. La noche entera fue una risa continua.", event: "Paint & Wine Night" },
      { author: "Sara D.", text: "Pintar con una copa en la mano te quita toda la vergüenza. Repetimos el mes que viene sí o sí.", event: "Paint & Wine Night" },
    ],
  },
  "sunday-lemon-brunch": {
    photos: [
      ph("https://live.staticflickr.com/2183/2224102244_5daaa0e99e_b.jpg", "Cocina de domingo entre amigos con café y pancakes", "massdistraction · CC BY-NC-ND"),
      ph("https://live.staticflickr.com/7/6972158_ee1a7b6f5a_b.jpg", "Mesa de brunch con amigos compartiendo", "sampsyo · CC BY"),
      ph("https://live.staticflickr.com/6019/6340821169_e986e4d6f0.jpg", "Sobremesa larga con risas y café", "adactio · CC BY"),
      ph("https://live.staticflickr.com/16/20550048_55699cd470_b.jpg", "Platos compartidos en el centro de la mesa", "sem · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/1387/1202226736_e9a4490c1e_b.jpg", "Detalle dulce del postre del brunch", "Alexandre Chang · CC BY-NC-SA"),
    ],
    quotes: [
      { author: "Diego R.", text: "El antidomingo existe y tiene pancakes. Conocí a mi grupo de pádel de los jueves en esta mesa.", event: "Sunday Lemon Brunch" },
      { author: "Marta L.", text: "Llegué sin conocer a nadie y acabé en una terraza hasta las tantas con seis personas nuevas.", event: "Sunday Lemon Brunch" },
    ],
  },
  "pasta-fresca": {
    photos: [
      ph("https://upload.wikimedia.org/wikipedia/commons/9/94/Making_fresh_pasta.jpg", "Manos amasando pasta fresca sobre la encimera", "Sam Pullara · CC BY"),
      ph("https://live.staticflickr.com/6019/6340821169_e986e4d6f0.jpg", "Amasado en equipo con harina por todas partes", "adactio · CC BY"),
      ph("https://live.staticflickr.com/2253/2051216724_5d41b68506.jpg", "Preparando masa fresca antes de estirarla", "Anne Helmond · CC BY-NC-ND"),
      ph("https://live.staticflickr.com/2314/2051216652_53670b9381.jpg", "Detalle del corte de la pasta recién hecha", "Anne Helmond · CC BY-NC-ND"),
      ph("https://live.staticflickr.com/8107/8480798314_a8926dcd0a_b.jpg", "Cocinando pasta en buena compañía", "michaelrabkin · CC BY-NC-SA"),
    ],
    quotes: [
      { author: "Elena M.", text: "Vine sola y me fui con grupo de viernes. La receta funciona, pero la gente funciona mejor.", event: "Pasta Fresca from Scratch" },
      { author: "Jorge A.", text: "Amasar al lado de desconocidos rompe el hielo mejor que cualquier app. Diez de diez.", event: "Pasta Fresca from Scratch" },
    ],
  },
  "ceramica-sin-miedo": {
    photos: [
      ph("https://live.staticflickr.com/5001/5319925321_a0cc352926_b.jpg", "Manos modelando barro en un taller de cerámica", "archer10 · CC BY-SA"),
      ph("https://live.staticflickr.com/7437/12365760034_066fa05f39_b.jpg", "Estudiantes trabajando el torno juntos", "Duke Univ. Archives · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/2053/2245383078_6d63935d4d_b.jpg", "Taller de alfarería con piezas en proceso", "Pet_r · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/7824/32593565287_f7c243a522_b.jpg", "Detalle de manos dando forma a una pieza", "Trinity Lavra · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/2253/2051216724_5d41b68506.jpg", "Texturas y herramientas sobre la mesa de trabajo", "Anne Helmond · CC BY-NC-ND"),
    ],
    quotes: [
      { author: "Carmen S.", text: "Mi taza está torcida y es perfecta. El café de después con el grupo, aún mejor.", event: "Cerámica sin Miedo" },
      { author: "Pablo V.", text: "No sabía que el barro podía ser tan terapéutico. Salí relajado y con tres contactos nuevos.", event: "Cerámica sin Miedo" },
    ],
  },
  "cata-blind-fold": {
    photos: [
      ph("https://live.staticflickr.com/7018/6526132527_0dcb420dcd_b.jpg", "Grupo de amigos brindando con copas de vino", "wharman · CC BY"),
      ph("https://live.staticflickr.com/2414/2203079102_7373439a74_b.jpg", "Copas levantadas durante la cata a ciegas", "fugutabetai · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/2360/2202287755_7b8aa50647_b.jpg", "Detalle de copas y risas entre ronda y ronda", "fugutabetai · CC BY-NC-SA"),
      ph("https://live.staticflickr.com/7381/9736654684_6fffdeecb8_b.jpg", "Brindis final con todo el grupo", "Prayitno · CC BY"),
      ph("https://live.staticflickr.com/7/6972158_ee1a7b6f5a_b.jpg", "Tabla de quesos compartida en la sobremesa", "sampsyo · CC BY"),
    ],
    quotes: [
      { author: "Ana P.", text: "No acerté ni una uva y me lo pasé mejor que nunca. La venda quita la vergüenza de golpe.", event: "Cata Blind Fold" },
      { author: "Raúl M.", text: "Salimos hablando de vinos como expertos y de planes como amigos. La combinación es imbatible.", event: "Cata Blind Fold" },
    ],
  },
};

/** Devuelve la galería de un taller (con fallback vacío seguro). */
export function galleryFor(eventId: string): Gallery {
  return GALLERIES[eventId] ?? { photos: [FALLBACK_PHOTO], quotes: [] };
}
