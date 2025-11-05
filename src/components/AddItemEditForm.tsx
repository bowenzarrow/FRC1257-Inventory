import React, { useState } from "react";
import { Item, DrawerLabel, ChestId } from "../types";
import { DRAWERS } from "../data";
import { useCategories } from "../hooks/useCategories";

type Props = {
  initial: Item; // always pass a full item
  onSave: (payload: Item) => void;
  onCancel?: () => void;
  submitLabel?: string;
  editingEnabled: boolean;
};

export default function AddEditItemForm({
  initial,
  onSave,
  onCancel,
  submitLabel = "Save",
  editingEnabled,
}: Props) {
  const [name, setName] = useState(initial.name);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [chest, setChest] = useState<ChestId>(initial.chest);
  const [drawer, setDrawer] = useState<DrawerLabel>(initial.drawer);
  const [category, setCategory] = useState(initial.category ?? "");

  const { categories } = useCategories();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...initial, // preserves id
      name: name.trim(),
      imageUrl: imageUrl.trim() || placeholder(name),
      chest,
      drawer,
      category,
    });
  }

  function placeholder(n: string) {
    return `https://dummyimage.com/200x200/ddd/000&text=${encodeURIComponent(n)}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={submit} className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="input"
          disabled={!editingEnabled}
        />
        <input
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="input"
          disabled={!editingEnabled}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={!editingEnabled}
        />
      </div>

      {imageUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ccc" }}
          />
        </div>
      )}

      <div className="form-row" style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <select
          name="chest"
          value={chest}
          onChange={(e) => setChest(e.target.value as ChestId)}
          className="input"
          disabled={!editingEnabled}
        >
          <option value="Electronics Chest">Electronics Chest</option>
          <option value="Build Chest">Build Chest</option>
        </select>

        <select
          name="drawer"
          value={drawer}
          onChange={(e) => setDrawer(e.target.value as DrawerLabel)}
          className="input"
          disabled={!editingEnabled}
        >
          {DRAWERS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          disabled={!editingEnabled}
        >
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit" className="button" disabled={!editingEnabled}>
          {submitLabel}
        </button>
        <button type="button" className="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
