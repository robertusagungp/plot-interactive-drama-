export interface CharacterArtProps {
  slug: string;
  expression?: string;
  className?: string;
}

export function getCharacterColor(slug: string): { hair: string; suit: string; accent: string; eyes: string } {
  switch (slug.toLowerCase()) {
    case "adrian":
    case "adrian-hartono":
      return {
        hair: "#111827", // Jet black styled hair
        suit: "#1E293B", // Sharp charcoal bespoke suit
        accent: "#E2B714", // Gold tie clip / subtle luxury
        eyes: "#38BDF8", // Piercing icy blue eyes
      };
    case "sarah":
    case "sarah-wijaya":
      return {
        hair: "#451A03", // Rich dark auburn / chocolate brunette
        suit: "#881337", // Elegant deep crimson / wine red blazer
        accent: "#F43F5E", // Rose gold necklace
        eyes: "#D97706", // Determined amber/hazel eyes
      };
    case "luca":
      return {
        hair: "#78350F", // Warm light brown layered hair
        suit: "#134E4A", // Emerald / dark teal relaxed jacket
        accent: "#2DD4BF", // Silver pendant
        eyes: "#10B981", // Warm emerald eyes
      };
    case "vanessa":
      return {
        hair: "#0F172A", // Sleek raven black high ponytail
        suit: "#581C87", // Regal plum / violet haute couture dress
        accent: "#C084FC", // Diamond chandelier earrings
        eyes: "#A855F7", // Sharp amethyst eyes
      };
    default:
      return {
        hair: "#334155",
        suit: "#0F172A",
        accent: "#94A3B8",
        eyes: "#64748B",
      };
  }
}

export const SCENE_BACKGROUNDS: Record<
  string,
  {
    title: string;
    description: string;
    gradient: string;
    overlay: string;
    svgElements: string;
  }
> = {
  penthouse: {
    title: "Adrian's Penthouse Suite",
    description: "Floor-to-ceiling glass overlooking the glowing metropolis skyline at midnight.",
    gradient: "from-[#05070F] via-[#0F172A] to-[#090D16]",
    overlay: "radial-gradient(ellipse at top, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)",
    svgElements: "cityline",
  },
  boardroom: {
    title: "Hartono Corp Headquarters",
    description: "High-stakes boardroom with mahogany table, city panorama, and cold fluorescent luxury.",
    gradient: "from-[#0F172A] via-[#1E293B] to-[#0A0E1A]",
    overlay: "radial-gradient(circle at center, rgba(226, 183, 20, 0.08) 0%, rgba(10, 14, 26, 0.96) 100%)",
    svgElements: "boardroom",
  },
  rain_street: {
    title: "Neon Rainlit Avenue",
    description: "Heavy rain shimmering against neon reflections outside the Wijaya family office.",
    gradient: "from-[#020617] via-[#0B132B] to-[#000814]",
    overlay: "radial-gradient(circle at top right, rgba(244, 63, 94, 0.15) 0%, rgba(2, 6, 23, 0.98) 100%)",
    svgElements: "rain",
  },
  ballroom: {
    title: "The Grand Charity Gala",
    description: "Opulent ballroom with crystal chandeliers, champagne towers, and high society gossip.",
    gradient: "from-[#1C1917] via-[#292524] to-[#0C0A09]",
    overlay: "radial-gradient(circle at top, rgba(234, 179, 8, 0.2) 0%, rgba(12, 10, 9, 0.95) 100%)",
    svgElements: "chandelier",
  },
  bedroom: {
    title: "The Master Suite",
    description: "Dimly lit private chambers with velvet curtains and tension heavy in the air.",
    gradient: "from-[#18181B] via-[#27272A] to-[#09090B]",
    overlay: "radial-gradient(circle at bottom, rgba(168, 85, 247, 0.12) 0%, rgba(9, 9, 11, 0.96) 100%)",
    svgElements: "interior",
  },
  office: {
    title: "Sarah's Office - Wijaya Holdings",
    description: "Stacks of overdue contracts, late night coffee, and the desperate fight to save the company.",
    gradient: "from-[#0F172A] via-[#1E1B4B] to-[#050510]",
    overlay: "radial-gradient(circle at top left, rgba(245, 158, 11, 0.1) 0%, rgba(5, 5, 16, 0.96) 100%)",
    svgElements: "office",
  },
};
