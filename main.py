import time
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.pretty import Pretty
from rich.text import Text

from core.broker import Broker
from core.gateway import Gateway
from core.mcp import mcp_decide
from core.digital_twin import simulate_decision
from core.actuator import execute_actions

from apps.soil_app import analyze_soil
from apps.agrivision_app import analyze_agrivision
from apps.climate_app import analyze_climate
from apps.energy_app import analyze_energy


console = Console()


def pause(seconds=1.5):
    time.sleep(seconds)


def show_title():
    title = Text("AGRIBRAIN SMART FARMING PROTOTYPE", style="bold green")
    subtitle = Text("IoT + Multi-App Analysis + MCP + Digital Twin + Actuator", style="cyan")
    console.print(Panel.fit(f"{title}\n{subtitle}", border_style="green"))


def show_packet_summary(soil_packet, energy_packet, vision_packet):
    table = Table(title="Incoming Data Packets", show_lines=True)
    table.add_column("Packet Type", style="bold cyan")
    table.add_column("Source", style="magenta")
    table.add_column("Packet ID", style="yellow")
    table.add_column("Status", style="green")

    table.add_row("Soil", soil_packet["source"], soil_packet["sensor_packet_id"], "Ready")
    table.add_row("Energy / Climate", energy_packet["source"], energy_packet["sensor_packet_id"], "Ready")
    table.add_row("Vision", vision_packet["source"], vision_packet["sensor_packet_id"], "Ready")

    console.print(table)


def show_collected_results(results):
    console.print(Panel.fit("[bold blue]Collected App Results[/bold blue]", border_style="blue"))

    for item in results:
        app_name = item["app_name"]
        result = item["result"]

        console.print(
            Panel(
                Pretty(result, expand_all=True),
                title=f"[bold green]{app_name}[/bold green]",
                border_style="green"
            )
        )
        pause(3.0)


def show_grouped_results(grouped):
    console.print(Panel.fit("[bold magenta]Grouped Results for MCP[/bold magenta]", border_style="magenta"))

    for app_name, result in grouped.items():
        console.print(
            Panel(
                Pretty(result, expand_all=True),
                title=f"[bold yellow]{app_name}[/bold yellow]",
                border_style="yellow"
            )
        )
        pause(2.8)


def show_mcp_result(mcp_result):
    decision = mcp_result["decision_summary"]

    table = Table(title="MCP Central Brain Decision", show_lines=True)
    table.add_column("Field", style="bold cyan")
    table.add_column("Value", style="white")

    table.add_row("Irrigation Decision", str(decision["irrigation_decision"]))
    table.add_row("Irrigation Time", str(decision["irrigation_time"]))
    table.add_row("Estimated Water (L)", str(decision["estimated_water_liters"]))
    table.add_row("Soil Fertility", str(decision["soil_fertility"]))
    table.add_row("Disease Status", str(decision["disease_status"]))
    table.add_row("Energy Available", str(decision["energy_available"]))
    table.add_row("Climate Status", str(decision["climate_status"]))

    console.print(table)

    actions = "\n".join(f"- {a}" for a in mcp_result["planned_actions"])
    console.print(Panel(actions, title="Planned Actions", border_style="red"))


def show_twin_result(twin_result):
    sim = twin_result["simulation_summary"]

    table = Table(title="Digital Twin Simulation", show_lines=True)
    table.add_column("Metric", style="bold cyan")
    table.add_column("Value", style="white")

    table.add_row("Simulated Decision", str(sim["simulated_decision"]))
    table.add_row("Execution Time", str(sim["simulated_execution_time"]))
    table.add_row("Soil Moisture Gain (%)", str(sim["predicted_soil_moisture_gain_percent"]))
    table.add_row("Water Usage (L)", str(sim["estimated_water_usage_liters"]))
    table.add_row("Feasibility Score", str(sim["feasibility_score"]))
    table.add_row("Risk Level", str(sim["risk_level"]))

    console.print(table)
    console.print(Panel(sim["twin_comment"], title="Twin Comment", border_style="blue"))


