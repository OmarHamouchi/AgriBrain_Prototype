import json
from apps.soil_app import analyze_soil

with open("data/soil_sensor_data.json", "r", encoding="utf-8") as f:
    packet = json.load(f)

result = analyze_soil(packet)
print(result)