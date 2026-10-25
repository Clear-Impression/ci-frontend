export type Service = {
  slug: string;
  title: string;
  previewDescription: string;
  largeDescription: string;
  detailParagraphs: readonly string[];
};

export const coreServices: Service[] = [
  {
    slug: 'window-washing-traditional-tools',
    title: "Traditional Tools",
    previewDescription: "Hand-detailed for a streak-free shine.",
    largeDescription:
      "Professional-grade squeegees, microfiber washers, and eco-friendly soaps are used to scrub and polish fingerprints, grease, and debris. This method is ideal for interior glass, detailed frames, and a mirror-like finish at eye level.",
    detailParagraphs: [
      "Your home is your sanctuary, but living in the Arizona Valley means dealing with constant dust, pollen, and monsoon splatter that quickly dulls your view. At Clear Impression Services, our residential window washing is designed to restore the natural light to your living spaces while protecting the integrity of your glass.",
      "We treat the inside of your home with the utmost respect. Our technicians utilize drop cloths, wear shoe covers, and carefully navigate around your furniture. We use professional-grade squeegees, eco-friendly soaps, and lint-free microfiber cloths to meticulously hand-detail every pane, ensuring that fingerprints, dog smudges, and cooking grease are entirely eliminated.",
      "For the exterior, we deploy state-of-the-art Water Fed Pole (WFP) technology. By utilizing 100% pure, deionized water, we can safely scrub away heavy environmental buildup from the safety of the ground. Because the water contains zero minerals, it dries completely spot-free, leaving a crystal-clear finish that actually stays clean longer since there is no sticky soap residue left behind to attract new dust.",
      "Whether you need a one-time deep clean for an upcoming event or want to join our recurring maintenance schedule to keep your views immaculate year-round, Clear Impression Services is ready to help your home shine.",
    ],
  },
  {
    slug: 'window-washing-100-percent-pure-water',
    title: "100% Pure Water",
    previewDescription: "Crystal-clear cleaning for hard-to-reach glass.",
    largeDescription:
      "Our carbon filter, reverse osmosis membrane, and deionization resin produce 100% pure water. It evaporates without leaving minerals or residue, creating a spotless finish on exterior and elevated windows.",
    detailParagraphs: [
      "Our pure-water window washing system is designed for exterior glass, elevated windows, and areas that are difficult or unsafe to reach with traditional tools.",
      "We filter, reverse-osmosis treat, and deionize the water until it contains no minerals. The purified water loosens dust and environmental buildup, then dries naturally without spots or soap residue.",
    ],
  },
];

type SpecializedServiceData = readonly [
  title: string,
  previewDescription: string,
  largeDescription: string,
  detailParagraphs: readonly string[],
];

