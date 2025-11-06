// import React, { useState, useRef, useEffect } from "react";
// import "../styles/videoEditor.css";

// export default function VideoEditor() {
//   const audioRef = useRef(null);
//   const timelineRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [segments, setSegments] = useState([
//     { id: 1, name: "Intro", start: 0, end: 5, color: "#4a90e2" },
//     { id: 2, name: "Main", start: 5, end: 15, color: "#e74c3c" },
//     { id: 3, name: "Outro", start: 15, end: 20, color: "#2ecc71" },
//   ]);
//   const [draggedSegment, setDraggedSegment] = useState(null);
//   const [selectedSegment, setSelectedSegment] = useState(null);
//   const [tool, setTool] = useState("select");
//   const [zoom, setZoom] = useState(1);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.addEventListener("loadedmetadata", () => {
//         setDuration(audio.duration);
//       });
//     }
//   }, []);

//   const togglePlay = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     if (audio.paused) {
//       audio.play();
//       setIsPlaying(true);
//     } else {
//       audio.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleTimelineClick = (e) => {
//     const rect = timelineRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const clickedTime = (x / rect.width) * duration;
//     audioRef.current.currentTime = clickedTime;
//     setCurrentTime(clickedTime);
//   };

//   const handleDragStart = (e, segment) => {
//     setDraggedSegment(segment);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (!draggedSegment) return;

//     const rect = timelineRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const newStart = Math.max(0, (x / rect.width) * duration);
//     const segmentDuration = draggedSegment.end - draggedSegment.start;

//     setSegments(
//       segments.map((seg) =>
//         seg.id === draggedSegment.id
//           ? { ...seg, start: newStart, end: newStart + segmentDuration }
//           : seg
//       )
//     );
//     setDraggedSegment(null);
//   };

//   const splitSegment = () => {
//     if (!selectedSegment) return;
//     const segment = segments.find((s) => s.id === selectedSegment);
//     if (!segment) return;

//     const midPoint = (segment.start + segment.end) / 2;
//     const newSegment = {
//       id: Date.now(),
//       name: `${segment.name} (2)`,
//       start: midPoint,
//       end: segment.end,
//       color: segment.color,
//     };

//     setSegments([
//       ...segments.map((s) =>
//         s.id === selectedSegment ? { ...s, end: midPoint } : s
//       ),
//       newSegment,
//     ]);
//     setSelectedSegment(null);
//   };

//   const deleteSegment = () => {
//     if (!selectedSegment) return;
//     setSegments(segments.filter((s) => s.id !== selectedSegment));
//     setSelectedSegment(null);
//   };

//   const addSegment = () => {
//     const newSegment = {
//       id: Date.now(),
//       name: "New Segment",
//       start: currentTime,
//       end: Math.min(currentTime + 3, duration),
//       color: "#" + Math.floor(Math.random() * 16777215).toString(16),
//     };
//     setSegments([...segments, newSegment]);
//   };

//   const formatTime = (time) => {
//     const mins = Math.floor(time / 60);
//     const secs = Math.floor(time % 60);
//     const ms = Math.floor((time % 1) * 10);
//     return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
//   };

//   return (
//     <div className="editor-container">
//       <nav className="editor-navbar">
//         <h2 className="editor-title">Beat Canvas Editor</h2>
//         <div className="nav-actions">
//           <button className="btn-outline">💾 Save</button>
//           <button className="btn-outline">📤 Export</button>
//         </div>
//       </nav>

//       <div className="editor-workspace">
//         <aside className="editor-sidebar">
//           <h3 className="sidebar-title">Tools</h3>
//           <button
//             className={`tool-btn ${tool === "select" ? "active" : ""}`}
//             onClick={() => setTool("select")}
//           >
//             ⬚ Select
//           </button>
//           <button
//             className={`tool-btn ${tool === "cut" ? "active" : ""}`}
//             onClick={() => setTool("cut")}
//           >
//             ✂ Cut
//           </button>
//           <button className="tool-btn" onClick={addSegment}>
//             ➕ Add Clip
//           </button>

//           <div className="divider"></div>

//           <h3 className="sidebar-title">Actions</h3>
//           <button
//             className="action-btn"
//             onClick={splitSegment}
//             disabled={!selectedSegment}
//           >
//             ⚡ Split
//           </button>
//           <button
//             className="action-btn"
//             onClick={deleteSegment}
//             disabled={!selectedSegment}
//           >
//             🗑 Delete
//           </button>

//           <div className="divider"></div>

//           <h3 className="sidebar-title">Zoom</h3>
//           <div className="zoom-controls">
//             <button
//               className="zoom-btn"
//               onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
//             >
//               −
//             </button>
//             <span className="zoom-text">{Math.round(zoom * 100)}%</span>
//             <button
//               className="zoom-btn"
//               onClick={() => setZoom(Math.min(3, zoom + 0.25))}
//             >
//               +
//             </button>
//           </div>
//         </aside>

