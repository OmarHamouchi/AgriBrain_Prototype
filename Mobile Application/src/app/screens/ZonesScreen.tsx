import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Droplets, Thermometer, AlertCircle, Zap, ChevronRight } from "lucide-react";
import { zones } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function ZonesScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHealthConfig = (status: string) => {
    if (status === "healthy") {
      return {
        badge: "Healthy",
        badgeClass: "bg-emerald-50 text-emerald-700 border-0 font-semibold",
        borderClass: "border-l-emerald-500",
        bgClass: "bg-gradient-to-br from-emerald-50/50 to-teal-50/30",
      };
    }
    if (status === "warning") {
      return {
        badge: "Attention",
        badgeClass: "bg-amber-50 text-amber-700 border-0 font-semibold",
        borderClass: "border-l-amber-500",
        bgClass: "bg-gradient-to-br from-amber-50/50 to-orange-50/30",
      };
    }
    return {
      badge: "Critical",
      badgeClass: "bg-red-50 text-red-700 border-0 font-semibold",
      borderClass: "border-l-red-500",
      bgClass: "bg-gradient-to-br from-red-50/50 to-pink-50/30",
    };
  };

  const getIrrigationStatus = (status: string) => {
    if (status === "active") {
      return { text: "Irrigating", color: "text-emerald-600", dot: "bg-emerald-500 animate-pulse" };
    }
    if (status === "scheduled") {
      return { text: "Scheduled", color: "text-blue-600", dot: "bg-blue-500" };
    }
    return { text: "Idle", color: "text-slate-500", dot: "bg-slate-300" };
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-8">
        <h1 className="text-[28px] font-bold tracking-tight mb-6">Farm Zones</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
          <Input
            type="text"
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/95 backdrop-blur-sm border-0 shadow-lg placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Zone Cards */}
      <div className="px-4 mt-5 space-y-3">
        {filteredZones.map((zone) => {
          const health = getHealthConfig(zone.cropStatus);
          const irrigation = getIrrigationStatus(zone.irrigationStatus);

          return (
            <Card
              key={zone.id}
              className={`p-5 cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] border-l-4 ${health.borderClass} ${health.bgClass} shadow-sm`}
              onClick={() => navigate(`/app/zones/${zone.id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-[17px] mb-1">{zone.name}</h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {zone.cropType} • {zone.growthStage}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {zone.alertCount > 0 && (
                    <div className="bg-red-100 text-red-700 rounded-xl px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {zone.alertCount}
                    </div>
                  )}
                  <Badge className={health.badgeClass}>{health.badge}</Badge>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-blue-600" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600 font-medium mb-0.5">Soil Moisture</p>
                    <p className="text-lg font-bold text-slate-900">{zone.soilMoisture}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <Thermometer className="w-5 h-5 text-orange-600" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600 font-medium mb-0.5">Temperature</p>
                    <p className="text-lg font-bold text-slate-900">{zone.temperature}°C</p>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/60">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${irrigation.dot}`} />
                  <span className={`text-sm font-semibold ${irrigation.color}`}>
                    {irrigation.text}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {zone.energyAvailable ? (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Zap className="w-4 h-4" strokeWidth={2} fill="currentColor" />
                      <span className="text-xs font-semibold">Power OK</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600">
                      <Zap className="w-4 h-4" strokeWidth={2} />
                      <span className="text-xs font-semibold">Low Power</span>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={2} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredZones.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" strokeWidth={2} />
          </div>
          <p className="text-slate-500 font-medium">No zones found</p>
          <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
