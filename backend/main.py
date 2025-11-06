# # backend/beat_api.py
# from fastapi import Form
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import tempfile, os, uuid
# from beat_model import detect_cinematic_beats

# app = FastAPI(title="Beat Detection API")

# # Allow local frontend connection (React dev server)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # ⚠️ change later to your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Beat Detection API is running 🎵"}


# @app.post("/detect-beats")
# async def detect_beats(file: UploadFile = File(...)):
#     """Receive an audio file and return detected beats as JSON."""
#     import traceback

#     try:
#         # Save uploaded file temporarily
#         suffix = os.path.splitext(file.filename)[1]
#         temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}{suffix}")

#         with open(temp_path, "wb") as f:
#             f.write(await file.read())

#         # Run your model
#         result = detect_cinematic_beats(temp_path, save_json=False)

#         if os.path.exists(temp_path):
#             os.remove(temp_path)

#         return JSONResponse(content=result)

#     except Exception as e:
#         print("❌ ERROR DETECTING BEATS:")
#         traceback.print_exc()  # 👈 this will show the real error in the terminal
#         return JSONResponse(content={"error": str(e)}, status_code=500)
    
    
    
    
    
# @app.post("/generate-preview")
# async def generate_preview(
#     audio: UploadFile = File(...),
#     metadata: str = Form(...),  # JSON string with segments
# ):
#     """
#     Combine images + audio based on beat segments and return preview video file path.
#     """
#     try:
#         meta = json.loads(metadata)
#         segments = meta.get("segments", [])
#         temp_dir = tempfile.mkdtemp()  # Temporary directory for processing
#         print("🛠️ Generating video preview in", temp_dir)

#         # Save audio file temporarily
#         audio_path = os.path.join(temp_dir, "audio.mp3")
#         with open(audio_path, "wb") as f:
#             f.write(await audio.read())

#         # Save all image frames (simulate ordered list)
#         frame_files = []
#         for i, seg in enumerate(segments):
#             if not seg.get("media"):  # skip empty
#                 continue
#             img_data = seg["media"]
#             ext = ".jpg"  # Assuming images, can adapt for other formats
#             img_path = os.path.join(temp_dir, f"frame_{i:03d}{ext}")
#             with open(img_path, "wb") as out:
#                 out.write(await (await UploadFile(seg["blob"]).read()))
#             frame_files.append(img_path)

#         # Generate a video preview using FFmpeg (concatenate images and add audio)
#         filelist_path = os.path.join(temp_dir, "filelist.txt")
#         with open(filelist_path, "w") as f:
#             for i, seg in enumerate(segments):
#                 dur = max(0.5, seg["end"] - seg["start"])  # Minimum duration for each segment
#                 img = frame_files[i % len(frame_files)] if frame_files else None
#                 if img:
#                     f.write(f"file '{img}'\n")
#                     f.write(f"duration {dur}\n")

#         preview_path = os.path.join(temp_dir, f"preview_{uuid.uuid4().hex}.mp4")

#         # FFmpeg command to combine images into video and add audio
#         subprocess.run([
#             "ffmpeg", "-y", "-f", "concat", "-safe", "0",
#             "-i", filelist_path, "-i", audio_path,
#             "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p",
#             "-c:a", "aac", preview_path
#         ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

#         if not os.path.exists(preview_path):
#             raise RuntimeError("FFmpeg failed to generate preview")

#         print("✅ Preview generated:", preview_path)
#         return FileResponse(preview_path, media_type="video/mp4", filename="preview.mp4")

#     except Exception as e:
#         print("❌ ERROR:")
#         print(str(e))
#         return JSONResponse(content={"error": str(e)}, status_code=500)












###################################################################
######################final



# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# import tempfile, os, uuid, subprocess, json   # ✅ Added json here
# from beat_model import detect_cinematic_beats

# app = FastAPI(title="Beat Detection & Video Preview API")

# # Allow local frontend connection (React dev server)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # ⚠️ change later to your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Beat Detection API is running 🎵"}


# # =========================
# # 🎵 BEAT DETECTION ENDPOINT
# # =========================
# @app.post("/detect-beats")
# async def detect_beats(file: UploadFile = File(...)):
#     """Receive an audio file and return detected beats as JSON."""
#     import traceback

#     try:
#         # Save uploaded file temporarily
#         suffix = os.path.splitext(file.filename)[1]
#         temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}{suffix}")

#         with open(temp_path, "wb") as f:
#             f.write(await file.read())

#         # Run your model
#         result = detect_cinematic_beats(temp_path, save_json=False)

#         if os.path.exists(temp_path):
#             os.remove(temp_path)

#         return JSONResponse(content=result)

#     except Exception as e:
#         print("❌ ERROR DETECTING BEATS:")
#         traceback.print_exc()
#         return JSONResponse(content={"error": str(e)}, status_code=500)


# # =========================
# # 🎬 VIDEO PREVIEW ENDPOINT
# # =========================
# @app.post("/generate-preview")
# async def generate_preview(
#     audio: UploadFile = File(...),
#     metadata: str = Form(...),
# ):
#     """
#     Combine uploaded images + audio based on beat segments and return a preview video.
#     """
#     try:
#         # ✅ Ensure json is available
#         meta = json.loads(metadata)
#         segments = meta.get("segments", [])
#         temp_dir = tempfile.mkdtemp()
#         print(f"🛠️ Generating video preview in: {temp_dir}")

