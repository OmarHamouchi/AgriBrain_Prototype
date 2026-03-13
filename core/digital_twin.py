def simulate_decision(grouped_results, mcp_result):
    decision_data = mcp_result.get("decision_summary", {})

    irrigation_decision = decision_data.get("irrigation_decision", "Unknown")
    irrigation_time = decision_data.get("irrigation_time", "Unknown")
    water_amount = decision_data.get("estimated_water_liters", 0)
    disease_status = decision_data.get("disease_status", "Unknown")
    climate_status = decision_data.get("climate_status", "Unknown")
    energy_available = decision_data.get("energy_available", False)

    feasibility_score = 0
    predicted_soil_moisture_gain = 0
    risk_level = "Low"

    if irrigation_decision == "Irrigate now":
        feasibility_score = 92 if energy_available else 55
        predicted_soil_moisture_gain = 18
        risk_level = "Medium" if disease_status == "Diseased" else "Low"

    elif irrigation_decision == "Schedule irrigation":
        feasibility_score = 78
        predicted_soil_moisture_gain = 15
        risk_level = "Low"

    elif irrigation_decision == "Delay irrigation":
        feasibility_score = 70
        predicted_soil_moisture_gain = 0
        risk_level = "Medium" if climate_status == "Delay irrigation" else "Low"

    else:
        feasibility_score = 60
        predicted_soil_moisture_gain = 0
        risk_level = "Low"

    simulation_result = {
        "module": "Digital Twin",
        "simulation_summary": {
            "simulated_decision": irrigation_decision,
            "simulated_execution_time": irrigation_time,
            "predicted_soil_moisture_gain_percent": predicted_soil_moisture_gain,
            "estimated_water_usage_liters": water_amount,
            "feasibility_score": feasibility_score,
            "risk_level": risk_level,
            "twin_comment": (
                f"Simulation suggests that '{irrigation_decision}' at '{irrigation_time}' "
                f"is feasible with score {feasibility_score}/100."
            )
        }
    }

    return simulation_result