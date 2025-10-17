// src/App.tsx

// Responsible for routing

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/HomePage";
import Inventory from "./pages/InventoryPage";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout><Home /></Layout>} />
    <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
  </Routes>
);

export default App;
