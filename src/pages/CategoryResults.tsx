import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "../contexts/ItemsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function CategoryResults() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { items } = useItems();

  const categoryName = name ? decodeURIComponent(name) : "";
  useDocumentTitle(`Category: ${categoryName}`);

  // ✅ Call hooks / useMemo first, before any return
  const results = useMemo(
    () => items.filter(i => (i.category || "None") === categoryName),
    [items, categoryName]
  );

  // early return AFTER hooks / useMemo
  if (!categoryName) {
    return <div className="container">Invalid category.</div>;
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button className="button" onClick={() => navigate(-1)}>Back</button>
          <span style={{ marginLeft: 12, fontWeight: 600 }}>Category: "{categoryName}"</span>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {results.length === 0 ? (
          <div className="card">No items in this category.</div>
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
                  <td>
                    <img src={it.imageUrl} alt={it.name} className="thumb" />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div>{`${it.chest} / ${it.drawer}`}</div>
                      <div>
                        <button
                          className="button"
                          onClick={() =>
                            navigate(`/chest/${it.chest}/drawer/${encodeURIComponent(it.drawer)}`)
                          }
                        >
                          Open
                        </button>
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
