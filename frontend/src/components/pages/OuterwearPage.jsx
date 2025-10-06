// src/components/pages/OuterwearPage.jsx
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { outerwear } from "../../data/catalog";

export default function OuterwearPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-8">Outerwear</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {outerwear.map((p) => (
            <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
