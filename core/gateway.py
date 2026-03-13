import json
import os


class Gateway:
    def __init__(self, broker):
        self.broker = broker

    def load_json_packet(self, file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def build_vision_packet(self, image_path):
        return {
            "sensor_packet_id": f"vision_{os.path.basename(image_path)}",
            "source": "drone_unit_X1",
            "timestamp": "2026-03-11T14:00:00Z",
            "data_type": "vision",
            "location": {
                "field": "Field A",
                "zone": "Zone 1"
            },
            "payload": {
                "image_path": image_path
            }
        }

    def send_packet(self, packet):
        print(
            f"[Gateway] Received packet from {packet['source']} "
            f"| type={packet['data_type']} "
            f"| id={packet['sensor_packet_id']}"
        )
        self.broker.route_input(packet)