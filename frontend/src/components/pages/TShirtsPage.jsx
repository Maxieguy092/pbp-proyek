// src/components/pages/TShirtsPage.jsx
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { tshirts } from "../../data/catalog";

export default function TShirtsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-8">T-Shirts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tshirts.map((p) => (
            <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
