import os
import json
import pandas as pd
import numpy as np

import mindspore as ms
import mindspore.nn as nn
from mindspore import Tensor
from mindspore import ops
from mindspore.train.serialization import save_checkpoint

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score


ms.set_context(mode=ms.PYNATIVE_MODE)


FEATURE_COLUMNS = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]
TARGET_COLUMN = "Output"


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


def save_scaler_params(scaler, path):
    scaler_data = {
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "features": FEATURE_COLUMNS
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(scaler_data, f, indent=2)


def main():
    dataset_path = os.path.join("data", "soil_fertility.csv")
    model_path = os.path.join("models", "soil_model.ckpt")
    scaler_path = os.path.join("models", "soil_scaler.json")

    df = pd.read_csv(dataset_path)

    X = df[FEATURE_COLUMNS].values.astype(np.float32)
    y = df[TARGET_COLUMN].values.astype(np.int32)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X).astype(np.float32)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    model = SoilNet(input_dim=len(FEATURE_COLUMNS))
    loss_fn = nn.SoftmaxCrossEntropyWithLogits(sparse=True, reduction="mean")
    optimizer = nn.Adam(model.trainable_params(), learning_rate=0.001)

    epochs = 80

    X_train_tensor = Tensor(X_train, ms.float32)
    y_train_tensor = Tensor(y_train, ms.int32)
    X_test_tensor = Tensor(X_test, ms.float32)

    def forward_fn(data, label):
        logits = model(data)
        loss = loss_fn(logits, label)
        return loss, logits

    grad_fn = ms.value_and_grad(forward_fn, None, optimizer.parameters, has_aux=True)

    def train_step(data, label):
        (loss, _), grads = grad_fn(data, label)
        optimizer(grads)
        return loss

    for epoch in range(epochs):
        loss = train_step(X_train_tensor, y_train_tensor)
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.asnumpy():.4f}")

    logits = model(X_test_tensor)
    preds = ops.Argmax(axis=1)(logits).asnumpy()
    acc = accuracy_score(y_test, preds)

    print(f"\nSoil Fertility Model Accuracy: {acc:.4f}")

    save_checkpoint(model, model_path)
    save_scaler_params(scaler, scaler_path)

    print(f"Model saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")


if __name__ == "__main__":
    main()