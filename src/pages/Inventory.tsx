// src/pages/Inventory.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InventoryPageStyles.css";
import FilterPanel, { ColumnKey } from "../components/FilterPanel";

import { Product } from "../types/Product";

type VirtualKey = "totalValue" | "expire";
type SortableKey = keyof Product | VirtualKey;

interface SortConfig {
  key: SortableKey;
  direction: "asc" | "desc";
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "dateOfPurchase", // default sort when opening the page
    direction: "asc",
  });

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<
    Record<ColumnKey, boolean>
  >({
    name: true,
    category: true,
    quantity: true,
    price: false,
    totalValue: false,
    dateOfPurchase: false,
    expirationDate: false,
    expire: true,
  });

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

  // Compute virtual values for sorting
  const getComputedValue = (
    product: Product,
    key: VirtualKey
  ): number | string => {
    switch (key) {
      case "totalValue":
        return (product.price ?? 0) * (product.quantity ?? 0);
      case "expire": {
        // Handles null, undefined, or invalid dates safely also preventing NaN issues
        if (!product.expirationDate) return Number.POSITIVE_INFINITY; // Ensures items without expiration date always appear last when sorting ascending
        const exp = new Date(product.expirationDate);
        if (isNaN(exp.getTime())) return Number.POSITIVE_INFINITY;
        const now = Date.now();
        return exp.getTime() - now;
      }
      default:
        return 0; // fallback
    }
  };

  // Unified sorting handler
  const handleSort = (key: SortableKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort products based on sortConfig
  const sortedProducts = [...products].sort((a, b) => {
    const { key, direction } = sortConfig;

    const aValue =
      key in a
        ? a[key as keyof Product] ?? ""
        : getComputedValue(a, key as VirtualKey);
    const bValue =
      key in b
        ? b[key as keyof Product] ?? ""
        : getComputedValue(b, key as VirtualKey);

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // ✅ Helper: Expiration text
  const getExpirationText = (expirationDate?: string | null): string => {
    if (!expirationDate) return "No date set";
    const exp = new Date(expirationDate);
    if (isNaN(exp.getTime())) return "Invalid date";
    const now = new Date();
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)); // in days

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "In 1 day";
    if (diffDays < 7) return `In ${diffDays} days`;
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? "s" : ""}`;
  };

  // Format category names
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

  const handleToggleColumn = (column: ColumnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"; // fallback if undefined
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
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
        className="filter-button"
        onClick={() => setShowFilter(true)}
      >
        Open Filter
      </button>

      {showFilter && (
        <FilterPanel
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onClose={() => setShowFilter(false)}
        />
      )}

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
                  {visibleColumns.name && (
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
                  )}
                  {visibleColumns.category && (
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
                  )}
                  {visibleColumns.quantity && (
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
                  )}
                  {visibleColumns.price && (
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
                  )}
                  {visibleColumns.totalValue && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("totalValue")}
                    >
                      Total Value (€){" "}
                      {sortConfig.key === "totalValue"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  )}
                  {visibleColumns.dateOfPurchase && (
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
                  )}
                  {visibleColumns.expirationDate && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("expirationDate")}
                    >
                      ExpirationDate{" "}
                      {sortConfig.key === "expirationDate"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  )}
                  {visibleColumns.expire && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("expire")}
                    >
                      Expires{" "}
                      {sortConfig.key === "expire" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="table-body">
                {sortedProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    {visibleColumns.name && (
                      <td className="cell-name">{p.name}</td>
                    )}
                    {visibleColumns.category && (
                      <td className="cell-category">
                        {formatCategoryName(
                          typeof p.category === "string"
                            ? p.category
                            : p.category.name
                        )}
                      </td>
                    )}
                    {visibleColumns.quantity && (
                      <td className="cell-quantity">{p.quantity}</td>
                    )}
                    {visibleColumns.price && (
                      <td className="cell-price">
                        {p.price === 0 ? "—" : p.price.toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.totalValue && (
                      <td className="cell-totalValue">
                        {p.price !== undefined
                          ? (p.price * p.quantity).toFixed(2)
                          : "-"}
                      </td>
                    )}
                    {visibleColumns.dateOfPurchase && (
                      <td className="cell-dateOfPurchase">
                        {formatDate(p.dateOfPurchase)}
                      </td>
                    )}
                    {visibleColumns.expirationDate && (
                      <td className="cell-expirationDate">
                        {formatDate(p.expirationDate)}
                      </td>
                    )}
                    {visibleColumns.expire && (
                      <td className="cell-expire">
                        {getExpirationText(p.expirationDate)}
                      </td>
                    )}
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
