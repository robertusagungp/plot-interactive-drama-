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
    case "kang-tae-jun":
    case "tae-jun":
      return {
        hair: "#0F172A", // Silver-streaked idol hair
        suit: "#3B82F6", // Electric blue stage blazer
        accent: "#60A5FA", // Silver earring & mic
        eyes: "#93C5FD", // Intense charismatic eyes
      };
    case "lee-min-hyuk":
    case "min-hyuk":
      return {
        hair: "#1E293B", // Natural wavy dark hair
        suit: "#4F46E5", // Royal indigo tailor-fit coat
        accent: "#F59E0B", // LK Group signet ring
        eyes: "#FBBF24", // Playful golden-brown eyes
      };
    case "yoon-jin-hyuk":
    case "jin-hyuk":
      return {
        hair: "#0F172A", // Slicked back CEO cut
        suit: "#09090B", // Midnight black executive suit
        accent: "#10B981", // Emerald cufflinks
        eyes: "#34D399", // Piercing sharp eyes
      };
    case "dante":
    case "tae-woon":
      return {
        hair: "#09090B", // Undercut dark hair
        suit: "#18181B", // Armored black trenchcoat
        accent: "#EF4444", // Crimson dragon tattoo accent
        eyes: "#F87171", // Fierce amber-red eyes
      };
    case "dr-jung-jae-won":
    case "jae-won":
      return {
        hair: "#1E293B", // Soft layered brown hair
        suit: "#0284C7", // Hospital surgical scrubs
        accent: "#38BDF8", // Titanium stethoscope
        eyes: "#7DD3FC", // Gentle focused eyes
      };
    case "duke-shin-do-hyuk":
    case "do-hyuk":
      return {
        hair: "#312E81", // Imperial silver-blue locks
        suit: "#4338CA", // Gold-trimmed imperial cloak
        accent: "#FBBF24", // Royal crest brooch
        eyes: "#A5B4FC", // Noble amethyst eyes
      };
    case "luca":
      return {
        hair: "#78350F",
        suit: "#134E4A",
        accent: "#2DD4BF",
        eyes: "#10B981",
      };
    case "vanessa":
    case "vanessa-lim":
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
    imageUrl?: string;
    svgElements: string;
  }
