// src/components/Navbar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavbarStyles.css"; 

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h2>My Fridge Inventory</h2>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? "active-link" : ""
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? "active-link" : ""
          }
        >
          Inventory
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
