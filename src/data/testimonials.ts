export interface Testimonial {
  id: string;
  name: string;
  age: number;
  initials: string;
  color: string;
  quote: string;
  event: string;
  stars: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "elena",
    name: "Elena M.",
    age: 27,
    initials: "EM",
    color: "bg-[#E2FF00] text-ink",
    quote:
      "Llegué a Zaragoza por trabajo sin conocer a nadie. Fui sola al taller de pasta y hoy tengo mi grupo de los viernes.",
    event: "Pasta Fresca from Scratch",
    stars: 5,
  },
  {
    id: "marcos",
    name: "Marcos T.",
    age: 34,
    initials: "MT",
    color: "bg-[#9BFFD6] text-ink",
    quote:
      "Yo era el típico que decía «luego vamos» y nunca iba. Un sábado de sushi y ya llevo cuatro planes con la misma gente.",
    event: "Sushimanía & Sangría",
    stars: 5,
  },
  {
    id: "lucia-sara",
    name: "Lucía & Sara",
    age: 25,
    initials: "L&S",
    color: "bg-[#FF8FA8] text-ink",
    quote:
      "Vinimos las dos y acabamos conociendo a seis. El rompehielo del principio es ridículo, pero funciona de verdad.",
    event: "Paint & Wine Night",
    stars: 5,
  },
  {
    id: "diego",
    name: "Diego R.",
    age: 41,
    initials: "DR",
    color: "bg-[#FFE600] text-ink",
    quote:
      "Me mudé a Zaragoza con 41 y pensaba que ya no se conocía a nadie. El brunch del domingo me quitó esa idea de la cabeza.",
    event: "Sunday Lemon Brunch",
    stars: 5,
  },
  {
    id: "ana",
    name: "Ana P.",
    age: 30,
    initials: "AP",
    color: "bg-[#C58BFF] text-ink",
    quote:
      "Cata a ciegas sin conocer a un alma: salí con tres amigos, una botella de recuerdo y planes para el mes que viene.",
    event: "Cata Blind Fold",
    stars: 4,
  },
];
