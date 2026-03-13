import json
import os
import numpy as np
import mindspore as ms
import mindspore.nn as nn
from mindspore import Tensor
from mindspore import ops
from mindspore.train.serialization import load_checkpoint, load_param_into_net


FEATURE_COLUMNS = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]


class SoilNet(nn.Cell):
    def __init__(self, input_dim):
        super(SoilNet, self).__init__()
        self.net = nn.SequentialCell(
            nn.Dense(input_dim, 32),
            nn.ReLU(),
            nn.Dense(32, 16),
            nn.ReLU(),
            nn.Dense(16, 2)
        )

    def construct(self, x):
        return self.net(x)


class SoilFertilityModel:
    def __init__(self):
        self.model = SoilNet(input_dim=len(FEATURE_COLUMNS))
        self.scaler = self._load_scaler(os.path.join("models", "soil_scaler.json"))
        self._load_model(os.path.join("models", "soil_model.ckpt"))

    def _load_scaler(self, scaler_path):
        with open(scaler_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _load_model(self, model_path):
        params = load_checkpoint(model_path)
        load_param_into_net(self.model, params)
        self.model.set_train(False)

    def _scale_features(self, values):
        mean = np.array(self.scaler["mean"], dtype=np.float32)
        scale = np.array(self.scaler["scale"], dtype=np.float32)
        values = np.array(values, dtype=np.float32)
        return (values - mean) / scale

    def predict(self, soil_features):
        values = [soil_features[col] for col in FEATURE_COLUMNS]
        scaled = self._scale_features(values)
        input_tensor = Tensor([scaled], ms.float32)

        logits = self.model(input_tensor)
        probs = ops.Softmax(axis=1)(logits).asnumpy()[0]
        pred = int(np.argmax(probs))

        return {
            "fertility_label": pred,
            "soil_fertility": "Fertile" if pred == 1 else "Not Fertile",
            "confidence": float(probs[pred])
        }


soil_model = None


def load_soil_model():
    global soil_model
    if soil_model is None:
        soil_model = SoilFertilityModel()
    return soil_model


def analyze_soil(packet):
    model = load_soil_model()
    payload = packet["payload"]

    prediction = model.predict(payload)

    result = {
        "app": "Soil App",
        "input_type": "soil",
        "source": packet["source"],
        "location": packet["location"],
        "soil_fertility_result": prediction
    }

    return result