# import librosa
# import numpy as np
# import json
# import os

# def detect_cinematic_beats(audio_path, output_json="beats.json", intensity=0.6, save_json=True):
#     """
#     Detect cinematic beats from an audio file intelligently for video editing.
    
#     Args:
#         audio_path (str): Path to the input audio file.
#         output_json (str): Where to save beat timestamps as JSON.
#         intensity (float): 0.0–1.0; higher = fewer beats (more cinematic).
#         save_json (bool): If True, saves beats as JSON file.
    
#     Returns:
#         dict: { "beats": [...], "tempo": float, "duration": float }
#     """

#     if not os.path.exists(audio_path):
#         raise FileNotFoundError(f"❌ Audio file not found: {audio_path}")

#     # Load audio
#     y, sr = librosa.load(audio_path, sr=None)
#     duration = librosa.get_duration(y=y, sr=sr)

#     # Extract core features
#     onset_env = librosa.onset.onset_strength(y=y, sr=sr)
#     tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, units="frames")
#     tempo = float(tempo.mean()) if isinstance(tempo, np.ndarray) else float(tempo)
#     beat_times = librosa.frames_to_time(beat_frames, sr=sr)

#     # Extra features for intelligence
#     rms = librosa.feature.rms(y=y)[0]
#     flux = librosa.onset.onset_strength(y=y, sr=sr, feature=librosa.feature.mfcc)

#     # Normalize all features
#     def normalize(x):
#         return (x - np.min(x)) / (np.max(x) - np.min(x) + 1e-8)
#     rms_norm, flux_norm, onset_norm = normalize(rms), normalize(flux), normalize(onset_env)

#     # Weighted beat score based on multiple features
#     beat_indices = librosa.time_to_frames(beat_times, sr=sr)
#     scores = []
#     for i in beat_indices:
#         if i < len(onset_norm):
#             score = (
#                 0.5 * onset_norm[i]
#                 + 0.3 * rms_norm[min(i, len(rms_norm) - 1)]
#                 + 0.2 * flux_norm[min(i, len(flux_norm) - 1)]
#             )
#             scores.append(score)

#     # Filter beats using percentile threshold (based on intensity)
#     threshold = np.percentile(scores, 100 * (1 - intensity))
#     selected_beats = [bt for bt, sc in zip(beat_times, scores) if sc >= threshold]

#     # Energy and tempo adaptive spacing
#     avg_energy = float(np.mean(rms))
#     energy_level = np.interp(avg_energy, [0.01, 0.3], [1.5, 0.6])  # low energy = slower pacing
#     min_gap = np.interp(tempo, [60, 180], [0.8, 0.3]) * energy_level

#     refined_beats = []
#     for b in selected_beats:
#         if not refined_beats or (b - refined_beats[-1]) > min_gap:
#             refined_beats.append(round(float(b), 3))

#     result = {"beats": refined_beats, "tempo": round(tempo, 2), "duration": round(duration, 2)}

#     if save_json:
#         with open(output_json, "w") as f:
#             json.dump(result, f, indent=4)
#         print(f"💾 Saved beats to {output_json}")

#     print(f"🎬 Tempo: {tempo:.2f} BPM | Beats detected: {len(refined_beats)} | Duration: {duration:.2f}s")
#     return result


# if __name__ == "__main__":
#     import argparse

#     parser = argparse.ArgumentParser(description="Cinematic Beat Detection Model")
#     parser.add_argument("audio_path", type=str, help="Path to the input audio file")
#     parser.add_argument("--output_json", type=str, default="beats.json", help="Output JSON file name")
#     parser.add_argument("--intensity", type=float, default=0.6, help="Beat selection intensity (0.0–1.0)")
#     args = parser.parse_args()

#     detect_cinematic_beats(args.audio_path, args.output_json, args.intensity)









































import librosa
import numpy as np
import json
import os
import subprocess
import tempfile

