export default function NewArrivalsRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">New Arrivals</h2>
        <p className="mt-2 text-sm sm:text-base text-[#3b6aa8]">
          Temukan koleksi terbaru dengan desain segar yang siap lengkapi gaya
          harianmu.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-[#d9d9d9] shadow-sm border border-[#e8e8e8]"
          />
        ))}
      </div>
    </section>
  );
}
