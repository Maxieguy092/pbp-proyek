import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  // NOTE: sementara mock total result buat UI (samain vibe mockup)
  const resultsCount = useMemo(() => (q ? 88 : 0), [q]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-center text-3xl font-semibold">Search</h1>
        {q && (
          <p className="mt-2 text-center text-sm sm:text-base text-[#3b6aa8]">
            {resultsCount} results for “{q}”
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-[#d9d9d9] shadow-sm border border-[#e8e8e8]"
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
