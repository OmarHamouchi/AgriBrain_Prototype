from core.broker import Broker
from core.gateway import Gateway
from core.mcp import mcp_decide
from core.digital_twin import simulate_decision
from core.actuator import execute_actions

from apps.soil_app import analyze_soil
from apps.agrivision_app import analyze_agrivision
from apps.climate_app import analyze_climate
from apps.energy_app import analyze_energy
import json


def main():
    print("========== AGRIBRAIN PROTOTYPE START ==========")

    broker = Broker()
    gateway = Gateway(broker)

    broker.register_app("soil", "Soil App", analyze_soil)
    broker.register_app("vision", "AgriVision App", analyze_agrivision)
    broker.register_app("energy_climate", "Climate App", analyze_climate)
    broker.register_app("energy_climate", "Energy App", analyze_energy)

    soil_packet = gateway.load_json_packet("data/soil_sensor_data.json")
    energy_climate_packet = gateway.load_json_packet("data/weather_energy_data.json")
    vision_packet = gateway.build_vision_packet("data/vision_samples/sample_test.jpg")

    gateway.send_packet(soil_packet)
    gateway.send_packet(energy_climate_packet)
    gateway.send_packet(vision_packet)

    print("\n========== COLLECTED RESULTS ==========")
    results = broker.get_results()

    for idx, item in enumerate(results, start=1):
        print(f"\n--- Result {idx} ---")
        print(f"App Name: {item['app_name']}")
        print(item["result"])

    grouped = broker.group_results_for_mcp()

    print("\n========== GROUPED RESULTS FOR MCP ==========")
    for app_name, result in grouped.items():
        print(f"\n[{app_name}]")
        print(result)

    mcp_result = mcp_decide(grouped)
    print("\n========== MCP CENTRAL BRAIN ==========")
    #print(mcp_result)
    print(json.dumps(mcp_result, indent=2))

    twin_result = simulate_decision(grouped, mcp_result)
    print("\n========== DIGITAL TWIN ==========")
    #print(twin_result)
    print(json.dumps(twin_result, indent=2))

    actuator_result = execute_actions(mcp_result, twin_result)
    print("\n========== ACTUATOR EXECUTION ==========")
    #print(actuator_result)
    print(json.dumps(actuator_result, indent=2))

    print("\n========== PROTOTYPE FLOW COMPLETED ==========")


if __name__ == "__main__":
    main()