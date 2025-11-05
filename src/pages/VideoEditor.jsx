import React, { useState, useRef, useEffect } from "react";
import "../styles/videoEditor.css";

export default function VideoEditor() {
  const audioRef = useRef(null);
  const timelineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [segments, setSegments] = useState([
    { id: 1, name: "Intro", start: 0, end: 5, color: "#4a90e2" },
    { id: 2, name: "Main", start: 5, end: 15, color: "#e74c3c" },
    { id: 3, name: "Outro", start: 15, end: 20, color: "#2ecc71" },
  ]);
  const [draggedSegment, setDraggedSegment] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimelineClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedTime = (x / rect.width) * duration;
    audioRef.current.currentTime = clickedTime;
    setCurrentTime(clickedTime);
  };

  const handleDragStart = (e, segment) => {
    setDraggedSegment(segment);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedSegment) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newStart = Math.max(0, (x / rect.width) * duration);
    const segmentDuration = draggedSegment.end - draggedSegment.start;

    setSegments(
      segments.map((seg) =>
        seg.id === draggedSegment.id
          ? { ...seg, start: newStart, end: newStart + segmentDuration }
          : seg
      )
    );
    setDraggedSegment(null);
  };

  const splitSegment = () => {
    if (!selectedSegment) return;
    const segment = segments.find((s) => s.id === selectedSegment);
    if (!segment) return;

    const midPoint = (segment.start + segment.end) / 2;
    const newSegment = {
      id: Date.now(),
      name: `${segment.name} (2)`,
      start: midPoint,
      end: segment.end,
      color: segment.color,
    };

    setSegments([
      ...segments.map((s) =>
        s.id === selectedSegment ? { ...s, end: midPoint } : s
      ),
      newSegment,
    ]);
    setSelectedSegment(null);
  };

  const deleteSegment = () => {
    if (!selectedSegment) return;
    setSegments(segments.filter((s) => s.id !== selectedSegment));
    setSelectedSegment(null);
  };

  const addSegment = () => {
    const newSegment = {
      id: Date.now(),
      name: "New Segment",
      start: currentTime,
      end: Math.min(currentTime + 3, duration),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
    setSegments([...segments, newSegment]);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className="editor-container">
      <nav className="editor-navbar">
        <h2 className="editor-title">Beat Canvas Editor</h2>
        <div className="nav-actions">
          <button className="btn-outline">💾 Save</button>
          <button className="btn-outline">📤 Export</button>
        </div>
      </nav>

      <div className="editor-workspace">
        <aside className="editor-sidebar">
          <h3 className="sidebar-title">Tools</h3>
          <button
            className={`tool-btn ${tool === "select" ? "active" : ""}`}
            onClick={() => setTool("select")}
          >
            ⬚ Select
          </button>
          <button
            className={`tool-btn ${tool === "cut" ? "active" : ""}`}
            onClick={() => setTool("cut")}
          >
            ✂ Cut
          </button>
          <button className="tool-btn" onClick={addSegment}>
            ➕ Add Clip
          </button>

          <div className="divider"></div>

          <h3 className="sidebar-title">Actions</h3>
          <button
            className="action-btn"
            onClick={splitSegment}
            disabled={!selectedSegment}
          >
            ⚡ Split
          </button>
          <button
            className="action-btn"
            onClick={deleteSegment}
            disabled={!selectedSegment}
          >
            🗑 Delete
          </button>

          <div className="divider"></div>

          <h3 className="sidebar-title">Zoom</h3>
          <div className="zoom-controls">
            <button
              className="zoom-btn"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              −
            </button>
            <span className="zoom-text">{Math.round(zoom * 100)}%</span>
            <button
              className="zoom-btn"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            >
              +
            </button>
          </div>
        </aside>

        <main className="editor-main">
          <section className="preview-section">
            <div className="preview-box">
              <div className="preview-content">
                <div className="waveform">🎧</div>
                <p className="preview-text">Preview Window</p>
                <p className="preview-subtext">
                  {selectedSegment
                    ? `Selected: ${
                        segments.find((s) => s.id === selectedSegment)?.name
                      }`
                    : "Select a segment to edit"}
                </p>
              </div>
            </div>

            <div className="controls">
              <audio
                ref={audioRef}
                src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_cadf26aaf0.mp3"
                onTimeUpdate={() =>
                  setCurrentTime(audioRef.current?.currentTime || 0)
                }
              ></audio>

              <button
                className="ctrl-btn"
                onClick={() => {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }}
              >
                ⏮
              </button>

              <button className="btn-play" onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button
                className="ctrl-btn"
                onClick={() => {
                  audioRef.current.currentTime = duration;
                  setCurrentTime(duration);
                }}
              >
                ⏭
              </button>

              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </section>

          <section className="timeline-section">
            <div className="timeline-header">
              <h3 className="timeline-title">Timeline</h3>
              <div className="timeline-info">
                {selectedSegment && (
                  <span className="selected-info">
                    ✓ {segments.find((s) => s.id === selectedSegment)?.name}
                  </span>
                )}
              </div>
            </div>

            <div
              ref={timelineRef}
              className="timeline-container"
              onClick={handleTimelineClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="timeline-ruler">
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="ruler-mark">
                    <span className="ruler-label">
                      {formatTime((duration / 10) * i)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="timeline-track">
                {segments.map((segment) => {
                  const left = (segment.start / duration) * 100;
                  const width =
                    ((segment.end - segment.start) / duration) * 100;

                  return (
                    <div
                      key={segment.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, segment)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSegment(segment.id);
                      }}
                      className={`segment ${
                        selectedSegment === segment.id ? "selected" : ""
                      }`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: segment.color,
                      }}
                    >
                      <span className="segment-name">{segment.name}</span>
                    </div>
                  );
                })}

                <div
                  className="playhead"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="playhead-line"></div>
                  <div className="playhead-top"></div>
                </div>
              </div>
            </div>

            <div className="track-labels">
              <div className="track-label">🎵 Audio Track</div>
              <div className="track-label">🎬 Video Track</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
