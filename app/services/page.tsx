import FlipCard from "./flip";

export default function Services() {
  return (
    <main className="flex-1">
      {/* Extend header section down, similar to the about page */}
      
      <section className="bg-[#200b38] pb-24 pt-16 px-8 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-semibold">Services</h1>

          <p className="text">
            Professional exterior cleaning solutions serving the Phoenix metro.
          </p>
        </div>
      </section>


      <section className="-mt-12 pt-28 pb-28 px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <FlipCard
            title="Residential Window Washing"
            previewDescription="Keep your windows clean and free of debris."
            largeDescription="largeDescription"
          />
          <FlipCard
            title="Commercial & Office Glass"
            previewDescription="Keep your business looking sharp."
            largeDescription="largeDescription"
          />
          <FlipCard
            title="Solar Panel Cleaning"
            previewDescription="Keep your solar panels working efficiently."
            largeDescription="largeDescription"
          />
        </div>
      </section>
    </main>
  );
}