#         # Save uploaded audio
#         audio_path = os.path.join(temp_dir, "audio.mp3")
#         with open(audio_path, "wb") as f:
#             f.write(await audio.read())

#         # Collect and save image files
#         frame_files = []
#         for i, seg in enumerate(segments):
#             if not seg.get("media"):
#                 continue

#             # Create dummy image path
#             img_path = os.path.join(temp_dir, f"frame_{i:03d}.jpg")

#             # Try reading base64 or blob data if available
#             try:
#                 if "blob" in seg and seg["blob"]:
#                     blob_data = await UploadFile(seg["blob"]).read()
#                     with open(img_path, "wb") as out:
#                         out.write(blob_data)
#                 else:
#                     # Fallback: skip if not a proper image source
#                     continue
#             except Exception:
#                 continue

#             frame_files.append(img_path)

#         # Ensure at least one image exists
#         if not frame_files:
#             raise ValueError("No valid images provided for preview generation.")

#         # Create ffmpeg file list
#         filelist_path = os.path.join(temp_dir, "filelist.txt")
#         with open(filelist_path, "w") as f:
#             for i, seg in enumerate(segments):
#                 dur = max(0.5, seg["end"] - seg["start"])
#                 img = frame_files[i % len(frame_files)]
#                 f.write(f"file '{img}'\n")
#                 f.write(f"duration {dur}\n")

#         preview_path = os.path.join(temp_dir, f"preview_{uuid.uuid4().hex}.mp4")

#         # Run ffmpeg command
#         subprocess.run([
#             "ffmpeg", "-y", "-f", "concat", "-safe", "0",
#             "-i", filelist_path, "-i", audio_path,
#             "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p",
#             "-c:a", "aac", preview_path
#         ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

#         # Check if video exists
#         if not os.path.exists(preview_path):
#             raise RuntimeError("FFmpeg failed to generate preview")

#         print(f"✅ Preview generated successfully: {preview_path}")
#         return FileResponse(preview_path, media_type="video/mp4", filename="preview.mp4")

#     except Exception as e:
#         print("❌ ERROR IN PREVIEW GENERATION:")
#         print(e)
#         return JSONResponse(content={"error": str(e)}, status_code=500)


############################################################################




























from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import tempfile, os, uuid, json, subprocess
from beat_model import detect_cinematic_beats

app = FastAPI(title="Beat Detection & Video Preview API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ update later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Beat Detection API is running 🎵"}


# ✅ Keep detect-beats same
@app.post("/detect-beats")
async def detect_beats(file: UploadFile = File(...)):
    import traceback
    try:
        suffix = os.path.splitext(file.filename)[1]
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}{suffix}")
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        result = detect_cinematic_beats(temp_path, save_json=False)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return JSONResponse(content=result)
    except Exception as e:
        print("❌ ERROR DETECTING BEATS:")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)


# ✅ FIXED generate-preview endpoint
@app.post("/generate-preview")
async def generate_preview(request: Request):
    """
    Handle audio + multiple image blobs + metadata in one request.
    """
    try:
        form = await request.form()

        # Extract the audio file
        audio: UploadFile = form.get("audio")
        if not audio:
            return JSONResponse(content={"error": "Missing audio file"}, status_code=400)

        # Extract metadata
        metadata = form.get("metadata")
        if not metadata:
            return JSONResponse(content={"error": "Missing metadata"}, status_code=400)

        meta = json.loads(metadata)
        segments = meta.get("segments", [])

        temp_dir = tempfile.mkdtemp()
        print(f"🛠️ Generating video preview in: {temp_dir}")

        # Save audio file
        audio_path = os.path.join(temp_dir, "audio.mp3")
        with open(audio_path, "wb") as f:
            f.write(await audio.read())

        # Save image blobs (file0, file1, ...)
        frame_files = []
        for key in form.keys():
            if key.startswith("file"):
                upload: UploadFile = form[key]
                ext = os.path.splitext(upload.filename)[1] or ".jpg"
                img_path = os.path.join(temp_dir, upload.filename)
                with open(img_path, "wb") as out:
                    out.write(await upload.read())
                frame_files.append(img_path)

        if not frame_files:
            raise ValueError("No valid images provided for preview generation.")

        # Map frames to segments
        filelist_path = os.path.join(temp_dir, "filelist.txt")
        with open(filelist_path, "w") as f:
            for i, seg in enumerate(segments):
                dur = max(0.5, seg["end"] - seg["start"])
                img = frame_files[i % len(frame_files)]
                f.write(f"file '{img}'\n")
                f.write(f"duration {dur}\n")

        preview_path = os.path.join(temp_dir, f"preview_{uuid.uuid4().hex}.mp4")

        # Run ffmpeg to merge audio + frames
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", filelist_path, "-i", audio_path,
            "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", preview_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        if not os.path.exists(preview_path):
            raise RuntimeError("FFmpeg failed to generate preview")

        print(f"✅ Preview generated successfully: {preview_path}")
        return FileResponse(preview_path, media_type="video/mp4", filename="preview.mp4")

    except Exception as e:
        print("❌ ERROR IN PREVIEW GENERATION:")
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)
