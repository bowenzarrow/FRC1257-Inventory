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

  const { categories, editingEnabled, setEditingEnabled } = useCategories();

  const drawer = drawerLabel ? decodeURIComponent(drawerLabel) : "";

  useEffect(() => {
    if (chestId && drawer) {
      document.title = `Drawer: ${drawer} — ${chestId}`;
    }
  }, [chestId, drawer]);

  const filtered = useMemo(() => {
    let base =
      chestId && drawerLabel
        ? items.filter((i) => i.chest === chestId && i.drawer === drawer)
        : [];
    return base;
  }, [items, chestId, drawer, drawerLabel]);

  if (!chestId || !drawerLabel) return <div className="container">Invalid drawer</div>;

  function addItem(payload: Omit<Item, "id"> & { id?: string }) {
    if (!editingEnabled) return;
    const id = payload.id ?? uid("it");
    setItems((prev) => [
      { id, ...payload },
      ...prev,
    ]);
    setShowAdd(false);
  }

  function deleteItem(id: string) {
    if (!editingEnabled) return;
    if (!window.confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(id: string) {
    if (!editingEnabled) return;
    setEditingId(id);
  }

  function saveEdit(payload: Omit<Item, "id"> & { id?: string }) {
    if (!editingEnabled || !payload.id) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === payload.id ? { ...i, ...payload } : i
      )
    );
    setEditingId(null);
  }

  const editingItem = items.find((i) => i.id === editingId || "");

  // 🔒 Toggle editing lock
  function toggleEditing() {
    if (editingEnabled) {
      setEditingEnabled(false);
      alert("Editing is now locked.");
    } else {
      const pw = prompt("Enter password to unlock editing:");
      if (pw === "1257") {
        setEditingEnabled(true);
        alert("Editing is now unlocked.");
      } else {
        alert("Incorrect password. Editing remains locked.");
      }
    }
  }

  return (
    <div className="container">
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

      {showAdd && editingEnabled && (
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
                    <button
                      className="button"
                      type="button"
                      onClick={() => startEdit(it.id)}
                      disabled={!editingEnabled}
                    >
                      Edit
                    </button>
                    <button
                      className="button"
                      type="button"
                      onClick={() => deleteItem(it.id)}
                      disabled={!editingEnabled}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!editingEnabled && (
        <div style={{ color: "red", marginTop: 8, fontWeight: 600 }}>
          Item editing is currently locked.
        </div>
      )}
    </div>
  );
}
