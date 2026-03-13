import os
import json
import numpy as np

import mindspore as ms
import mindspore.nn as nn
import mindspore.dataset as ds
import mindspore.dataset.vision as vision
import mindspore.dataset.transforms as transforms

from mindspore import Tensor
from mindspore import ops
from mindspore.train.serialization import save_checkpoint
from sklearn.metrics import accuracy_score


ms.set_context(mode=ms.PYNATIVE_MODE)

DATA_DIR = os.path.join("data", "vision_dataset")
TRAIN_DIR = os.path.join(DATA_DIR, "train")
VAL_DIR = os.path.join(DATA_DIR, "val")
MODEL_PATH = os.path.join("models", "agrivision_model.ckpt")
LABELS_PATH = os.path.join("models", "vision_labels.json")

IMG_SIZE = 128
BATCH_SIZE = 16
EPOCHS = 5
NUM_CLASSES = 2


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


def create_dataset(data_dir, batch_size=16, training=True):
    dataset = ds.ImageFolderDataset(data_dir, shuffle=training)

    image_ops = [
        vision.Decode(),
        vision.Resize((IMG_SIZE, IMG_SIZE)),
        vision.Rescale(1.0 / 255.0, 0.0),
        vision.HWC2CHW()
    ]

    label_ops = transforms.TypeCast(ms.int32)

    dataset = dataset.map(operations=image_ops, input_columns="image")
    dataset = dataset.map(operations=label_ops, input_columns="label")
    dataset = dataset.batch(batch_size)

    return dataset


def evaluate_model(model, dataset):
    all_preds = []
    all_labels = []

    softmax = ops.Softmax(axis=1)
    argmax = ops.Argmax(axis=1)

    for batch in dataset.create_dict_iterator():
        images = batch["image"]
        labels = batch["label"]

        logits = model(images)
        probs = softmax(logits)
        preds = argmax(probs)

        all_preds.extend(preds.asnumpy().tolist())
        all_labels.extend(labels.asnumpy().tolist())

    return accuracy_score(all_labels, all_preds)


def save_labels(train_dir, labels_path):
    class_names = sorted(
        [name for name in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, name))]
    )
    label_map = {idx: name for idx, name in enumerate(class_names)}

    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(label_map, f, indent=2)

    print(f"Labels saved to: {labels_path}")
    print(f"Label mapping: {label_map}")


def main():
    train_dataset = create_dataset(TRAIN_DIR, batch_size=BATCH_SIZE, training=True)
    val_dataset = create_dataset(VAL_DIR, batch_size=BATCH_SIZE, training=False)

    model = SimpleVisionNet(num_classes=NUM_CLASSES)
    loss_fn = nn.SoftmaxCrossEntropyWithLogits(sparse=True, reduction="mean")
    optimizer = nn.Adam(model.trainable_params(), learning_rate=0.001)

    def forward_fn(data, label):
        logits = model(data)
        loss = loss_fn(logits, label)
        return loss, logits

    grad_fn = ms.value_and_grad(forward_fn, None, optimizer.parameters, has_aux=True)

    def train_step(data, label):
        (loss, _), grads = grad_fn(data, label)
        optimizer(grads)
        return loss

    for epoch in range(EPOCHS):
        losses = []

        for batch in train_dataset.create_dict_iterator():
            images = batch["image"]
            labels = batch["label"]
            loss = train_step(images, labels)
            losses.append(loss.asnumpy().item())

        avg_loss = float(np.mean(losses)) if losses else 0.0
        val_acc = evaluate_model(model, val_dataset)

        print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {avg_loss:.4f} | Val Accuracy: {val_acc:.4f}")

    save_checkpoint(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")

    save_labels(TRAIN_DIR, LABELS_PATH)


if __name__ == "__main__":
    main()