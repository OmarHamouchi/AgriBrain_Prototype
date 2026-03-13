// Mock data for the AgriBrain Farmer App

export interface Zone {
  id: string;
  name: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  irrigationStatus: "active" | "idle" | "scheduled";
  cropStatus: "healthy" | "warning" | "critical";
  cropType: string;
  growthStage: string;
  energyAvailable: boolean;
  alertCount: number;
  fertility: number;
  et0: number; // Evapotranspiration
  vpd: number; // Vapor Pressure Deficit
  diseaseStatus: string;
  stressStatus: string;
  lastIrrigation: string;
  nextAction: string;
}

export interface Alert {
  id: string;
  title: string;
  zone: string;
  category: "Disease" | "Water Stress" | "Harvest" | "Leak" | "Irrigation" | "Energy" | "Climate";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  description: string;
  recommendedAction: string;
  aiReasoning: string;
  relatedMetrics?: { label: string; value: string }[];
}

export interface Action {
  id: string;
  title: string;
  zone: string;
  time: string;
  status: "completed" | "ongoing" | "scheduled";
  source: "AI" | "Manual" | "Scheduled";
  priority: "low" | "medium" | "high";
  details: string;
}

export const zones: Zone[] = [
  {
    id: "zone-a",
    name: "Zone A - Tomatoes",
    soilMoisture: 42,
    temperature: 26,
    humidity: 65,
    irrigationStatus: "idle",
    cropStatus: "warning",
    cropType: "Tomatoes",
    growthStage: "Flowering",
    energyAvailable: true,
    alertCount: 2,
    fertility: 78,
    et0: 4.2,
    vpd: 1.8,
    diseaseStatus: "None detected",
    stressStatus: "High water stress",
    lastIrrigation: "8 hours ago",
    nextAction: "Start irrigation in 2 hours (AI)",
  },
  {
    id: "zone-b",
    name: "Zone B - Peppers",
    soilMoisture: 68,
    temperature: 24,
    humidity: 72,
    irrigationStatus: "active",
    cropStatus: "healthy",
    cropType: "Peppers",
    growthStage: "Vegetative",
    energyAvailable: true,
    alertCount: 0,
    fertility: 82,
    et0: 3.8,
    vpd: 1.2,
    diseaseStatus: "None detected",
    stressStatus: "No stress",
    lastIrrigation: "1 hour ago",
    nextAction: "Stop irrigation in 15 min (Auto)",
  },
  {
    id: "zone-c",
    name: "Zone C - Lettuce",
    soilMoisture: 55,
    temperature: 22,
    humidity: 70,
    irrigationStatus: "idle",
    cropStatus: "warning",
    cropType: "Lettuce",
    growthStage: "Mature",
    energyAvailable: true,
    alertCount: 1,
    fertility: 75,
    et0: 3.5,
    vpd: 1.4,
    diseaseStatus: "Possible leaf disease",
    stressStatus: "Slight stress",
    lastIrrigation: "4 hours ago",
    nextAction: "Monitor disease status",
  },
  {
    id: "zone-d",
    name: "Zone D - Cucumbers",
    soilMoisture: 72,
    temperature: 25,
    humidity: 68,
    irrigationStatus: "scheduled",
    cropStatus: "healthy",
    cropType: "Cucumbers",
    growthStage: "Fruiting",
    energyAvailable: true,
    alertCount: 1,
    fertility: 85,
    et0: 4.0,
    vpd: 1.5,
    diseaseStatus: "None detected",
    stressStatus: "No stress",
    lastIrrigation: "6 hours ago",
    nextAction: "Harvest window approaching",
  },
];

