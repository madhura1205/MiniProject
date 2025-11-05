import React from "react";

export default function EditorRightPanel({
  selectedSegment,
  updateSegment,
  replaceMedia,
  removeMedia,
}) {
  if (!selectedSegment)
    return (
      <aside className="right-panel">
        <div className="muted">Select a clip to edit its properties.</div>
      </aside>
    );

  return (
    <aside className="right-panel">
      <h3>Properties</h3>

      <div className="prop-row">
        <label>Duration</label>
        <input
          type="number"
          value={selectedSegment.duration}
          step="0.1"
          onChange={(e) =>
            updateSegment(selectedSegment.id, {
              duration: parseFloat(e.target.value),
            })
          }
        />
      </div>

      <div className="prop-row">
        <label>Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selectedSegment.opacity}
          onChange={(e) =>
            updateSegment(selectedSegment.id, {
              opacity: parseFloat(e.target.value),
            })
          }
        />
      </div>

      <div className="prop-row">
        <label>Scale</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={selectedSegment.scale}
          onChange={(e) =>
            updateSegment(selectedSegment.id, {
              scale: parseFloat(e.target.value),
            })
          }
        />
      </div>

      <div className="prop-row">
        <label>Replace media</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) replaceMedia(selectedSegment.id, f);
          }}
        />
      </div>

      <button className="btn-outline" onClick={() => removeMedia(selectedSegment.id)}>
        Remove Media
      </button>
    </aside>
  );
}
