// src/components/ProductModal.tsx

import React, { useEffect } from "react";
import { useState } from "react";
import { Product } from "../types/Product";
import "../styles/ProductModalStyles.css";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product>({
    ...product,
    quantity: product.quantity || 1,
  });

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "leftOver"
          ? Number(value)
          : value,
    }));
  };

  // Only send changed fields to onSave
  const handleSave = () => {
    const updatedProduct: Partial<Product> = { id: product.id };

    if (formData.name !== product.name) updatedProduct.name = formData.name;
    if (formData.category !== product.category)
      updatedProduct.category = formData.category;
    if (formData.leftOver !== product.leftOver)
      updatedProduct.leftOver = formData.leftOver;
    if (formData.quantity === 0 || isNaN(formData.quantity)) {
      formData.quantity = 1;
    }
    if (formData.quantity !== product.quantity)
      updatedProduct.quantity = formData.quantity;
    if (formData.price !== product.price) updatedProduct.price = formData.price;
    if (formData.dateOfPurchase !== product.dateOfPurchase)
      updatedProduct.dateOfPurchase = formData.dateOfPurchase;
    if (formData.expirationDate !== product.expirationDate)
      updatedProduct.expirationDate = formData.expirationDate;

    onSave(updatedProduct as Product);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Product</h3>
        <div className="modal-fields">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={
                typeof formData.category === "string"
                  ? formData.category
                  : formData.category.name
              }
              onChange={handleChange}
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              min={1}
              value={formData.quantity === 0 ? "" : formData.quantity}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  quantity: value === "" ? 0 : Number(value),
                }));
              }}
            />
          </label>

          <label>
            Price (€):
            <input
              type="number"
              name="price"
              step="1.00"
              value={formData.price === 0 ? "" : formData.price}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  price: value === "" ? 0 : Number(value),
                }));
              }}
            />
          </label>

          <label>
            Leftover:
            <select
              name="leftOver"
              value={formData.leftOver ?? 1}
              onChange={handleChange}
            >
              <option value={0.25}>1/4</option>
              <option value={0.5}>2/4</option>
              <option value={0.75}>3/4</option>
              <option value={1}>4/4 (Full)</option>
            </select>
          </label>

          <label>
            Date of Purchase:
            <input
              type="date"
              name="dateOfPurchase"
              value={formData.dateOfPurchase?.split("T")[0] ?? ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Expiration Date:
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate?.split("T")[0] ?? ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
