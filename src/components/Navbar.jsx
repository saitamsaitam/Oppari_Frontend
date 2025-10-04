// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css"; // optional for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>My Fridge Inventory</h2>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "active-link" : ""}>Home</NavLink>
        <NavLink to="/inventory" className={({isActive}) => isActive ? "active-link" : ""}>Inventory</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
