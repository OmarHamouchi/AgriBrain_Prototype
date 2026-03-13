def execute_actions(mcp_result, digital_twin_result):
    decision_data = mcp_result.get("decision_summary", {})
    planned_actions = mcp_result.get("planned_actions", [])
    twin_data = digital_twin_result.get("simulation_summary", {})

    irrigation_decision = decision_data.get("irrigation_decision", "Unknown")
    irrigation_time = decision_data.get("irrigation_time", "Unknown")
    water_amount = decision_data.get("estimated_water_liters", 0)
    feasibility_score = twin_data.get("feasibility_score", 0)

    execution_status = []
    actuator_status = "Ready"

    for action in planned_actions:
        if action == "Irrigate now":
            execution_status.append({
                "action": "Irrigation Pump Activation",
                "status": "Executed",
                "time": "Now",
                "water_liters": water_amount
            })
        elif action == "Schedule irrigation":
            execution_status.append({
                "action": "Irrigation Scheduling",
                "status": "Scheduled",
                "time": irrigation_time,
                "water_liters": water_amount
            })
        elif action == "Delay irrigation":
            execution_status.append({
                "action": "Irrigation Hold",
                "status": "Postponed",
                "time": irrigation_time,
                "reason": "Climate condition not suitable"
            })
        elif action == "Dispatch crop inspection":
            execution_status.append({
                "action": "Crop Inspection Task",
                "status": "Scheduled",
                "time": "Immediate"
            })
        elif action == "Schedule disease treatment review":
            execution_status.append({
                "action": "Disease Treatment Review",
                "status": "Scheduled",
                "time": "Next agronomy window"
            })

    if feasibility_score < 50:
        actuator_status = "Warning"
    elif feasibility_score < 75:
        actuator_status = "Moderate confidence"
    else:
        actuator_status = "Execution validated"

    return {
        "module": "Actuator App",
        "actuator_status": actuator_status,
        "executed_actions": execution_status
    }