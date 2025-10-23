import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item, DrawerLabel, ChestId } from "../types";
import { SAMPLE_ITEMS } from "../data";
import { useIndexedDB } from "../hooks/useIndexedDB";
import AddEditItemForm from "../components/AddItemEditForm";
import { uid } from "../utils";

export default function DrawerPage() {
  const { chestId, drawerLabel } = useParams<{ chestId: string; drawerLabel: string }>();
  const navigate = useNavigate();

  // Use indexedDB hook
  const [items, setItems] = useIndexedDB<Item[]>("drawer_app_items_v1", SAMPLE_ITEMS);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  if (!chestId || !drawerLabel) return <div className="container">Invalid drawer</div>;

  const drawer: DrawerLabel = decodeURIComponent(drawerLabel) as DrawerLabel;

  // Filter items in this drawer
  const filtered = useMemo(
    () => items.filter((i) => i.chest === chestId && i.drawer === drawer),
    [items, chestId, drawer]
  );

  // Add item
  function addItem(payload: Omit<Item, "id"> & { id?: string }) {
    const id = payload.id ?? uid("it");
    const newItem: Item = {
      id,
      name: payload.name,
      imageUrl: payload.imageUrl,
      chest: payload.chest,
      drawer: payload.drawer,
    };
    setItems([...items, newItem]); // no TS error now
    setShowAdd(false);
  }

  // Delete item
  function deleteItem(id: string) {
    if (!window.confirm("Delete this item?")) return;
    setItems(items.filter((i) => i.id !== id));
  }

  // Start editing
  function startEdit(id: string) {
    setEditingId(id);
  }

  // Save edited item
  function saveEdit(payload: Omit<Item, "id"> & { id?: string }) {
    if (!payload.id) return;
    setItems(
      items.map((i) =>
        i.id === payload.id
          ? {
              id: payload.id,
              name: payload.name,
              imageUrl: payload.imageUrl,
              chest: payload.chest,
              drawer: payload.drawer,
            }
          : i
      )
    );
    setEditingId(null);
  }

  const editingItem = items.find((i) => i.id === editingId) ?? null;

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <button className="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <span style={{ marginLeft: 12, fontWeight: 600 }}>
            {`Chest: ${chestId} — Drawer: ${drawer}`}
          </span>
        </div>
        <div>
          <button className="button" onClick={() => setShowAdd((s) => !s)}>
            {showAdd ? "Close" : "Add Item"}
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showAdd && (
  <AddEditItemForm
    onSave={(data) =>
      addItem({
        ...data,
        chest: chestId as ChestId,
        drawer: drawer,
      })
    }
    onCancel={() => setShowAdd(false)}
    submitLabel="Add"
    initial={{ name: "", imageUrl: "", chest: chestId as ChestId, drawer, id: "" }}
  />
)}

      {/* Edit Item Form */}
      {editingItem && editingId && (
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
                    <button className="button" onClick={() => startEdit(it.id)}>
                      Edit
                    </button>
                    <button className="button" onClick={() => deleteItem(it.id)}>
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
