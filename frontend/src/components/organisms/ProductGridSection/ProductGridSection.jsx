import { Link } from "react-router-dom";
import Button from "../../atoms/Button/Button";

export default function ProductGridSection({
  id,
  title,
  description,
  to, // optional: link "View All"
  items = 5, // jumlah placeholder
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm sm:text-base text-[#3b6aa8]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-[#d9d9d9] shadow-sm border border-[#e8e8e8]"
          />
        ))}
      </div>

      {to && (
        <div className="flex justify-center">
          <Link to={to}>
            <Button className="mt-8">View All</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
