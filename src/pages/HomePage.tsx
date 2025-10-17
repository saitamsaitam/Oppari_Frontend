// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

// Define a type for Product
interface Product {
  id: number;
  name: string;
  quantity: number;
  expiration_date: string; // You could also use Date if you parse it
}

const Home: React.FC = () => {
  const username = "John";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Product[]>(`http://localhost:8080/api/item/getAll/${1}`)
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = `My Fridge Inventory (${products.length})`;
  }, [products]);

  return (
    <div className="app">
      <div className="title">Dashboard</div>
      <div className="helloAndCount">
        <p className="hello">Hello, {username}! Welcome back.</p>
        <p className="productCount">
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
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{p.expiration_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
