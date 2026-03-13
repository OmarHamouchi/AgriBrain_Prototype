def mcp_decide(grouped_results):
    soil_result = grouped_results.get("Soil App", {})
    climate_result = grouped_results.get("Climate App", {})
    energy_result = grouped_results.get("Energy App", {})
    vision_result = grouped_results.get("AgriVision App", {})

    soil_fertility = (
        soil_result.get("soil_fertility_result", {}).get("soil_fertility", "Unknown")
    )

    climate_data = climate_result.get("climate_result", {})
    irrigation_climate_status = climate_data.get("irrigation_climate_status", "Unknown")
    rain_forecast = climate_data.get("rain_forecast", False)

    energy_data = energy_result.get("energy_result", {})
    energy_available = energy_data.get("energy_available_for_irrigation", False)
    energy_window = energy_data.get("recommended_energy_window", "Unknown")

    vision_data = vision_result.get("agrivision_result", {})
    disease_status = vision_data.get("disease_status", "Unknown")

    actions = []
    irrigation_decision = "No irrigation"
    irrigation_time = "Not scheduled"
    estimated_water_liters = 0

    if disease_status == "Diseased":
        actions.append("Dispatch crop inspection")
        actions.append("Schedule disease treatment review")

    if rain_forecast or irrigation_climate_status == "Delay irrigation":
        irrigation_decision = "Delay irrigation"
        irrigation_time = "Wait for better climate window"
        estimated_water_liters = 0
    else:
        if energy_available:
            irrigation_decision = "Irrigate now"
            irrigation_time = "Now"
            estimated_water_liters = 120 if soil_fertility == "Not Fertile" else 80
        else:
            irrigation_decision = "Schedule irrigation"
            irrigation_time = energy_window
            estimated_water_liters = 120 if soil_fertility == "Not Fertile" else 80

    if irrigation_decision != "No irrigation":
        actions.append(irrigation_decision)

    result = {
        "module": "MCP Central Brain",
        "decision_summary": {
            "irrigation_decision": irrigation_decision,
            "irrigation_time": irrigation_time,
            "estimated_water_liters": estimated_water_liters,
            "soil_fertility": soil_fertility,
            "disease_status": disease_status,
            "energy_available": energy_available,
            "climate_status": irrigation_climate_status
        },
        "planned_actions": actions
    }

    return result