// src/components/organisms/HeroBanner/HeroBanner.jsx
export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className="w-full rounded-2xl h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/images/hero.jpg")' }}
        role="img"
        aria-label="Hero banner koleksi terbaru"
      ></div>
    </section>
  );
}
