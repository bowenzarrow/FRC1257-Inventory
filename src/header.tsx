import React from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

type Props = { query: string; setQuery: (s: string) => void };

export default function Header({ query, setQuery }: Props) {
  const navigate = useNavigate();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ pathname: "/search", search: createSearchParams({ q }).toString() });
  }

  function onReset() {
    setQuery("");
    navigate("/");
  }

  return (
    <header className="header container">
      <h1>Drawer Finder</h1>
      <form onSubmit={onSearch} className="search" style={{width: "100%"}}>
        <input className="input" placeholder="Search items..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="button">Search</button>
        <button type="button" onClick={onReset} className="button">Home</button>
      </form>
    </header>
  );
}

