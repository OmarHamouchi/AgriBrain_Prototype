from apps.agrivision_app import analyze_agrivision

packet = {
    "sensor_packet_id": "vision_pkt_001",
    "source": "drone_unit_X1",
    "timestamp": "2026-03-11T14:00:00Z",
    "data_type": "vision",
    "location": {
        "field": "Field A",
        "zone": "Zone 1"
    },
    "payload": {
        "image_path": "data/vision_samples/sample_test.jpg"
    }
}

result = analyze_agrivision(packet)
print(result)