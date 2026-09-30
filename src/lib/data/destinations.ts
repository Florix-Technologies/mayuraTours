export type Destination = {
  name: string;
  image: string;
  imageAlt: string;
  region: string;
  description: string;
  highlights: string[];
  packageSlugs: string[];
};

export const destinations: Destination[] = [
  {
    name: "Goa",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Goa beach turquoise water",
    region: "West India",
    description:
      "Discover Goa's golden beaches, Portuguese heritage, vibrant coastal culture, and relaxed tropical atmosphere.",
    highlights: [
      "Beautiful beaches",
      "Portuguese heritage",
      "Water sports",
      "Coastal cuisine",
    ],
    packageSlugs: ["goa"],
  },
  {
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Kerala backwaters houseboat",
    region: "South India",
    description:
      "Experience serene backwaters, misty tea plantations, lush landscapes, wildlife, and the unique culture of God's Own Country.",
    highlights: [
      "Backwater cruises",
      "Tea plantations",
      "Wildlife",
      "Houseboat stays",
    ],
    packageSlugs: ["kerala-munnar"],
  },
  {
    name: "Ooty",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Ooty Nilgiri hills green",
    region: "Tamil Nadu",
    description:
      "Escape into the cool Nilgiri hills with beautiful tea gardens, scenic viewpoints, colonial charm, and refreshing mountain air.",
    highlights: [
      "Nilgiri hills",
      "Tea gardens",
      "Doddabetta Peak",
      "Mountain railway",
    ],
    packageSlugs: ["ooty-coonoor"],
  },
  {
    name: "Coorg",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Coorg misty coffee plantation hills",
    region: "Karnataka",
    description:
      "Explore misty hills, fragrant coffee estates, waterfalls, viewpoints, and the peaceful natural beauty of Coorg.",
    highlights: [
      "Coffee plantations",
      "Misty hills",
      "Abbey Falls",
      "Raja's Seat",
    ],
    packageSlugs: ["coorg"],
  },
  {
    name: "Mysore",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Mysore Palace illuminated night heritage",
    region: "Karnataka",
    description:
      "Step into Karnataka's royal heritage with magnificent palaces, historic landmarks, temples, gardens, and vibrant local culture.",
    highlights: [
      "Mysore Palace",
      "Chamundi Hills",
      "Brindavan Gardens",
      "Royal heritage",
    ],
    packageSlugs: ["mysore-srirangapatna"],
  },
  {
    name: "Chikmagalur",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Chikmagalur mountain trekking mist",
    region: "Karnataka",
    description:
      "Discover rolling coffee hills, mountain trails, waterfalls, wildlife, and the refreshing landscapes of Chikmagalur.",
    highlights: [
      "Coffee estates",
      "Mullayanagiri",
      "Mountain trekking",
      "Wildlife",
    ],
    packageSlugs: ["chikmagalur"],
  },
  {
    name: "Munnar",
    image:
      "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Munnar rolling green tea plantation hills",
    region: "Kerala",
    description:
      "Wander through endless tea-covered hills, misty valleys, scenic viewpoints, and peaceful mountain landscapes.",
    highlights: [
      "Tea plantations",
      "Misty valleys",
      "Eravikulam National Park",
      "Mountain viewpoints",
    ],
    packageSlugs: ["kerala-munnar"],
  },
  {
    name: "Wayanad",
    image:
      "https://images.unsplash.com/photo-1755462518641-96732039dc57?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Wayanad misty green mountains",
    region: "Kerala",
    description:
      "Reconnect with nature among lush forests, misty mountains, waterfalls, wildlife, and the rich cultural heritage of Wayanad.",
    highlights: [
      "Lush forests",
      "Waterfalls",
      "Wildlife",
      "Mountain landscapes",
    ],
    packageSlugs: [],
  },
  {
    name: "Hampi",
    image:
      "https://images.unsplash.com/photo-1767615047003-540dc546ccb8?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Hampi ancient boulder ruins at sunset",
    region: "Karnataka",
    description:
      "Travel through the fascinating ruins of the Vijayanagara Empire surrounded by dramatic boulder landscapes and ancient temples.",
    highlights: [
      "Ancient ruins",
      "Historic temples",
      "Boulder landscapes",
      "Vijayanagara heritage",
    ],
    packageSlugs: [],
  },
  {
    name: "Kanyakumari",
    image:
      "https://images.unsplash.com/photo-1560273436-eaa99ede2d44?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Kanyakumari ocean sunset where three seas meet",
    region: "Tamil Nadu",
    description:
      "Visit India's southern tip where the Arabian Sea, Bay of Bengal, and Indian Ocean meet, surrounded by coastal beauty and cultural landmarks.",
    highlights: [
      "Ocean viewpoints",
      "Sunrise and sunset",
      "Vivekananda Rock",
      "Coastal heritage",
    ],
    packageSlugs: [],
  },
];


{/*export type Destination = {
  name: string;
  image: string;
  imageAlt: string;
};

export const destinations: Destination[] = [
  {
    name: "Goa",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Goa beach turquoise water",
  },
  {
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Kerala backwaters houseboat",
  },
  {
    name: "Ooty",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Ooty Nilgiri hills green",
  },
  {
    name: "Coorg",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Coorg misty coffee plantation hills",
  },
  {
    name: "Mysore",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Mysore Palace illuminated night heritage",
  },
  {
    name: "Chikmagalur",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Chikmagalur mountain trekking mist",
  },
  {
    name: "Munnar",
    image:
      "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Munnar rolling green tea plantation hills",
  },
  {
    name: "Wayanad",
    image:
      "https://images.unsplash.com/photo-1755462518641-96732039dc57?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Wayanad misty green mountains",
  },
  {
    name: "Hampi",
    image:
      "https://images.unsplash.com/photo-1767615047003-540dc546ccb8?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Hampi ancient boulder ruins at sunset",
  },
  {
    name: "Kanyakumari",
    image:
      "https://images.unsplash.com/photo-1560273436-eaa99ede2d44?w=300&q=80&auto=format&fit=crop",
    imageAlt: "Kanyakumari ocean sunset where three seas meet",
  },
];

*/}

