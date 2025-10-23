import React from "react";
import { useNavigate } from "react-router-dom";
import chest1Img from "../assets/chest1.png";
import chest2Img from "../assets/chest2.png";

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

  const handleClick = (chestId: string, drawer: string) => {
    navigate(`/chest/${chestId}/drawer/${encodeURIComponent(drawer)}`);
  };


  const chest1Positions = [
    { top: 40, left: 160 }, //Top
    { top: 80, left: 80 }, //2nd Left 
    { top: 100, left: 140 }, //3rd Left
    { top: 120, left: 80 }, //4th Left
    { top: 160, left: 120 }, //5th Left
    { top: 80, left: 270 }, //2nd Right
    { top: 100, left: 310 }, //3rd Right
    { top: 120, left: 270 }, //4th Right
    { top: 160, left: 290 }, //5th Right
  ];

  // Example positions for chest2 drawers (can be same or different)
  const chest2Positions = chest1Positions;

  return (
    <div className="container">
      <h2>Tool Chests</h2>

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
