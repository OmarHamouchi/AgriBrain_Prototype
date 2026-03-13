import { useNavigate } from "react-router";
import {
  Bell,
  Droplets,
  Thermometer,
  Wind,
  Zap,
  Activity,
  TrendingUp,
  MapPin,
  Battery,
  Eye,
  ChevronRight,
  Waves,
  AlertCircle,
} from "lucide-react";
import { farmMetrics, weatherData, zones, actions, alerts } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export function HomeScreen() {
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const ongoingActions = actions.filter((a) => a.status === "ongoing");
  const scheduledActions = actions.filter((a) => a.status === "scheduled").slice(0, 2);
  const activeZones = zones.filter((z) => z.irrigationStatus === "active").length;

  return (
    <div className="pb-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Good afternoon</p>
            <h1 className="text-[28px] font-bold tracking-tight">John Farmer</h1>
          </div>
          <button
            onClick={() => navigate("/app/alerts")}
            className="relative bg-white/20 backdrop-blur-md rounded-2xl p-3 hover:bg-white/30 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <Bell className="w-6 h-6" strokeWidth={2} />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {activeAlerts}
              </span>
            )}
          </button>
        </div>

        {/* Farm Health Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl shadow-black/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-0.5">Farm Health Score</p>
              <p className="text-3xl font-bold text-slate-900">{farmMetrics.cropHealthScore}%</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <Progress value={farmMetrics.cropHealthScore} className="h-2 mb-4 bg-slate-100" />
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" strokeWidth={2} />
              <span className="text-slate-700 font-medium">{zones.length} Zones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500" strokeWidth={2} />
              <span className="text-slate-700 font-medium">{activeZones} Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={2} />
              <span className="text-slate-700 font-medium">{activeAlerts} Alerts</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-4 space-y-5">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            icon={Droplets}
            label="Moisture"
            value={`${farmMetrics.averageSoilMoisture}%`}
            color="blue"
          />
          <MetricCard
            icon={Thermometer}
            label="Temp"
            value={`${farmMetrics.averageTemperature}°C`}
            color="orange"
          />
          <MetricCard
            icon={Wind}
            label="Humidity"
            value={`${farmMetrics.averageHumidity}%`}
            color="sky"
          />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <QuickCard
            icon={Zap}
            label="Energy"
            value={`${farmMetrics.energyLevel}%`}
            subtitle="Battery level"
            alert={farmMetrics.energyLevel < 30}
            onClick={() => navigate("/app/energy")}
          />
          <QuickCard
            icon={Waves}
            label="Reservoir"
            value={`${farmMetrics.reservoirLevel}%`}
            subtitle="Water level"
            onClick={() => navigate("/app/reservoir")}
          />
        </div>

        {/* Weather Widget */}
        <Card className="p-5 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Weather</p>
              <p className="text-2xl font-bold text-slate-900">{weatherData.current.temperature}°C</p>
              <p className="text-slate-600 text-sm mt-0.5">{weatherData.current.condition}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-white/60 rounded-xl">
              <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" strokeWidth={2} />
              <p className="text-xs text-slate-600">Humidity</p>
              <p className="text-sm font-bold text-slate-900">{weatherData.current.humidity}%</p>
            </div>
            <div className="text-center p-2 bg-white/60 rounded-xl">
              <Wind className="w-4 h-4 text-slate-600 mx-auto mb-1" strokeWidth={2} />
              <p className="text-xs text-slate-600">Wind</p>
              <p className="text-sm font-bold text-slate-900">{weatherData.current.windSpeed} km/h</p>
            </div>
            <div className="text-center p-2 bg-white/60 rounded-xl">
              <svg className="w-4 h-4 text-sky-600 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
                <path d="M16 14v6m-4-3v3m-4-1v1" />
              </svg>
              <p className="text-xs text-slate-600">Rain</p>
              <p className="text-sm font-bold text-slate-900">{weatherData.current.rainfall} mm</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/app/climate")}
            className="w-full mt-3 text-sm font-medium text-sky-700 hover:text-sky-800 transition-colors flex items-center justify-center gap-1"
          >
            View forecast
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </Card>

        {/* Ongoing Actions */}
        {ongoingActions.length > 0 && (
          <Card className="p-5 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Active Operations
              </h3>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 font-semibold">
                {ongoingActions.length}
              </Badge>
            </div>
            <div className="space-y-2.5">
              {ongoingActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm mb-0.5">{action.title}</p>
                    <p className="text-xs text-slate-600">{action.zone} • {action.time}</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs shrink-0">
                    {action.source}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI Recommendations */}
        <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900">AI Insights</h3>
          </div>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-sm text-slate-700 font-medium">Start irrigation in Zone A in 2 hours during peak solar</p>
              </div>
              <p className="text-xs text-slate-500 ml-3.5">High priority • Zone A</p>
            </div>
            <div className="p-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <p className="text-sm text-slate-700 font-medium">Monitor disease progression in Zone C</p>
              </div>
              <p className="text-xs text-slate-500 ml-3.5">Medium priority • Zone C</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={Eye}
            label="AgriVision"
            onClick={() => navigate("/app/agrivision")}
          />
          <ActionButton
            icon={MapPin}
            label="View Zones"
            onClick={() => navigate("/app/zones")}
          />
        </div>
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
    blue: { bg: "bg-blue-50", icon: "text-blue-600", value: "text-blue-700" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", value: "text-orange-700" },
    sky: { bg: "bg-sky-50", icon: "text-sky-600", value: "text-sky-700" },
  };

  const colors = colorMap[color as keyof typeof colorMap];

  return (
    <Card className={`p-4 ${colors.bg} border-0 shadow-sm`}>
      <Icon className={`w-5 h-5 ${colors.icon} mb-3`} strokeWidth={2} />
      <p className="text-xs text-slate-600 mb-1 font-medium">{label}</p>
      <p className={`text-xl font-bold ${colors.value}`}>{value}</p>
    </Card>
  );
}

function QuickCard({
  icon: Icon,
  label,
  value,
  subtitle,
  alert,
  onClick,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  alert?: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-lg transition-all active:scale-98 ${
        alert ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200" : "bg-white shadow-sm"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 ${alert ? "text-red-600" : "text-slate-600"}`} strokeWidth={2} />
        {alert && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </div>
      <p className={`text-2xl font-bold ${alert ? "text-red-700" : "text-slate-900"} mb-1`}>{value}</p>
      <p className="text-xs text-slate-600 font-medium">{subtitle}</p>
    </Card>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all active:scale-98 shadow-sm flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-700" strokeWidth={2} />
      </div>
      <span className="font-semibold text-slate-900 text-sm">{label}</span>
    </button>
  );
}
