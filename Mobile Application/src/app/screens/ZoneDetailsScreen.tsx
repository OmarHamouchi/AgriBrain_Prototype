import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Droplets, Thermometer, Cloud, TrendingUp, AlertCircle, Play, Square, Zap, Info } from "lucide-react";
import { zones } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export function ZoneDetailsScreen() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const zone = zones.find((z) => z.id === zoneId);
  const [isAutoMode, setIsAutoMode] = useState(true);

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Zone not found</p>
      </div>
    );
  }

  const moistureData = [
    { time: "6h", value: 55, id: "m1" },
    { time: "5h", value: 52, id: "m2" },
    { time: "4h", value: 48, id: "m3" },
    { time: "3h", value: 46, id: "m4" },
    { time: "2h", value: 44, id: "m5" },
    { time: "1h", value: 42, id: "m6" },
    { time: "Now", value: zone.soilMoisture, id: "m7" },
  ];

  const tempData = [
    { time: "6h", value: 22, id: "t1" },
    { time: "5h", value: 23, id: "t2" },
    { time: "4h", value: 24, id: "t3" },
    { time: "3h", value: 25, id: "t4" },
    { time: "2h", value: 26, id: "t5" },
    { time: "1h", value: 26, id: "t6" },
    { time: "Now", value: zone.temperature, id: "t7" },
  ];

  const handleStartIrrigation = () => {
    toast.success("Irrigation started manually", {
      description: `${zone.name} - 45 minute cycle`,
    });
  };

  const handleStopIrrigation = () => {
    toast.success("Irrigation stopped", {
      description: zone.name,
    });
  };

  const toggleMode = () => {
    const newMode = !isAutoMode;
    setIsAutoMode(newMode);
    toast.info(`Switched to ${newMode ? "Auto" : "Manual"} Mode`, {
      description: newMode ? "AI will manage irrigation automatically" : "Manual control enabled",
    });
  };

  return (
    <div className="pb-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/app/zones")}
            className="p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-[24px] font-bold tracking-tight">{zone.name}</h1>
            <p className="text-emerald-100 text-sm mt-0.5 font-medium">
              {zone.cropType} • {zone.growthStage}
            </p>
          </div>
          {zone.alertCount > 0 && (
            <div className="bg-red-500 text-white rounded-xl px-3 py-1.5 text-sm font-bold flex items-center gap-1.5 shadow-lg">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {zone.alertCount}
            </div>
          )}
        </div>

        {/* Mode Toggle */}
        <button
          onClick={toggleMode}
          className={`w-full p-4 rounded-2xl font-semibold text-[15px] transition-all shadow-lg ${
            isAutoMode
              ? "bg-white text-emerald-600 hover:bg-emerald-50"
              : "bg-white/20 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/30"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" strokeWidth={2.5} fill={isAutoMode ? "currentColor" : "none"} />
            {isAutoMode ? "Auto Mode Active (AI)" : "Manual Mode Active"}
          </div>
        </button>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Droplets}
            label="Soil Moisture"
            value={`${zone.soilMoisture}%`}
            color="blue"
          />
          <MetricCard
            icon={Thermometer}
            label="Temperature"
            value={`${zone.temperature}°C`}
            color="orange"
          />
          <MetricCard
            icon={Cloud}
            label="Humidity"
            value={`${zone.humidity}%`}
            color="sky"
          />
          <MetricCard
            icon={TrendingUp}
            label="Fertility"
            value={`${zone.fertility}%`}
            color="emerald"
          />
        </div>

        {/* Advanced Metrics */}
        <Card className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/30">
              <Info className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-900">Advanced Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">ET0 (Evapotranspiration)</p>
                <p className="text-xs text-slate-600 mt-0.5">Water loss rate</p>
              </div>
              <span className="text-lg font-bold text-slate-900">{zone.et0} mm/day</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">VPD (Vapor Pressure Deficit)</p>
                <p className="text-xs text-slate-600 mt-0.5">Air moisture demand</p>
              </div>
              <span className="text-lg font-bold text-slate-900">{zone.vpd} kPa</span>
            </div>
          </div>
        </Card>

        {/* Crop Health Status */}
        <Card className="p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Crop Health Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Disease Status</span>
              <Badge className={zone.diseaseStatus.includes("None") ? "bg-emerald-50 text-emerald-700 border-0 font-semibold" : "bg-red-50 text-red-700 border-0 font-semibold"}>
                {zone.diseaseStatus}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Stress Level</span>
              <Badge className={zone.stressStatus.includes("No") ? "bg-emerald-50 text-emerald-700 border-0 font-semibold" : "bg-amber-50 text-amber-700 border-0 font-semibold"}>
                {zone.stressStatus}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Irrigation Status */}
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50/30 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Irrigation Status</h3>
            <Badge className={
              zone.irrigationStatus === "active" ? "bg-emerald-100 text-emerald-700 border-0 font-semibold" :
              zone.irrigationStatus === "scheduled" ? "bg-blue-100 text-blue-700 border-0 font-semibold" :
              "bg-slate-100 text-slate-700 border-0 font-semibold"
            }>
              {zone.irrigationStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
              <span className="text-sm text-slate-600 font-medium">Last Irrigation</span>
              <span className="font-semibold text-slate-900">{zone.lastIrrigation}</span>
            </div>
            <div className="p-3 bg-white/60 rounded-xl">
              <p className="text-xs text-slate-600 font-medium mb-1">Next Action</p>
              <p className="text-sm font-semibold text-slate-900">{zone.nextAction}</p>
            </div>
          </div>
        </Card>

        {/* Trend Chart */}
        <Card className="p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Soil Moisture Trend (6h)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Manual Controls */}
        <Card className="p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Manual Controls</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleStartIrrigation}
              disabled={isAutoMode || zone.irrigationStatus === "active"}
              className="h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 font-semibold disabled:opacity-50 disabled:shadow-none"
            >
              <Play className="w-4 h-4 mr-2" strokeWidth={2.5} fill="currentColor" />
              Start
            </Button>
            <Button
              onClick={handleStopIrrigation}
              disabled={isAutoMode || zone.irrigationStatus !== "active"}
              variant="outline"
              className="h-12 border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold disabled:opacity-50"
            >
              <Square className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Stop
            </Button>
          </div>
          {isAutoMode && (
            <p className="text-xs text-slate-500 mt-3 text-center font-medium">
              Switch to Manual Mode to enable controls
            </p>
          )}
        </Card>

        {/* AI Explanation */}
        <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900">AI Analysis</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {zone.nextAction.includes("Start irrigation") 
              ? `Soil moisture at ${zone.soilMoisture}% is below optimal range for ${zone.cropType} during ${zone.growthStage} stage. AI recommends irrigation in 2 hours during peak solar to ensure energy-efficient operation.`
              : zone.nextAction.includes("Monitor")
              ? `AgriVision detected possible disease indicators. AI is monitoring progression and will recommend intervention if spread accelerates. Reducing humidity through adjusted irrigation is suggested.`
              : `Zone operating within optimal parameters. AI continues monitoring and will schedule irrigation based on ET0 calculations and weather forecasts.`
            }
          </p>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap = {
    blue: { bg: "from-blue-500 to-blue-600", iconBg: "bg-blue-50", text: "text-blue-700" },
    orange: { bg: "from-orange-500 to-orange-600", iconBg: "bg-orange-50", text: "text-orange-700" },
    sky: { bg: "from-sky-500 to-sky-600", iconBg: "bg-sky-50", text: "text-sky-700" },
    emerald: { bg: "from-emerald-500 to-emerald-600", iconBg: "bg-emerald-50", text: "text-emerald-700" },
  };

  const colors = colorMap[color as keyof typeof colorMap];

  return (
    <Card className="p-4 bg-white shadow-sm border-slate-200">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg shadow-${color}-500/30 mb-3`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <p className="text-xs text-slate-600 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}