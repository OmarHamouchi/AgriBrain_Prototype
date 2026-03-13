import json
from apps.climate_app import analyze_climate
from apps.energy_app import analyze_energy

with open("data/weather_energy_data.json", "r", encoding="utf-8") as f:
    packet = json.load(f)

climate_result = analyze_climate(packet)
energy_result = analyze_energy(packet)

print("=== CLIMATE APP RESULT ===")
print(climate_result)

print("\n=== ENERGY APP RESULT ===")
print(energy_result)