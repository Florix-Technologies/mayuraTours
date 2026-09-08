export type HeroDestinationCard = {
  name: string;
  categoryLabel: string;
  image: string;
  imageAlt: string;
};

export type HeroExperience = {
  slug: string;
  category: string;
  tag: string;
  headline: string;
  description: string;
  /** High-resolution poster image — shown as the <video> poster while it buffers, and as the mobile background (video is desktop/tablet-only for data-usage reasons). */
  backgroundImage: string;
  backgroundImageAlt: string;
  /** Local category-specific footage — every category has one. */
  video: string;
  packageSlug: string;
  destinations: [HeroDestinationCard, HeroDestinationCard, HeroDestinationCard];
};

export const heroExperiences: HeroExperience[] = [
  {
    slug: "heritage",
    category: "Heritage & History",
    tag: "✦ Living History",
    headline: "Palaces, forts and centuries of story",
    description:
      "Walk illuminated palace halls, island fortresses and hilltop ramparts built by kings and empires — Karnataka's heritage circuit, told the way it deserves.",
    backgroundImage:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Mysore Palace illuminated at night, Karnataka heritage architecture",
    video: "/video/heritage and history.mp4",
    packageSlug: "mysore-srirangapatna",
    destinations: [
      {
        name: "Mysore Palace",
        categoryLabel: "Heritage",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Mysore Palace illuminated at night",
      },
      {
        name: "Hampi",
        categoryLabel: "Ruins",
        image:
          "https://images.unsplash.com/photo-1767615047003-540dc546ccb8?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Hampi ancient boulder ruins at sunset",
      },
      {
        name: "Srirangapatna",
        categoryLabel: "Fortress",
        image:
          "https://images.unsplash.com/photo-1759851343085-2c52e1d4118d?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Ornate temple gopuram tower with colourful sculptures at Srirangapatna",
      },
    ],
  },
  {
    slug: "hills",
    category: "Hills & Mountains",
    tag: "✦ Cool Season",
    headline: "Misty peaks and endless tea country",
    description:
      "Winding ghat roads, cloud-wrapped ridgelines and slopes carpeted in tea and coffee — the Western Ghats at their most cinematic, from Bengaluru's own back yard.",
    backgroundImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Misty green Nilgiri hills with tea gardens",
    video: "/video/hills and mountain.mp4",
    packageSlug: "ooty-coonoor",
    destinations: [
      {
        name: "Ooty",
        categoryLabel: "Tea Gardens",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Ooty tea slopes, misty green Nilgiri hills",
      },
      {
        name: "Coorg",
        categoryLabel: "Coffee Hills",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Misty Coorg coffee plantation hills",
      },
      {
        name: "Munnar",
        categoryLabel: "Tea Country",
        image:
          "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Munnar rolling green tea plantation hills",
      },
    ],
  },
  {
    slug: "beaches",
    category: "Beaches & Islands",
    tag: "✦ Monsoon Special",
    headline: "Golden coastlines, endless horizon",
    description:
      "North and south coast in one trip — swaying palms, Portuguese forts and the Arabian Sea at your feet. Leave at 7 p.m., wake up on the coast.",
    backgroundImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Goa coastline with turquoise water and golden sand",
    video: "/video/goa-beach-aerial.mp4",
    packageSlug: "goa",
    destinations: [
      {
        name: "Baga Beach",
        categoryLabel: "South Goa",
        image:
          "https://images.unsplash.com/photo-1571366343168-631c5bcca7a4?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Baga Beach Goa, vibrant with colourful boats",
      },
      {
        name: "Fort Aguada",
        categoryLabel: "Heritage",
        image:
          "https://images.unsplash.com/photo-1727786473209-5a3a7747e877?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Old Portuguese cannon on the fort wall at Fort Aguada, Goa",
      },
      {
        name: "Dudhsagar Falls",
        categoryLabel: "Waterfall",
        image:
          "https://images.unsplash.com/photo-1667760334198-d3958029a08b?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Dudhsagar waterfalls, Goa, lush green monsoon",
      },
    ],
  },
  {
    slug: "nature",
    category: "Nature & Wildlife",
    tag: "✦ God's Own Country",
    headline: "Backwaters, wildlife and untouched green",
    description:
      "Drift a houseboat through still backwaters, walk mist-wrapped forest trails and track wildlife through Periyar's reserve — Kerala's greatest hits in one journey.",
    backgroundImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Kerala backwaters houseboat at sunset with palm trees",
    video: "/video/nature and wildlife.mp4",
    packageSlug: "kerala-munnar",
    destinations: [
      {
        name: "Alleppey",
        categoryLabel: "Backwaters",
        image:
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Alleppey backwaters houseboat at sunset",
      },
      {
        name: "Periyar",
        categoryLabel: "Wildlife",
        image:
          "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Periyar wildlife sanctuary tropical forest",
      },
      {
        name: "Wayanad",
        categoryLabel: "Misty Hills",
        image:
          "https://images.unsplash.com/photo-1755462518641-96732039dc57?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Wayanad misty green mountains",
      },
    ],
  },
  {
    slug: "spiritual",
    category: "Spiritual & Cultural",
    tag: "✦ Pilgrimage",
    headline: "Temples, traditions and sacred ground",
    description:
      "From hilltop shrines to island temple towns and the meeting point of three seas — journeys built around Karnataka and Tamil Nadu's most sacred sites.",
    backgroundImage:
      "https://images.unsplash.com/photo-1560273436-eaa99ede2d44?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Kanyakumari ocean sunset where three seas meet",
    video: "/video/spiritual and cultural.mp4",
    packageSlug: "mysore-srirangapatna",
    destinations: [
      {
        name: "Chamundi Hills",
        categoryLabel: "Shrine",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Chamundi Hills temple shrine near Mysore",
      },
      {
        name: "Ranganathaswamy Temple",
        categoryLabel: "Srirangapatna",
        image:
          "https://images.unsplash.com/photo-1759851343085-2c52e1d4118d?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Ornate temple gopuram tower with colourful sculptures",
      },
      {
        name: "Kanyakumari",
        categoryLabel: "Pilgrimage",
        image:
          "https://images.unsplash.com/photo-1560273436-eaa99ede2d44?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Kanyakumari ocean sunset where three seas meet",
      },
    ],
  },
  {
    slug: "adventure",
    category: "Adventure &\u00A0Outdoors",
    tag: "✦ Trail & Trek",
    headline: "Trails, peaks and open-air exploring",
    description:
      "Trek to Karnataka's highest summit, walk coffee-estate trails through the clouds and wander misty forest paths — the outdoor side of the Western Ghats.",
    backgroundImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&q=85&auto=format&fit=crop",
    backgroundImageAlt: "Chikmagalur coffee hills trekking misty mountains",
    video: "/video/adventures and outdoors.mp4",
    packageSlug: "chikmagalur",
    destinations: [
      {
        name: "Chikmagalur",
        categoryLabel: "Peak Trek",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Chikmagalur coffee hills trekking misty mountains",
      },
      {
        name: "Coorg",
        categoryLabel: "Estate Trails",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Misty Coorg coffee plantation hills",
      },
      {
        name: "Wayanad",
        categoryLabel: "Forest Trails",
        image:
          "https://images.unsplash.com/photo-1755462518641-96732039dc57?w=1200&q=90&auto=format&fit=crop",
        imageAlt: "Wayanad misty green mountains",
      },
    ],
  },
];
