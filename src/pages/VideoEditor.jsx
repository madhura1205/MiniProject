// // src/pages/VideoEditor.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import TimelineEditor from "../components/TimelineEditor";
// import EditorControls from "../components/EditorControls";
// import "../styles/videoEditor.css";

// /*
//   Updated VideoEditor.jsx
//   - Preserves your existing project/segment initialization and export logic.
//   - Adds:
//     - Left panel tabs (Media / Text / Effects / Transitions)
//     - Center preview area with play controls and a live playhead indicator
//     - Right properties panel (shows properties of selected segment)
//     - Timeline (uses your existing TimelineEditor) — now supports selection via onSelectSegment
//   - Minimal changes to existing functions and state names so integration is safe.
// */

// export default function VideoEditor() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const audioRef = useRef(null);
//   const bulkFilesRef = useRef(null);

//   // Existing states
//   const [project, setProject] = useState(null);
//   const [segments, setSegments] = useState([]); // canonical segments array
//   const [playheadTime, setPlayheadTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [pxPerSec, setPxPerSec] = useState(140);

//   // NEW UI states
//   const [activeTab, setActiveTab] = useState("Media"); // left panel tabs
//   const [selectedSegmentId, setSelectedSegmentId] = useState(null); // currently selected clip
//   const [textOverlays, setTextOverlays] = useState([]); // simple list of text overlays
//   const [effectPreset, setEffectPreset] = useState(null);

//   // -------- Initialize project (unchanged logic) --------
//   useEffect(() => {
//     let beats = location.state?.beats || [];
//     let photos = location.state?.photos || {};
//     let audioFile = location.state?.audioFile || null;

//     if (!beats || beats.length === 0) {
//       try {
//         const stored = JSON.parse(localStorage.getItem("beat_project_edit") || "null");
//         if (stored?.beats && stored.beats.length) {
//           beats = stored.beats;
//           photos = stored.photos || {};
//         }
//       } catch (e) {
//         // ignore
//       }
//     }

//     if (!beats || beats.length === 0) {
//       navigate("/beat-detection");
//       return;
//     }

//     const segs = [];
//     for (let i = 0; i < beats.length; i++) {
//       const start = beats[i];
//       const end = i + 1 < beats.length ? beats[i + 1] : beats[i] + 1.0;
//       const duration = Math.max(0.2, parseFloat((end - start).toFixed(3)));
//       segs.push({
//         id: `seg-${i}`,
//         index: i,
//         start,
//         duration,
//         imageUrl: photos[i] || null,
//         mediaFile: null,
//         transition: null,
//         title: "",
//         opacity: 1,
//         scale: 1,
//       });
//     }

//     const total_duration = segs.length ? segs[segs.length - 1].start + segs[segs.length - 1].duration : 10;

//     const projectData = {
//       name: location.state?.projectName || "Auto Beat-Sync Project",
//       total_duration,
//       beats,
//       audioFile: audioFile || null,
//       createdAt: Date.now(),
//     };

//     setProject(projectData);
//     setSegments(segs);

//     try {
//       localStorage.setItem("beat_project_edit", JSON.stringify({
//         beats: projectData.beats,
//         photos, // only urls
//         name: projectData.name,
//       }));
//     } catch (e) {
//       console.warn("localStorage save failed", e);
//     }

//     if (audioFile) {
//       if (typeof audioFile === "string") {
//         if (audioRef.current) audioRef.current.src = audioFile;
//       } else if (audioFile instanceof File) {
//         const url = URL.createObjectURL(audioFile);
//         setTimeout(() => { if (audioRef.current) audioRef.current.src = url; }, 0);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.state, navigate]);

//   // -------- Audio playback + playhead syncing (unchanged) --------
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     const onTime = () => setPlayheadTime(audio.currentTime);
//     const onEnded = () => setIsPlaying(false);
//     audio.addEventListener("timeupdate", onTime);
//     audio.addEventListener("ended", onEnded);
//     return () => {
//       audio.removeEventListener("timeupdate", onTime);
//       audio.removeEventListener("ended", onEnded);
//     };
//   }, []);

