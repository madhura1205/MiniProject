// src/components/TextPanel.jsx
import React from "react";

export default function TextPanel({ textOverlays, addTextOverlay, updateTextOverlay, removeTextOverlay }) {
  return (
    <div className="text-panel">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn-outline" onClick={addTextOverlay}>+ Add Text</button>
      </div>

      <div className="text-list">
        {textOverlays.length === 0 && <div className="muted">No text overlays yet.</div>}
        {textOverlays.map(t => (
          <div key={t.id} className="text-item">
            <input value={t.text} onChange={(e) => updateTextOverlay(t.id, { text: e.target.value })} />
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-outline" onClick={() => updateTextOverlay(t.id, { start: Math.max(0, t.start - 1) })}>-1s</button>
              <button className="btn-outline" onClick={() => updateTextOverlay(t.id, { start: t.start + 1 })}>+1s</button>
              <button className="btn-outline" onClick={() => removeTextOverlay(t.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