export const alerts: Alert[] = [
  {
    id: "alert-1",
    title: "High water stress detected",
    zone: "Zone A",
    category: "Water Stress",
    severity: "high",
    timestamp: "2 hours ago",
    status: "active",
    description: "Soil moisture has dropped below optimal levels for tomatoes in flowering stage. Current moisture is 42%, target is 60-70%.",
    recommendedAction: "Start irrigation cycle for 45 minutes. Monitor soil moisture recovery.",
    aiReasoning: "The AI detected a rapid decline in soil moisture combined with high temperature (26°C) and VPD (1.8 kPa). Given the flowering stage, water stress can significantly impact fruit set. Irrigation is recommended within the next 2 hours during optimal solar window.",
    relatedMetrics: [
      { label: "Soil Moisture", value: "42%" },
      { label: "VPD", value: "1.8 kPa" },
      { label: "Temperature", value: "26°C" },
      { label: "ET0", value: "4.2 mm/day" },
    ],
  },
  {
    id: "alert-2",
    title: "Possible leaf disease detected",
    zone: "Zone C",
    category: "Disease",
    severity: "medium",
    timestamp: "5 hours ago",
    status: "acknowledged",
    description: "Computer vision detected abnormal leaf patterns consistent with downy mildew in lettuce crop.",
    recommendedAction: "Visual inspection recommended. Consider applying organic fungicide if confirmed. Reduce irrigation frequency to lower humidity.",
    aiReasoning: "AgriVision detected yellowing patterns and lesions on 8% of visible leaves. High humidity (70%) and moderate temperatures create favorable conditions for downy mildew. Early intervention can prevent spread.",
    relatedMetrics: [
      { label: "Affected Area", value: "8% of leaves" },
      { label: "Humidity", value: "70%" },
      { label: "Confidence", value: "82%" },
    ],
  },
  {
    id: "alert-3",
    title: "Leak suspected near irrigation line",
    zone: "Zone B",
    category: "Leak",
    severity: "medium",
    timestamp: "1 day ago",
    status: "active",
    description: "Water usage in Zone B is 35% higher than expected based on irrigation schedule and ET0 calculations.",
    recommendedAction: "Inspect irrigation lines and valves in Zone B for leaks or malfunctions.",
    aiReasoning: "Water flow sensors detected sustained high flow even after irrigation cycles completed. The pattern suggests a small continuous leak rather than a one-time spike.",
    relatedMetrics: [
      { label: "Expected Usage", value: "120 L/day" },
      { label: "Actual Usage", value: "162 L/day" },
      { label: "Excess", value: "35%" },
    ],
  },
  {
    id: "alert-4",
    title: "Harvest window approaching",
    zone: "Zone D",
    category: "Harvest",
    severity: "low",
    timestamp: "3 hours ago",
    status: "active",
    description: "Cucumbers in Zone D have reached maturity. Optimal harvest window is 3-5 days.",
    recommendedAction: "Plan harvest within the next 3-5 days for optimal quality and yield.",
    aiReasoning: "Based on growth stage tracking, fruit size analysis, and days since flowering, cucumbers are at peak harvest readiness. Delaying beyond 5 days may result in overripe fruit.",
    relatedMetrics: [
      { label: "Growth Stage", value: "Fruiting" },
      { label: "Days Since Flowering", value: "58 days" },
      { label: "Harvest Readiness", value: "92%" },
    ],
  },
  {
    id: "alert-5",
    title: "Low battery reserve",
    zone: "All Zones",
    category: "Energy",
    severity: "medium",
    timestamp: "30 minutes ago",
    status: "active",
    description: "Battery level at 28%. Cloudy weather forecast for next 2 days may limit solar charging.",
    recommendedAction: "Prioritize critical irrigation only. Consider delaying non-essential pump operations.",
    aiReasoning: "Weather forecast shows overcast conditions reducing solar input to 30% of normal. Current battery level can support approximately 6 hours of irrigation. AI recommends water-stressed zones take priority.",
    relatedMetrics: [
      { label: "Battery Level", value: "28%" },
      { label: "Forecast Solar", value: "30% of normal" },
      { label: "Autonomy", value: "~6 hours irrigation" },
    ],
  },
];

export const actions: Action[] = [
  {
    id: "action-1",
    title: "Irrigation cycle completed",
    zone: "Zone B",
    time: "1 hour ago",
    status: "completed",
    source: "AI",
    priority: "medium",
    details: "45-minute irrigation cycle delivered 85L of water. Soil moisture increased from 52% to 68%.",
  },
  {
    id: "action-2",
    title: "Currently irrigating",
    zone: "Zone B",
    time: "Started 15 min ago",
    status: "ongoing",
    source: "AI",
    priority: "medium",
    details: "Scheduled to complete in 30 minutes. Target moisture: 70%.",
  },
  {
    id: "action-3",
    title: "Start irrigation",
    zone: "Zone A",
    time: "In 2 hours",
    status: "scheduled",
    source: "AI",
    priority: "high",
    details: "45-minute cycle during peak solar window to address water stress.",
  },
  {
    id: "action-4",
    title: "Disease monitoring",
    zone: "Zone C",
    time: "Ongoing",
    status: "ongoing",
    source: "AI",
    priority: "medium",
    details: "AgriVision monitoring leaf disease progression every 2 hours.",
  },
  {
    id: "action-5",
    title: "Fertilizer application",
    zone: "Zone D",
    time: "Tomorrow 7:00 AM",
    status: "scheduled",
    source: "Manual",
    priority: "low",
    details: "Manual fertilizer application scheduled by farmer.",
  },
  {
    id: "action-6",
    title: "Pump maintenance check",
    zone: "All Zones",
    time: "Yesterday 9:00 AM",
    status: "completed",
    source: "Scheduled",
    priority: "low",
    details: "Weekly scheduled maintenance completed. All systems operational.",
  },
];

export const weatherData = {
  current: {
    condition: "Partly Cloudy",
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    rainfall: 0,
  },
  forecast: [
    { time: "Now", temp: 24, condition: "Partly Cloudy", rain: 0 },
    { time: "3 PM", temp: 26, condition: "Sunny", rain: 0 },
    { time: "6 PM", temp: 23, condition: "Partly Cloudy", rain: 0 },
    { time: "9 PM", temp: 19, condition: "Clear", rain: 0 },
    { time: "Tomorrow", temp: 25, condition: "Sunny", rain: 0 },
  ],
  weekly: [
    { day: "Mon", high: 26, low: 18, condition: "Sunny", rain: 0 },
    { day: "Tue", high: 24, low: 17, condition: "Cloudy", rain: 5 },
    { day: "Wed", high: 23, low: 16, condition: "Rainy", rain: 15 },
    { day: "Thu", high: 25, low: 17, condition: "Partly Cloudy", rain: 2 },
    { day: "Fri", high: 27, low: 19, condition: "Sunny", rain: 0 },
  ],
};

export const farmMetrics = {
  averageSoilMoisture: 59,
  averageTemperature: 24,
  averageHumidity: 69,
  waterUsageToday: 342,
  energyLevel: 28,
  cropHealthScore: 82,
  reservoirLevel: 68,
};
