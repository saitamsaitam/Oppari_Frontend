// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Home = () => {
  const username = "John";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/items")
      .then(res => setProducts(res.data))
      .catch(err => setError(err))
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
          {loading ? "Loading..." : error ? "Error loading products" : `Total products: ${products.length}`}
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
