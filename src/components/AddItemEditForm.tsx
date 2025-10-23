import React, { useState } from "react";
import { Item, ChestId, DrawerLabel } from "../types";

type Props = {
  initial: Item;
  onSave: (data: Item) => void;
  onCancel: () => void;
  submitLabel: string;
};

export default function AddEditItemForm({ initial, onSave, onCancel, submitLabel }: Props) {
  const [name, setName] = useState(initial.name);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [chest, setChest] = useState<ChestId>(initial.chest);
  const [drawer, setDrawer] = useState<DrawerLabel>(initial.drawer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (uploadFile) {
      finalImageUrl = await fileToBase64(uploadFile);
    }

    onSave({ ...initial, name, imageUrl: finalImageUrl, chest, drawer });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tool Name" required />

      <label style={{ fontSize: "0.85rem" }}>Upload Image (optional)</label>
      <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files?.[0] ?? null)} />

      <label style={{ fontSize: "0.85rem" }}>Or Enter Image URL</label>
      <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />

      <select value={chest} onChange={e => setChest(e.target.value as ChestId)}>
        <option value="chest1">Chest 1</option>
        <option value="chest2">Chest 2</option>
      </select>

      <select value={drawer} onChange={e => setDrawer(e.target.value as DrawerLabel)}>
        <option value="Top">Top</option>
        <option value="2nd left">2nd left</option>
        <option value="3rd left">3rd left</option>
        <option value="4th left">4th left</option>
        <option value="5th left">5th left</option>
        <option value="2nd right">2nd right</option>
        <option value="3rd right">3rd right</option>
        <option value="4th right">4th right</option>
        <option value="5th right">5th right</option>
      </select>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="button">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="button">Cancel</button>
      </div>
    </form>
  );
}
