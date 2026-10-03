export type Category = "Cocina" | "Arte" | "Catas" | "Brunch";

export interface ProgramStep {
  time: string;
  title: string;
  desc: string;
}

export interface LemonEvent {
  id: string;
  title: string;
  category: Category;
  emoji: string;
  gradient: string;
  date: string;
  dateShort: string;
  time: string;
  place: string;
  price: number;
  spots: number;
  level: string;
  tagline: string;
  description: string;
  program: ProgramStep[];
  rating: number;
  satisfaction: number;
  friendsAfter: number;
  badge?: string;
}

export const CATEGORIES: Array<Category | "Todos"> = ["Todos", "Cocina", "Arte", "Catas", "Brunch"];

export const EVENTS: LemonEvent[] = [
  {
    id: "sushimania-sangria",
    title: "Miércoles Lemon: Sushimanía",
    category: "Cocina",
    emoji: "🍣",
    gradient: "from-[#FFE600] via-[#FF9B3D] to-[#FF5C7A]",
    date: "Miércoles 11 de marzo",
    dateShort: "MIÉ 11 MAR",
    time: "19:00 – 21:30",
    place: "El Gancho, Zaragoza",
    price: 24,
    spots: 3,
    level: "Principiante · Cero timidez",
    tagline: "El miércoles que cortamos la semana: sushi para principiantes + romper el hielo.",
    description:
      "Aprende a preparar arroz, cortar como un profesional y enrollar tus propios makis mientras la sangría hace su magia. Empezamos con una dinámica rapidísima para que nadie se quede mirando el suelo.",
    program: [
      { time: "19:00", title: "Bienvenida + pictionary relámpago", desc: "Copa en mano y a romper el hielo sin que te des cuenta." },
      { time: "19:20", title: "Arroz, cuchillo y secretos del sushi", desc: "Lo básico bien hecho, con demostración paso a paso." },
      { time: "19:55", title: "Concurso de enrollado", desc: "Tu equipo contra el de al lado. Gana el que menos se ría." },
      { time: "20:40", title: "Se come, se brinda, se intercambian planes", desc: "Casi siempre aquí nace el grupo de WhatsApp." },
    ],
    rating: 4.9,
    satisfaction: 97,
    friendsAfter: 89,
    badge: "¡Últimas 3 plazas!",
  },
  {
    id: "paint-wine-night",
    title: "Miércoles de Pintura & Vino",
    category: "Arte",
    emoji: "🎨",
    gradient: "from-[#9BFFD6] via-[#4FE0B0] to-[#2E86FF]",
    date: "Miércoles 18 de marzo",
    dateShort: "MIÉ 18 MAR",
    time: "19:30 – 22:00",
    place: "Depósito, Zaragoza",
    price: 22,
    spots: 8,
    level: "Principiante · Cero timidez",
    tagline: "Pintura y cerámica con copa en mano. Nuestro miércoles de desconexión.",
    description:
      "Elige lienzo o pieza de cerámica, coge tu copa y déjate llevar. No hay dioses ni principiantes: hay gente pasándoselo bien un viernes por la noche en lugar de mirar la tele.",
    program: [
      { time: "19:30", title: "Welcome drink + mezcla de equipos", desc: "Te toca conocer a tres personas que no conocías." },
      { time: "19:50", title: "Técnica exprés", desc: "Pinceladas, texturas y una copa de vino tinto o mosto." },
      { time: "20:40", title: "Sesión libre guiada", desc: "Música, charla y un monitor paseando entre mesas." },
      { time: "21:40", title: "Mini galería + foto de grupo", desc: "Tu obra vuelve a casa contigo y con un buen recuerdo." },
    ],
    rating: 4.8,
    satisfaction: 96,
    friendsAfter: 84,
    badge: "Top valorado",
  },
  {
    id: "sunday-lemon-brunch",
    title: "Sunday Lemon Brunch",
    category: "Brunch",
    emoji: "🥑",
    gradient: "from-[#E2FF00] via-[#9BFFD6] to-[#FFFBE8]",
    date: "Domingo 22 de marzo",
    dateShort: "DOM 22 MAR",
    time: "11:30 – 14:00",
    place: "La Paz, Zaragoza",
    price: 18,
    spots: 12,
    level: "Principiante · Cero timidez",
    tagline: "El antidomingo perfecto para conocer gente comiendo bien.",
    description:
      "Pancakes, tostadas de aguacate, café de especialidad y una mesa larga llena de gente que tampoco tenía planes. El mejor antídoto contra el domingo gris de Zaragoza.",
    program: [
      { time: "11:30", title: "Café, mesas rotatorias y hellos", desc: "Sí, te moverás de sitio. Sí, funciona." },
      { time: "12:00", title: "Brunch servido", desc: "Opción vegana y sin gluten disponibles." },
      { time: "12:45", title: "Dinámica 'Dos verdades y una mentira'", desc: "El clásico que convierte a desconocidos en colegas." },
      { time: "13:30", title: "Planes espontáneos", desc: "Muchos acaban tomando algo más. Nadie lo planificó." },
    ],
    rating: 5,
    satisfaction: 98,
    friendsAfter: 92,
    badge: "98% repiten",
  },
  {
    id: "pasta-fresca",
    title: "Pasta Fresca from Scratch",
    category: "Cocina",
    emoji: "🍝",
    gradient: "from-[#FFF3B0] via-[#FFD84D] to-[#FF8A3D]",
    date: "Jueves 26 de marzo",
    dateShort: "JUE 26 MAR",
    time: "19:00 – 21:30",
    place: "Centro, Zaragoza",
    price: 26,
    spots: 6,
    level: "Principiante · Cero timidez",
    tagline: "Amasado, relleno y salsa. Te llevas la receta (y el grupo).",
    description:
      "Talajar pasta fresca con las manos mientras huele a parmesano y tomate. Ideal si acabas de mudarte a Zaragoza y buscas un plan de jueves que no sea 'quedamos por una caña y ya'.",
    program: [
      { time: "19:00", title: "Reparto de parejas y masa", desc: "Amasas con quien acabas de conocer. Buen inicio." },
      { time: "19:30", title: "Estirado y corte", desc: "Tagliatelle, ravioli y una sorpresa rellena." },
      { time: "20:30", title: "Salsa + cocción exprés", desc: "Dos salsas, una vegetariana, ambas peligrosamente buenas." },
      { time: "21:00", title: "Cena entre todos", desc: "Se cena lo que se ha hecho. Y se sigue hablando." },
    ],
    rating: 4.9,
    satisfaction: 97,
    friendsAfter: 91,
    badge: "¡Últimas 6 plazas!",
  },
  {
    id: "ceramica-sin-miedo",
    title: "Miércoles de Cerámica & Vino",
    category: "Arte",
    emoji: "🏺",
    gradient: "from-[#F7E7CE] via-[#E8B08A] to-[#B5654A]",
    date: "Miércoles 25 de marzo",
    dateShort: "MIÉ 25 MAR",
    time: "19:00 – 21:30",
    place: "El Gancho, Zaragoza",
    price: 30,
    spots: 5,
    level: "Principiante · Cero timidez",
    tagline: "Modelado a mano sin torno. Tu miércoles, tus reglas.",
    description:
      "Barro, manos y cero exigencia. Modelas tu propia taza o cuenco mientras el café circula y la conversación va fluyendo sola.",
    program: [
      { time: "11:00", title: "Calentamiento de manos + barro", desc: "Para vencer la torpeza inicial en 5 minutos." },
      { time: "11:20", title: "Técnicas de pellizco y plancha", desc: "Tazas, cuencos o lo que tu imaginación mande." },
      { time: "12:30", title: "Decoración con engobes", desc: "Color, textura y algún garabato que presumirás luego." },
      { time: "13:10", title: "Horneado posterior y entrega", desc: "Te avisamos cuando tu pieza esté lista para recoger." },
    ],
    rating: 4.9,
    satisfaction: 95,
    friendsAfter: 86,
  },
  {
    id: "cata-blind-fold",
    title: "Miércoles de Cata Blind Fold",
    category: "Catas",
    emoji: "🍇",
    gradient: "from-[#C58BFF] via-[#8B5CF6] to-[#3B1E6E]",
    date: "Miércoles 1 de abril",
    dateShort: "MIÉ 1 ABR",
    time: "20:00 – 22:00",
    place: "Centro, Zaragoza",
    price: 25,
    spots: 9,
    level: "Principiante · Cero timidez",
    tagline: "Adivina la uva a ciegas. Se ríe, se aprende y se brinda.",
    description:
      "Vendados, con seis vinos de Aragón delante y un grupo de desconocidos intentando adivinar de dónde viene cada copa. La sesión de risas más divertida de la semana.",
    program: [
      { time: "20:00", title: "Bienvenida sin mirar", desc: "Antifaz, copa y una persona nueva a tu lado." },
      { time: "20:20", title: "Ronda de adivinanza", desc: "Aroma, textura, origen. Cada acierto suma puntos al equipo." },
      { time: "21:00", title: "Desvelando etiquetas", desc: "Sorpresa: casi nadie acierta y eso es lo bueno." },
      { time: "21:30", title: "Tabla de quesos + intercambio", desc: "El cierre donde se cierran planes del finde." },
    ],
    rating: 4.8,
    satisfaction: 96,
    friendsAfter: 88,
  },
];
