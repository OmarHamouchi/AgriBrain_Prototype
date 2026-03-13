import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ChevronRight } from "lucide-react";
import { alerts } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function AlertsScreen() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredAlerts = alerts.filter((alert) => {
    const categoryMatch = filterCategory === "all" || alert.category === filterCategory;
    const severityMatch = filterSeverity === "all" || alert.severity === filterSeverity;
    return categoryMatch && severityMatch;
  });

  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const categories = ["Disease", "Water Stress", "Harvest", "Leak", "Irrigation", "Energy", "Climate"];

  return (
    <div className="pb-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 text-white px-6 pt-8 pb-8">
        <h1 className="text-[28px] font-bold tracking-tight mb-2">Alert Center</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="text-white/90 text-sm font-medium">{activeAlerts} Active Alerts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mt-5 mb-4 flex gap-3">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="flex-1 h-11 bg-white border-slate-200 shadow-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="flex-1 h-11 bg-white border-slate-200 shadow-sm">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <div className="px-4 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-400" strokeWidth={2} />
            </div>
            <p className="text-slate-500 font-medium">No alerts found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onClick={() => navigate(`/app/alerts/${alert.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert, onClick }: { alert: any; onClick: () => void }) {
  const getSeverityConfig = (severity: string) => {
    if (severity === "critical") {
      return {
        borderClass: "border-l-red-500",
        bgClass: "bg-gradient-to-br from-red-50/80 to-pink-50/50",
        badge: "bg-red-100 text-red-700 border-0 font-bold",
        dot: "bg-red-500 animate-pulse shadow-lg shadow-red-500/50",
        icon: "🚨",
      };
    }
    if (severity === "high") {
      return {
        borderClass: "border-l-orange-500",
        bgClass: "bg-gradient-to-br from-orange-50/80 to-amber-50/50",
        badge: "bg-orange-100 text-orange-700 border-0 font-bold",
        dot: "bg-orange-500 shadow-lg shadow-orange-500/50",
        icon: "⚠️",
      };
    }
    if (severity === "medium") {
      return {
        borderClass: "border-l-amber-500",
        bgClass: "bg-gradient-to-br from-amber-50/80 to-yellow-50/50",
        badge: "bg-amber-100 text-amber-700 border-0 font-bold",
        dot: "bg-amber-500",
        icon: "⚡",
      };
    }
    return {
      borderClass: "border-l-blue-500",
      bgClass: "bg-gradient-to-br from-blue-50/80 to-sky-50/50",
      badge: "bg-blue-100 text-blue-700 border-0 font-bold",
      dot: "bg-blue-500",
      icon: "ℹ️",
    };
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Disease: "🦠",
      "Water Stress": "💧",
      Harvest: "🌾",
      Leak: "🚰",
      Irrigation: "💦",
      Energy: "⚡",
      Climate: "🌤️",
    };
    return icons[category] || "⚠️";
  };

  const config = getSeverityConfig(alert.severity);

  return (
    <Card
      className={`p-5 border-l-4 ${config.borderClass} ${config.bgClass} cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] shadow-sm`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3.5">
        <div className="text-2xl shrink-0 mt-0.5">{getCategoryIcon(alert.category)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug">{alert.title}</h3>
            <div className={`w-2.5 h-2.5 rounded-full ${config.dot} shrink-0 mt-1`} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 font-medium">
            <span>{alert.zone}</span>
            <span className="text-slate-400">•</span>
            <span>{alert.timestamp}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">
            {alert.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge className={config.badge}>{alert.severity.toUpperCase()}</Badge>
            <Badge className="bg-violet-50 text-violet-700 border-0 font-semibold">
              {alert.category}
            </Badge>
            {alert.status === "active" && (
              <Badge className="bg-emerald-50 text-emerald-700 border-0 font-semibold">
                Active
              </Badge>
            )}
            {alert.status === "acknowledged" && (
              <Badge className="bg-slate-100 text-slate-700 border-0 font-semibold">
                Acknowledged
              </Badge>
            )}
          </div>
          {alert.recommendedAction && (
            <div className="pt-3 border-t border-white/60">
              <div className="flex items-start gap-2">
                <p className="text-xs text-slate-600 flex-1">
                  <span className="font-bold text-slate-700">Recommended: </span>
                  {alert.recommendedAction}
                </p>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={2} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
