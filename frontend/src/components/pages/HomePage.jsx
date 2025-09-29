import MainLayout from "../templates/MainLayout/MainLayout";
import HeroBanner from "../organisms/HeroBanner/HeroBanner";
import NewArrivalsRow from "../organisms/NewArrivalsRow/NewArrivalsRow";
import ProductGridSection from "../organisms/ProductGridSection/ProductGridSection";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroBanner />

      {/* New Arrivals tetap di paling atas */}
      <NewArrivalsRow />

      {/* Katalog lain, scroll ke bawah */}
      <ProductGridSection
        id="shirts"
        title="Shirts"
        description="Kemeja premium untuk tampilan rapi, nyaman dipakai dari pagi hingga malam."
        to="/shirts"
      />
      <ProductGridSection
        id="tshirts"
        title="T-Shirts"
        description="Kaos simpel dan versatile, mudah dipadu-padankan untuk setiap kesempatan."
        to="/t-shirts"
      />
      <ProductGridSection
        id="pants"
        title="Pants"
        description="Celana dengan potongan modern dan bahan nyaman, cocok untuk gaya formal maupun kasual."
        to="/pants"
      />
      <ProductGridSection
        id="outerwear"
        title="Outerwear"
        description="Lapisan stylish untuk melengkapi penampilan—hangat, ringan, dan penuh karakter."
        to="/outerwear"
      />
    </MainLayout>
  );
}
