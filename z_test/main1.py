from core.broker import Broker
from core.gateway import Gateway

from apps.soil_app import analyze_soil
from apps.agrivision_app import analyze_agrivision
from apps.climate_app import analyze_climate
from apps.energy_app import analyze_energy


def main():
    print("========== AGRIBRAIN PROTOTYPE START ==========")

    broker = Broker()
    gateway = Gateway(broker)

    # Register apps
    broker.register_app("soil", "Soil App", analyze_soil)
    broker.register_app("vision", "AgriVision App", analyze_agrivision)
    broker.register_app("energy_climate", "Climate App", analyze_climate)
    broker.register_app("energy_climate", "Energy App", analyze_energy)

    # Load packets
    soil_packet = gateway.load_json_packet("data/soil_sensor_data.json")
    energy_climate_packet = gateway.load_json_packet("data/weather_energy_data.json")
    vision_packet = gateway.build_vision_packet("data/vision_samples/sample_test.jpg")

    # Send through gateway
    gateway.send_packet(soil_packet)
    gateway.send_packet(energy_climate_packet)
    gateway.send_packet(vision_packet)

    # Show collected results
    print("\n========== COLLECTED RESULTS ==========")
    results = broker.get_results()

    for idx, item in enumerate(results, start=1):
        print(f"\n--- Result {idx} ---")
        print(f"App Name: {item['app_name']}")
        print(item["result"])

    print("\n========== GROUPED RESULTS FOR MCP ==========")
    grouped = broker.group_results_for_mcp()
    for app_name, result in grouped.items():
        print(f"\n[{app_name}]")
        print(result)

    print("\n========== PROTOTYPE FLOW COMPLETED ==========")


if __name__ == "__main__":
    main()