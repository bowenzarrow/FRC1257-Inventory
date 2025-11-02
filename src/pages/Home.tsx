import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import chest1Img from "../assets/chest1.png";
import chest2Img from "../assets/chest2.png";
import { useItems } from "../contexts/ItemsContext";
import { Item } from "../types";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

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
  useDocumentTitle("Inventory Home");
  const navigate = useNavigate();
  const { items, setItems } = useItems();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (chestId: string, drawer: string) => {
    navigate(`/chest/${chestId}/drawer/${encodeURIComponent(drawer)}`);
  };

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

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const importedItems: Item[] = JSON.parse(text);
        if (Array.isArray(importedItems)) {
          setItems(importedItems);
          alert("Items imported successfully!");
        } else alert("Invalid JSON format");
      } catch (err) {
        console.error(err);
        alert("Error reading JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const chest1Positions = [
    { top: 80, left: 160 },
    { top: 120, left: 80 },
    { top: 140, left: 140 },
    { top: 160, left: 80 },
    { top: 200, left: 120 },
    { top: 120, left: 270 },
    { top: 140, left: 310 },
    { top: 160, left: 270 },
    { top: 200, left: 290 },
  ];

  const chest2Positions = chest1Positions;

  return (
    <div className="container">
      <h2>Tool Chests</h2>

      {/* Top controls */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
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

        <button
          onClick={() => navigate("/categories")}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          View Categories
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Chest 1 */}
      <div style={{ marginBottom: 32, position: "relative", width: 400, textAlign: "center" }}>
        <h3 style={{ marginTop: 8 }}>Electronics Chest</h3>
        <img src={chest1Img} alt="Electronics Chest" style={{ width: "100%" }} />
        {DRAWERS.map((drawer, i) => (
          <button
            key={drawer}
            onClick={() => handleClick("Electronics Chest", drawer)}
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
      <div style={{ marginBottom: 32, position: "relative", width: 400, textAlign: "center" }}>
        <h3 style={{ marginTop: 8 }}>Build Chest</h3>
        <img src={chest2Img} alt="Build Chest" style={{ width: "100%" }} />
        {DRAWERS.map((drawer, i) => (
          <button
            key={drawer}
            onClick={() => handleClick("Build Chest", drawer)}
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
