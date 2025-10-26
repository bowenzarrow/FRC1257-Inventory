import React, { useState } from "react";
import { Item, DrawerLabel, ChestId } from "../inventory";
import { DRAWERS } from "../data";

type Props = {
  initial?: Partial<Item>;
  onSave: (payload: Omit<Item, "id"> & { id?: string }) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function AddEditItemForm({
  initial = {},
  onSave,
  onCancel,
  submitLabel = "Save",
}: Props) {
  const [name, setName] = useState(initial.name ?? "");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl ?? "");
  const [chest, setChest] = useState<ChestId>((initial as Item).chest ?? "chest1");
  const [drawer, setDrawer] = useState<DrawerLabel>((initial as Item).drawer ?? DRAWERS[0]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: (initial as Item)?.id,
      name: name.trim(),
      imageUrl: imageUrl.trim() || placeholder(name),
      chest,
      drawer,
    });
  }

  function placeholder(n: string) {
    return `https://dummyimage.com/200x200/ddd/000&text=${encodeURIComponent(n)}`;
  }

  // Handle image file upload
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
        />

        <input
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="input"
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />
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

      <div className="form-row">
        <select
          name="chest"
          value={chest}
          onChange={(e) => setChest(e.target.value as ChestId)}
          className="input"
        >
          <option value="Electronics Chest">Electronics Chest</option>
          <option value="Build Chest">Build Chest</option>
        </select>

        <select
          name="drawer"
          value={drawer}
          onChange={(e) => setDrawer(e.target.value as DrawerLabel)}
          className="input"
        >
          {DRAWERS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="button">
            {submitLabel}
          </button>
          <button type="button" className="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
