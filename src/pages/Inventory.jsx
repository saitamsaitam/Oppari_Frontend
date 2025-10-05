// src/pages/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InventoryPageStyles.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "dateOfPurchase", direction: "asc"})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/items")
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = `My Fridge Inventory (${products.length})`;
  }, [products]);


 const handleSort = (key) => {
    let direction = 'asc';

    // If clicking the same column, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction})
 }

 const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortConfig.key]; 
    const bValue = b[sortConfig.key];

    // Strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Numbers (including numeric strings)
    if (!isNaN(aValue) && !isNaN(bValue)) {
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // Dates (assumes ISO string like "2023-08-01")
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    if (!isNaN(aDate) && !isNaN(bDate)) {
      return sortConfig.direction === 'asc'
        ? aDate - bDate
        : bDate - aDate;
    }
    return 0; // Fallback for unhandled types
 });


  return (
    <div className="inventoryPage">
      <div className="title">Inventory</div>
      <div className="countOfProductsText">
        <p className="productCountText">
          {loading
            ? "Loading..."
            : error
            ? "Error loading products"
            : `Total products: ${products.length}`}
        </p>
      </div>


      <div className="products">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error loading products</p>
        ) : (
          <table className="products-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell clickable" onClick={() => handleSort("name")}>
                  Product {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th> 
                <th className="table-cell clickable" onClick={() => handleSort("categoryId")}>
                  Category {sortConfig.key === "categoryId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                <th className="table-cell clickable" onClick={() => handleSort("quantity")}>
                  Quantity {sortConfig.key === "quantity" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                <th className="table-cell clickable" onClick={() => handleSort("price")}>
                  Price {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                <th className="table-cell clickable" onClick={() => handleSort("dateOfPurchase")}>
                  Date of Purchase {sortConfig.key === "dateOfPurchase" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                <th className="table-cell clickable" onClick={() => handleSort("expirationDate")}>
                  Expires {sortConfig.key === "expirationDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sortedProducts.map((p, index) => (
                <tr key={p.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="cell-name">{p.name}</td>
                  <td className="cell-category">{p.categoryId}</td>
                  <td className="cell-quantity">{p.quantity}</td>
                  <td className="cell-price">{p.price}</td>
                  <td className="cell-dateOfPurchase">{p.dateOfPurchase}</td>
                  <td className="cell-ExpirationDate">{p.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventory;
