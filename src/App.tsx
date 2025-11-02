import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import DrawerPage from "./pages/DrawerPage";
import SearchResults from "./pages/SearchResults";
import ItemDetail from "./pages/ItemDetail";
import { ItemsProvider } from "./contexts/ItemsContext";
import "./App.css";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryResults from "./pages/CategoryResults";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <ItemsProvider>
      <div>
        <Header query={query} setQuery={setQuery} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chest/:chestId/drawer/:drawerLabel" element={<DrawerPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="*" element={<div className="container">Page not found</div>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:name" element={<CategoryResults />} />
        </Routes>
      </div>
    </ItemsProvider>
  );
}