//   // Playback controls
//   const onPlayToggle = () => {
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

//   const onSeek = (time) => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     audio.currentTime = Math.max(0, Math.min(time, audio.duration || time));
//     setPlayheadTime(audio.currentTime);
//   };

//   const onAudioUpload = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     const url = URL.createObjectURL(f);
//     if (audioRef.current) audioRef.current.src = url;
//     setProject((p) => ({ ...(p || {}), audioFile: f }));
//     setMessage(`Loaded audio: ${f.name}`);
//   };

//   // -------- Segment helpers (unchanged) --------
//   const updateSegment = (id, patch) => {
//     setSegments((prev) => prev.map(s => s.id === id ? ({ ...s, ...patch }) : s));
//   };

//   const replaceSegmentMedia = (id, fileOrUrl) => {
//     setSegments((prev) => prev.map(s => {
//       if (s.id !== id) return s;
//       const newSeg = { ...s };
//       if (fileOrUrl instanceof File) {
//         newSeg.mediaFile = fileOrUrl;
//         newSeg.imageUrl = URL.createObjectURL(fileOrUrl);
//       } else if (typeof fileOrUrl === "string") {
//         newSeg.mediaFile = null;
//         newSeg.imageUrl = fileOrUrl;
//       } else {
//         newSeg.mediaFile = null;
//         newSeg.imageUrl = null;
//       }
//       return newSeg;
//     }));
//   };

//   const removeSegmentMedia = (id) => {
//     setSegments((prev) => prev.map(s => s.id === id ? ({ ...s, mediaFile: null, imageUrl: null }) : s));
//   };

//   const handleBulkFiles = (files) => {
//     if (!files || files.length === 0) return;
//     setSegments((prev) => {
//       const copy = prev.map((seg, idx) => {
//         const file = files[idx];
//         if (!file) return seg;
//         return {
//           ...seg,
//           mediaFile: file,
//           imageUrl: URL.createObjectURL(file),
//         };
//       });
//       return copy;
//     });
//     setMessage(`Assigned ${Math.min(files.length, segments.length)} photos to segments.`);
//   };

//   const onBulkUploadClick = () => {
//     bulkFilesRef.current?.click();
//   };

//   // Export (unchanged)
//   const exportProject = async (options = { useFormData: true }) => {
//     setLoading(true);
//     try {
//       if (options.useFormData) {
//         const form = new FormData();
//         form.append("projectName", project?.name || "export");
//         form.append("totalDuration", project?.total_duration || 0);
//         form.append("beats", JSON.stringify(project?.beats || []));
//         if (project?.audioFile && project.audioFile instanceof File) {
//           form.append("audio", project.audioFile, project.audioFile.name);
//         }
//         const meta = segments.map((s, i) => {
//           if (s.mediaFile instanceof File) {
//             const field = `segmentFile_${i}`;
//             form.append(field, s.mediaFile, s.mediaFile.name);
//             return { id: s.id, start: s.start, duration: s.duration, fileField: field, transition: s.transition };
//           }
//           return { id: s.id, start: s.start, duration: s.duration, imageUrl: s.imageUrl || null, transition: s.transition };
//         });
//         form.append("segments", JSON.stringify(meta));
//         console.log("Prepared FormData for export (inspect in network tab).");
//         alert("Prepared FormData export payload. Check console for details.");
//       } else {
//         const payload = { project: { ...project }, segments: segments.map(s => ({ id: s.id, start: s.start, duration: s.duration, hasFile: !!s.mediaFile, imageUrl: s.imageUrl || null, transition: s.transition })) };
//         console.log("EXPORT JSON PAYLOAD:", payload);
//         alert("Export JSON payload logged to console.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Export failed. See console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply transition to selected segment (or all if id null)
//   const setSegmentTransition = (id, transition) => {
//     if (!id) {
//       // apply to all
//       setSegments(prev => prev.map(s => ({ ...s, transition })));
//     } else {
//       updateSegment(id, { transition });
//     }
//   };

