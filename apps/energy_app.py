def analyze_energy(packet):
    payload = packet["payload"]

    solar_irradiance = payload["solar_irradiance"]
    wind_speed = payload["wind_speed"]
    battery_level = payload["battery_level"]

    energy_score = (
        solar_irradiance * 0.05 +
        wind_speed * 5 +
        battery_level * 0.8
    )

    if energy_score >= 60:
        energy_status = "Sufficient"
        energy_available_for_irrigation = True
        recommended_energy_window = "Now"
    elif energy_score >= 40:
        energy_status = "Moderate"
        energy_available_for_irrigation = True
        recommended_energy_window = "Within 1-2 hours"
    else:
        energy_status = "Insufficient"
        energy_available_for_irrigation = False
        recommended_energy_window = "18:00-19:30"

    result = {
        "app": "Energy App",
        "input_type": "energy_climate",
        "source": packet["source"],
        "location": packet["location"],
        "energy_result": {
            "energy_score": round(energy_score, 2),
            "energy_status": energy_status,
            "energy_available_for_irrigation": energy_available_for_irrigation,
            "recommended_energy_window": recommended_energy_window,
            "battery_level": battery_level,
            "solar_irradiance": solar_irradiance,
            "wind_speed": wind_speed
        }
    }

    return result