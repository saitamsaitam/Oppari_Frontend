
import './App.css'
import axios from 'axios';
import { useState, useEffect } from "react";

function App() {

  // Sample username
  const username = "John";

  // Sample product data
  // const products = [
  //   { id: 1, name: "Milk", quantity: "2 L", expires: "2025-10-10" },
  //   { id: 2, name: "Eggs", quantity: "12 pcs", expires: "2025-10-15" },
  //   { id: 3, name: "Flour", quantity: "1 kg", expires: "2026-01-01" }
  // ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/items")
      .then(res => setProducts(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Update page title with product count
  useEffect(() => {
    document.title = `My Fridge Inventory (${products.length})`;
  }, [products]);

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">My Fridge Inventory</div>

      {/* Title row */}
      <div className="title">Dashboard</div>

      {/* Hello + product count row */}
      <div className="helloAndCount">
        <p className="hello">Hello, {username}! Welcome back.</p>
        <p className="productCount">
          {loading ? "Loading..." : error ? "Error loading products" : `Total products: ${products.length}`}
        </p>
      </div>

      {/* Products table */}
      <div className="products">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error loading products</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th> {/* wider */}
                <th>Quantity</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>{p.category_id}</td>
                  <td>{p.left_over}</td>
                  <td>{p.date_of_purchase}</td>
                  <td>{p.expiration_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;








