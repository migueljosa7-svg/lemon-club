export interface CoinTier {
  id: string;
  name: string;
  min: number;
  emoji: string;
  reward: string;
  blurb: string;
}

/** Rangos acumulables por mes (talleres/mes × puntos por taller). */
export const COIN_TIERS: CoinTier[] = [
  {
    id: "starter",
    name: "Lemon Starter",
    min: 0,
    emoji: "🌰",
    reward: "5% dto. en tu entrada",
    blurb: "Empiezas a zumbar. Un taller al mes ya te da tu primer descuento.",
  },
  {
    id: "limonero",
    name: "Limonero",
    min: 20,
    emoji: "🌱",
    reward: "10% dto. + prioridad de reserva",
    blurb: "Acceso anticipado a plazas antes de que se agoten.",
  },
  {
    id: "zumo-pro",
    name: "Zumo Pro",
    min: 50,
    emoji: "🧃",
    reward: "Totebag Lemon Club gratis",
    blurb: "Merch oficial para presumir de comunidad por Zaragoza.",
  },
  {
    id: "lemon-vip",
    name: "Lemon VIP",
    min: 80,
    emoji: "👑",
    reward: "Taller privado gratis + acceso VIP",
    blurb: "Trae a tu gente y elegís vosotros tema, fecha y espacio.",
  },
];

export const COINS_PER_WORKSHOP = 10;
export const COINS_PER_FRIEND = 5;
export const MAX_WORKSHOPS = 8;

export function tierFor(coins: number): { tier: CoinTier; index: number } {
  let index = 0;
  COIN_TIERS.forEach((t, i) => {
    if (coins >= t.min) index = i;
  });
  return { tier: COIN_TIERS[index], index };
}

export function nextTier(coins: number): CoinTier | null {
  const { index } = tierFor(coins);
  return COIN_TIERS[index + 1] ?? null;
}
