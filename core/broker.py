class Broker:
    def __init__(self):
        self.routes = {}
        self.collected_results = []

    def register_app(self, data_type, app_name, app_handler):
        if data_type not in self.routes:
            self.routes[data_type] = []

        self.routes[data_type].append({
            "app_name": app_name,
            "handler": app_handler
        })

    def route_input(self, packet):
        data_type = packet["data_type"]

        print(f"[Broker] Routing packet type: {data_type}")

        if data_type not in self.routes:
            print(f"[Broker] No apps registered for data type: {data_type}")
            return

        for route in self.routes[data_type]:
            app_name = route["app_name"]
            handler = route["handler"]

            print(f"[Broker] Sending packet to {app_name}...")
            result = handler(packet)

            self.collected_results.append({
                "data_type": data_type,
                "app_name": app_name,
                "result": result
            })

            print(f"[Broker] Result received from {app_name}")

    def get_results(self):
        return self.collected_results

    def group_results_for_mcp(self):
        grouped = {}
        for item in self.collected_results:
            grouped[item["app_name"]] = item["result"]
        return grouped