> = {
  penthouse: {
    title: "Skyscraper Penthouse Suite",
    description: "Floor-to-ceiling glass overlooking the glowing metropolis skyline at midnight.",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    gradient: "from-[#05070F] via-[#0F172A] to-[#090D16]",
    overlay: "radial-gradient(ellipse at top, rgba(56, 189, 248, 0.18) 0%, rgba(15, 23, 42, 0.85) 100%)",
    svgElements: "cityline",
  },
  boardroom: {
    title: "Executive Corporate Boardroom",
    description: "High-stakes boardroom with mahogany table, city panorama, and cold fluorescent luxury.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    gradient: "from-[#0F172A] via-[#1E293B] to-[#0A0E1A]",
    overlay: "radial-gradient(circle at center, rgba(226, 183, 20, 0.12) 0%, rgba(10, 14, 26, 0.88) 100%)",
    svgElements: "boardroom",
  },
  rain_street: {
    title: "Neon Rainlit Avenue",
    description: "Heavy rain shimmering against neon reflections outside the luxury boutique avenue.",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80",
    gradient: "from-[#020617] via-[#0B132B] to-[#000814]",
    overlay: "radial-gradient(circle at top right, rgba(244, 63, 94, 0.2) 0%, rgba(2, 6, 23, 0.9) 100%)",
    svgElements: "rain",
  },
  ballroom: {
    title: "The Grand Charity Gala",
    description: "Opulent ballroom with crystal chandeliers, champagne towers, and high society spotlight.",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    gradient: "from-[#1C1917] via-[#292524] to-[#0C0A09]",
    overlay: "radial-gradient(circle at top, rgba(234, 179, 8, 0.25) 0%, rgba(12, 10, 9, 0.85) 100%)",
    svgElements: "chandelier",
  },
  bedroom: {
    title: "The Master Suite",
    description: "Dimly lit private chambers with velvet curtains and tension heavy in the air.",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
    gradient: "from-[#18181B] via-[#27272A] to-[#09090B]",
    overlay: "radial-gradient(circle at bottom, rgba(168, 85, 247, 0.16) 0%, rgba(9, 9, 11, 0.88) 100%)",
    svgElements: "interior",
  },
  office: {
    title: "Executive Creative Studio",
    description: "Stacks of overdue contracts, late night coffee, and the desperate fight to protect your company.",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80",
    gradient: "from-[#0F172A] via-[#1E1B4B] to-[#050510]",
    overlay: "radial-gradient(circle at top left, rgba(245, 158, 11, 0.15) 0%, rgba(5, 5, 16, 0.88) 100%)",
    svgElements: "office",
  },
  idol_stage: {
    title: "Dome Stadium Stage",
    description: "Blinding stage lights, roaring stadium crowds, and electric laser beams.",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
    gradient: "from-[#030712] via-[#1E1B4B] to-[#020617]",
    overlay: "radial-gradient(circle at top, rgba(99, 102, 241, 0.3) 0%, rgba(3, 7, 18, 0.85) 100%)",
    svgElements: "stage_lights",
  },
  recording_studio: {
    title: "Acoustic Recording Studio",
    description: "Soundproof studio booth with glowing audio meters and midnight melodies.",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
    gradient: "from-[#0F172A] via-[#1E293B] to-[#020617]",
    overlay: "radial-gradient(circle at center, rgba(14, 165, 233, 0.2) 0%, rgba(2, 6, 23, 0.9) 100%)",
    svgElements: "soundwave",
  },
  casino_vault: {
    title: "Underground Casino Vault",
    description: "High-roller private vault protected by heavy steel doors and dark noir shadows.",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80",
    gradient: "from-[#18181B] via-[#27272A] to-[#09090B]",
    overlay: "radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, rgba(9, 9, 11, 0.9) 100%)",
    svgElements: "vault",
  },
  hospital_er: {
    title: "Emergency Trauma Unit",
    description: "Urgent heart monitors, sterile blues, and high-stakes medical adrenaline.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    gradient: "from-[#082F49] via-[#0C4A6E] to-[#030712]",
    overlay: "radial-gradient(circle at top, rgba(56, 189, 248, 0.25) 0%, rgba(3, 7, 18, 0.88) 100%)",
    svgElements: "heartbeat",
  },
  courtroom: {
    title: "Supreme Court Bench",
    description: "Grand judicial hall of mahogany wood, judicial gavels, and absolute justice.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    gradient: "from-[#292524] via-[#1C1917] to-[#0C0A09]",
    overlay: "radial-gradient(circle at top, rgba(245, 158, 11, 0.2) 0%, rgba(12, 10, 9, 0.9) 100%)",
    svgElements: "court",
  },
  royal_palace: {
    title: "Grand Imperial Palace",
    description: "Majestic palace hall adorned with gold arches and lush rose gardens.",
    imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80",
    gradient: "from-[#312E81] via-[#1E1B4B] to-[#020617]",
    overlay: "radial-gradient(circle at top, rgba(234, 179, 8, 0.3) 0%, rgba(2, 6, 23, 0.85) 100%)",
    svgElements: "palace",
  },
  cozy_cafe: {
    title: "Rainy Alley Coffeehouse",
    description: "Warm espresso steam, acoustic melodies, and shelter from the cold downpour.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    gradient: "from-[#451A03] via-[#292524] to-[#0C0A09]",
    overlay: "radial-gradient(circle at center, rgba(249, 115, 22, 0.2) 0%, rgba(12, 10, 9, 0.88) 100%)",
    svgElements: "cafe",
  },
  rooftop_night: {
    title: "Apartment 502 Rooftop",
    description: "Quiet rooftop hideout with string fairy lights overlooking the neon city skyline.",
    imageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80",
    gradient: "from-[#0F172A] via-[#1E293B] to-[#020617]",
    overlay: "radial-gradient(circle at top, rgba(244, 63, 94, 0.2) 0%, rgba(2, 6, 23, 0.88) 100%)",
    svgElements: "cityline",
  },
};
