def analyze_climate(packet):
    payload = packet["payload"]

    temperature = payload["temperature"]
    humidity = payload["humidity"]
    rain_forecast = payload["rain_forecast"]
    cloud_cover = payload["cloud_cover"]

    if rain_forecast:
        irrigation_climate_status = "Delay irrigation"
        rain_risk = "High"
    elif temperature > 32 and humidity < 45:
        irrigation_climate_status = "Hot and dry conditions"
        rain_risk = "Low"
    elif cloud_cover > 70:
        irrigation_climate_status = "Monitor conditions"
        rain_risk = "Medium"
    else:
        irrigation_climate_status = "Climate acceptable for irrigation"
        rain_risk = "Low"

    result = {
        "app": "Climate App",
        "input_type": "energy_climate",
        "source": packet["source"],
        "location": packet["location"],
        "climate_result": {
            "irrigation_climate_status": irrigation_climate_status,
            "rain_risk": rain_risk,
            "temperature": temperature,
            "humidity": humidity,
            "cloud_cover": cloud_cover,
            "rain_forecast": rain_forecast,
            "climate_summary": (
                f"Temp={temperature}°C, Humidity={humidity}%, "
                f"Cloud cover={cloud_cover}%, Rain forecast={rain_forecast}"
            )
        }
    }

    return result