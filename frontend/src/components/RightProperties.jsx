// src/components/RightProperties.jsx
import React from "react";

export default function RightProperties({ selectedSegment, updateSegment, replaceMedia, removeMedia, textOverlays, updateTextOverlay }) {
  if (!selectedSegment) {
    return (
      <div className="right-properties">
        <div className="muted">Select a clip to see properties</div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700 }}>Text overlays</div>
          {textOverlays.length === 0 ? <div className="muted">No text overlays</div> : textOverlays.map(t => <div key={t.id}>{t.text}</div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="right-properties">
      <h4>Clip #{selectedSegment.index}</h4>

      <label>Duration (s)</label>
      <input type="number" value={selectedSegment.duration} step="0.1" onChange={(e) => updateSegment(selectedSegment.id, { duration: Number(e.target.value) })} />

      <label>Opacity</label>
      <input type="range" min="0" max="1" step="0.01" value={selectedSegment.opacity ?? 1} onChange={(e) => updateSegment(selectedSegment.id, { opacity: Number(e.target.value) })} />

      <label>Scale</label>
      <input type="range" min="0.5" max="2" step="0.01" value={selectedSegment.scale ?? 1} onChange={(e) => updateSegment(selectedSegment.id, { scale: Number(e.target.value) })} />

      <label>Replace media</label>
      <input type="file" accept="image/*,video/*" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) replaceMedia(selectedSegment.id, f);
      }} />

      <div style={{ marginTop: 8 }}>
        <button className="btn-outline" onClick={() => removeMedia(selectedSegment.id)}>Remove Media</button>
      </div>
    </div>
  );
}
