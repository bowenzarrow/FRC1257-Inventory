import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { SAMPLE_ITEMS } from "../data";
import { Item } from "../types";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim().toLowerCase() ?? "";
  const navigate = useNavigate();
  const [items, setItems] = useIndexedDB<Item[]>("drawer_app_items_v1", SAMPLE_ITEMS);

  if (!q) {
    return <div className="container">No search query.</div>;
  }

  const results = items.filter(i => i.name.toLowerCase().includes(q));

  return (
    <div className="container">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <button className="button" onClick={() => navigate(-1)}>Back</button>
          <span style={{marginLeft:12, fontWeight:600}}>Search: "{params.get("q")}"</span>
        </div>
      </div>

      <div style={{marginTop:12}}>
        {results.length === 0 ? (
          <div className="card">No results found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Image</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {results.map(it => (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td><img src={it.imageUrl} alt={it.name} className="thumb" /></td>
                  <td>
                    <div style={{display:"flex", gap:8, alignItems:"center"}}>
                      <div>{`${it.chest} / ${it.drawer}`}</div>
                      <div>
                        <button className="button" onClick={() => navigate(`/item/${it.id}`)}>Open</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
