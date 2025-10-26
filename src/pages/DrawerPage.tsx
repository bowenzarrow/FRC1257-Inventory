import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../types";
import { useItems } from "../contexts/ItemsContext";
import { uid } from "../utils";
import AddEditItemForm from "../components/AddItemEditForm";
import { SAMPLE_ITEMS } from "../data"; 
import { DrawerLabel } from "../types";

export default function DrawerPage() {
  const { chestId, drawerLabel } = useParams<{ chestId: string; drawerLabel: string }>();
  const navigate = useNavigate();

  // Top-level hooks
  const { items, setItems } = useItems();
  // seeding is handled by ItemsProvider
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Decode drawer name
  const drawer = drawerLabel ? decodeURIComponent(drawerLabel) : "";

  // Filter items in this drawer safely (hooks not conditional)
  const filtered = useMemo(
    () =>
      chestId && drawerLabel
        ? items.filter((i) => i.chest === chestId && i.drawer === drawer)
        : [],
    [items, chestId, drawer, drawerLabel]
  );

  // Early return if params invalid
  if (!chestId || !drawerLabel) return <div className="container">Invalid drawer</div>;

  // Add item
  function addItem(payload: Omit<Item, "id"> & { id?: string }) {
    const id = payload.id ?? uid("it");
    setItems((prev) => [
      { id, name: payload.name, imageUrl: payload.imageUrl, chest: payload.chest, drawer: payload.drawer },
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
          ? { id: payload.id, name: payload.name, imageUrl: payload.imageUrl, chest: payload.chest, drawer: payload.drawer }
          : i
      )
    );
    setEditingId(null);
  }

  const editingItem = items.find((i) => i.id === editingId || "");

  return (
    <div className="container">
      {/* Header with Back */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
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

      {/* Add Item Form */}
      {showAdd && <AddEditItemForm
        onSave={(data) => addItem({ ...data, chest: chestId as "chest1" | "chest2", drawer: drawer as DrawerLabel  })}
        onCancel={() => setShowAdd(false)}
        submitLabel="Add"
        initial={{ name: "", imageUrl: "", chest: chestId as "chest1" | "chest2", drawer: drawer as DrawerLabel }}
      />}

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
            <th style={{ width: "40%" }}>Name</th>
            <th style={{ width: "40%" }}>Image</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: 12 }}>
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
