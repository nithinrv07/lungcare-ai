# Real model integration

New Assessment calls the Python service. Existing dashboard/history entries remain demonstration data; live requests are not persisted. The live results stay in the assessment view and never use the demo calculation, explanations or overlays.

## Run locally

Use Python 3.11 in a virtual environment:
```sh
python -m venv backend/.venv
# Windows: backend\.venv\Scripts\activate
# macOS/Linux: source backend/.venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

In another terminal run `npm install` and `npm run dev`. Vite forwards /api to port 8000. For production configure a same-origin /api reverse proxy to the backend. This service is for local research use; internet deployment needs authentication, upload rate limits and request-body limits at the proxy.

## Required artifacts

Provision trusted files in backend/models (ignored by git):
- lung_cancer_model_deduplicated.pkl — the supplied Random Forest, scikit-learn 1.6.1.
- selected_image_model.keras — the actual trained image checkpoint, not yet supplied.
- metadata.json — training export containing class_names in this exact verified order:
  ["adenocarcinoma", "large.cell.carcinoma", "normal", "squamous.cell.carcinoma"]

The repository root metadata.json is AI Studio app metadata, NOT model metadata.
Restart the backend after provisioning artifacts. /api/health reports each model independently.

The image model must accept RGB 224x224 values in 0–255 with EfficientNet preprocessing built in. No additional division by 255. Only single PNG/JPEG CT exports are accepted, not DICOM volumes or X-rays.

The structured form deliberately uses the original 23 column names. The demo questionnaire's pack-years, booleans and duration fields cannot be safely mapped to those encodings. Obtain the original CSV/training preprocessing and validate the codes before using this branch. No ranges or category conversions have been invented.

Missing artifacts produce unavailable results. Scores, diagnoses, SHAP and Grad-CAM are never fabricated. Two outputs are never averaged.

## Verification

Install pytest and httpx, then run `python -m pytest backend/test_app.py -q`. Tests cover missing artifacts, invalid structured values, malformed images, RGB pixel scale, and independent output class ordering.
