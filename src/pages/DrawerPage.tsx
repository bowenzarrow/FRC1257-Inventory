import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../types";
import { useItems } from "../contexts/ItemsContext";
import { uid } from "../utils";
import AddEditItemForm from "../components/AddItemEditForm";
import { DrawerLabel } from "../types";
import { useCategories } from "../hooks/useCategories"; // 🆕 import

export default function DrawerPage() {
  const { chestId, drawerLabel } = useParams<{ chestId: string; drawerLabel: string }>();
  const navigate = useNavigate();
  const { items, setItems } = useItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // 🆕 category filter state
  const { categories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Decode drawer name
  const drawer = drawerLabel ? decodeURIComponent(drawerLabel) : "";
  useEffect(() => {
    if (chestId && drawer) {
      document.title = `Drawer: ${drawer} — ${chestId}`;
    }
  }, [chestId, drawer]);

  // Filter items in this drawer, then apply category filter
  const filtered = useMemo(() => {
    let base =
      chestId && drawerLabel
        ? items.filter((i) => i.chest === chestId && i.drawer === drawer)
        : [];
    if (categoryFilter) base = base.filter((i) => i.category === categoryFilter);
    return base;
  }, [items, chestId, drawer, drawerLabel, categoryFilter]);

  // Early return if params invalid
  if (!chestId || !drawerLabel) return <div className="container">Invalid drawer</div>;

  // Add item
  function addItem(payload: Omit<Item, "id"> & { id?: string }) {
    const id = payload.id ?? uid("it");
    setItems((prev) => [
      {
        id,
        name: payload.name,
        imageUrl: payload.imageUrl,
        chest: payload.chest,
        drawer: payload.drawer,
        category: payload.category, // 🆕 include category
      },
      ...prev,
    ]);
    setShowAdd(false);
  }

  // Delete item
  function deleteItem(id: string) {
    if (!window.confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Start editing
  function startEdit(id: string) {
    setEditingId(id);
  }

  // Save edited item
  function saveEdit(payload: Omit<Item, "id"> & { id?: string }) {
    if (!payload.id) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === payload.id
          ? {
              id: payload.id,
              name: payload.name,
              imageUrl: payload.imageUrl,
              chest: payload.chest,
              drawer: payload.drawer,
              category: payload.category, // 🆕 include category
            }
          : i
      )
    );
    setEditingId(null);
  }

  const editingItem = items.find((i) => i.id === editingId || "");

  return (
    <div className="container">
      {/* Header with Back */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <button className="button" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <span style={{ marginLeft: 12, fontWeight: 600 }}>
            {`Chest: ${chestId} — Drawer: ${drawer}`}
          </span>
        </div>
        <div>
          <button className="button" type="button" onClick={() => setShowAdd((s) => !s)}>
            {showAdd ? "Close" : "Add Item"}
          </button>
        </div>
      </div>

      {/* 🧩 Category Filter */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <label>Filter by category: </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Item Form */}
      {showAdd && (
        <AddEditItemForm
          onSave={(data) =>
            addItem({
              ...data,
              chest: chestId as "Electronics Chest" | "Build Chest",
              drawer: drawer as DrawerLabel,
            })
          }
          onCancel={() => setShowAdd(false)}
          submitLabel="Add"
          initial={{
            name: "",
            imageUrl: "",
            chest: chestId as "Electronics Chest" | "Build Chest",
            drawer: drawer as DrawerLabel,
          }}
        />
      )}

      {/* Edit Item Form */}
      {editingId && editingItem && (
        <div style={{ marginTop: 12 }}>
          <h4>Edit Item</h4>
          <AddEditItemForm
            initial={editingItem}
            onSave={saveEdit}
            onCancel={() => setEditingId(null)}
            submitLabel="Save"
          />
        </div>
      )}

      {/* Items Table */}
      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Name</th>
            <th style={{ width: "25%" }}>Image</th>
            <th style={{ width: "25%" }}>Category</th> {/* 🆕 column */}
            <th style={{ width: "25%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 12 }}>
                No items in this drawer.
              </td>
            </tr>
          ) : (
            filtered.map((it) => (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td>
                  <img src={it.imageUrl} alt={it.name} className="thumb" />
                </td>
                <td>{it.category || <em>None</em>}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="button" type="button" onClick={() => startEdit(it.id)}>
                      Edit
                    </button>
                    <button className="button" type="button" onClick={() => deleteItem(it.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
