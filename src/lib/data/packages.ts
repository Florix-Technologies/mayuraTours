export type TourPackage = {
  slug: string;
  name: string;
  badge: string;
  badgeVariant: "hot" | "left" | "default";
  secondaryBadge?: string;
  secondaryBadgeVariant?: "hot" | "left" | "default";
  description: string;
  tags: string[];
  price: string;
  priceUnit?: string;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
};

export const packages: TourPackage[] = [
  {
    slug: "goa",
    name: "Goa Beach Getaway",
    badge: "Monsoon Special",
    badgeVariant: "default",
    secondaryBadge: "Bestseller",
    secondaryBadgeVariant: "hot",
    description:
      "North & South Goa beaches, Bom Jesus Basilica, Fort Aguada & the vibrant Calangute strip. Leave Friday evening, return Monday morning fresh.",
    tags: ["2 Nights · 3 Days", "Deluxe Hotel", "AC Sleeper", "Breakfast"],
    price: "₹6,475",
    priceUnit: "per person",
    image:
      "https://images.unsplash.com/photo-1682743710558-b338ba285925?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Aerial view of Goa's pristine beaches and blue Arabian Sea",
    whatsappMessage: "Hi, I'd like to book the Goa package",
  },
  {
    slug: "ooty-coonoor",
    name: "Ooty + Coonoor Hills",
    badge: "Cool Season",
    badgeVariant: "default",
    description:
      "Tea slopes, Doddabetta peak, Sim's Park, and the famous Nilgiri Mountain Railway. A free day built in for relaxed exploring at your own pace.",
    tags: ["5 Nights · 6 Days", "3-Star Hotels", "Volvo Coach", "Sightseeing"],
    price: "₹15,600",
    priceUnit: "per person",
    image:
       "https://images.unsplash.com/photo-1672748930862-a17dc466e58b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      //
    imageAlt: "Lush green Ooty Nilgiri hills with misty valleys and tea gardens",
    whatsappMessage: "Hi, I'd like to book Ooty + Coonoor",
  },
  {
    slug: "mysore-srirangapatna",
    name: "Mysore & Srirangapatna",
    badge: "Daily Departure",
    badgeVariant: "default",
    secondaryBadge: "Day Trip",
    secondaryBadgeVariant: "left",
    description:
      "The grand palace, Chamundi hills shrine, the island fortress, and Brindavan gardens — all in one glorious, well-paced day from Bengaluru.",
    tags: ["Same-day return", "Departs 7:30 AM", "AC Coach", "Guide included"],
    price: "On request",
    image:
      "https://images.unsplash.com/photo-1665376620694-fc0c4bab7294?q=80&w=1133&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Mysore Palace grand illuminated facade Karnataka heritage",
    whatsappMessage: "Hi, I'd like to book Mysore Heritage",
  },
  {
    slug: "coorg",
    name: "Coorg Coffee Country",
    badge: "Year-round",
    badgeVariant: "default",
    description:
      "Scotland of India — misty hills, fragrant coffee estates, Abbey Falls, Raja's Seat, and the golden Bhagamandala temple confluence.",
    tags: ["3 Nights · 4 Days", "Estate Stay", "AC Volvo"],
    price: "₹12,200",
    priceUnit: "per person",
    image:
         "https://images.unsplash.com/photo-1683665446527-0bfa0d7a8822?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      //"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80&auto=format&fit=crop",
      
    imageAlt: "Misty Coorg coffee plantation with lush green hills Karnataka",
    whatsappMessage: "Coorg package",
  },
  {
    slug: "kerala-munnar",
    name: "Kerala Backwaters & Munnar",
    badge: "God's Own Country",
    badgeVariant: "default",
    secondaryBadge: "Popular",
    secondaryBadgeVariant: "hot",
    description:
      "Munnar tea hills, Alleppey houseboat cruise, Periyar wildlife sanctuary and the serene Kochi backwaters — Kerala's greatest hits in 7 days.",
    tags: ["6 Nights · 7 Days", "Houseboat", "3-star Hotels", "AC Coach"],
    price: "₹22,500",
    priceUnit: "per person",
    image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      //"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Kerala backwaters houseboat at sunset with palm trees",
    whatsappMessage: "Kerala package",
  },
  {
    slug: "chikmagalur",
    name: "Chikmagalur & Mullayanagiri",
    badge: "Trek Friendly",
    badgeVariant: "default",
    description:
      "Trek to Karnataka's highest peak at 1,930m, explore pristine coffee plantations, Bhadra Wildlife Sanctuary, and the ancient Hoysala temples of Belur.",
    tags: ["2 Nights · 3 Days", "Coffee Resort", "Trekking"],
    price: "₹9,800",
    priceUnit: "per person",
    image:
       "https://images.unsplash.com/photo-1578496034584-2d95250334b5?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      //"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop",
    imageAlt: "Chikmagalur coffee hills trekking misty mountains Karnataka",
    whatsappMessage: "Chikmagalur package",
  },
];
