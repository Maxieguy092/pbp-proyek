// src/data/catalog.js
// Satu sumber kebenaran (single source of truth) untuk semua produk.
// NOTE: Semua path gambar diasumsikan ada di /public/images/... dan diakses dengan "/images/...".

// ---------- T-SHIRTS ----------
export const tshirts = [
  {
    id: 101,
    name: "Boxy Tee Black",
    price: 159000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-1.jpg",
    images: [
      "/images/t-shirts-1.jpg",
      "/images/t-shirts-1b.jpg",
      "/images/t-shirts-1c.jpg",
      "/images/t-shirts-1d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    description:
      "Kaos boxy fit 240gsm, nyaman dipakai harian, warna deep black anti pudar.",
  },
  {
    id: 102,
    name: "Boxy Tee Cream",
    price: 159000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-2.jpg",
    images: [
      "/images/t-shirts-2.jpg",
      "/images/t-shirts-2b.jpg",
      "/images/t-shirts-2c.jpg",
      "/images/t-shirts-2d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    description:
      "Kaos boxy fit tone krem kalem, bahan tebal jatuh dan tidak menerawang.",
  },
  {
    id: 103,
    name: "Graphic Tee Blue",
    price: 179000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-3.jpg",
    images: [
      "/images/t-shirts-3.jpg",
      "/images/t-shirts-3b.jpg",
      "/images/t-shirts-3c.jpg",
      "/images/t-shirts-3d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 9,
    description:
      "Graphic tee biru dengan sablon plastisol tajam dan tahan cuci.",
  },
  {
    id: 104,
    name: "Oversized Tee Grey",
    price: 169000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-4.jpg",
    images: [
      "/images/t-shirts-4.jpg",
      "/images/t-shirts-4b.jpg",
      "/images/t-shirts-4c.jpg",
      "/images/t-shirts-4d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    description:
      "Oversized tee abu, cutting loose untuk look santai tapi tetap rapi.",
  },
  {
    id: 105,
    name: "Vintage Tee Navy",
    price: 169000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-5.jpg",
    images: [
      "/images/t-shirts-5.jpg",
      "/images/t-shirts-5b.jpg",
      "/images/t-shirts-5c.jpg",
      "/images/t-shirts-5d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    description: "Nuansa vintage navy, treatment washed lembut dan nyaman.",
  },
  {
    id: 106,
    name: "Rib Tee Cream",
    price: 169000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-6.jpg",
    images: [
      "/images/t-shirts-6.jpg",
      "/images/t-shirts-6b.jpg",
      "/images/t-shirts-6c.jpg",
      "/images/t-shirts-6d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 11,
    description: "Ribbed tee tekstur halus, stretch pas di badan.",
  },
  {
    id: 107,
    name: "Pocket Tee Olive",
    price: 169000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-7.jpg",
    images: [
      "/images/t-shirts-7.jpg",
      "/images/t-shirts-7b.jpg",
      "/images/t-shirts-7c.jpg",
      "/images/t-shirts-7d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 13,
    description:
      "Kaos dengan saku dada, warna olive earth-tone yang gampang di-mix.",
  },
  {
    id: 108,
    name: "Heavyweight Tee",
    price: 169000,
    category: "T-Shirts",
    imageUrl: "/images/t-shirts-8.jpg",
    images: [
      "/images/t-shirts-8.jpg",
      "/images/t-shirts-8b.jpg",
      "/images/t-shirts-8c.jpg",
      "/images/t-shirts-8d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 16,
    description:
      "Heavyweight 260gsm, bentuk tetap rapih setelah banyak pencucian.",
  },
];

// ---------- SHIRTS ----------
export const shirts = [
  {
    id: 201,
    name: "Oxford Shirt Blue",
    price: 299000,
    category: "Shirts",
    imageUrl: "/images/shirt-1.jpg",
    images: [
      "/images/shirt-1.jpg",
      "/images/shirt-1b.jpg",
      "/images/shirt-1c.jpg",
      "/images/shirt-1d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    description:
      "Kemeja oxford biru, tekstur khas dan breathable untuk daily smart look.",
  },
  {
    id: 202,
    name: "Oxford Shirt White",
    price: 299000,
    category: "Shirts",
    imageUrl: "/images/shirt-2.jpg",
    images: [
      "/images/shirt-2.jpg",
      "/images/shirt-2b.jpg",
      "/images/shirt-2c.jpg",
      "/images/shirt-2d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    description: "Kemeja oxford putih versatile, cocok formal maupun casual.",
  },
  {
    id: 203,
    name: "Linen Shirt Sand",
    price: 329000,
    category: "Shirts",
    imageUrl: "/images/shirt-3.jpg",
    images: [
      "/images/shirt-3.jpg",
      "/images/shirt-3b.jpg",
      "/images/shirt-3c.jpg",
      "/images/shirt-3d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    description:
      "Linen sand sejuk, pas untuk cuaca tropis—ringan dan agak tekstur.",
  },
  {
    id: 204,
    name: "Denim Shirt Dark",
    price: 349000,
    category: "Shirts",
    imageUrl: "/images/shirt-4.jpg",
    images: [
      "/images/shirt-4.jpg",
      "/images/shirt-4b.jpg",
      "/images/shirt-4c.jpg",
      "/images/shirt-4d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    description: "Kemeja denim dark wash, durable dengan jahitan rapi.",
  },
];

// ---------- PANTS ----------
export const pants = [
  {
    id: 301,
    name: "Chino Slim Khaki",
    price: 279000,
    category: "Pants",
    imageUrl: "/images/pants-1.jpg",
    images: [
      "/images/pants-1.jpg",
      "/images/pants-1b.jpg",
      "/images/pants-1c.jpg",
      "/images/pants-1d.jpg",
    ],
    sizes: ["28", "29", "30", "31", "32", "33", "34", "36"],
    stock: 14,
    description: "Chino slim fit warna khaki, bahan stretch nyaman gerak.",
  },
  {
    id: 302,
    name: "Chino Slim Navy",
    price: 279000,
    category: "Pants",
    imageUrl: "/images/pants-2.jpg",
    images: [
      "/images/pants-2.jpg",
      "/images/pants-2b.jpg",
      "/images/pants-2c.jpg",
      "/images/pants-2d.jpg",
    ],
    sizes: ["28", "29", "30", "31", "32", "33", "34", "36"],
    stock: 12,
    description: "Chino slim navy, gampang dipadu sama sneakers atau loafers.",
  },
  {
    id: 303,
    name: "Relaxed Cargo Olive",
    price: 299000,
    category: "Pants",
    imageUrl: "/images/pants-3.jpg",
    images: [
      "/images/pants-3.jpg",
      "/images/pants-3b.jpg",
      "/images/pants-3c.jpg",
      "/images/pants-3d.jpg",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 10,
    description:
      "Celana cargo relaxed, banyak kantong fungsional—outdoor friendly.",
  },
  {
    id: 304,
    name: "Denim Straight Blue",
    price: 329000,
    category: "Pants",
    imageUrl: "/images/pants-4.jpg",
    images: [
      "/images/pants-4.jpg",
      "/images/pants-4b.jpg",
      "/images/pants-4c.jpg",
      "/images/pants-4d.jpg",
    ],
    sizes: ["28", "29", "30", "31", "32", "33", "34", "36"],
    stock: 9,
    description:
      "Jeans straight cutting klasik, mid blue wash, tebal tapi tetap fleksibel.",
  },
];

// ---------- OUTERWEAR ----------
export const outerwear = [
  {
    id: 401,
    name: "Coach Jacket Black",
    price: 399000,
    category: "Outerwear",
    imageUrl: "/images/outer-1.jpg",
    images: [
      "/images/outer-1.jpg",
      "/images/outer-1b.jpg",
      "/images/outer-1c.jpg",
      "/images/outer-1d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 7,
    description: "Coach jacket hitam, wind-resistant dengan lining tipis.",
  },
  {
    id: 402,
    name: "Hoodie Heavy Cream",
    price: 329000,
    category: "Outerwear",
    imageUrl: "/images/outer-2.jpg",
    images: [
      "/images/outer-2.jpg",
      "/images/outer-2b.jpg",
      "/images/outer-2c.jpg",
      "/images/outer-2d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    description: "Hoodie heavyweight, lembut dalamnya, jatuh bagus dan hangat.",
  },
  {
    id: 403,
    name: "Windbreaker Navy",
    price: 369000,
    category: "Outerwear",
    imageUrl: "/images/outer-3.jpg",
    images: [
      "/images/outer-3.jpg",
      "/images/outer-3b.jpg",
      "/images/outer-3c.jpg",
      "/images/outer-3d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 11,
    description: "Windbreaker navy ringan, cocok buat commuting dan lari sore.",
  },
  {
    id: 404,
    name: "Denim Jacket Mid",
    price: 449000,
    category: "Outerwear",
    imageUrl: "/images/outer-4.jpg",
    images: [
      "/images/outer-4.jpg",
      "/images/outer-4b.jpg",
      "/images/outer-4c.jpg",
      "/images/outer-4d.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    description:
      "Jaket denim mid-wash, build sturdy, cocok layered dengan tee/hoodie.",
  },
];

// ---------- UTILITIES ----------
export const allProducts = [...tshirts, ...shirts, ...pants, ...outerwear];

export const productsById = Object.fromEntries(
  allProducts.map((p) => [String(p.id), p])
);

export function getProductById(id) {
  return productsById[String(id)] ?? null;
}

// Shuffle util (kalau mau randomized di New Arrivals)
export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