//   // NEW: selection helpers
//   const selectedSegment = segments.find(s => s.id === selectedSegmentId) || null;

//   const onSelectSegment = (id) => {
//     setSelectedSegmentId(id);
//     // ensure right panel shows this segment
//   };

//   // Text overlays helpers (simple)
//   const addTextOverlay = () => {
//     const t = { id: `txt-${Date.now()}`, text: "New Title", start: 0, duration: 3, x: 0.5, y: 0.1 };
//     setTextOverlays(prev => [...prev, t]);
//     setActiveTab("Text");
//   };

//   const updateSelectedSegmentProperty = (key, value) => {
//     if (!selectedSegmentId) return;
//     updateSegment(selectedSegmentId, { [key]: value });
//   };

//   // UI: if project not ready
//   if (!project) return <div className="video-editor-page"><Navbar /><div style={{padding:40}}>Loading editor...</div></div>;

//   const timelineWidthPx = Math.max((project.total_duration || 10) * pxPerSec, 800);

//   return (
//     <div className="video-editor-page dark-editor">
//       <Navbar />

//       <div className="editor-shell">
//         {/* LEFT PANEL (tabs: Media / Text / Effects / Transitions) */}
//         <aside className="left-panel">
//           <div className="left-header">
//             <h3>Tools</h3>
//           </div>

//           <div className="left-tabs">
//             {["Media", "Text", "Effects", "Transitions"].map(tab => (
//               <button
//                 key={tab}
//                 className={`left-tab ${activeTab === tab ? "active" : ""}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="left-content">
//             {activeTab === "Media" && (
//               <>
//                 <div className="media-section">
//                   <label className="upload-label small">
//                     Upload Audio
//                     <input type="file" accept="audio/*" onChange={onAudioUpload} style={{ display: "none" }} />
//                   </label>

//                   <div style={{ marginTop: 12 }}>
//                     <input ref={bulkFilesRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={(e) => handleBulkFiles(Array.from(e.target.files || []))} />
//                     <button className="btn-outline" onClick={() => bulkFilesRef.current?.click()}>Upload Photos (bulk)</button>
//                   </div>