//         <main className="editor-main">
//           <section className="preview-section">
//             <div className="preview-box">
//               <div className="preview-content">
//                 <div className="waveform">🎧</div>
//                 <p className="preview-text">Preview Window</p>
//                 <p className="preview-subtext">
//                   {selectedSegment
//                     ? `Selected: ${
//                         segments.find((s) => s.id === selectedSegment)?.name
//                       }`
//                     : "Select a segment to edit"}
//                 </p>
//               </div>
//             </div>

//             <div className="controls">
//               <audio
//                 ref={audioRef}
//                 src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_cadf26aaf0.mp3"
//                 onTimeUpdate={() =>
//                   setCurrentTime(audioRef.current?.currentTime || 0)
//                 }
//               ></audio>

//               <button
//                 className="ctrl-btn"
//                 onClick={() => {
//                   audioRef.current.currentTime = 0;
//                   setCurrentTime(0);
//                 }}
//               >
//                 ⏮
//               </button>

//               <button className="btn-play" onClick={togglePlay}>
//                 {isPlaying ? "⏸" : "▶"}
//               </button>

//               <button
//                 className="ctrl-btn"
//                 onClick={() => {
//                   audioRef.current.currentTime = duration;
//                   setCurrentTime(duration);
//                 }}
//               >
//                 ⏭
//               </button>

//               <span className="time-display">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>
//           </section>

//           <section className="timeline-section">
//             <div className="timeline-header">
//               <h3 className="timeline-title">Timeline</h3>
//               <div className="timeline-info">
//                 {selectedSegment && (
//                   <span className="selected-info">
//                     ✓ {segments.find((s) => s.id === selectedSegment)?.name}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div
//               ref={timelineRef}
//               className="timeline-container"
//               onClick={handleTimelineClick}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             >
//               <div className="timeline-ruler">
//                 {[...Array(11)].map((_, i) => (
//                   <div key={i} className="ruler-mark">
//                     <span className="ruler-label">
//                       {formatTime((duration / 10) * i)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="timeline-track">
//                 {segments.map((segment) => {
//                   const left = (segment.start / duration) * 100;
//                   const width =
//                     ((segment.end - segment.start) / duration) * 100;

//                   return (
//                     <div
//                       key={segment.id}
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, segment)}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedSegment(segment.id);
//                       }}
//                       className={`segment ${
//                         selectedSegment === segment.id ? "selected" : ""
//                       }`}
//                       style={{
//                         left: `${left}%`,
//                         width: `${width}%`,
//                         backgroundColor: segment.color,
//                       }}
//                     >
//                       <span className="segment-name">{segment.name}</span>
//                     </div>
//                   );
//                 })}

//                 <div
//                   className="playhead"
//                   style={{ left: `${(currentTime / duration) * 100}%` }}
//                 >
//                   <div className="playhead-line"></div>
//                   <div className="playhead-top"></div>
//                 </div>
//               </div>
//             </div>

//             <div className="track-labels">
//               <div className="track-label">🎵 Audio Track</div>
//               <div className="track-label">🎬 Video Track</div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }











import React, { useState, useRef, useEffect } from "react";
import "../styles/videoEditor.css";

