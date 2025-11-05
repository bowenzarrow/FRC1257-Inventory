import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../types";
import { useItems } from "../contexts/ItemsContext";
import { uid } from "../utils";
import AddEditItemForm from "../components/AddItemEditForm";
import { DrawerLabel } from "../types";
import { useCategories } from "../hooks/useCategories";

export default function DrawerPage() {
  const { chestId, drawerLabel } = useParams<{ chestId: string; drawerLabel: string }>();
  const navigate = useNavigate();
  const { items, setItems } = useItems();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { categories, editingEnabled, setEditingEnabled } = useCategories();

  const drawer = drawerLabel ? decodeURIComponent(drawerLabel) : "";

  useEffect(() => {
    if (chestId && drawer) {
      document.title = `Drawer: ${drawer} — ${chestId}`;
    }
  }, [chestId, drawer]);

  // Filter items by drawer and category
  const filtered = useMemo(() => {
    let base = chestId && drawerLabel
      ? items.filter((i) => i.chest === chestId && i.drawer === drawer)
      : [];
    if (categoryFilter) {
      base = base.filter((i) => i.category === categoryFilter);
    }
    return base;
  }, [items, chestId, drawer, drawerLabel, categoryFilter]);

  if (!chestId || !drawerLabel) return <div className="container">Invalid drawer</div>;

  function addItem(payload: Omit<Item, "id"> & { id?: string }) {
    const id = payload.id ?? uid("it");
    setItems((prev) => [{ id, ...payload }, ...prev]);
    setShowAdd(false);
  }

  function saveEdit(payload: Item) {
    setItems((prev) => prev.map((i) => (i.id === payload.id ? payload : i)));
    setEditingId(null);
  }

  function deleteItem(id: string) {
    if (!window.confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function toggleEditing() {
    if (editingEnabled) {
      setEditingEnabled(false);
      alert("Editing locked");
    } else {
      const pw = prompt("Enter password to unlock editing:");
      if (pw === "1257") setEditingEnabled(true);
      else alert("Incorrect password");
    }
  }

  const editingItem = items.find((i) => i.id === editingId);

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <button className="button" type="button" onClick={() => navigate(-1)}>Back</button>
          <span style={{ marginLeft: 12, fontWeight: 600 }}>
            {`Chest: ${chestId} — Drawer: ${drawer}`}
          </span>
        </div>
        <div>
          <button className="button" type="button" onClick={toggleEditing}>
            {editingEnabled ? "🔒 Lock Editing" : "🔓 Unlock Editing"}
          </button>
          <button
            className="button"
            type="button"
            onClick={() => setShowAdd((s) => !s)}
            disabled={!editingEnabled}
            style={{ marginLeft: 8 }}
          >
            {showAdd ? "Close" : "Add Item"}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label>Filter by category: </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <AddEditItemForm
          initial={{
            id: uid("it"),
            name: "",
            imageUrl: "",
            chest: chestId as "Electronics Chest" | "Build Chest",
            drawer: drawer as DrawerLabel,
            category: "",
          }}
          onSave={addItem}
          onCancel={() => setShowAdd(false)}
          submitLabel="Add"
          editingEnabled={editingEnabled}
        />
      )}

      {/* Edit Form */}
      {editingItem && (
        <div style={{ marginTop: 12 }}>
          <h4>Edit Item</h4>
          <AddEditItemForm
            initial={editingItem}
            onSave={saveEdit}
            onCancel={() => setEditingId(null)}
            submitLabel="Save"
            editingEnabled={editingEnabled}
          />
        </div>
      )}

      {/* Table */}
      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Name</th>
            <th style={{ width: "25%" }}>Image</th>
            <th style={{ width: "25%" }}>Category</th>
            <th style={{ width: "25%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 12 }}>No items in this drawer.</td>
            </tr>
          ) : (
            filtered.map((it) => (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td><img src={it.imageUrl} alt={it.name} className="thumb" /></td>
                <td>{it.category || <em>None</em>}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="button" type="button" onClick={() => setEditingId(it.id)} disabled={!editingEnabled}>Edit</button>
                    <button className="button" type="button" onClick={() => deleteItem(it.id)} disabled={!editingEnabled}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!editingEnabled && (
        <div style={{ color: "red", marginTop: 8, fontWeight: 600 }}>Item editing is currently locked.</div>
      )}
    </div>
  );
}
