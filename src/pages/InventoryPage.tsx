// src/pages/InventoryPage.tsx
import React, { useMemo } from "react";
import axios from "axios";
import { useInventory } from "../context/InventoryContext";
import FilterPanel from "../components/FilterPanel";
import ProductModal from "../components/ProductModal";
import ConfirmModal from "../components/ConfirmModal";
import { formatCurrency } from "../utils/formatCurrency";
import {
  formatDate,
  getExpirationText,
  formatCategoryName,
} from "../utils/formatHelpers";
import "../styles/InventoryPageStyles.css";

const InventoryPage: React.FC = () => {
  const { state, dispatch } = useInventory();

  const {
    products,
    sortConfig,
    visibleColumns,
    showFilter,
    selectedProduct,
    confirmDelete,
    loading,
    error,
    selectedCurrency,
  } = state;

  // --------------------- Handlers ---------------------
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_CURRENCY", payload: e.target.value });
  };

  const handleSort = (key: typeof sortConfig.key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    dispatch({ type: "SET_SORT", payload: { key, direction } });
  };

const handleLeftOverChange = async (id: number, value: string) => {
  // Convert dropdown value
  const leftOver =
    value === "empty" ? 0 : isNaN(Number(value)) ? 0 : parseFloat(value);

  // Find the selected product
  const targetProduct = products.find((p) => p.id === id);
  if (!targetProduct) return;

  // If the user selects "Empty", confirm deletion
  if (value === "empty") {
    const confirmDelete = window.confirm(
      `Remove "${targetProduct.name}" from inventory?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/item/deleteByItemID/${id}`, {
        data: { id },
      });

      // Update local state (remove deleted product)
      dispatch({
        type: "SET_PRODUCTS",
        payload: products.filter((p) => p.id !== id),
      });
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
    }

    return; // stop here after deletion
  }

  // Otherwise, update leftover amount
  const updatedProducts = products.map((p) =>
    p.id === id ? { ...p, leftOver } : p
  );
  dispatch({ type: "SET_PRODUCTS", payload: updatedProducts });

  try {
    // only send id and leftOver to backend
    const updatedProduct = { id, leftOver };
    const res = await axios.patch(
      "http://localhost:8080/api/item/update",
      updatedProduct
    );

    // Replace local copy with backend-confirmed one
    if (res.data) {
      dispatch({
        type: "SET_PRODUCTS",
        payload: products.map((p) =>
          p.id === res.data.id ? res.data : p
        ),
      });
    }
  } catch (err) {
    console.error("Failed to update leftover:", err);
    alert("Failed to update leftover. Please try again.");
  }
};

  // --------------------- Derived Data ---------------------
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      const key = sortConfig.key;
      let aValue = (a as any)[key];
      let bValue = (b as any)[key];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [products, sortConfig]);

  // --------------------- JSX ---------------------
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
        onClick={() => dispatch({ type: "TOGGLE_FILTER" })}
      >
        Open Filter
      </button>

      {showFilter && (
        <FilterPanel
          visibleColumns={visibleColumns}
          onToggleColumn={(key) =>
            dispatch({ type: "TOGGLE_COLUMN", payload: key })
          }
          onClose={() => dispatch({ type: "TOGGLE_FILTER" })}
        />
      )}

      <div className="currency-selector">
        <label>
          Currency:
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </label>
      </div>

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
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.category && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("category")}
                    >
                      Category{" "}
                      {sortConfig.key === "category" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.leftOver && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("leftOver")}
                    >
                      LeftOver{" "}
                      {sortConfig.key === "leftOver" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.quantity && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity{" "}
                      {sortConfig.key === "quantity" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.price && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("price")}
                    >
                      Price{" "}
                      {sortConfig.key === "price" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.totalValue && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("totalValue")}
                    >
                      Total Value{" "}
                      {sortConfig.key === "totalValue" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.dateOfPurchase && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("dateOfPurchase")}
                    >
                      Date of Purchase{" "}
                      {sortConfig.key === "dateOfPurchase" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  {visibleColumns.expirationDate && (
                    <th
                      className="table-cell clickable"
                      onClick={() => handleSort("expirationDate")}
                    >
                      Expiration Date{" "}
                      {sortConfig.key === "expirationDate" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
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
                    onClick={() =>
                      dispatch({ type: "SET_SELECTED_PRODUCT", payload: p })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {visibleColumns.name && <td>{p.name}</td>}
                    {visibleColumns.category && (
                      <td>
                        {formatCategoryName(
                          typeof p.category === "string"
                            ? p.category
                            : p.category.name
                        )}
                      </td>
                    )}
                    {visibleColumns.leftOver && (
                      <td>
                        <select
                          value={p.leftOver ?? "empty"}
                          onClick={(e) => e.stopPropagation()} // prevent row click
                          onChange={(e) =>
                            handleLeftOverChange(p.id, e.target.value)
                          }
                        >
                          <option value="empty">Empty</option>
                          <option value="0.25">1/4</option>
                          <option value="0.5">2/4</option>
                          <option value="0.75">3/4</option>
                          <option value="1">4/4 (Full)</option>
                        </select>
                      </td>
                    )}
                    {visibleColumns.quantity && <td>{p.quantity}</td>}
                    {visibleColumns.price && (
                      <td>
                        {p.price
                          ? formatCurrency(p.price, selectedCurrency)
                          : "—"}
                      </td>
                    )}
                    {visibleColumns.totalValue && (
                      <td>
                        {p.price
                          ? formatCurrency(
                              p.price * p.quantity,
                              selectedCurrency
                            )
                          : "—"}
                      </td>
                    )}
                    {visibleColumns.dateOfPurchase && (
                      <td>{formatDate(p.dateOfPurchase)}</td>
                    )}
                    {visibleColumns.expirationDate && (
                      <td>{formatDate(p.expirationDate)}</td>
                    )}
                    {visibleColumns.expire && (
                      <td>{getExpirationText(p.expirationDate)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() =>
            dispatch({ type: "SET_SELECTED_PRODUCT", payload: null })
          }
          onSave={(updatedProduct) => {
            axios
              .patch("http://localhost:8080/api/item/update", updatedProduct)
              .then((res) => {
                const savedProduct = res.data;
                dispatch({
                  type: "SET_PRODUCTS",
                  payload: products.map((p) =>
                    p.id === savedProduct.id ? savedProduct : p
                  ),
                });
              })
              .catch((err) => {
                console.error("Failed to update item:", err);
                alert("Failed to update item. Please try again.");
              });
          }}
        />
      )}

      {confirmDelete.show && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={() => {
            axios
              .delete("http://localhost:8080/api/item/delete", {
                data: { id: confirmDelete.id },
              })
              .then(() =>
                dispatch({
                  type: "SET_PRODUCTS",
                  payload: products.filter((p) => p.id !== confirmDelete.id),
                })
              )
              .finally(() =>
                dispatch({
                  type: "SET_CONFIRM_DELETE",
                  payload: { id: null, show: false },
                })
              );
          }}
          onCancel={() =>
            dispatch({
              type: "SET_CONFIRM_DELETE",
              payload: { id: null, show: false },
            })
          }
        />
      )}
    </div>
  );
};

export default InventoryPage;