def show_actuator_result(actuator_result):
    console.print(Panel.fit("[bold green]Actuator Execution[/bold green]", border_style="green"))
    console.print(f"[bold yellow]Actuator Status:[/bold yellow] {actuator_result['actuator_status']}")

    table = Table(title="Executed / Scheduled Actions", show_lines=True)
    table.add_column("Action", style="bold cyan")
    table.add_column("Status", style="green")
    table.add_column("Time", style="yellow")
    table.add_column("Extra", style="magenta")

    for action in actuator_result["executed_actions"]:
        extra = ""
        if "water_liters" in action:
            extra = f"{action['water_liters']} L"
        elif "reason" in action:
            extra = action["reason"]

        table.add_row(
            str(action.get("action", "")),
            str(action.get("status", "")),
            str(action.get("time", "")),
            extra
        )

    console.print(table)


def show_flow_step(step_title):
    console.print(f"\n[bold white on dark_green] {step_title} [/bold white on dark_green]")


def send_with_status(gateway, packet, message, wait_before=1.5, wait_after=1.0):
    with console.status(f"[bold cyan]{message}[/bold cyan]", spinner="dots"):
        time.sleep(wait_before)
    gateway.send_packet(packet)
    time.sleep(wait_after)


def main():
    show_title()
    pause(3.0)

    broker = Broker()
    gateway = Gateway(broker)

    broker.register_app("soil", "Soil App", analyze_soil)
    broker.register_app("vision", "AgriVision App", analyze_agrivision)
    broker.register_app("energy_climate", "Climate App", analyze_climate)
    broker.register_app("energy_climate", "Energy App", analyze_energy)

    soil_packet = gateway.load_json_packet("data/soil_sensor_data.json")
    energy_climate_packet = gateway.load_json_packet("data/weather_energy_data.json")
    vision_packet = gateway.build_vision_packet("data/vision_samples/sample_test.jpg")

    show_flow_step("STEP 1 - LOAD INPUT PACKETS")
    show_packet_summary(soil_packet, energy_climate_packet, vision_packet)
    pause(4.0)

    show_flow_step("STEP 2 - GATEWAY TO BROKER TO APPS")

    send_with_status(
        gateway,
        soil_packet,
        "Receiving soil sensor packet from field node..."
    )

    send_with_status(
        gateway,
        energy_climate_packet,
        "Receiving weather-energy packet from monitoring node..."
    )

    send_with_status(
        gateway,
        vision_packet,
        "Uploading drone image to AgriVision pipeline..."
    )

    show_flow_step("STEP 3 - APP RESULTS")
    results = broker.get_results()
    show_collected_results(results)
    pause(3.5)

    grouped = broker.group_results_for_mcp()

    show_flow_step("STEP 4 - RESULTS GROUPED FOR MCP")
    show_grouped_results(grouped)
    pause(3.5)

    show_flow_step("STEP 5 - MCP DECISION")
    with console.status("[bold cyan]MCP Central Brain is analyzing all app outputs...[/bold cyan]", spinner="dots"):
        time.sleep(4.0)
    mcp_result = mcp_decide(grouped)
    show_mcp_result(mcp_result)
    pause(3.5)

    show_flow_step("STEP 6 - DIGITAL TWIN SIMULATION")
    with console.status("[bold cyan]Digital Twin is simulating future execution scenario...[/bold cyan]", spinner="dots"):
        time.sleep(4.0)
    twin_result = simulate_decision(grouped, mcp_result)
    show_twin_result(twin_result)
    pause(3.5)

    show_flow_step("STEP 7 - ACTUATOR EXECUTION")
    with console.status("[bold cyan]Actuator is validating and scheduling field actions...[/bold cyan]", spinner="dots"):
        time.sleep(4.0)
    actuator_result = execute_actions(mcp_result, twin_result)
    show_actuator_result(actuator_result)
    pause(3.0)

    console.print(Panel.fit("[bold green]PROTOTYPE FLOW COMPLETED SUCCESSFULLY[/bold green]", border_style="green"))


if __name__ == "__main__":
    main()