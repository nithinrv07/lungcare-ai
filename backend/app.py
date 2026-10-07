"""Local research inference service; no demo predictions or score fusion."""
import io
import json
import math
import os
import hashlib
from pathlib import Path
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parent
MODEL_DIR = Path(os.getenv("MODEL_DIR", ROOT / "models"))
FEATURES = ["Age", "Gender", "Air Pollution", "Alcohol use", "Dust Allergy",
 "OccuPational Hazards", "Genetic Risk", "chronic Lung Disease", "Balanced Diet",
 "Obesity", "Smoking", "Passive Smoker", "Chest Pain", "Coughing of Blood",
 "Fatigue", "Weight Loss", "Shortness of Breath", "Wheezing", "Swallowing Difficulty",
 "Clubbing of Finger Nails", "Frequent Cold", "Dry Cough", "Snoring"]
CLASSES = ["adenocarcinoma", "large.cell.carcinoma", "normal", "squamous.cell.carcinoma"]
models = {}
errors = {}
versions = {}
MAX_BYTES = 10 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 20_000_000

def load_models():
    models.clear()
    errors.clear()
    for branch, filename in [("structured", "lung_cancer_model_deduplicated.pkl"),
                             ("image", "selected_image_model.keras")]:
        path = MODEL_DIR / filename
        if not path.exists():
            errors[branch] = f"Missing {filename}"
            continue
        try:
            if branch == "structured":
                import joblib
                model = joblib.load(path)  # Only locally provisioned trusted artifacts.
                if list(model.feature_names_in_) != FEATURES:
                    raise ValueError("Feature order differs from the documented 23-column contract")
                if set(map(str, model.classes_)) != {"High", "Low", "Medium"}:
                    raise ValueError("Unexpected structured class labels")
            else:
                import tensorflow as tf
                meta = json.loads((MODEL_DIR / "metadata.json").read_text())
                if meta.get("class_names") != CLASSES:
                    raise ValueError("metadata.json must contain the verified ordered class_names")
                model = tf.keras.models.load_model(path, compile=False, safe_mode=True)
                if tuple(model.input_shape[1:]) != (224, 224, 3) or model.output_shape[-1] != 4:
                    raise ValueError("Expected RGB 224x224 input and four outputs")
            models[branch] = model
            versions[branch] = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
        except Exception as exc:
            errors[branch] = f"Artifact could not load: {type(exc).__name__}: {exc}"

@asynccontextmanager
async def lifespan(app):
    load_models()
    yield

app = FastAPI(title="LungCare model inference", lifespan=lifespan)

@app.get("/api/health")
def health():
    return {"models": {b: {"loaded": b in models, "version": versions.get(b),
                           "error": errors.get(b)} for b in ("structured", "image")}}

@app.get("/api/schema")
def schema():
    return {"features": FEATURES, "class_names": CLASSES,
            "structured_input": "Original training-encoded values; no clinical-unit conversion.",
            "image_input": "Single exported CT image, PNG/JPEG, RGB 224x224, pixel range 0–255"}

def validated_features(raw):
    try:
        values = json.loads(raw)
    except (ValueError, TypeError):
        raise HTTPException(422, "Features must be a JSON object")
    if not isinstance(values, dict) or set(values) != set(FEATURES):
        raise HTTPException(422, "Supply exactly the 23 feature names returned by /api/schema")
    if any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v)
           for v in values.values()):
        raise HTTPException(422, "Every feature must be a finite number in the training encoding")
    return values

def image_tensor(data):
    try:
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as im:
                if im.format not in {"PNG", "JPEG"}:
                    raise ValueError("Only PNG and JPEG are supported")
                if im.width * im.height > Image.MAX_IMAGE_PIXELS:
                    raise ValueError("Image exceeds 20 megapixels")
                im = im.convert("RGB").resize((224, 224), Image.Resampling.BILINEAR)
                return np.asarray(im, dtype=np.float32)[None, ...]
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError,
            Image.DecompressionBombWarning):
        raise HTTPException(422, "Invalid or oversized PNG/JPEG image")

def predict_branch(branch, inputs):
    if branch not in models:
        return {"status": "unavailable", "error": errors.get(branch, "Model not loaded")}
    try:
        if branch == "structured":
            import pandas as pd
            frame = pd.DataFrame([[inputs[f] for f in FEATURES]], columns=FEATURES)
            labels = list(map(str, models[branch].classes_))
            scores = np.asarray(models[branch].predict_proba(frame)[0], dtype=float)
        else:
            labels = CLASSES
            scores = np.asarray(models[branch](inputs, training=False))[0].astype(float)
        if scores.shape != (len(labels),) or not np.isfinite(scores).all() or (scores < 0).any() or (scores > 1).any() or not np.isclose(scores.sum(), 1, atol=1e-3):
            raise ValueError("Invalid model probability vector")
        return {"status": "available", "model": "Random Forest" if branch == "structured" else "EfficientNetB0",
                "version": versions[branch], "predicted_class": labels[int(scores.argmax())],
                "scores": dict(zip(labels, scores.tolist()))}
    except Exception:
        return {"status": "failed", "error": "Inference failed; check artifact and runtime compatibility"}

@app.post("/api/predict")
async def predict(mode: str = Form(...), features: str | None = Form(None),
                  image: UploadFile | None = File(None)):
    if mode not in {"both", "patient_only", "image_only"}:
        raise HTTPException(422, "Invalid assessment mode")
    values = tensor = None
    if mode != "image_only":
        if features is None:
            raise HTTPException(422, "Structured features are required")
        values = validated_features(features)
    if mode != "patient_only":
        if image is None:
            raise HTTPException(422, "A CT image is required")
        data = await image.read(MAX_BYTES + 1)
        await image.close()
        if len(data) > MAX_BYTES:
            raise HTTPException(413, "Maximum image size is 10 MB")
        tensor = image_tensor(data)
    # Run CPU/GPU inference outside the asynchronous request loop.
    from starlette.concurrency import run_in_threadpool
    result = {}
    for branch, inputs in [("structured", values), ("image", tensor)]:
        result[branch] = (await run_in_threadpool(predict_branch, branch, inputs)
                          if inputs is not None else {"status": "not_included"})
    return result
