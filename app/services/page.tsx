"use client";

import FlipCard from "./flip";

type Service = {
  icon: string;
  title: string;
  previewDescription: string;
  largeDescription: string;
};

const coreServices: Service[] = [
  {
    icon: "🧽",
    title: "Window Washing using Traditional Tools",
    previewDescription: "Hand-detailed for a streak-free shine.",
    largeDescription:
      "Professional-grade squeegees, microfiber washers, and eco-friendly soaps are used to scrub and polish fingerprints, grease, and debris. This method is ideal for interior glass, detailed frames, and a mirror-like finish at eye level.",
  },
  {
    icon: "💧",
    title: "Window Washing using 100% Pure Water",
    previewDescription: "Crystal-clear cleaning for hard-to-reach glass.",
    largeDescription:
      "Our carbon filter, reverse osmosis membrane, and deionization resin produce 100% pure water. It evaporates without leaving minerals or residue, creating a spotless finish on exterior and elevated windows.",
  },
];

const specializedServices: Service[] = [
  ["💧", "Hard Water Stain Removal", "Restore the clarity and shine of your glass.", "Our hard water stain removal service safely lifts mineral buildup from windows, glass doors, and other exterior surfaces."],
  ["🧼", "Screen Deep Cleaning", "Refresh screens covered in dust and debris.", "We remove dust, pollen, and embedded debris from window screens for cleaner airflow and clearer natural light."],
  ["🛠️", "Post-Construction Cleanup", "Clear away the mess left after a project.", "We remove construction dust, fingerprints, labels, and job-site residue so your newly finished space is ready to enjoy."],
  ["🧱", "Graffiti Removal Service", "Get exterior surfaces looking like new again.", "We target unwanted paint and markings on appropriate exterior surfaces while taking care to protect the underlying finish."],
  ["🪟", "French & Storm Windows", "Detailed care for specialty window designs.", "We carefully clean specialty window panes, frames, and hard-to-reach details without cutting corners."],
  ["✨", "Glass Door & Mirror Polishing", "Keep high-touch glass bright and spotless.", "We polish glass doors and mirrors to remove smudges, water spots, and buildup for a crisp, streak-free finish."],
  ["💡", "Chandelier Cleaning", "Bring back the sparkle of your light fixtures.", "We carefully remove dust and grime from delicate fixtures and crystal details so your lighting can shine."],
  ["☀️", "Awning & Sunroom Cleaning", "Make your covered outdoor spaces feel fresh.", "We clean awnings, sunrooms, and surrounding glass to remove dust, pollen, and weather-related buildup."],
  ["📦", "Move-In / Move-Out Servicing", "Start or finish a move with a clean property.", "Our detailed service helps renters, homeowners, and property managers create a cleaner, smoother property handoff."],
  ["🪜", "Skylight & Rooftop Glass", "Brighten hard-to-reach glass above your home.", "We clean skylights and rooftop glass with a careful approach designed for elevated and difficult-to-access areas."],
  ["🏡", "General Property Maintenance", "Keep your property looking its best year-round.", "Our general property maintenance service keeps exterior details clean, presentable, and cared for between larger projects."],
].map(([icon, title, previewDescription, largeDescription]) => ({
  icon,
  title,
  previewDescription,
  largeDescription,
}));

function ServiceSection({
  title,
  description,
  services,
}: {
  title: string;
  description: string;
  services: Service[];
}) {
  return (
    <section className="px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-[#200b38] sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-gray-600">{description}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <FlipCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <main className="flex-1">
      <section className="bg-[#200b38] px-8 pb-20 pt-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-semibold sm:text-5xl">Services</h1>
          <p className="mt-3 max-w-2xl">
            Professional exterior cleaning solutions serving the Phoenix metro.
          </p>
        </div>
      </section>
      <ServiceSection
        title="Core Services"
        description="Choose a card to learn more about our two primary window-washing methods."
        services={coreServices}
      />
      <ServiceSection
        title="Specialized Services"
        description="Tap or click any card to explore additional cleaning and maintenance solutions."
        services={specializedServices}
      />
    </main>
  );
}
