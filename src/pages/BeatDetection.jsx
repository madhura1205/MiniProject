// import React, { useState } from "react";
// import "../styles/BeatDetection.css";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";

// export default function BeatDetection() {
//   const [audioFile, setAudioFile] = useState(null);
//   const [beatData, setBeatData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle Audio Upload
//   const handleAudioUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setAudioFile(file);
//   };

//   // Simulate Beat Detection (replace with backend API later)
//   const handleBeatDetection = async () => {
//     if (!audioFile) {
//       alert("Please upload an audio file first!");
//       return;
//     }

//     setLoading(true);

//     // Simulated delay for beat detection
//     setTimeout(() => {
//       const mockBeats = {
//         beats: [0.5, 1.2, 2.8, 3.6, 5.0, 7.2, 9.1],
//         total_duration: 10.0,
//       };
//       setBeatData(mockBeats);
//       setLoading(false);
//     }, 1500);
//   };

//   // Go to video editing page (with template preloaded later)
//   const handleGoToEditor = () => {
//     navigate("/video-editor"); // create this route later
//   };

//   return (
//     <div className="beat-detection-page">
//       <Navbar />

//       {/* Header */}
//       <div className="beat-header">
//         <h1>Beat Detection</h1>
//         <p>
//           Upload an audio file to automatically detect beats and generate a
//           photo-sync template for your video.
//         </p>
//       </div>

//       {/* Upload Section */}
//       <div className="upload-section">
//         <label htmlFor="audioUpload" className="upload-label">
//           {audioFile ? "Replace Audio File" : "Upload Audio File"}
//         </label>
//         <input
//           id="audioUpload"
//           type="file"
//           accept="audio/*"
//           onChange={handleAudioUpload}
//         />
//         {audioFile && <p className="file-name">🎵 {audioFile.name}</p>}
//       </div>

//       {/* Buttons */}
//       <div className="action-buttons">
//         <button className="btn-black" onClick={handleBeatDetection}>
//           {loading ? "Analyzing..." : "Detect Beats"}
//         </button>
//         {beatData && (
//           <button className="btn-outline" onClick={handleGoToEditor}>
//             Proceed to Video Editor →
//           </button>
//         )}
//       </div>

//       {/* Visualization Section */}
//       {beatData && (
//         <div className="beat-visualization">
//           <h2>Detected Beats</h2>
//           <div className="waveform">
//             {/* Render beat markers */}
//             {beatData.beats.map((b, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   position: "absolute",
//                   left: `${(b / beatData.total_duration) * 100}%`,
//                   top: "0",
//                   height: "100%",
//                   width: "2px",
//                   backgroundColor: "black",
//                 }}
//               ></div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="beat-footer">© 2025 BeatCanvas | Audio Sync Engine</div>
//     </div>
//   );
// }






import React, { useState, useRef } from "react";
import "../styles/BeatDetection.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function BeatDetection() {
  const [audioFile, setAudioFile] = useState(null);
  const [beatData, setBeatData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockImages, setBlockImages] = useState({});
  const fileInputs = useRef({}); // store refs for each beat block
  const navigate = useNavigate();

  // Handle audio upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  // Simulate Beat Detection (replace with backend API later)
  const handleBeatDetection = async () => {
    if (!audioFile) {
      alert("Please upload an audio file first!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Example backend JSON response format
      const mockBeats = {
        beats: [0.52, 1.28, 2.9, 3.65, 5.04, 7.21, 9.13],
        total_duration: 10.0,
      };
      setBeatData(mockBeats);
      setLoading(false);
    }, 1500);
  };

  // Handle click on block (triggers hidden input)
  const handleBlockClick = (index) => {
    if (fileInputs.current[index]) {
      fileInputs.current[index].click();
    }
  };

  // Handle image upload for individual block
  const handleBlockImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBlockImages((prev) => ({ ...prev, [index]: imageUrl }));
    }
  };

  // Handle multiple photo uploads
  const handleAllPhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = {};
      files.forEach((file, i) => {
        newImages[i] = URL.createObjectURL(file);
      });
      setBlockImages(newImages);
    }
  };

  const handleGoToEditor = () => {
    navigate("/video-editor", {
  state: {
    beats: beatData.beats,
    photos: blockImages,
  },
});
  };

  return (
    <div className="beat-detection-page">
      <Navbar />

      {/* Header */}
      <div className="beat-header">
        <h1>Beat Detection</h1>
        <p>
          Upload an audio file to detect beats and automatically create
          timestamped photo blocks for video syncing.
        </p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <label htmlFor="audioUpload" className="upload-label">
          {audioFile ? "Replace Audio File" : "Upload Audio File"}
        </label>
        <input
          id="audioUpload"
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
        />
        {audioFile && <p className="file-name">🎵 {audioFile.name}</p>}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-black" onClick={handleBeatDetection}>
          {loading ? "Analyzing..." : "Detect Beats"}
        </button>
        {beatData && (
          <button className="btn-outline" onClick={handleGoToEditor}>
            Proceed to Video Editor →
          </button>
        )}
      </div>

      {/* Beat Blocks Section */}
      {beatData && (
        <div className="beat-blocks-section">
          <h2>Detected Beat Blocks</h2>

          <div className="beat-blocks-container">
            {beatData.beats.map((beat, idx) => (
              <div
                key={idx}
                className="beat-block"
                onClick={() => handleBlockClick(idx)}
              >
                {blockImages[idx] ? (
                  <img src={blockImages[idx]} alt={`Block ${idx}`} />
                ) : (
                  <span className="add-icon">+</span>
                )}
                <p className="timestamp">
                  {beat.toFixed(2)}s
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={(el) => (fileInputs.current[idx] = el)}
                  style={{ display: "none" }}
                  onChange={(e) => handleBlockImageUpload(idx, e)}
                />
              </div>
            ))}
          </div>

          {/* Add All Photos */}
          <div style={{ textAlign: "center" }}>
            <label htmlFor="allPhotos" className="add-all-btn">
              Add All Photos Together
            </label>
            <input
              id="allPhotos"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleAllPhotosUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="beat-footer">© 2025 BeatCanvas | Audio Sync Engine</div>
    </div>
  );
}
