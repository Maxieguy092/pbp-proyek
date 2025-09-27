import React from "react";
import './Navbar.css'

const Navbar = () => {
    return (
        <div className="navbar">
            <ul className="navbar-menu">
                <li>New Arrivals</li>
                <li>Shirts</li>
                <li>T-Shirts</li>
                <li>Pants</li>
                <li>Outerwear</li>
            </ul>
            <button>View All</button>
        </div>
    )
}

export default Navbar