import FlipCard from "./flip";

export default function Services() {
  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold">Services</h1>

      <p className="text-xl">
        Professional exterior cleaning solutions serving the Phoenix metro.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <FlipCard
          title="Residential Window Washing"
          description="Keep your windows clean and free of debris."
          largeDescription="largeDescription"
        />
        <FlipCard
          title="Commercial & Office Glass"
          description="Keep your business looking sharp."
          largeDescription="largeDescription"
        />
        <FlipCard
          title="Solar Panel Cleaning"
          description="Keep your solar panels working efficiently."
          largeDescription="largeDescription"
        />
      </div>
    </main>
  );
}
