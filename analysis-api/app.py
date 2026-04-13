import os
import tempfile
from typing import Optional

import librosa
import numpy as np
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Midas Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MAJOR_PROFILE = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MINOR_PROFILE = np.array([6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]


def pick_genre_hint(bpm: int) -> str:
    if bpm < 85:
        return "Melancholic Lofi"
    if bpm < 120:
        return "Upbeat Afrobeats"
    return "Dark Drill"


def estimate_key(y: np.ndarray, sr: int) -> str:
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    chroma_vector = chroma.mean(axis=1)
    major_scores = [np.corrcoef(chroma_vector, np.roll(MAJOR_PROFILE, i))[0, 1] for i in range(12)]
    minor_scores = [np.corrcoef(chroma_vector, np.roll(MINOR_PROFILE, i))[0, 1] for i in range(12)]
    major_idx = int(np.nanargmax(major_scores))
    minor_idx = int(np.nanargmax(minor_scores))
    major_score = major_scores[major_idx]
    minor_score = minor_scores[minor_idx]
    if float(minor_score) > float(major_score):
        return f"{NOTES[minor_idx]} minor"
    return f"{NOTES[major_idx]} major"


def verify_auth(authorization: Optional[str]) -> None:
    expected = os.getenv("ANALYSIS_API_KEY")
    if not expected:
        return
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(status_code=401, detail="Invalid Authorization scheme")
    token = authorization[len(prefix):].strip()
    if token != expected:
        raise HTTPException(status_code=403, detail="Invalid API key")


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/analyze")
async def analyze(
    stem: UploadFile = File(...),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    verify_auth(authorization)
    suffix = os.path.splitext(stem.filename or "audio.wav")[-1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        payload = await stem.read()
        tmp.write(payload)
        temp_path = tmp.name

    try:
        y, sr = librosa.load(temp_path, sr=None, mono=True)
        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = int(round(float(tempo)))
        key_name = estimate_key(y, sr)
        duration_sec = int(round(float(duration)))
        return {
            "bpm": max(1, bpm),
            "key": key_name,
            "durationSec": max(1, duration_sec),
            "genreHint": pick_genre_hint(max(1, bpm)),
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not analyze audio: {exc}")
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass
