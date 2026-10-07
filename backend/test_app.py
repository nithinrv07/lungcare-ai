import io
import json
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from backend.app import app, FEATURES, models, errors, versions, image_tensor

client = TestClient(app)

def png():
    buf = io.BytesIO()
    Image.new("RGB", (20, 10), (255, 128, 0)).save(buf, "PNG")
    return buf.getvalue()

def test_missing_model_is_unavailable():
    models.clear()
    response = client.post("/api/predict", data={"mode": "image_only"},
                           files={"image": ("scan.png", png(), "image/png")})
    assert response.status_code == 200
    assert response.json()["image"]["status"] == "unavailable"
    assert response.json()["structured"]["status"] == "not_included"

def test_reject_missing_feature_and_nonfinite():
    values = dict.fromkeys(FEATURES, 1)
    for bad in [{}, {**values, "Age": float("nan")}, {**values, "Age": True}]:
        r = client.post("/api/predict", data={"mode": "patient_only", "features": json.dumps(bad)})
        assert r.status_code == 422

def test_reject_invalid_image():
    r = client.post("/api/predict", data={"mode":"image_only"},
                    files={"image":("bad.png", b"not an image", "image/png")})
    assert r.status_code == 422

def test_image_range_and_shape():
    x = image_tensor(png())
    assert x.shape == (1,224,224,3)
    assert list(x[0,0,0]) == [255,128,0]

def test_both_branches_keep_their_class_order():
    class Structured:
        classes_ = np.array(["High", "Low", "Medium"])
        def predict_proba(self, frame):
            assert list(frame.columns) == FEATURES
            return np.array([[.1,.2,.7]])
    class Imaging:
        def __call__(self, x, training):
            assert training is False
            return np.array([[.1,.6,.2,.1]])
    models.update(structured=Structured(),image=Imaging())
    versions.update(structured="test", image="test")
    try:
        r=client.post("/api/predict",data={"mode":"both","features":json.dumps(dict.fromkeys(FEATURES,1))},
                      files={"image":("scan.png",png(),"image/png")})
        assert r.status_code==200
        assert r.json()["structured"]["predicted_class"]=="Medium"
        assert r.json()["image"]["predicted_class"]=="large.cell.carcinoma"
        assert set(r.json())=={"structured","image"}
    finally:
        models.clear()
