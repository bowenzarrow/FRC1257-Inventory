import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import chest1Img from "../assets/chest1.png";
import chest2Img from "../assets/chest2.png";
import { useItems } from "../contexts/ItemsContext"; // Make sure provider wraps App
import { Item } from "../types";

const DRAWERS = [
  "Top",
  "2nd left",
  "3rd left",
  "4th left",
  "5th left",
  "2nd right",
  "3rd right",
  "4th right",
  "5th right",
];

export default function Home() {
  const navigate = useNavigate();
  const { items, setItems } = useItems();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (chestId: string, drawer: string) => {
    navigate(`/chest/${chestId}/drawer/${encodeURIComponent(drawer)}`);
  };

  // Export items as JSON file
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawer_items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Read and import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const importedItems: Item[] = JSON.parse(text);
        if (Array.isArray(importedItems)) {
          setItems(importedItems); // set directly to context + IndexedDB
          alert("Items imported successfully!");
        } else {
          alert("Invalid JSON format");
        }
      } catch (err) {
        console.error(err);
        alert("Error reading JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input so same file can be re-imported
  };

  const chest1Positions = [
    { top: 40, left: 160 },
    { top: 80, left: 80 },
    { top: 100, left: 140 },
    { top: 120, left: 80 },
    { top: 160, left: 120 },
    { top: 80, left: 270 },
    { top: 100, left: 310 },
    { top: 120, left: 270 },
    { top: 160, left: 290 },
  ];

  const chest2Positions = chest1Positions;

  return (
    <div className="container">
      <h2>Tool Chests</h2>

      {/* Export / Import buttons */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button
          onClick={handleExportJSON}
          style={{
            padding: "8px 12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Export Items as JSON
        </button>

        <button
          onClick={handleImportClick}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Import Items from JSON
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Chest 1 */}
      <div style={{ marginBottom: 32, position: "relative", width: 400 }}>
        <img src={chest1Img} alt="Chest 1" style={{ width: "100%" }} />
        {DRAWERS.map((drawer, i) => (
          <button
            key={drawer}
            onClick={() => handleClick("chest1", drawer)}
            style={{
              position: "absolute",
              top: chest1Positions[i].top,
              left: chest1Positions[i].left,
              padding: "4px 8px",
              backgroundColor: "rgba(0, 123, 255, 0.8)",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {drawer}
          </button>
        ))}
      </div>

      {/* Chest 2 */}
      <div style={{ marginBottom: 32, position: "relative", width: 400 }}>
        <img src={chest2Img} alt="Chest 2" style={{ width: "100%" }} />
        {DRAWERS.map((drawer, i) => (
          <button
            key={drawer}
            onClick={() => handleClick("chest2", drawer)}
            style={{
              position: "absolute",
              top: chest2Positions[i].top,
              left: chest2Positions[i].left,
              padding: "4px 8px",
              backgroundColor: "rgba(220, 53, 69, 0.8)",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {drawer}
          </button>
        ))}
      </div>
    </div>
  );
}
