import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ZonesScreen } from "./screens/ZonesScreen";
import { ZoneDetailsScreen } from "./screens/ZoneDetailsScreen";
import { ActionsScreen } from "./screens/ActionsScreen";
import { AlertsScreen } from "./screens/AlertsScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { EnergyScreen } from "./screens/EnergyScreen";
import { ClimateScreen } from "./screens/ClimateScreen";
import { ReservoirScreen } from "./screens/ReservoirScreen";
import { AgriVisionScreen } from "./screens/AgriVisionScreen";
import { AlertDetailScreen } from "./screens/AlertDetailScreen";
import { MainLayout } from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
      {
        path: "zones",
        element: <ZonesScreen />,
      },
      {
        path: "zones/:zoneId",
        element: <ZoneDetailsScreen />,
      },
      {
        path: "actions",
        element: <ActionsScreen />,
      },
      {
        path: "alerts",
        element: <AlertsScreen />,
      },
      {
        path: "alerts/:alertId",
        element: <AlertDetailScreen />,
      },
      {
        path: "settings",
        element: <SettingsScreen />,
      },
      {
        path: "energy",
        element: <EnergyScreen />,
      },
      {
        path: "climate",
        element: <ClimateScreen />,
      },
      {
        path: "reservoir",
        element: <ReservoirScreen />,
      },
      {
        path: "agrivision",
        element: <AgriVisionScreen />,
      },
    ],
  },
]);
