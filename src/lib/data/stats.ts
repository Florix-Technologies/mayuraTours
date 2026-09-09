import { business, yearsInBusiness } from "./business";

/** Rounded down to the nearest 5 for a clean marketing figure ("36 years" -> "35+"). */
const roundedYears = Math.floor(yearsInBusiness() / 5) * 5;

export const stats = [
  { to: roundedYears, suffix: "+", label: "Years of trusted\ntravel expertise" },
  { to: 50000, suffix: "+", label: "Happy travellers\ntransported safely" },
  { to: 20, suffix: "+", label: "Destinations across\nSouth & Central India" },
  { to: 4.4, suffix: "★", label: "Avg. customer rating\non Google & JustDial" },
];

export const howItWorksSteps = [
  {
    number: 1,
    title: "Choose & Enquire",
    description:
      "Pick a destination that calls to you. WhatsApp or call us for instant pricing and availability.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80&auto=format&fit=crop",
    imageAlt: "Person browsing tours on phone and laptop",
  },
  {
    number: 2,
    title: "Confirm & Pay",
    description:
      "Lock your seats with a small advance and get a confirmation receipt within 24 hours. No hidden charges ever.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&auto=format&fit=crop",
    imageAlt: "Digital payment confirmation on mobile",
  },
  {
    number: 3,
    title: "Travel & Enjoy",
    description:
      "Board our AC coach, sit back, and let Mayura take care of every detail from start to finish.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop",
    imageAlt: "Happy family at scenic mountain viewpoint",
  },
];

export const trustCards = [
  {
    icon: "trophy",
    stat: `${roundedYears}+`,
    title: "Years in Business",
    description: `Established in Gandhi Nagar, Bengaluru since ${business.foundedYear} — one of the longest-running tour operators in Karnataka.`,
  },
  {
    icon: "bus",
    stat: "Own Fleet",
    title: "No Contract Buses",
    description:
      "We operate our own GPS-tracked Volvo and multi-axle AC sleeper coaches — maintained, inspected, and insured.",
  },
  {
    icon: "badge",
    stat: "Licensed",
    title: "Karnataka Tourism",
    description:
      "Registered and licensed with Karnataka Tourism — a recognised, accountable operator, not a middleman.",
  },
  {
    icon: "star",
    stat: "4.4★",
    title: "Highly Rated",
    description:
      "Consistently rated 4.4+ on JustDial & Google. See our live rating on either platform before you book.",
  },
] as const;

export const trustBadges = [
  {
    icon: "secure",
    tint: "green",
    title: "Secure Payments",
    description:
      "UPI, Bank Transfer & Online payments to registered business account only",
  },
  {
    icon: "support",
    tint: "gold",
    title: "24/7 Support",
    description:
      "Dedicated helpline during travel — your tour manager is always reachable",
  },
  {
    icon: "itinerary",
    tint: "gold",
    title: "Detailed Itinerary",
    description:
      "Hotel names, vehicle details & sightseeing list provided before booking",
  },
  {
    icon: "cost",
    tint: "green",
    title: "No Hidden Costs",
    description:
      "All-inclusive pricing with clear cancellation & refund policy upfront",
  },
] as const;
