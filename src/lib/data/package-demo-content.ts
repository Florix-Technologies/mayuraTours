import type { TourPackage } from "./packages";

/** DESIGN PLACEHOLDERS ONLY. Never use these values for pricing, checkout or promises.
 * Verified package fields take priority. Replace independently as client content arrives. */
export type PackageDemoContent = {
  overview: string;
  highlights: NonNullable<TourPackage["highlights"]>;
  itinerary: NonNullable<TourPackage["itinerary"]>;
  included: NonNullable<TourPackage["included"]>;
  excluded: NonNullable<TourPackage["excluded"]>;
};

export const packageDemoContent: Record<string, PackageDemoContent> = {
  "goa": {
    "overview": "A coastal escape with time for Goa's beaches, Portuguese heritage and unhurried evenings. This sample outline balances sightseeing with independent time by the sea.",
    "highlights": [
      {
        "title": "Coastal mornings",
        "description": "Imagine a relaxed beach visit around North Goa, with time to explore the shoreline at your own pace."
      },
      {
        "title": "Goa's heritage",
        "description": "A sample cultural stop at Bom Jesus Basilica adds a different perspective to the coastal journey."
      },
      {
        "title": "Fort and sunset views",
        "description": "A sample Fort Aguada visit pairs coastal history with views over the Arabian Sea."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrive and find your coastal rhythm",
        "description": "Sample plan: arrive in Goa, settle into the hotel and spend the afternoon around Calangute. Allow time for an independent evening walk."
      },
      {
        "day": "Day 2",
        "title": "Beaches and heritage",
        "description": "Sample plan: explore North and South Goa beach areas, with a proposed visit to Bom Jesus Basilica and Fort Aguada. The order and operating times need confirmation."
      },
      {
        "day": "Day 3",
        "title": "A slower farewell",
        "description": "Sample plan: enjoy breakfast, leave time for a final coastal stroll and prepare for the return journey. Departure arrangements need confirmation."
      }
    ],
    "included": [
      {
        "title": "Comfortable AC transfers",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Deluxe hotel stay",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Selected breakfasts",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  },
  "ooty-coonoor": {
    "overview": "An easy-paced Nilgiri journey through tea slopes, hillside viewpoints and Ooty's gardens. The sample itinerary keeps a free day for personal exploring.",
    "highlights": [
      {
        "title": "Tea-country landscapes",
        "description": "A sample visit through the Nilgiri tea slopes offers gentle walks and views over the green valleys."
      },
      {
        "title": "Ooty's high viewpoints",
        "description": "Doddabetta is a proposed stop in this preview, with time to appreciate the hillside landscape."
      },
      {
        "title": "Coonoor at your pace",
        "description": "Sim's Park and a proposed railway experience give the sample journey a relaxed rhythm; rail availability needs confirmation."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrive in the Nilgiris",
        "description": "Sample plan: travel to Ooty, check in and enjoy a relaxed orientation around the town."
      },
      {
        "day": "Day 2",
        "title": "Doddabetta and tea slopes",
        "description": "Sample plan: take in Doddabetta viewpoint and spend time around the tea-country landscape, subject to weather."
      },
      {
        "day": "Day 3",
        "title": "Discover Coonoor",
        "description": "Sample plan: explore Coonoor and Sim's Park at a comfortable pace."
      },
      {
        "day": "Day 4",
        "title": "A railway perspective",
        "description": "Sample plan: leave time for a Nilgiri Mountain Railway experience, subject to ticket availability and confirmation."
      },
      {
        "day": "Day 5",
        "title": "A day of your own",
        "description": "Sample plan: enjoy the existing free-day concept with independent exploring or time to relax at the hotel."
      },
      {
        "day": "Day 6",
        "title": "Return with mountain memories",
        "description": "Sample plan: breakfast and check-out, followed by return travel. Final pickup and departure timings need confirmation."
      }
    ],
    "included": [
      {
        "title": "Comfortable coach travel",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Sample 3-star hotel stay",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Selected breakfasts",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  },
  "mysore-srirangapatna": {
    "overview": "A day shaped around royal architecture, local history and garden landscapes. This sample outline follows the existing same-day journey from Bengaluru.",
    "highlights": [
      {
        "title": "Royal Mysore",
        "description": "A proposed palace visit celebrates the architecture and heritage already featured in the package overview."
      },
      {
        "title": "Island-fortress history",
        "description": "A sample stop in Srirangapatna brings the region's historical landscape into the journey."
      },
      {
        "title": "Gardens and hill views",
        "description": "Chamundi Hills and Brindavan Gardens provide a varied finish to the sample day."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "A day of heritage",
        "description": "Sample plan: depart Bengaluru at the existing advertised 7:30 AM, visit the Mysore Palace and Chamundi Hills, explore Srirangapatna and finish with Brindavan Gardens before returning. The visit order and access need confirmation."
      }
    ],
    "included": [
      {
        "title": "Comfortable AC coach",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Same-day trip; no overnight stay",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Meal arrangements to confirm",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  },
  "coorg": {
    "overview": "A slower coffee-country break, with forested hills, waterfall scenery and time around Coorg's estates. This is a sample route for visual preview, not a confirmed programme.",
    "highlights": [
      {
        "title": "Coffee-estate atmosphere",
        "description": "A sample estate walk invites time to appreciate Coorg's greenery and coffee-growing landscape."
      },
      {
        "title": "Abbey Falls scenery",
        "description": "A proposed waterfall stop gives the sample journey a refreshing outdoor interlude."
      },
      {
        "title": "Raja's Seat and Bhagamandala",
        "description": "A sample route brings viewpoints and the temple confluence into a balanced travel day."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Settle into coffee country",
        "description": "Sample plan: arrive in Coorg, settle into the estate stay and enjoy a relaxed orientation."
      },
      {
        "day": "Day 2",
        "title": "Waterfalls and viewpoints",
        "description": "Sample plan: visit Abbey Falls and Raja's Seat, with time between stops to enjoy the landscape."
      },
      {
        "day": "Day 3",
        "title": "The temple confluence",
        "description": "Sample plan: explore Bhagamandala and allow time for an estate-area walk, subject to local access."
      },
      {
        "day": "Day 4",
        "title": "A relaxed return",
        "description": "Sample plan: breakfast and check-out before the return journey. Transfer timings need confirmation."
      }
    ],
    "included": [
      {
        "title": "Comfortable AC transfers",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Sample estate stay",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Selected breakfasts",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  },
  "kerala-munnar": {
    "overview": "A sample journey from Munnar's tea-country hills to Kerala's waterways. The preview links the destinations already described in the package without promising a final schedule.",
    "highlights": [
      {
        "title": "Munnar tea hills",
        "description": "A proposed hillside day focuses on tea-estate landscapes and a comfortable pace."
      },
      {
        "title": "Alleppey on the water",
        "description": "A sample houseboat experience introduces the backwaters; boat category and timings need confirmation."
      },
      {
        "title": "Nature and Kochi",
        "description": "Proposed Periyar and Kochi visits add wildlife scenery and waterfront time to the sample route."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrive and travel to Munnar",
        "description": "Sample plan: arrival transfer to Munnar and a relaxed check-in after travel."
      },
      {
        "day": "Day 2",
        "title": "Explore tea-country landscapes",
        "description": "Sample plan: spend time around Munnar's tea slopes and viewpoints, subject to local access and weather."
      },
      {
        "day": "Day 3",
        "title": "A slower mountain morning",
        "description": "Sample plan: additional time in Munnar for independent exploring before onward travel arrangements."
      },
      {
        "day": "Day 4",
        "title": "Periyar nature day",
        "description": "Sample plan: explore the Periyar area. Wildlife activities, permits and availability need confirmation."
      },
      {
        "day": "Day 5",
        "title": "Alleppey backwaters",
        "description": "Sample plan: a proposed houseboat cruise around Alleppey; the boat type, meals and duration need confirmation."
      },
      {
        "day": "Day 6",
        "title": "Kochi waterfront time",
        "description": "Sample plan: travel towards Kochi with relaxed time around its waterfront areas."
      },
      {
        "day": "Day 7",
        "title": "The journey home",
        "description": "Sample plan: breakfast and departure transfer. Final route and travel timings need confirmation."
      }
    ],
    "included": [
      {
        "title": "Comfortable AC transfers",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Sample hotel and houseboat arrangements",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Selected meals to confirm",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  },
  "chikmagalur": {
    "overview": "An adventurous sample break through coffee estates and Karnataka's mountain landscapes, with proposed nature and heritage stops from the existing package overview.",
    "highlights": [
      {
        "title": "Mullayanagiri views",
        "description": "A proposed visit towards Karnataka's highest peak balances scenic views with weather-dependent walking."
      },
      {
        "title": "Coffee-estate character",
        "description": "A sample coffee-country visit creates space for a slower look at the landscape."
      },
      {
        "title": "Nature and Hoysala heritage",
        "description": "Proposed Bhadra-area and Belur stops add variety; access and the final route need confirmation."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Into the coffee hills",
        "description": "Sample plan: arrive in Chikmagalur, settle into the resort and enjoy time around the coffee-country landscape."
      },
      {
        "day": "Day 2",
        "title": "A mountain day",
        "description": "Sample plan: head towards Mullayanagiri for a weather-dependent walk, then return for a relaxed afternoon. Trek access and suitability need confirmation."
      },
      {
        "day": "Day 3",
        "title": "Nature, heritage and return",
        "description": "Sample plan: proposed Bhadra-area and Belur stops before the return journey, subject to timing, access and the final approved route."
      }
    ],
    "included": [
      {
        "title": "Comfortable scheduled transfers",
        "description": "Sample arranged transportation between the planned stops; vehicle and timings need confirmation."
      },
      {
        "title": "Sample coffee resort stay",
        "description": "Sample stay arrangement for this design preview; property and room category need confirmation."
      },
      {
        "title": "Destination sightseeing",
        "description": "Sample guided or coordinated visits to the places outlined in the preview itinerary."
      },
      {
        "title": "Selected breakfasts",
        "description": "Sample meal arrangement only; the final meal plan will be specified by Mayura."
      },
      {
        "title": "Travel assistance",
        "description": "Sample on-trip coordination and driver support during scheduled transfers."
      }
    ],
    "excluded": [
      {
        "title": "Personal purchases",
        "description": "Sample exclusion: shopping, laundry and personal expenses."
      },
      {
        "title": "Optional experiences",
        "description": "Sample exclusion: activities outside the final confirmed itinerary."
      },
      {
        "title": "Entry tickets",
        "description": "Sample exclusion: attraction tickets unless expressly included in the final package."
      },
      {
        "title": "Additional meals",
        "description": "Sample exclusion: meals and beverages outside the confirmed meal plan."
      }
    ]
  }
};