os.environ["PATH"] += os.pathsep + r"C:\Users\kriya\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin"


def detect_cinematic_beats(audio_path, output_json="beats.json", intensity=0.6, save_json=True):
    """
    Detect cinematic beats from an audio file intelligently for video editing.
    
    Args:
        audio_path (str): Path to the input audio file.
        output_json (str): Where to save beat timestamps as JSON.
        intensity (float): 0.0–1.0; higher = fewer beats (more cinematic).
        save_json (bool): If True, saves beats as JSON file.
    
    Returns:
        dict: { "beats": [...], "tempo": float, "duration": float }
    """

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"❌ Audio file not found: {audio_path}")

    # --- SAFE AUDIO LOADING (auto ffmpeg fallback) ---
    try:
        y, sr = librosa.load(audio_path, sr=None)
    except Exception:
        # Convert unsupported formats (.m4a, .aac, etc.) to WAV using ffmpeg
        print("⚙️  Converting audio to WAV for compatibility...")
        wav_path = os.path.join(tempfile.gettempdir(), "temp_audio.wav")
        subprocess.run(
            ["ffmpeg", "-y", "-i", audio_path, wav_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        y, sr = librosa.load(wav_path, sr=None)
        os.remove(wav_path)

    duration = librosa.get_duration(y=y, sr=sr)

    # --- FEATURE EXTRACTION ---
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, units="frames")
    tempo = float(tempo.mean()) if isinstance(tempo, np.ndarray) else float(tempo)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    rms = librosa.feature.rms(y=y)[0]
    flux = librosa.onset.onset_strength(y=y, sr=sr, feature=librosa.feature.mfcc)

    # --- NORMALIZATION ---
    def normalize(x):
        return (x - np.min(x)) / (np.max(x) - np.min(x) + 1e-8)
    rms_norm, flux_norm, onset_norm = normalize(rms), normalize(flux), normalize(onset_env)

    # --- WEIGHTED SCORING ---
    beat_indices = librosa.time_to_frames(beat_times, sr=sr)
    scores = []
    for i in beat_indices:
        if i < len(onset_norm):
            score = (
                0.5 * onset_norm[i]
                + 0.3 * rms_norm[min(i, len(rms_norm) - 1)]
                + 0.2 * flux_norm[min(i, len(flux_norm) - 1)]
            )
            scores.append(score)

    # --- FILTERING BASED ON INTENSITY ---
    threshold = np.percentile(scores, 100 * (1 - intensity))
    selected_beats = [bt for bt, sc in zip(beat_times, scores) if sc >= threshold]

    # --- ENERGY- & TEMPO-AWARE SPACING ---
    avg_energy = float(np.mean(rms))
    energy_level = np.interp(avg_energy, [0.01, 0.3], [1.5, 0.6])  # low energy = slower pacing
    min_gap = np.interp(tempo, [60, 180], [0.8, 0.3]) * energy_level

    refined_beats = []
    for b in selected_beats:
        if not refined_beats or (b - refined_beats[-1]) > min_gap:
            refined_beats.append(round(float(b), 3))

    # --- RESULT ---
    result = {"beats": refined_beats, "tempo": round(tempo, 2), "duration": round(duration, 2)}

    if save_json:
        with open(output_json, "w") as f:
            json.dump(result, f, indent=4)
        print(f"💾 Saved beats to {output_json}")

    print(f"🎬 Tempo: {tempo:.2f} BPM | Beats detected: {len(refined_beats)} | Duration: {duration:.2f}s")
    return result


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Cinematic Beat Detection Model")
    parser.add_argument("audio_path", type=str, help="Path to the input audio file")
    parser.add_argument("--output_json", type=str, default="beats.json", help="Output JSON file name")
    parser.add_argument("--intensity", type=float, default=0.6, help="Beat selection intensity (0.0–1.0)")
    args = parser.parse_args()

    detect_cinematic_beats(args.audio_path, args.output_json, args.intensity)
