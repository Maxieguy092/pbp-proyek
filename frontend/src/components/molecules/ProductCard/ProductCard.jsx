import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  name,
  category,
  price,
  imageUrl,
  images = [],
}) {
  const fallback = "/images/fallback.jpg";
  const BASE_URL = "http://localhost:5000";

  const finalImageUrl =
    (imageUrl && imageUrl.trim() !== "" ? imageUrl : images[0]) || fallback;

  const displayImage = finalImageUrl.startsWith("http")
    ? finalImageUrl
    : `${BASE_URL}/${finalImageUrl}`;

  return (
    <Link to={`/products/${id}`} className="group block">
      <div className="aspect-square rounded-2xl overflow-hidden bg-[#f2f2f2] shadow-sm border border-[#e8e8e8]">
        <img
          src={displayImage}
          alt={name || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-black">
            {name || "Product Name"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{category || "Category"}</p>
        </div>
        <p className="text-sm font-medium text-gray-500">
          {typeof price === "number"
            ? `Rp ${price.toLocaleString("id-ID")}`
            : price || "Rp —"}
        </p>
      </div>
    </Link>
  );
}