//                   <div className="media-list">
//                     {segments.map(s => (
//                       <div key={s.id} className={`media-item ${selectedSegmentId === s.id ? "selected" : ""}`} onClick={() => onSelectSegment(s.id)}>
//                         {s.imageUrl ? <img src={s.imageUrl} alt={s.id} /> : <div className="media-placeholder">+</div>}
//                         <div className="media-meta">#{s.index} • {s.duration}s</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === "Text" && (
//               <>
//                 <div className="text-section">
//                   <button className="btn-outline" onClick={addTextOverlay}>+ Add Text</button>
//                   <div className="text-list">
//                     {textOverlays.map(t => (
//                       <div key={t.id} className="text-item">
//                         <div className="text-preview">{t.text}</div>
//                         <div className="tiny">start {t.start}s • dur {t.duration}s</div>
//                       </div>
//                     ))}
//                     {!textOverlays.length && <div className="muted">No text overlays yet</div>}
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === "Effects" && (
//               <div className="effects-section">
//                 <h4>Presets</h4>
//                 <div className="effects-list">
//                   {["None", "Cinematic", "Lo-fi", "Bright"].map(e => (
//                     <button key={e} className={`effect-btn ${effectPreset === e ? "active" : ""}`} onClick={() => setEffectPreset(e)}>{e}</button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "Transitions" && (
//               <div className="transitions-section">
//                 <h4>Quick Transitions</h4>
//                 <div className="transitions-list">
//                   {[
//                     { key: "none", label: "None" },
//                     { key: "crossfade", label: "Crossfade" },
//                     { key: "dip-to-black", label: "Dip" },
//                     { key: "slide", label: "Slide" }
//                   ].map(t => (
//                     <button key={t.key} className="transition-btn" onClick={() => setSegmentTransition(selectedSegmentId, t.key === "none" ? null : { type: t.key, duration: 0.4 })}>
//                       {t.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </aside>

//         {/* CENTER PREVIEW + CONTROLS */}
//         <main className="center-panel">
//           <div className="preview-top">
//             <div className="preview-window">
//               {/* The preview area; we show the selected segment's image as a simple preview */}
//               {selectedSegment && selectedSegment.imageUrl ? (
//                 <img src={selectedSegment.imageUrl} alt="preview" className="preview-media" />
//               ) : (
//                 <div className="preview-empty">
//                   <div>Preview</div>
//                   <div className="muted">Select a clip to preview or play the timeline</div>
//                 </div>
//               )}

//               {/* simple overlay: current time */}
//               <div className="time-overlay">{playheadTime.toFixed(2)}s</div>
//             </div>

//             {/* preview controls */}
//             <div className="preview-controls">
//               <button className="ctrl-btn" onClick={() => onSeek(Math.max(0, playheadTime - 5))}>⏮ 5s</button>
//               <button className="ctrl-btn" onClick={onPlayToggle}>{isPlaying ? "⏸" : "▶"}</button>
//               <button className="ctrl-btn" onClick={() => onSeek(playheadTime + 5)}>5s ⏭</button>

//               <div className="zoom-control">
//                 <label>Zoom</label>
//                 <input type="range" min="80" max="220" value={pxPerSec} onChange={(e) => setPxPerSec(Number(e.target.value))} />
//               </div>

//               <div style={{ marginLeft: "auto" }}>
//                 <button className="btn-black" onClick={() => exportProject({ useFormData: true })}>Export</button>
//               </div>
//             </div>
//           </div>

//           {/* bottom area: timeline container (we still use your TimelineEditor) */}
//           <div className="center-timeline">
//             <div className="ruler">Ruler / Timeline</div>
//             <div className="timeline-wrapper" style={{ height: 220 }}>
//               <TimelineEditor
//                 segments={segments}
//                 setSegments={setSegments}
//                 pxPerSec={pxPerSec}
//                 timelineWidthPx={timelineWidthPx}
//                 onReplaceMedia={(id, fileOrUrl) => replaceSegmentMedia(id, fileOrUrl)}
//                 onUpdateSegment={(id, patch) => updateSegment(id, patch)}
//                 onRemoveSegment={(id) => removeSegmentMedia(id)}
//                 playheadTime={playheadTime}
//                 onSeek={onSeek}
//                 // new prop: notify selection when a clip is clicked inside TimelineEditor
//                 onSelectSegment={(id) => onSelectSegment(id)}
//               />
//             </div>
//           </div>
//         </main>

//         {/* RIGHT PROPERTIES PANEL */}
//         <aside className="right-panel">
//           <div className="right-header">
//             <h3>Properties</h3>
//           </div>

//           <div className="props-content">
//             {selectedSegment ? (
//               <>
//                 <div className="prop-row">
//                   <label>Clip #{selectedSegment.index}</label>
//                   <div className="muted">start {selectedSegment.start}s</div>
//                 </div>

//                 <div className="prop-row">
//                   <label>Duration (s)</label>
//                   <input type="number" min="0.1" step="0.1" value={selectedSegment.duration} onChange={(e) => updateSelectedSegmentProperty("duration", Number(e.target.value))} />
//                 </div>

//                 <div className="prop-row">
//                   <label>Opacity</label>
//                   <input type="range" min="0" max="1" step="0.01" value={selectedSegment.opacity ?? 1} onChange={(e) => updateSelectedSegmentProperty("opacity", Number(e.target.value))} />
//                 </div>

//                 <div className="prop-row">
//                   <label>Scale</label>
//                   <input type="range" min="0.5" max="2" step="0.05" value={selectedSegment.scale ?? 1} onChange={(e) => updateSelectedSegmentProperty("scale", Number(e.target.value))} />
//                 </div>

//                 <div className="prop-row">
//                   <label>Transition</label>
//                   <select value={selectedSegment.transition?.type || ""} onChange={(e) => setSegmentTransition(selectedSegment.id, e.target.value ? { type: e.target.value, duration: 0.4 } : null)}>
//                     <option value="">None</option>
//                     <option value="crossfade">Crossfade</option>
//                     <option value="dip-to-black">Dip</option>
//                     <option value="slide">Slide</option>
//                   </select>
//                 </div>

//                 <div style={{ marginTop: 12 }}>
//                   <label>Replace media</label>
//                   <input type="file" accept="image/*,video/*" onChange={(e) => {
//                     const f = e.target.files?.[0];
//                     if (f) replaceSegmentMedia(selectedSegment.id, f);
//                   }} />
//                   <div style={{ marginTop: 8 }}>
//                     <button className="btn-outline" onClick={() => removeSegmentMedia(selectedSegment.id)}>Remove Media</button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="muted">Select a clip on the timeline to edit its properties.</div>
//             )}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }







































































// // src/pages/VideoEditor.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import TimelineEditor from "../components/TimelineEditor";
// import EditorLeftPanel from "../components/EditorLeftPanel";
// import EditorCenterPanel from "../components/EditorCenterPanel";
// import EditorRightPanel from "../components/EditorRightPanel";
// import "../styles/videoEditor.css";

// export default function VideoEditor() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const audioRef = useRef(null);
//   const bulkFilesRef = useRef(null);

//   // core states
//   const [project, setProject] = useState(null);
//   const [segments, setSegments] = useState([]);
//   const [playheadTime, setPlayheadTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [pxPerSec, setPxPerSec] = useState(140);
//   const [message, setMessage] = useState("");
//   const [selectedSegmentId, setSelectedSegmentId] = useState(null);

//   const selectedSegment = segments.find((s) => s.id === selectedSegmentId) || null;

//   // 🟢 Initialize project from BeatDetection
//   useEffect(() => {
//     let beats = location.state?.beats || [];
//     let photos = location.state?.photos || {};
//     let audioFile = location.state?.audioFile || null;

//     if (!beats || beats.length === 0) {
//       navigate("/beat-detection");
//       return;
//     }

//     const segs = beats.map((b, i) => ({
//       id: `seg-${i}`,
//       index: i,
//       start: b,
//       duration: beats[i + 1] ? beats[i + 1] - b : 1,
//       imageUrl: photos[i] || null,
//       mediaFile: null,
//       transition: null,
//       opacity: 1,
//       scale: 1,
//     }));

//     const projectData = {
//       name: "Auto Beat-Sync Project",
//       total_duration: beats[beats.length - 1] + 1,
//       beats,
//       audioFile,
//     };

//     setProject(projectData);
//     setSegments(segs);
//   }, [location.state, navigate]);

//   // 🟢 Audio control
//   const onPlayToggle = () => {
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

//   const onSeek = (time) => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     audio.currentTime = Math.max(0, Math.min(time, audio.duration || time));
//     setPlayheadTime(audio.currentTime);
//   };

//   // 🟢 Segment control
//   const updateSegment = (id, patch) => {
//     setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
//   };

//   const replaceSegmentMedia = (id, fileOrUrl) => {
//     setSegments((prev) =>
//       prev.map((s) => {
//         if (s.id !== id) return s;
//         const newSeg = { ...s };
//         if (fileOrUrl instanceof File) {
//           newSeg.mediaFile = fileOrUrl;
//           newSeg.imageUrl = URL.createObjectURL(fileOrUrl);
//         } else {
//           newSeg.mediaFile = null;
//           newSeg.imageUrl = fileOrUrl || null;
//         }
//         return newSeg;
//       })
//     );
//   };

//   const removeSegmentMedia = (id) => {
//     updateSegment(id, { mediaFile: null, imageUrl: null });
//   };

//   const handleBulkFiles = (files) => {
//     if (!files.length) return;
//     setSegments((prev) =>
//       prev.map((seg, i) => ({
//         ...seg,
//         imageUrl: files[i] ? URL.createObjectURL(files[i]) : seg.imageUrl,
//       }))
//     );
//   };

//   // 🟢 Export
//   const exportProject = () => {
//     console.log("Export project:", project, segments);
//     alert("Export JSON payload printed to console.");
//   };

//   if (!project)
//     return (
//       <div className="video-editor-page">
//         <Navbar />
//         <div style={{ padding: 40 }}>Loading editor...</div>
//       </div>
//     );

//   return (
//     <div className="video-editor-page dark-editor">
//       <Navbar />

//       <div className="editor-shell">
//         {/* LEFT PANEL */}
//         <EditorLeftPanel
//           segments={segments}
//           selectedSegmentId={selectedSegmentId}
//           onSelectSegment={setSelectedSegmentId}
//           onBulkUpload={(files) => handleBulkFiles(files)}
//           replaceMedia={replaceSegmentMedia}
//           bulkFilesRef={bulkFilesRef}
//         />

//         {/* CENTER PREVIEW */}
//         <EditorCenterPanel
//           selectedSegment={selectedSegment}
//           isPlaying={isPlaying}
//           onPlayToggle={onPlayToggle}
//           playheadTime={playheadTime}
//           pxPerSec={pxPerSec}
//           setPxPerSec={setPxPerSec}
//           exportProject={exportProject}
//           onSeek={onSeek}
//         />

//         {/* RIGHT PROPERTIES */}
//         <EditorRightPanel
//           selectedSegment={selectedSegment}
//           updateSegment={updateSegment}
//           replaceMedia={replaceSegmentMedia}
//           removeMedia={removeSegmentMedia}
//         />
//       </div>

//       {/* TIMELINE */}
//       <div className="timeline-area">
//         <TimelineEditor
//           segments={segments}
//           setSegments={setSegments}
//           pxPerSec={pxPerSec}
//           playheadTime={playheadTime}
//           onSeek={onSeek}
//           onSelectSegment={setSelectedSegmentId}
//           onReplaceMedia={replaceSegmentMedia}
//           onRemoveSegment={removeSegmentMedia}
//         />
//       </div>
//     </div>
//   );
// }































// src/pages/VideoEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SidebarMenu from "../components/SidebarMenu";
import MediaPanel from "../components/MediaPanel";
import TextPanel from "../components/TextPanel";
import TransitionsPanel from "../components/TransitionsPanel";
import CenterPreview from "../components/CenterPreview";
import RightProperties from "../components/RightProperties";
import TimelineEditor from "../components/TimelineEditor";
import "../styles/VideoEditor.css";

export default function VideoEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const bulkFilesRef = useRef(null);

  const [project, setProject] = useState(null);
  const [segments, setSegments] = useState([]);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pxPerSec, setPxPerSec] = useState(140);
  const [activePanel, setActivePanel] = useState("Media");
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [textOverlays, setTextOverlays] = useState([]);
  const [message, setMessage] = useState("");

  const selectedSegment = segments.find((s) => s.id === selectedSegmentId) || null;

  useEffect(() => {
    let beats = location.state?.beats || [];
    let photos = location.state?.photos || {};
    let audioFile = location.state?.audioFile || null;

    if (!beats?.length) {
      navigate("/beat-detection");
      return;
    }

    const segs = beats.map((b, i) => ({
      id: `seg-${i}`,
      index: i,
      start: b,
      duration: beats[i + 1] ? beats[i + 1] - b : 1,
      imageUrl: photos[i] || null,
      transition: null,
      opacity: 1,
      scale: 1,
    }));

    const total_duration = segs.at(-1).start + segs.at(-1).duration;
    setProject({ name: "Beat Sync Project", beats, total_duration, audioFile });
    setSegments(segs);
  }, [location.state, navigate]);

  // Audio playback
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPlayheadTime(a.currentTime);
    const onEnd = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const onPlayToggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setIsPlaying(true);
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  const onSeek = (time) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = time;
    setPlayheadTime(a.currentTime);
  };

  const updateSegment = (id, patch) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const replaceSegmentMedia = (id, fileOrUrl) => {
    if (!id) return;
    if (fileOrUrl instanceof File) {
      const url = URL.createObjectURL(fileOrUrl);
      updateSegment(id, { mediaFile: fileOrUrl, imageUrl: url });
    } else if (typeof fileOrUrl === "string") {
      updateSegment(id, { imageUrl: fileOrUrl });
    }
  };

  const removeSegmentMedia = (id) => updateSegment(id, { mediaFile: null, imageUrl: null });

  const handleBulkFiles = (files) => {
    if (!files?.length) return;
    setSegments((prev) =>
      prev.map((seg, i) => ({
        ...seg,
        imageUrl: files[i] ? URL.createObjectURL(files[i]) : seg.imageUrl,
      }))
    );
  };

  if (!project)
    return (
      <div className="video-editor-page">
        <Navbar />
        <div className="loading">Loading Editor...</div>
      </div>
    );

  const timelineWidthPx = Math.max((project.total_duration || 10) * pxPerSec, 800);

  return (
    <div className="video-editor-page">
      <Navbar />
      <div className="editor-layout">
        {/* Left Sidebar */}
        <SidebarMenu activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Left Dynamic Panel */}
        <div className="left-panel">
          {activePanel === "Media" && (
            <MediaPanel
              segments={segments}
              onSelectSegment={setSelectedSegmentId}
              selectedSegmentId={selectedSegmentId}
              onBulkUpload={handleBulkFiles}
              replaceMedia={replaceSegmentMedia}
              bulkFilesRef={bulkFilesRef}
            />
          )}
          {activePanel === "Text" && (
            <TextPanel
              textOverlays={textOverlays}
              addTextOverlay={() =>
                setTextOverlays((p) => [
                  ...p,
                  { id: Date.now(), text: "New Text", start: 0, duration: 2 },
                ])
              }
            />
          )}
          {activePanel === "Transitions" && (
            <TransitionsPanel
              setSegmentTransition={(id, t) => updateSegment(id, { transition: t })}
              selectedSegmentId={selectedSegmentId}
            />
          )}
        </div>

        {/* Center Editor */}
        <div className="center-panel">
          <CenterPreview
            selectedSegment={selectedSegment}
            audioRef={audioRef}
            isPlaying={isPlaying}
            onPlayToggle={onPlayToggle}
            playheadTime={playheadTime}
            pxPerSec={pxPerSec}
            setPxPerSec={setPxPerSec}
          />

          <div className="timeline-container">
            <TimelineEditor
              segments={segments}
              setSegments={setSegments}
              pxPerSec={pxPerSec}
              timelineWidthPx={timelineWidthPx}
              playheadTime={playheadTime}
              onSeek={onSeek}
              onSelectSegment={setSelectedSegmentId}
              onReplaceMedia={replaceSegmentMedia}
              onRemoveSegment={removeSegmentMedia}
            />
          </div>
        </div>

        {/* Right Properties */}
        <div className="right-panel">
          <RightProperties
            selectedSegment={selectedSegment}
            updateSegment={updateSegment}
            replaceMedia={replaceSegmentMedia}
            removeMedia={removeSegmentMedia}
          />
        </div>
      </div>
    </div>
  );
}
