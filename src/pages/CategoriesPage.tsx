import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useItems } from "../contexts/ItemsContext";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    removeCategory,
    renameCategory,
    editingEnabled,
    setEditingEnabled,
  } = useCategories();

  const { items, setItems } = useItems();
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const navigate = useNavigate();

  // 🔒 toggle editing lock
  function toggleEditing() {
    if (editingEnabled) {
      setEditingEnabled(false);
      alert("Category editing is now locked.");
    } else {
      const pw = prompt("Enter password to unlock category editing:");
      if (pw === "1257") {
        setEditingEnabled(true);
        alert("Category editing is now unlocked.");
      } else {
        alert("Incorrect password. Editing remains locked.");
      }
    }
  }

  // Navigate to category page
  function handleClickCategory(category: string) {
    if (!editingCategory) navigate(`/category/${encodeURIComponent(category)}`);
  }

  // Add new category
  function handleAddCategory() {
    if (!editingEnabled) return alert("Editing is locked.");
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    addCategory(trimmed);
    setNewCategory("");
  }

  // Delete a category
  function handleDeleteCategory(category: string) {
    if (!editingEnabled) return alert("Editing is locked.");
    if (!window.confirm(`Delete category "${category}"? Items will be moved to "None".`)) return;

    setItems((prev) =>
      prev.map((item) =>
        item.category === category ? { ...item, category: "None" } : item
      )
    );

    removeCategory(category);
  }

  // Start editing a category
  function startEditCategory(category: string) {
    if (!editingEnabled) return alert("Editing is locked.");
    setEditingCategory(category);
    setEditingName(category);
  }

  // Save edited category
  function saveEditCategory() {
    if (!editingEnabled) return alert("Editing is locked.");
    const trimmed = editingName.trim();
    if (!trimmed || trimmed === editingCategory || categories.includes(trimmed)) return;

    renameCategory(editingCategory!, trimmed);

    setItems((prev) =>
      prev.map((item) =>
        item.category === editingCategory ? { ...item, category: trimmed } : item
      )
    );

    setEditingCategory(null);
    setEditingName("");
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>All Categories</h2>
        <button className="button" onClick={toggleEditing}>
          {editingEnabled ? "🔒 Lock Editing" : "🔓 Unlock Editing"}
        </button>
      </div>

      {/* Add new category */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="input"
          disabled={!editingEnabled}
        />
        <button className="button" onClick={handleAddCategory} disabled={!editingEnabled}>
          Add
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card">No categories yet.</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {categories.map((c) => (
            <div
              key={c}
              style={{
                position: "relative",
                minWidth: 120,
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
              onClick={() => handleClickCategory(c)}
            >
              {editingCategory === c ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    style={{ width: "100%", marginBottom: 6 }}
                    disabled={!editingEnabled}
                  />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="button" onClick={saveEditCategory} disabled={!editingEnabled}>
                      Save
                    </button>
                    <button
                      className="button"
                      style={{ backgroundColor: "#6c757d", color: "white" }}
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>{c}</div>
                  {c !== "None" && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                      <button
                        className="button"
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#ffc107",
                          fontSize: "0.8rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditCategory(c);
                        }}
                        disabled={!editingEnabled}
                      >
                        Edit
                      </button>
                      <button
                        className="button"
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          fontSize: "0.8rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(c);
                        }}
                        disabled={!editingEnabled}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {!editingEnabled && (
        <div style={{ color: "red", marginTop: 8, fontWeight: 600 }}>
          Category editing is currently locked.
        </div>
      )}
    </div>
  );
}
