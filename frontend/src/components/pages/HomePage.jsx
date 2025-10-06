// src/components/pages/HomePage.jsx
import MainLayout from "../templates/MainLayout/MainLayout";
import HeroBanner from "../organisms/HeroBanner/HeroBanner";
import NewArrivalsRow from "../organisms/NewArrivalsRow/NewArrivalsRow";
import ProductGridSection from "../organisms/ProductGridSection/ProductGridSection";

// ⬇️ tambahin ini (path dari /components/pages -> /data = ../../data)
import { shirts, tshirts, pants, outerwear } from "../../data/catalog";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroBanner />
      <NewArrivalsRow />

      <ProductGridSection
        id="shirts"
        title="Shirts"
        description="Kemeja premium untuk tampilan rapi."
        to="/shirts"
        products={shirts}
        limit={5} // ⬅️ tampilkan 5 item aja
      />
      <ProductGridSection
        id="tshirts"
        title="T-Shirts"
        description="Kaos simpel dan versatile."
        to="/t-shirts"
        products={tshirts}
        limit={5}
      />
      <ProductGridSection
        id="pants"
        title="Pants"
        description="Potongan modern & nyaman."
        to="/pants"
        products={pants}
        limit={5}
      />
      <ProductGridSection
        id="outerwear"
        title="Outerwear"
        description="Lapisan stylish yang hangat."
        to="/outerwear"
        products={outerwear}
        limit={5}
      />
    </MainLayout>
  );
}