const specializedServiceData: readonly SpecializedServiceData[] = [
  [
    "Hard Water Stain Removal",
    "Restore the clarity and shine of your glass.",
    "Our hard water stain removal service safely lifts mineral buildup from windows, glass doors, and other exterior surfaces.",
    [
      "Arizona's hard water can leave mineral deposits that become increasingly difficult to remove over time. Our hard water stain removal service is designed to restore the clarity and shine of affected glass.",
      "We assess the condition of the glass before selecting the appropriate restoration method. Our technicians work carefully to remove buildup while protecting the surrounding frames and surfaces.",
      "This service is ideal for windows, glass doors, shower glass, and other surfaces affected by sprinkler overspray or mineral-rich water.",
    ],
  ],
  ["Screen Deep Cleaning", 
    "Refresh screens covered in dust and debris.", "We remove dust, pollen, and embedded debris from window screens for cleaner airflow and clearer natural light.", 
    [
      "There is nothing more frustrating than paying for beautifully clean windows, only to have the technician place a filthy, dusty screen right back over the glass. Window screens act like giant air filters for your home. As the wind blows, the tiny mesh squares catch an incredible amount of dust, pollen, pet dander, and spiderwebs. When it rains, that trapped dirt splatters directly onto your freshly cleaned glass. At Clear Impression Services, we believe that clean screens are an absolutely essential part of the window washing process. While a quick dry-wipe might knock off the heaviest cobwebs, it does nothing to remove the fine particulate matter embedded in the mesh.",
      "Our deep cleaning process involves safely removing your screens and taking them outside. We gently but thoroughly scrub the mesh using specialized screen-cleaning solutions and soft-bristle brushes to lift the embedded grime. We then rinse them completely and tap them dry before carefully reinstalling them. The result is better airflow, fewer allergens entering your home, and a perfectly unobstructed view through your pristine glass."
    ]
  ],
  ["Post-Construction Cleanup", 
    "Clear away the mess left after a project.", "We remove construction dust, fingerprints, labels, and job-site residue so your newly finished space is ready to enjoy.", 
    [
      "Whether you've just built your dream home or completed a major commercial renovation, the final hurdle is always the cleanup. Construction sites are incredibly messy, and new glass surfaces inevitably become coated in a hazardous mix of thick drywall dust, paint overspray, sloppy silicone caulk, and hardened stucco splatter.",
      "Post-construction window cleaning is a highly specialized skill. Standard cleaning methods will simply smear the silicone or drag abrasive cement dust across the pane, causing thousands of micro-scratches that permanently ruin brand-new, expensive windows. Clear Impression Services has the expertise and the specialized tools required to safely restore new glass.",
      "We start by chemically softening heavy adhesives and paints using glass-safe solvents. We then use professional-grade, single-edge surgical steel scrapers to carefully lift stucco and overspray from the surface, ensuring the blade is always properly angled and lubricated to prevent scratching. Finally, we perform a deep wash and squeegee finish to reveal the flawless new glass underneath."
    ]
  ],
  ["Graffiti Removal Service", "Get exterior surfaces looking like new again.", "We target unwanted paint and markings on appropriate exterior surfaces while taking care to protect the underlying finish.", 
    [
      "Waking up to find your business storefront or commercial property tagged with graffiti is incredibly stressful. Vandalism not only damages your property's curb appeal, but it can also make customers feel unsafe and negatively impact your daily revenue. When it comes to graffiti, time is of the essence. The longer spray paint or industrial markers are allowed to bake into the glass under the Arizona sun, the harder they are to remove.",
      "Clear Impression Services provides rapid, discreet graffiti removal specifically targeted for glass surfaces. Trying to scrape away dried spray paint with improper tools usually results in severe scratching, while over-the-counter chemicals can permanently damage window frames and rubber seals.",
      "Our technicians use commercial-grade, eco-friendly solvents that are specially formulated to break the molecular bond of aerosol paints and heavy inks without degrading the underlying glass or window tinting. We carefully dissolve the vandalism, lift it safely away, and perform a full window wash to ensure your storefront looks exactly as it did before the incident occurred."
    ]
  ],
  ["French & Storm Windows", "Detailed care for specialty window designs.", "We carefully clean specialty window panes, frames, and hard-to-reach details without cutting corners.",
    [
      "True divided-light French windows (often called \"cut-ups\") add incredible architectural charm to a home, but they are an absolute nightmare to clean. Instead of one large pane of glass, a single French window can consist of 10, 15, or even 20 individual tiny squares of glass, each framed by wooden or vinyl muntins. Similarly, older homes often feature storm windows, which involve multiple layers of glass that trap dust and dead insects in the dead space between them.",
      "Clear Impression Services has the patience and precision required to handle these complex setups. For French panes, standard large squeegees are useless. We use specialized, small-format tools and perform extensive hand-detailing to ensure every single corner of every single square is free of soapy residue and dirty water drips.",
      "For storm windows, we carefully disassemble the outer panes, taking great care not to damage aging hardware. We thoroughly clean the inner glass, the dead space, and the outer glass before reassembling the unit properly so that your home retains its aesthetic charm and its weatherproofing integrity."
    ]
  ],
  ["Glass Door & Mirror Polishing", "Keep high-touch glass bright and spotless.", "We polish glass doors and mirrors to remove smudges, water spots, and buildup for a crisp, streak-free finish.", 
    [
      "Exterior windows aren't the only glass surfaces that need professional attention. Inside your home or business, heavy-traffic areas accumulate grease, oils, and smudges at a rapid pace. Sliding patio doors become covered in wet dog noses and sticky toddler hands, while heavy glass shower enclosures build up thick layers of soap scum. In a commercial setting, large gym mirrors, dance studio walls, and salon vanity mirrors must be kept flawlessly reflective to serve their purpose.",
      "Clear Impression Services extends our professional glass detailing to these crucial interior surfaces. Standard glass cleaners and paper towels simply push body oils and grease around, leaving behind a hazy, streaky mess that looks worse than when you started.",
      "We use professional-grade degreasers and lint-free polishing techniques to completely lift heavy soils from sliding doors, entryways, and large mirrored walls. We leave behind a brilliantly clear, flawlessly polished surface that makes interior rooms feel larger, brighter, and significantly cleaner."
    ]
  ],
  ["Chandelier Cleaning", "Bring back the sparkle of your light fixtures.", "We carefully remove dust and grime from delicate fixtures and crystal details so your lighting can shine.",
    [
      "A grand chandelier is meant to be the breathtaking centerpiece of a room, refracting light and creating an atmosphere of elegance. However, due to their height and intricate designs, chandeliers are massive dust traps. When a thick layer of airborne dust, cooking grease, and cobwebs coats the crystal, the light becomes dull, muted, and yellowed, completely ruining the fixture's aesthetic appeal.",
      "Cleaning a chandelier is a daunting, dangerous task for a homeowner, involving tall ladders and incredibly fragile pieces. Clear Impression Services offers specialized, high-dusting and chandelier detailing to safely restore your lighting's brilliance.",
      "We lay down heavy drop cloths to protect your flooring and furniture beneath the fixture. Instead of aggressively spraying harsh chemicals that can tarnish the metal framework or short out the electrical components, our technicians meticulously hand-wipe individual crystals, glass shades, and metal arms. We use specialized glass-safe solutions and microfiber detailing cloths to ensure every facet catches the light perfectly once again."
    ]
  ],
  ["Awning & Sunroom Cleaning", "Make your covered outdoor spaces feel fresh.", "We clean awnings, sunrooms, and surrounding glass to remove dust, pollen, and weather-related buildup.", 
    [
      "Sunrooms and custom awnings are fantastic additions that allow you to enjoy the beauty of the outdoors while staying protected from the harsh Arizona sun. Unfortunately, because these structures feature large, horizontal, or slanted surfaces, they take the absolute brunt of environmental fallout. Glass ceilings become completely obscured by fallen leaves, thick pollen, and bird droppings, while fabric and vinyl awnings quickly develop dark streaks of dirt, mold, and mildew.",
      "Clear Impression Services provides comprehensive cleaning for these specialized outdoor structures. For glass sunrooms, greenhouses, and solariums, we safely utilize our pure water-fed pole systems to reach overhead panes, aggressively scrubbing away heavy environmental debris while rinsing the glass to a spot-free finish without requiring our technicians to bear weight on delicate roofing panels.",
      "For fabric and vinyl awnings, high-pressure washing can rip the material to shreds. Instead, we use a gentle \"soft-wash\" technique, applying specialized detergents to safely lift dirt and organic growth, followed by a low-pressure rinse that restores the vibrant color of the awning without causing any structural damage."
    ]
  ],
  ["Move-In / Move-Out Servicing", "Start or finish a move with a clean property.", "Our detailed service helps renters, homeowners, and property managers create a cleaner, smoother property handoff.", 
    [
      "The real estate market moves fast, and first impressions dictate property values. Whether you are a homeowner preparing to list your house for sale, a property manager turning over a rental unit, or a family finally moving into your dream home, the cleanliness of the property sets the entire tone of the transition. Nothing makes a space feel dirtier or smaller than looking through grimy, cobweb-covered windows.",
      "Clear Impression Services offers comprehensive Move-In and Move-Out detailing packages. When preparing a home for listing photos or open houses, sparkling clean windows immediately make the rooms look larger, brighter, and meticulously maintained, which can directly translate to higher offers and faster sales.",
      "Our turnover service is a total reset for the property's glass. We don't just hit the main windows; our team performs a deep clean of all interior and exterior glass, aggressively details the window tracks to remove years of built-up mud and hair, and deeply washes the screens. Hand over the keys with confidence, knowing the property is shining."
    ]
  ],
  ["Skylight & Rooftop Glass", "Brighten hard-to-reach glass above your home.", "We clean skylights and rooftop glass with a careful approach designed for elevated and difficult-to-access areas.",
    [
      "Skylights are an incredible architectural feature, designed to flood dark hallways, bathrooms, and living areas with beautiful, natural sunlight. However, due to their positioning directly facing the sky, they are entirely exposed to the elements. Over a single season, skylights become completely caked in layers of tree sap, falling leaves, thick dust, and acidic bird droppings, severely diminishing the amount of light that actually enters your home.",
      "Because they are difficult and dangerous to reach, skylights are often completely neglected by homeowners. Clear Impression Services takes the risk out of rooftop glass maintenance. Our technicians are trained in safe roof access and maneuvering, ensuring that we clean your glass without causing damage to your delicate shingles or roof tiles.",
      "We use heavy-duty scrubbers and pure water systems to cut through the baked-on grime that accumulates on domed and flat skylights. By the time we are finished, the difference in the interior lighting of your home is often night and day. Add skylight cleaning to your regular window maintenance package to keep your home bright and welcoming."
    ]
  ],
  ["General Property Maintenance", "Keep your property looking its best year-round.", "Our general property maintenance service keeps exterior details clean, presentable, and cared for between larger projects.", 
    [
      "A truly beautiful property requires attention to more than just the glass. While window washing is our primary expertise, Clear Impression Services understands that the surrounding elements of your home or commercial building drastically impact its overall curb appeal. There is no point in having flawlessly clear windows if the frames are surrounded by thick spiderwebs and the exterior patio lights are full of dead bugs.",
      "To provide a complete aesthetic upgrade, we offer supplemental exterior property maintenance. While our technicians are on-site, we can be contracted to perform comprehensive high-dusting, using specialized extension poles to sweep away wasp nests and heavy cobwebs from your eaves, soffits, and entryways. We also offer exterior light fixture detailing, carefully wiping down the glass lanterns and sconces around your doors and garage to ensure they shine brightly at night. If your property has unique exterior cleaning needs, let us know. We are happy to build a customized, recurring maintenance schedule that addresses all of your exterior detailing needs in one seamless visit."
    ]
  ],
];

export const specializedServices: Service[] = specializedServiceData.map(
  ([title, previewDescription, largeDescription, detailParagraphs]) => ({
  slug: title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, ''),
  title,
  previewDescription,
  largeDescription,
  detailParagraphs: detailParagraphs ?? [largeDescription],
  }),
);

export const services = [...coreServices, ...specializedServices];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
