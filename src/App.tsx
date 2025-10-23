import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import DrawerPage from "./pages/DrawerPage";
import SearchResults from "./pages/SearchResults";
import ItemDetail from "./pages/ItemDetail";
import "./App.css";
import { ItemsProvider }  from "./context/ItemsContext";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <Header query={query} setQuery={setQuery} />
      <ItemsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chest/:chestId/drawer/:drawerLabel" element={<DrawerPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="*" element={<div className="container">Page not found</div>} />
      </Routes>
      </ItemsProvider>
    </div>
  );
}
