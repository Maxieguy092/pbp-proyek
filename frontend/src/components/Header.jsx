import React from "react";
import "./Header.css";
import UserIcon from "../assets/user.svg";
import CartIcon from "../assets/cart.svg";
import SearchIcon from "../assets/search.svg";

function Header() {
  return (
    <header className="header">
      {/* kiri kosong */}
      <div className="header-left"></div>

      {/* judul */}
      <h1 className="header-title">Nama Website</h1>

      {/* kanan: ikon-ikon */}
      <div className="header-right">
        <img src={SearchIcon} alt="Search" className="icon" />
        <img src={CartIcon} alt="Cart" className="icon" />
        <img src={UserIcon} alt="User" className="icon" />
      </div>
    </header>
  );
}

export default Header;
