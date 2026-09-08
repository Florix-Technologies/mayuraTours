export type HeroThumb = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export type HeroSlide = {
  name: string;
  tag: string;
  sub: string;
  price: string;
  description: string;
  chips: string[];
  image: string;
  imageAlt: string;
  thumbs: [HeroThumb, HeroThumb, HeroThumb];
};

export const heroSlides: HeroSlide[] = [
  {
    name: "GOA",
    tag: "✦ Monsoon Special",
    sub: "2 Nights · 3 Days · Ex Bangalore",
    price: "₹6,475",
    description:
      "Leave at 7 p.m., wake up on the coast. Two nights, deluxe hotel with breakfast, both coasts by luxury bus — and our own A/C sleeper coach each way.",
    chips: ["North & South Goa", "Deluxe Hotel", "AC Sleeper Coach", "Breakfast Included"],
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Goa coastline with palm trees at golden hour",
    thumbs: [
      {
        src: "https://images.unsplash.com/photo-1571366343168-631c5bcca7a4?w=500&q=80&auto=format&fit=crop",
        alt: "Baga Beach Goa, vibrant with colourful boats",
        title: "Baga Beach",
        caption: "Day 3 · South Goa",
      },
      {
        src: "https://images.unsplash.com/photo-1727786473209-5a3a7747e877?w=500&q=80&auto=format&fit=crop",
        alt: "Old Portuguese cannon on the fort wall at Fort Aguada, Goa",
        title: "Fort Aguada",
        caption: "Fort Aguada",
      },
      {
        src: "https://images.unsplash.com/photo-1667760334198-d3958029a08b?w=500&q=80&auto=format&fit=crop",
        alt: "Dudhsagar waterfalls, Goa, lush green monsoon",
        title: "Dudhsagar Falls",
        caption: "Day 2 · Waterfalls",
      },
    ],
  },
  {
    name: "OOTY",
    tag: "✦ Cool Season",
    sub: "5 Nights · 6 Days · Ex Bangalore",
    price: "₹15,600",
    description:
      "Four stops across the ranges with a free day in the middle to do absolutely nothing. Tea slopes, lake towns and the long road back down.",
    chips: ["Doddabetta Peak", "Nilgiri Railway", "Tea Garden Walks", "3-Star Hotels"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Ooty Nilgiri hills misty tea gardens",
    thumbs: [
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80&auto=format&fit=crop",
        alt: "Ooty tea slopes, misty green Nilgiri hills",
        title: "Tea Gardens",
        caption: "Day 2 · Free day",
      },
      {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80&auto=format&fit=crop",
        alt: "Doddabetta peak, highest point in the Nilgiris",
        title: "Doddabetta Peak",
        caption: "Doddabetta Ridge",
      },
      {
        src: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&q=80&auto=format&fit=crop",
        alt: "Coonoor waterfall in tropical forest",
        title: "Coonoor Falls",
        caption: "Coonoor falls",
      },
    ],
  },
  {
    name: "MYSORE",
    tag: "✦ Daily Departure",
    sub: "Departs 7:30 a.m. · Same-day return",
    price: "On request",
    description:
      "The palace city and the temple town in one long, easy day. The hill shrine, the palace, the church, and the gardens before the fountain show.",
    chips: ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens", "AC Coach"],
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Mysore Palace illuminated at night",
    thumbs: [
      {
        src: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&q=80&auto=format&fit=crop",
        alt: "Mysore Palace illuminated at night",
        title: "Mysore Palace",
        caption: "Departs 7:30 a.m.",
      },
      {
        src: "https://images.unsplash.com/photo-1759851343085-2c52e1d4118d?w=500&q=80&auto=format&fit=crop",
        alt: "Ornate temple gopuram tower with colourful sculptures",
        title: "Ranganathaswamy Temple",
        caption: "Srirangapatna",
      },
      {
        src: "https://images.unsplash.com/photo-1651349776781-7a8cf162a494?w=500&q=80&auto=format&fit=crop",
        alt: "Brindavan Gardens, Mysore, at Krishnaraja Sagar dam",
        title: "Brindavan Gardens",
        caption: "Brindavan Gardens",
      },
    ],
  },
];
