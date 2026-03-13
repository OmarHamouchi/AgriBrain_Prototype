import { useNavigate } from "react-router";
import { ArrowLeft, Battery, Sun, Zap, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function EnergyScreen() {
  const navigate = useNavigate();

  const batteryLevel = 28;
  const solarInput = 650;
  const pumpUsage = 420;
  const powerSource = "Battery";
  const energyEfficiency = 86;

  const energyData = [
    { time: "6h", solar: 0, usage: 200, id: "e1" },
    { time: "5h", solar: 150, usage: 300, id: "e2" },
    { time: "4h", solar: 400, usage: 450, id: "e3" },
    { time: "3h", solar: 550, usage: 380, id: "e4" },
    { time: "2h", solar: 680, usage: 420, id: "e5" },
    { time: "1h", solar: 650, usage: 420, id: "e6" },
    { time: "Now", solar: 650, usage: 420, id: "e7" },
  ];

  const getBatteryColor = () => {
    if (batteryLevel > 60) return "text-emerald-600";
    if (batteryLevel > 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getBatteryBgColor = () => {
    if (batteryLevel > 60) return "bg-emerald-100";
    if (batteryLevel > 30) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white px-6 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/app")}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Energy Management</h1>
            <p className="text-white/90 text-sm mt-0.5">Solar & Battery System</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Battery Status */}
        <Card className={`p-4 border-l-4 ${batteryLevel < 30 ? "border-red-400 bg-red-50" : "border-emerald-400 bg-emerald-50"}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Battery className={`w-5 h-5 ${getBatteryColor()}`} />
              Battery Level
            </h3>
            <span className={`text-2xl font-bold ${getBatteryColor()}`}>{batteryLevel}%</span>
          </div>
          <Progress value={batteryLevel} className="h-3 mb-2" />
          {batteryLevel < 30 && (
            <p className="text-sm text-red-700 mt-2">
              ⚠️ Low battery reserve. Prioritize critical irrigation only.
            </p>
          )}
        </Card>

        {/* Real-time Energy Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Solar Input</p>
            <p className="text-lg font-bold text-slate-800">{solarInput}W</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Pump Usage</p>
            <p className="text-lg font-bold text-slate-800">{pumpUsage}W</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Battery className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Power Source</p>
            <p className="text-sm font-semibold text-slate-800">{powerSource}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1">Efficiency</p>
            <p className="text-lg font-bold text-slate-800">{energyEfficiency}%</p>
          </Card>
        </div>

        {/* Energy Chart */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Energy Flow (Last 6 Hours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="solar" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSolar)" name="Solar (W)" />
              <Area type="monotone" dataKey="usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsage)" name="Usage (W)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-slate-600">Solar Input</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-slate-600">Pump Usage</span>
            </div>
          </div>
        </Card>

        {/* Forecast */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Energy Forecast</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Next 6 Hours Solar</span>
              <span className="font-semibold text-slate-800">Peak Generation</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tomorrow Forecast</span>
              <span className="font-semibold text-yellow-600">Cloudy (30%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Estimated Autonomy</span>
              <span className="font-semibold text-slate-800">~6 hours irrigation</span>
            </div>
          </div>
        </Card>

        {/* AI Recommendation */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Energy Optimization Recommendation
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-2">
            <strong>Delay irrigation by 2 hours for better solar charging</strong>
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Current battery level is low (28%). Solar generation will peak in 2 hours. Delaying non-critical irrigation will allow battery to charge to 45%, ensuring sufficient energy reserve for evening operations. Water stress in Zone A is manageable for 2-hour delay.
          </p>
        </Card>
      </div>
    </div>
  );
}