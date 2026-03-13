import { useParams, useNavigate } from "react-router";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { alerts } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export function AlertDetailScreen() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const alert = alerts.find((a) => a.id === alertId);

  if (!alert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Alert not found</p>
      </div>
    );
  }

  const getSeverityConfig = (severity: string) => {
    if (severity === "critical") {
      return { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
    }
    if (severity === "high") {
      return { color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
    }
    if (severity === "medium") {
      return { color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    }
    return { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
  };

  const config = getSeverityConfig(alert.severity);

  const handleAcknowledge = () => {
    toast.success("Alert acknowledged");
    navigate("/app/alerts");
  };

  const handleResolve = () => {
    toast.success("Alert marked as resolved");
    navigate("/app/alerts");
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className={`${config.bgColor} px-6 pt-6 pb-6 rounded-b-3xl border-b-4 ${config.borderColor}`}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/app/alerts")}
            className={`p-2 ${config.bgColor} rounded-full transition-colors`}
          >
            <ArrowLeft className={`w-5 h-5 ${config.color}`} />
          </button>
          <div className="flex-1">
            <Badge variant="outline" className={`${config.color} border-current mb-2`}>
              {alert.severity.toUpperCase()} PRIORITY
            </Badge>
            <h1 className={`text-2xl font-bold ${config.color}`}>{alert.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="bg-white">
            {alert.category}
          </Badge>
          <span className={config.color}>•</span>
          <span className={config.color}>{alert.zone}</span>
          <span className={config.color}>•</span>
          <span className={config.color}>{alert.timestamp}</span>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Description */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-slate-700 leading-relaxed">{alert.description}</p>
        </Card>

        {/* Recommended Action */}
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Recommended Farmer Action
          </h3>
          <p className="text-emerald-900 leading-relaxed">{alert.recommendedAction}</p>
        </Card>

        {/* AI Reasoning */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            AI Analysis & Reasoning
          </h3>
          <p className="text-slate-700 leading-relaxed">{alert.aiReasoning}</p>
        </Card>

        {/* Related Metrics */}
        {alert.relatedMetrics && alert.relatedMetrics.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Related Metrics</h3>
            <div className="space-y-2">
              {alert.relatedMetrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-sm text-slate-600">{metric.label}</span>
                  <span className="font-semibold text-slate-800">{metric.value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {alert.status === "active" && (
            <>
              <Button
                onClick={handleAcknowledge}
                variant="outline"
                className="flex-1"
              >
                Acknowledge
              </Button>
              <Button
                onClick={handleResolve}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                Mark as Resolved
              </Button>
            </>
          )}
          {alert.status === "acknowledged" && (
            <Button
              onClick={handleResolve}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Mark as Resolved
            </Button>
          )}
          {alert.status === "resolved" && (
            <div className="w-full text-center py-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 inline mr-2" />
              This alert has been resolved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
