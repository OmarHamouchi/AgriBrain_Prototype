from core.broker import Broker
from core.gateway import Gateway


def dummy_soil_app(packet):
    print("[Soil App] Soil packet received")
    return {"status": "soil analysis pending"}

def dummy_energy_app(packet):
    print("[Energy App] Energy packet received")
    return {"status": "energy analysis pending"}

def dummy_agrivision_app(packet):
    print("[AgriVision App] Vision packet received")
    return {"status": "vision analysis pending"}


def main():
    broker = Broker()
    gateway = Gateway(broker)

    broker.register_app("soil", dummy_soil_app)
    broker.register_app("energy_climate", dummy_energy_app)
    broker.register_app("vision", dummy_agrivision_app)

    soil_packet = gateway.load_json_packet("data/soil_sensor_data.json")
    energy_packet = gateway.load_json_packet("data/weather_energy_data.json")
    vision_packet = gateway.build_vision_packet("data/vision_samples/diseased_crop.jpg")

    gateway.send_packet(soil_packet)
    gateway.send_packet(energy_packet)
    gateway.send_packet(vision_packet)

    print("\n=== Broker Collected Results ===")
    print(broker.get_results())


if __name__ == "__main__":
    main()