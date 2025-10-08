// src/pages/Inventory.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InventoryPageStyles.css";

interface Product {
  id: number;
  name: string;
  category: string | { name: string };
  quantity: number;
  price: number;
  dateOfPurchase: string;
  expirationDate: string;
  totalValue?: number;
}

interface SortConfig {
  key: keyof Product;
  direction: "asc" | "desc";
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "dateOfPurchase",
    direction: "asc",
  });
  const [showPrices, setShowPrices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:8080/api/items")
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = `My Fridge Inventory (${products.length})`;
  }, [products]);

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return sortConfig.direction === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    const aDate = new Date(aValue as string);
    const bDate = new Date(bValue as string);
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return sortConfig.direction === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    return 0;
  });

  const formatCategoryName = (name: string) => {
    if (!name) return "";
    let formatted = name.replace(/_/g, " ");
    formatted = formatted.replace(/&/g, " & ").replace(/\s+/g, " ");
    formatted = formatted.trim();
    formatted = formatted
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formatted;
  };

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
      <button
        type="button"
        className="toggle-price-button"
        onClick={() => setShowPrices(!showPrices)}
      >
        {showPrices ? "Hide Prices" : "Show Prices"}
      </button>
      <div className="products">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error loading products</p>
        ) : (
          <form className="inventory-form">
            <table className="products-table">
              <thead className="table-header">
                <tr>
                  <th
                    className="table-cell clickable"
                    onClick={() => handleSort("name")}
                  >
                    Product{" "}
                    {sortConfig.key === "name"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    className="table-cell clickable"
                    onClick={() => handleSort("category")}
                  >
                    Category{" "}
                    {sortConfig.key === "category"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    className="table-cell clickable"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity{" "}
                    {sortConfig.key === "quantity"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  {showPrices && (
                    <>
                      <th
                        className="table-cell clickable"
                        onClick={() => handleSort("price")}
                      >
                        Price{" "}
                        {sortConfig.key === "price"
                          ? sortConfig.direction === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className="table-cell clickable"
                        onClick={() => handleSort("totalValue")}
                      >
                        Total value (€){" "}
                        {sortConfig.key === "price"
                          ? sortConfig.direction === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                    </>
                  )}
                  <th
                    className="table-cell clickable"
                    onClick={() => handleSort("dateOfPurchase")}
                  >
                    Date of Purchase{" "}
                    {sortConfig.key === "dateOfPurchase"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    className="table-cell clickable"
                    onClick={() => handleSort("expirationDate")}
                  >
                    Expires{" "}
                    {sortConfig.key === "expirationDate"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {sortedProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <td className="cell-name">{p.name}</td>
                    <td className="cell-category">
                      {formatCategoryName(typeof p.category === "string" ?p.category : p.category.name)}
                    </td>
                    <td className="cell-quantity">{p.quantity}</td>
                    {showPrices && (
                      <>
                        <td className="cell-price">{p.price.toFixed(2)}</td>
                        <td className="cell-totalValue">
                          {(p.price * p.quantity).toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="cell-dateOfPurchase">{p.dateOfPurchase}</td>
                    <td className="cell-ExpirationDate">{p.expirationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        )}
      </div>
    </div>
  );
};

export default Inventory;
