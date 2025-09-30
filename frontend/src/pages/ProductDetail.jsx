import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./ProductDetail.css";

import Header from "../components/Header";
import UserNavbar from "../components/UserNavbar";

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);

  // Placeholder images
  const images = [1, 2, 3, 4];

  return (
    <div className="product-page">
      {/* Atas: Header & Navbar */}
      <Header />
      <UserNavbar />

      {/* Detail Produk */}
      <div className="product-detail">
        {/* LEFT: IMAGE SLIDER */}
        <div className="product-images">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
          >
            {images.map((num) => (
              <SwiperSlide key={num}>
                <div className="placeholder-image">{num}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


        {/* RIGHT: PRODUCT INFO */}
        <div className="product-info">
          <h2 className="product-title">Baju Baju - Warna</h2>
          <p className="price">IDR 999,000.00</p>


          {/* SIZE SELECTOR */}
          <div className="size-selector">
            <p>Size</p>
            <div className="size-options">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>


          {/* QUANTITY */}
          <div className="quantity">
            <label>Quantity</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className="add-to-cart">Add to cart</button>

          {/* DESCRIPTION */}
          <div className="description">
            <h4>Description</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
