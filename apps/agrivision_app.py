import os
import json
import numpy as np
from PIL import Image

import mindspore as ms
import mindspore.nn as nn
from mindspore import Tensor
from mindspore import ops
from mindspore.train.serialization import load_checkpoint, load_param_into_net


IMG_SIZE = 128


class SimpleVisionNet(nn.Cell):
    def __init__(self, num_classes=2):
        super(SimpleVisionNet, self).__init__()
        self.features = nn.SequentialCell(
            nn.Conv2d(3, 16, kernel_size=3, pad_mode="pad", padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(16, 32, kernel_size=3, pad_mode="pad", padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(32, 64, kernel_size=3, pad_mode="pad", padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )

        self.flatten = nn.Flatten()
        self.classifier = nn.SequentialCell(
            nn.Dense(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Dense(128, num_classes)
        )

    def construct(self, x):
        x = self.features(x)
        x = self.flatten(x)
        x = self.classifier(x)
        return x


class AgriVisionModel:
    def __init__(self):
        self.labels = self._load_labels(os.path.join("models", "vision_labels.json"))
        self.model = SimpleVisionNet(num_classes=len(self.labels))
        self._load_model(os.path.join("models", "agrivision_model.ckpt"))

    def _load_labels(self, labels_path):
        with open(labels_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
        return {int(k): v for k, v in raw.items()}

    def _load_model(self, model_path):
        params = load_checkpoint(model_path)
        load_param_into_net(self.model, params)
        self.model.set_train(False)

    def _preprocess_image(self, image_path):
        image = Image.open(image_path).convert("RGB")
        image = image.resize((IMG_SIZE, IMG_SIZE))
        image = np.array(image).astype(np.float32) / 255.0
        image = np.transpose(image, (2, 0, 1))
        image = np.expand_dims(image, axis=0)
        return Tensor(image, ms.float32)

    def predict(self, image_path):
        input_tensor = self._preprocess_image(image_path)

        logits = self.model(input_tensor)
        probs = ops.Softmax(axis=1)(logits).asnumpy()[0]
        pred_idx = int(np.argmax(probs))
        label = self.labels[pred_idx]
        confidence = float(probs[pred_idx])

        disease_status = "Healthy" if label == "healthy" else "Diseased"

        return {
            "predicted_label": label,
            "disease_status": disease_status,
            "confidence": confidence
        }


agrivision_model = None


def load_agrivision_model():
    global agrivision_model
    if agrivision_model is None:
        agrivision_model = AgriVisionModel()
    return agrivision_model


def analyze_agrivision(packet):
    model = load_agrivision_model()
    image_path = packet["payload"]["image_path"]

    prediction = model.predict(image_path)

    result = {
        "app": "AgriVision App",
        "input_type": "vision",
        "source": packet["source"],
        "location": packet["location"],
        "image_path": image_path,
        "agrivision_result": prediction
    }

    return result