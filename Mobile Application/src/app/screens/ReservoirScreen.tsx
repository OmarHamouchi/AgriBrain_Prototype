import { useNavigate } from "react-router";
import { ArrowLeft, Droplets, TrendingDown, AlertTriangle, Activity } from "lucide-react";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function ReservoirScreen() {
  const navigate = useNavigate();

  const reservoirLevel = 68;
  const availableWater = 3400;
  const totalCapacity = 5000;
  const dailyUsage = 342;
  const autonomy = 9.9;
  const leakSuspicion = false;
  const waterEfficiency = 88;

  const zoneUsage = [
    { zone: "Zone A", usage: 85, color: "#ef4444", id: "z1" },
    { zone: "Zone B", usage: 120, color: "#3b82f6", id: "z2" },
    { zone: "Zone C", usage: 68, color: "#f59e0b", id: "z3" },
    { zone: "Zone D", usage: 69, color: "#10b981", id: "z4" },
  ];

  const valveStates = [
    { name: "Main Valve", status: "Open", flow: 850 },
    { name: "Zone A Valve", status: "Closed", flow: 0 },
    { name: "Zone B Valve", status: "Open", flow: 420 },
    { name: "Zone C Valve", status: "Closed", flow: 0 },
    { name: "Zone D Valve", status: "Closed", flow: 0 },
  ];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white px-6 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/app")}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Water & Reservoir</h1>
            <p className="text-white/90 text-sm mt-0.5">Tank level & water management</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Reservoir Level */}
        <Card className="p-4 border-l-4 border-cyan-400 bg-cyan-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              Reservoir Level
            </h3>
            <span className="text-2xl font-bold text-cyan-600">{reservoirLevel}%</span>
          </div>
          <Progress value={reservoirLevel} className="h-3 mb-3" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Available: {availableWater}L</span>
            <span className="text-slate-600">Capacity: {totalCapacity}L</span>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingDown className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Daily Usage</p>
            <p className="text-lg font-bold text-slate-800">{dailyUsage}L</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Droplets className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Autonomy</p>
            <p className="text-lg font-bold text-slate-800">{autonomy} days</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${leakSuspicion ? "bg-red-100" : "bg-slate-100"} p-2 rounded-lg`}>
                <AlertTriangle className={`w-4 h-4 ${leakSuspicion ? "text-red-600" : "text-slate-400"}`} />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Leak Detection</p>
            <p className={`text-sm font-semibold ${leakSuspicion ? "text-red-600" : "text-emerald-600"}`}>
              {leakSuspicion ? "Suspected" : "No Issues"}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Water Efficiency</p>
            <p className="text-lg font-bold text-slate-800">{waterEfficiency}%</p>
          </Card>
        </div>

        {/* Water Consumption by Zone */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Today's Water Consumption by Zone</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={zoneUsage}>
              <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="usage" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {zoneUsage.map((zone, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                  <span className="text-slate-700">{zone.zone}</span>
                </div>
                <span className="font-semibold text-slate-800">{zone.usage}L</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Valve & Pump States */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Valve & Pump Status</h3>
          <div className="space-y-2">
            {valveStates.map((valve, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${valve.status === "Open" ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700">{valve.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={valve.status === "Open" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                    {valve.status}
                  </Badge>
                  {valve.flow > 0 && (
                    <span className="text-sm text-slate-600">{valve.flow} L/h</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Water Management Tips */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Water Management Insight
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Reservoir level is healthy at {reservoirLevel}%. Current consumption rate provides {autonomy} days of autonomy. 
            Water efficiency is good at {waterEfficiency}%. Rain forecast for Wednesday may allow reduced irrigation.
          </p>
        </Card>
      </div>
    </div>
  );
}