export default function VideoEditor() {
  const audioRef = useRef(null);
  const timelineRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_cadf26aaf0.mp3"
  );

  const [segments, setSegments] = useState([
    { id: 1, name: "Intro", start: 0, end: 5, color: "#4a90e2", file: null },
    { id: 2, name: "Main", start: 5, end: 15, color: "#e74c3c", file: null },
    { id: 3, name: "Outro", start: 15, end: 20, color: "#2ecc71", file: null },
  ]);

  const [draggedSegment, setDraggedSegment] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      const d = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(d);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    if (audio.readyState >= 1) onLoaded();

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioURL]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimelineClick = (e) => {
    if (!timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clickedTime = (clampedX / rect.width) * duration;
    audioRef.current.currentTime = clickedTime;
    setCurrentTime(clickedTime);
  };

  const handleDragStart = (e, segment) => {
    setDraggedSegment(segment);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedSegment || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newStart = Math.max(0, (x / rect.width) * duration);
    const segDur = draggedSegment.end - draggedSegment.start;
    const newEnd = Math.min(duration, newStart + segDur);
    setSegments((prev) =>
      prev.map((s) =>
        s.id === draggedSegment.id
          ? { ...s, start: newStart, end: newEnd }
          : s
      )
    );
    setDraggedSegment(null);
  };

  const splitSegment = () => {
    if (!selectedSegment) return;
    const seg = segments.find((s) => s.id === selectedSegment);
    if (!seg) return;
    const splitAt = (seg.start + seg.end) / 2;
    const newSeg = {
      id: Date.now(),
      name: `${seg.name} (2)`,
      start: splitAt,
      end: seg.end,
      color: seg.color,
      file: seg.file,
      type: seg.type,
    };
    setSegments((prev) =>
      [
        ...prev.map((s) =>
          s.id === selectedSegment ? { ...s, end: splitAt } : s
        ),
        newSeg,
      ].sort((a, b) => a.start - b.start)
    );
    setSelectedSegment(null);
  };

  const deleteSegment = () => {
    if (!selectedSegment) return;
    setSegments((prev) => prev.filter((s) => s.id !== selectedSegment));
    setSelectedSegment(null);
  };

  // 📁 Trigger upload dialog
  const handleAddClip = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image");
    const start = Math.min(currentTime, duration);

    if (isImage) {
      // Image → fixed 3 seconds
      const newSeg = {
        id: Date.now(),
        name: file.name,
        start,
        end: Math.min(start + 3, duration + 3),
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        file: fileURL,
        type: "image",
      };
      setSegments((prev) => [...prev, newSeg]);
      e.target.value = "";
    } else {
      // Video → detect real duration
      const tempVideo = document.createElement("video");
      tempVideo.src = fileURL;
      tempVideo.preload = "metadata";
      tempVideo.onloadedmetadata = () => {
        const vidDuration = tempVideo.duration || 5;
        const newSeg = {
          id: Date.now(),
          name: file.name,
          start,
          end: Math.min(start + vidDuration, duration + vidDuration),
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          file: fileURL,
          type: "video",
        };
        setSegments((prev) => [...prev, newSeg]);
        e.target.value = "";
      };
    }
  };

  const handleAudioUploadClick = () => {
    if (audioInputRef.current) audioInputRef.current.click();
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioURL(url);
    setCurrentTime(0);
    setIsPlaying(false);
    e.target.value = "";
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time) || time <= 0) return "0:00.0";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  const safeDuration = duration > 0 ? duration : 1;

  return (
    <div className="editor-container">
      <nav className="editor-navbar">
        <h2 className="editor-title">Beat Canvas Editor</h2>
        <div className="nav-actions">
          <button className="btn-outline" onClick={handleAudioUploadClick}>
            🎵 Upload Audio
          </button>
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
          <button className="tool-btn" onClick={handleAddClip}>
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

          {/* Hidden upload inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            style={{ display: "none" }}
            onChange={handleVideoUpload}
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleAudioFileUpload}
          />
        </aside>

        <main className="editor-main">
          <section className="preview-section">
            <div className="preview-box">
              <div className="preview-content">
                {selectedSegment &&
                segments.find((s) => s.id === selectedSegment)?.file ? (
                  segments.find((s) => s.id === selectedSegment)?.type ===
                  "image" ? (
                    <img
                      src={segments.find((s) => s.id === selectedSegment)?.file}
                      alt="Preview"
                      style={{ width: "100%", borderRadius: "10px" }}
                    />
                  ) : (
                    <video
                      src={segments.find((s) => s.id === selectedSegment)?.file}
                      width="100%"
                      height="auto"
                      controls
                    />
                  )
                ) : (
                  <>
                    <div className="waveform">🎧</div>
                    <p className="preview-text">Preview Window</p>
                    <p className="preview-subtext">
                      {selectedSegment
                        ? `Selected: ${
                            segments.find((s) => s.id === selectedSegment)?.name
                          }`
                        : "Select or upload a clip"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="controls">
              <audio ref={audioRef} src={audioURL}></audio>

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
                      {formatTime((safeDuration / 10) * i)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="timeline-track"
                style={{
                  transform: `scaleX(${zoom})`,
                  transformOrigin: "left center",
                }}
              >
                {segments.map((segment) => {
                  const left = (segment.start / safeDuration) * 100;
                  const width =
                    ((segment.end - segment.start) / safeDuration) * 100;

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
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {segment.file ? (
                        segment.type === "image" ? (
                          <img
                            src={segment.file}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: 0.85,
                            }}
                          />
                        ) : (
                          <video
                            src={segment.file}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: 0.85,
                            }}
                            muted
                            loop
                            playsInline
                          />
                        )
                      ) : (
                        <span className="segment-name">{segment.name}</span>
                      )}
                    </div>
                  );
                })}

                <div
                  className="playhead"
                  style={{
                    left: `${Math.max(
                      0,
                      Math.min((currentTime / safeDuration) * 100, 100)
                    )}%`,
                  }}
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














































///////////////////////////final
///////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useRef, useEffect } from "react";
// import "../styles/videoEditor.css";
// import { useLocation, useNavigate } from "react-router-dom";

// /*
//   VideoEditor features:
//   - Builds segments from beats passed in location.state
//   - Drag segments horizontally to reposition
//   - Resize segment (right handle) to change length
//   - Click segment to open file picker to replace/add image
//   - Photo pool (from previous page) - drag onto segment by dropping file into it
//   - Audio playback syncs playhead
//   - Save / Export (download JSON)
//   - LocalStorage autosave
// */

// export default function VideoEditor() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { beats = null, duration = 0, tempo = null, photos = {}, audioURL = null } =
//     (location && location.state) || {};

//   const audioRef = useRef(null);
//   const timelineRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [segments, setSegments] = useState([]);
//   const [selectedSegment, setSelectedSegment] = useState(null);
//   const [dragging, setDragging] = useState(null); // { id, startX, origStart, origEnd }
//   const [resizing, setResizing] = useState(null); // { id, startX, origEnd }
//   const filePickers = useRef({}); // input refs per segment
//   const [photoPool, setPhotoPool] = useState(photos || {});

//   // Initialize segments from beats on mount
//   useEffect(() => {
//     // if no beats provided, redirect back
//     if (!beats || beats.length === 0) {
//       // keep using a fallback segment if needed
//       const saved = localStorage.getItem("vc_segments");
//       if (saved) {
//         setSegments(JSON.parse(saved));
//       } else {
//         setSegments([
//           { id: 1, name: "Clip 1", start: 0, end: Math.min(3, duration || 10), color: "#4a90e2", media: null },
//         ]);
//       }
//       return;
//     }

//     // Build segments: start at beat[i], end at beat[i+1] or beat+defaultGap
//     const segs = beats.map((b, i) => {
//       const next = beats[i + 1] ?? Math.min(b + 1.5, duration || b + 1.5);
//       return {
//         id: Date.now() + i,
//         name: `Clip ${i + 1}`,
//         start: parseFloat(b),
//         end: parseFloat(next),
//         color: ["#4a90e2", "#e74c3c", "#2ecc71", "#f39c12"][(i % 4)],
//         media: null, // image/video src
//       };
//     });
//     setSegments(segs);

//     // autosave initial
//     localStorage.setItem("vc_segments", JSON.stringify(segs));
//   }, [beats, duration]);

//   // audio time update
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     const onTime = () => setCurrentTime(audio.currentTime);
//     audio.addEventListener("timeupdate", onTime);
//     audio.addEventListener("ended", () => setIsPlaying(false));
//     return () => {
//       audio.removeEventListener("timeupdate", onTime);
//     };
//   }, []);

//   // toggle play
//   const togglePlay = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     if (audio.paused) {
//       audio.play();
//       setIsPlaying(true);
//     } else {
//       audio.pause();
//       setIsPlaying(false);
//     }
//   };

//   // timeline click to seek
//   const handleTimelineClick = (e) => {
//     const rect = timelineRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const clickedTime = (x / rect.width) * (duration || 1);
//     audioRef.current.currentTime = clickedTime;
//     setCurrentTime(clickedTime);
//   };

//   // start dragging a segment
//   const onSegmentDragStart = (e, seg) => {
//     e.dataTransfer?.setData("text/plain", String(seg.id)); // for desktop drag API
//     setDragging({
//       id: seg.id,
//       startX: e.clientX,
//       origStart: seg.start,
//       origEnd: seg.end,
//     });
//   };

//   // on drag over timeline to allow drop
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   // drop segment to move
//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (!dragging) return;
//     const rect = timelineRef.current.getBoundingClientRect();
//     const deltaX = e.clientX - dragging.startX;
//     const deltaTime = (deltaX / rect.width) * (duration || 1);
//     let newStart = Math.max(0, dragging.origStart + deltaTime);
//     let newEnd = Math.min(duration, dragging.origEnd + deltaTime);

//     // clamp
//     if (newEnd > duration) {
//       const shift = newEnd - duration;
//       newEnd -= shift;
//       newStart -= shift;
//       newStart = Math.max(0, newStart);
//     }

//     setSegments((prev) =>
//       prev.map((s) =>
//         s.id === dragging.id ? { ...s, start: newStart, end: newEnd } : s
//       )
//     );
//     setDragging(null);
//   };

//   // mouse move for resizing/dragging (for non-native drag)
//   useEffect(() => {
//     const onMouseMove = (e) => {
//       if (resizing) {
//         const rect = timelineRef.current.getBoundingClientRect();
//         const deltaX = e.clientX - resizing.startX;
//         const deltaTime = (deltaX / rect.width) * (duration || 1);
//         let newEnd = Math.max(resizing.origEnd + deltaTime, resizing.minEnd); // avoid negative len
//         newEnd = Math.min(newEnd, duration);
//         setSegments((prev) =>
//           prev.map((s) => (s.id === resizing.id ? { ...s, end: newEnd } : s))
//         );
//       } else if (dragging && dragging.mouseDrag) {
//         const rect = timelineRef.current.getBoundingClientRect();
//         const deltaX = e.clientX - dragging.startX;
//         const deltaTime = (deltaX / rect.width) * (duration || 1);
//         let newStart = Math.max(0, dragging.origStart + deltaTime);
//         let newEnd = Math.min(duration, dragging.origEnd + deltaTime);
//         if (newEnd > duration) {
//           const shift = newEnd - duration;
//           newEnd -= shift;
//           newStart -= shift;
//           newStart = Math.max(0, newStart);
//         }
//         setSegments((prev) =>
//           prev.map((s) =>
//             s.id === dragging.id ? { ...s, start: newStart, end: newEnd } : s
//           )
//         );
//       }
//     };

//     const onMouseUp = () => {
//       if (resizing) {
//         setResizing(null);
//         localStorage.setItem("vc_segments", JSON.stringify(segments));
//       }
//       if (dragging && dragging.mouseDrag) {
//         setDragging(null);
//         localStorage.setItem("vc_segments", JSON.stringify(segments));
//       }
//     };

//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     };
//   }, [resizing, dragging, duration, segments]);

//   // start resize: hold right handle
//   const startResize = (e, seg) => {
//     e.stopPropagation();
//     setResizing({
//       id: seg.id,
//       startX: e.clientX,
//       origEnd: seg.end,
//       minEnd: seg.start + 0.2,
//     });
//   };

//   // start non-native drag move (mousedown on segment body)
//   const startMouseDrag = (e, seg) => {
//     e.stopPropagation();
//     setDragging({
//       id: seg.id,
//       startX: e.clientX,
//       origStart: seg.start,
//       origEnd: seg.end,
//       mouseDrag: true,
//     });
//   };

//   // click segment -> select and open file picker
//   const onSegmentClick = (e, seg) => {
//     e.stopPropagation();
//     setSelectedSegment(seg.id);
//   };

//   // open file picker programmatically for selected segment
//   const openPickerForSegment = (id) => {
//     if (filePickers.current[id]) filePickers.current[id].click();
//   };

//   // handle media file drop into segment (from pool or external)
//   const handleSegmentMediaDrop = (e, seg) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       const url = URL.createObjectURL(file);
//       setSegments((prev) => prev.map((s) => (s.id === seg.id ? { ...s, media: url } : s)));
//       // add to pool as well
//       setPhotoPool((prev) => ({ ...prev, [Object.keys(prev).length]: url }));
//     } else {
//       // some browsers may send dataTransfer.getData
//       const data = e.dataTransfer.getData("text/plain");
//       if (data && photoPool[data]) {
//         setSegments((prev) => prev.map((s) => (s.id === seg.id ? { ...s, media: photoPool[data] } : s)));
//       }
//     }
//   };

//   // drop file from pool by dragging an <img> element (we set dataTransfer data as index)
//   const onPoolDragStart = (e, key) => {
//     e.dataTransfer.setData("text/plain", String(key));
//   };

//   // handle image file chosen via input
//   const handleFileInput = (e, seg) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setSegments((prev) => prev.map((s) => (s.id === seg.id ? { ...s, media: url } : s)));
//     setPhotoPool((prev) => ({ ...prev, [Object.keys(prev).length]: url }));
//   };

//   // add a new empty segment at current time with default length
//   const addSegment = () => {
//     const newSeg = {
//       id: Date.now(),
//       name: "New Clip",
//       start: Math.min(currentTime, Math.max(0, (duration || 10) - 2)),
//       end: Math.min((currentTime || 0) + 2, duration || (currentTime || 0) + 2),
//       color: "#" + Math.floor(Math.random() * 16777215).toString(16),
//       media: null,
//     };
//     setSegments((prev) => [...prev, newSeg]);
//   };

//   // delete selected
//   const deleteSegment = () => {
//     if (!selectedSegment) return;
//     setSegments((prev) => prev.filter((s) => s.id !== selectedSegment));
//     setSelectedSegment(null);
//   };

//   // split selected at currentTime
//   const splitSegment = () => {
//     if (!selectedSegment) return;
//     const seg = segments.find((s) => s.id === selectedSegment);
//     if (!seg) return;
//     const t = currentTime;
//     if (t <= seg.start + 0.1 || t >= seg.end - 0.1) return;
//     const left = { ...seg, end: t };
//     const right = {
//       ...seg,
//       id: Date.now(),
//       start: t,
//       end: seg.end,
//       name: seg.name + " (2)",
//     };
//     setSegments((prev) => [...prev.filter((s) => s.id !== seg.id), left, right]);
//   };

//   // export segments to JSON and download
//   const exportJSON = () => {
//     const payload = { segments, tempo, duration };
//     const dataStr =
//       "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
//     const dlAnchor = document.createElement("a");
//     dlAnchor.setAttribute("href", dataStr);
//     dlAnchor.setAttribute("download", "segments.json");
//     dlAnchor.click();
//   };

//   // save to local
//   const saveLocal = () => {
//     localStorage.setItem("vc_segments", JSON.stringify(segments));
//     alert("Saved locally.");
//   };

//   // utility: format time mm:ss.ms
//   const formatTime = (time) => {
//     if (!isFinite(time)) return "0:00.0";
//     const mins = Math.floor(time / 60);
//     const secs = Math.floor(time % 60).toString().padStart(2, "0");
//     const ms = Math.floor((time % 1) * 10);
//     return `${mins}:${secs}.${ms}`;
//   };

//   // segments render helpers
//   const segLeftPercent = (s) => ((s.start / (duration || 1)) * 100).toFixed(4);
//   const segWidthPercent = (s) => (((s.end - s.start) / (duration || 1)) * 100).toFixed(4);

//   return (
//     <div className="editor-container">
//       <nav className="editor-navbar">
//         <h2 className="editor-title">Beat Canvas Editor</h2>
//         <div className="nav-actions">
//           <button className="btn-outline" onClick={saveLocal}>💾 Save</button>
//           <button className="btn-outline" onClick={exportJSON}>📤 Export</button>
//           <button className="btn-outline" onClick={() => navigate(-1)}>🔙 Back</button>
//         </div>
//       </nav>

//       <div className="editor-workspace">
//         <aside className="editor-sidebar">
//           <h3 className="sidebar-title">Photo Pool</h3>
//           <div className="photo-pool">
//             {Object.keys(photoPool).length === 0 && <div style={{color:"#666"}}>No photos yet — add from Beat Detection</div>}
//             {Object.entries(photoPool).map(([k, src]) => (
//               <img
//                 key={k}
//                 src={src}
//                 draggable
//                 onDragStart={(e) => onPoolDragStart(e, k)}
//                 alt={"pool-" + k}
//                 className="pool-photo"
//               />
//             ))}
//           </div>

//           <div style={{marginTop:12}}>
//             <button className="action-btn" onClick={addSegment}>➕ Add Clip</button>
//             <button className="action-btn" onClick={splitSegment} disabled={!selectedSegment}>⚡ Split</button>
//             <button className="action-btn" onClick={deleteSegment} disabled={!selectedSegment}>🗑 Delete</button>
//           </div>
//         </aside>

//         <main className="editor-main">
//           <section className="preview-section">
//             <div className="preview-box">
//               <div className="preview-content">
//                 <div className="waveform">🎧</div>
//                 <p className="preview-text">Preview Window</p>
//                 <p className="preview-subtext">
//                   {selectedSegment
//                     ? `Selected: ${segments.find((s) => s.id === selectedSegment)?.name}`
//                     : "Select a segment to edit"}
//                 </p>
//                 {selectedSegment && (
//                   <div style={{marginTop:8}}>
//                     <button onClick={() => openPickerForSegment(selectedSegment)}>Replace Media</button>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       ref={(el) => (filePickers.current[selectedSegment] = el)}
//                       style={{display:"none"}}
//                       onChange={(e) => handleFileInput(e, segments.find(s=>s.id===selectedSegment))}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="controls">
//               <audio
//                 ref={audioRef}
//                 src={audioURL || ""}
//                 onLoadedMetadata={() => {
//                   if (audioRef.current && duration === 0) {
//                     // maybe set duration
//                   }
//                 }}
//                 onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
//               />
//               <button className="ctrl-btn" onClick={() => { audioRef.current.currentTime = 0; setCurrentTime(0); }}>⏮</button>
//               <button className="btn-play" onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
//               <button className="ctrl-btn" onClick={() => { audioRef.current.currentTime = duration; setCurrentTime(duration); }}>⏭</button>

//               <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
//             </div>
//           </section>

//           <section className="timeline-section">
//             <div className="timeline-header">
//               <h3 className="timeline-title">Timeline</h3>
//               <div className="timeline-info">
//                 {tempo && <span style={{marginRight:10}}>Tempo: {Math.round(tempo)} BPM</span>}
//                 <span className="selected-info">{selectedSegment ? `Selected: ${selectedSegment}` : ""}</span>
//               </div>
//             </div>

//             <div
//               ref={timelineRef}
//               className="timeline-container"
//               onClick={handleTimelineClick}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             >
//               <div className="timeline-ruler">
//                 {[...Array(11)].map((_, i) => (
//                   <div key={i} className="ruler-mark">
//                     <span className="ruler-label">{formatTime((duration / 10) * i)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="timeline-track">
//                 {segments.map((segment) => {
//                   const left = segLeftPercent(segment);
//                   const width = segWidthPercent(segment);
//                   return (
//                     <div
//                       key={segment.id}
//                       draggable
//                       onDragStart={(e) => onSegmentDragStart(e, segment)}
//                       onClick={(e) => onSegmentClick(e, segment)}
//                       onDoubleClick={() => openPickerForSegment(segment.id)}
//                       onDrop={(e) => handleSegmentMediaDrop(e, segment)}
//                       onDragOver={(e) => e.preventDefault()}
//                       className={`segment ${selectedSegment === segment.id ? "selected" : ""}`}
//                       style={{
//                         left: `${left}%`,
//                         width: `${width}%`,
//                         backgroundColor: segment.color,
//                       }}
//                     >
//                       <div
//                         className="segment-body"
//                         onMouseDown={(e) => startMouseDrag(e, segment)}
//                         style={{ cursor: "grab" }}
//                       >
//                         <span className="segment-name">{segment.name}</span>
//                         <div className="segment-media-preview">
//                           {segment.media ? <img src={segment.media} alt="seg-media" /> : <span style={{opacity:0.6}}>No media</span>}
//                         </div>
//                       </div>

//                       {/* right resize handle */}
//                       <div
//                         className="resize-handle"
//                         onMouseDown={(e) => startResize(e, segment)}
//                       />

//                       {/* hidden file input */}
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         ref={(el) => (filePickers.current[segment.id] = el)}
//                         style={{ display: "none" }}
//                         onChange={(e) => handleFileInput(e, segment)}
//                       />

//                       {/* simple time labels */}
//                       <div className="segment-times">
//                         <small>{formatTime(segment.start)}</small> - <small>{formatTime(segment.end)}</small>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* playhead */}
//                 <div
//                   className="playhead"
//                   style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
//                 >
//                   <div className="playhead-line"></div>
//                   <div className="playhead-top"></div>
//                 </div>
//               </div>
//             </div>

//             <div className="track-labels">
//               <div className="track-label">🎵 Audio Track</div>
//               <div className="track-label">🎬 Video Track</div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }


///////////

// import React, { useState, useRef, useEffect } from "react";
// import "../styles/videoEditor.css";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function VideoEditor() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { beats = [], duration = 0, tempo = null, photos = {}, audioURL = null } =
//     location.state || {};

//   const audioRef = useRef(null);
//   const timelineRef = useRef(null);
//   const videoRef = useRef(null);
//   const filePickers = useRef({});

//   const [segments, setSegments] = useState([]);
//   const [selectedSegment, setSelectedSegment] = useState(null);
//   const [photoPool, setPhotoPool] = useState(photos);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [previewURL, setPreviewURL] = useState(null);
//   const [loadingPreview, setLoadingPreview] = useState(false);

//   // Initialize segments
//   useEffect(() => {
//     if (!beats.length) return;
//     const segs = beats.map((b, i) => ({
//       id: i + 1,
//       name: `Clip ${i + 1}`,
//       start: b,
//       end: beats[i + 1] || duration,
//       color: ["#4a90e2", "#e74c3c", "#2ecc71", "#f39c12"][i % 4],
//       media: null,
//     }));
//     setSegments(segs);
//   }, [beats, duration]);

//   // Play audio and update time
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     const update = () => setCurrentTime(audio.currentTime);
//     audio.addEventListener("timeupdate", update);
//     audio.addEventListener("ended", () => setIsPlaying(false));
//     return () => {
//       audio.removeEventListener("timeupdate", update);
//     };
//   }, []);

//   // Toggle play/pause
//   const togglePlay = () => {
//     const audio = audioRef.current;
//     if (audio.paused) {
//       audio.play();
//       setIsPlaying(true);
//     } else {
//       audio.pause();
//       setIsPlaying(false);
//     }
//   };

//   // Handle image selection for segment
//   const handleFileInput = (e, seg) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setSegments((prev) =>
//       prev.map((s) => (s.id === seg.id ? { ...s, media: url, blob: file } : s))
//     );
//   };

//   // Automatically show preview (sync with backend)
//   useEffect(() => {
//     // const generatePreview = async () => {
//     //   try {
//     //     setLoadingPreview(true);
//     //     const formData = new FormData();
//     //     formData.append("audio", await fetch(audioURL).then((r) => r.blob()));

//     //     const cleanSegments = segments
//     //       .filter((s) => s.media)
//     //       .map((s) => ({
//     //         id: s.id,
//     //         start: s.start,
//     //         end: s.end,
//     //         media: s.media,
//     //         blob: s.blob,
//     //       }));

//     //     formData.append(
//     //       "metadata",
//     //       JSON.stringify({ segments: cleanSegments })
//     //     );

//     //     const res = await fetch("http://127.0.0.1:8000/generate-preview", {
//     //       method: "POST",
//     //       body: formData,
//     //     });

//     //     if (!res.ok) throw new Error("Failed to generate preview");
//     //     const blob = await res.blob();
//     //     const url = URL.createObjectURL(blob);
//     //     setPreviewURL(url);
//     //   } catch (err) {
//     //     console.error(err);
//     //     alert("Error generating preview video");
//     //   } finally {
//     //     setLoadingPreview(false);
//     //   }
//     // };

//     // Inside your `VideoEditor.jsx` component

// const generatePreview = async () => {
//   try {
//     setLoadingPreview(true);

//     const formData = new FormData();

//     // Attach the audio file
//     const audioBlob = await fetch(audioURL).then((r) => r.blob());
//     formData.append("audio", audioBlob, "audio.mp3");

//     // Filter segments that have an image
//     const cleanSegments = segments
//       .filter((s) => s.media && s.blob)
//       .map((s, i) => ({
//         id: s.id,
//         start: s.start,
//         end: s.end,
//         file_field: `file${i}`, // this tells backend which blob to use
//       }));

//     // Attach image blobs
//     cleanSegments.forEach((seg, i) => {
//       formData.append(seg.file_field, seg.blob, `frame_${i}.jpg`);
//     });

//     // Add metadata JSON
//     formData.append("metadata", JSON.stringify({ segments: cleanSegments }));

//     // Send to backend
//     const res = await fetch("http://127.0.0.1:8000/generate-preview", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Failed to generate preview");
//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     setPreviewURL(url);
//   } catch (err) {
//     console.error(err);
//     alert("Error generating preview video");
//   } finally {
//     setLoadingPreview(false);
//   }
// };

//     if (beats.length) {
//       generatePreview();
//     }
//   }, [beats, audioURL]);

//   // Render formatted time
//   const formatTime = (t) => {
//     const mins = Math.floor(t / 60);
//     const secs = Math.floor(t % 60);
//     const ms = Math.floor((t % 1) * 10);
//     return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
//   };

//   // Update segments' start and end time on timeline interaction
//   const handleTimelineClick = (e) => {
//     const rect = timelineRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const clickedTime = (x / rect.width) * (duration || 1);
//     audioRef.current.currentTime = clickedTime;
//     setCurrentTime(clickedTime);
//   };

//   return (
//     <div className="editor-container">
//       <nav className="editor-navbar">
//         <h2 className="editor-title">Beat Canvas Editor</h2>
//         <div className="nav-actions">
//           <button className="btn-outline" onClick={() => navigate(-1)}>
//             🔙 Back
//           </button>
//         </div>
//       </nav>

//       <div className="editor-workspace">
//         <aside className="editor-sidebar">
//           <h3 className="sidebar-title">Tools</h3>
//           <div className="sidebar-title">Photos</div>
//           <div className="photo-pool">
//             {Object.values(photoPool).map((src, i) => (
//               <img
//                 key={i}
//                 src={src}
//                 alt="pool"
//                 className="pool-photo"
//                 onClick={() => {
//                   if (selectedSegment)
//                     setSegments((prev) =>
//                       prev.map((s) =>
//                         s.id === selectedSegment ? { ...s, media: src } : s
//                       )
//                     );
//                 }}
//               />
//             ))}
//           </div>
//         </aside>

//         <main className="editor-main">
//           <section className="preview-section">
//             <div className="preview-box">
//               {loadingPreview ? (
//                 <div className="preview-content">
//                   <p>Rendering preview...</p>
//                 </div>
//               ) : previewURL ? (
//                 <video
//                   ref={videoRef}
//                   controls
//                   src={previewURL}
//                   className="preview-video"
//                 ></video>
//               ) : (
//                 <div className="preview-content">
//                   <p>🎞️ No preview yet</p>
//                   <p style={{ color: "#888" }}>
//                     Add photos to segments and preview will auto-generate
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="controls">
//               <audio
//                 ref={audioRef}
//                 src={audioURL || ""}
//                 onTimeUpdate={() =>
//                   setCurrentTime(audioRef.current?.currentTime || 0)
//                 }
//               />
//               <button
//                 className="ctrl-btn"
//                 onClick={() => {
//                   audioRef.current.currentTime = 0;
//                   setCurrentTime(0);
//                 }}
//               >
//                 ⏮
//               </button>
//               <button className="btn-play" onClick={togglePlay}>
//                 {isPlaying ? "⏸" : "▶"}
//               </button>
//               <button
//                 className="ctrl-btn"
//                 onClick={() => {
//                   audioRef.current.currentTime = duration;
//                   setCurrentTime(duration);
//                 }}
//               >
//                 ⏭
//               </button>

//               <span className="time-display">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>
//           </section>

//           <section className="timeline-section">
//             <div className="timeline-container" onClick={handleTimelineClick}>
//               <div className="timeline-track">
//                 {segments.map((segment) => {
//                   const left = (segment.start / duration) * 100;
//                   const width = ((segment.end - segment.start) / duration) * 100;
//                   return (
//                     <div
//                       key={segment.id}
//                       className={`segment ${
//                         selectedSegment === segment.id ? "selected" : ""
//                       }`}
//                       style={{
//                         left: `${left}%`,
//                         width: `${width}%`,
//                         backgroundColor: segment.color,
//                       }}
//                       onClick={() => setSelectedSegment(segment.id)}
//                     >
//                       <div className="segment-media-preview">
//                         {segment.media ? (
//                           <img src={segment.media} alt="seg" />
//                         ) : (
//                           <span style={{ opacity: 0.5 }}>No media</span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }
