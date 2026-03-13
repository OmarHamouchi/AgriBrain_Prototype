import { useNavigate } from "react-router";
import { ArrowLeft, Eye, AlertCircle, Droplets, TrendingUp, Camera } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export function AgriVisionScreen() {
  const navigate = useNavigate();

  const visionData = {
    diseaseDetection: {
      zonesMonitored: 4,
      issuesDetected: 1,
      confidence: 82,
      affectedZone: "Zone C",
      diseaseType: "Downy Mildew (suspected)",
      affectedArea: "8% of leaves",
    },
    waterStress: {
      highStress: ["Zone A"],
      moderateStress: ["Zone C"],
      noStress: ["Zone B", "Zone D"],
    },
    plantCount: {
      zoneA: 156,
      zoneB: 142,
      zoneC: 188,
      zoneD: 134,
    },
    growthMetrics: {
      averageGrowthRate: 92,
      harvestReadiness: {
        zoneA: 45,
        zoneB: 32,
        zoneC: 78,
        zoneD: 92,
      },
    },
    lastScan: "15 minutes ago",
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white px-6 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/app")}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">AgriVision AI</h1>
            <p className="text-white/90 text-sm mt-0.5">Computer vision crop monitoring</p>
          </div>
          <Eye className="w-8 h-8" />
        </div>
        <p className="text-sm text-white/80">Last scan: {visionData.lastScan}</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Disease Detection */}
        <Card className={`p-4 border-l-4 ${visionData.diseaseDetection.issuesDetected > 0 ? "border-yellow-400 bg-yellow-50" : "border-emerald-400 bg-emerald-50"}`}>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${visionData.diseaseDetection.issuesDetected > 0 ? "text-yellow-600" : "text-emerald-600"}`} />
            Plant Disease Detection
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Zones Monitored</span>
              <span className="font-semibold text-slate-800">{visionData.diseaseDetection.zonesMonitored}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Issues Detected</span>
              <Badge variant="outline" className={visionData.diseaseDetection.issuesDetected > 0 ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}>
                {visionData.diseaseDetection.issuesDetected}
              </Badge>
            </div>
            {visionData.diseaseDetection.issuesDetected > 0 && (
              <>
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Detected Issue:</p>
                  <p className="text-sm text-slate-700">{visionData.diseaseDetection.diseaseType}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Location: {visionData.diseaseDetection.affectedZone} ({visionData.diseaseDetection.affectedArea})
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>AI Confidence</span>
                      <span>{visionData.diseaseDetection.confidence}%</span>
                    </div>
                    <Progress value={visionData.diseaseDetection.confidence} className="h-2" />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Water Stress Detection */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Stress Detection
          </h3>
          <div className="space-y-2">
            {visionData.waterStress.highStress.length > 0 && (
              <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-700 mb-1">High Stress</p>
                <p className="text-sm text-red-600">{visionData.waterStress.highStress.join(", ")}</p>
              </div>
            )}
            {visionData.waterStress.moderateStress.length > 0 && (
              <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-700 mb-1">Moderate Stress</p>
                <p className="text-sm text-yellow-600">{visionData.waterStress.moderateStress.join(", ")}</p>
              </div>
            )}
            {visionData.waterStress.noStress.length > 0 && (
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-700 mb-1">No Stress</p>
                <p className="text-sm text-emerald-600">{visionData.waterStress.noStress.join(", ")}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Plant Count */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Plant Count Analysis
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Zone A</p>
              <p className="text-lg font-bold text-slate-800">{visionData.plantCount.zoneA}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Zone B</p>
              <p className="text-lg font-bold text-slate-800">{visionData.plantCount.zoneB}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Zone C</p>
              <p className="text-lg font-bold text-slate-800">{visionData.plantCount.zoneC}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Zone D</p>
              <p className="text-lg font-bold text-slate-800">{visionData.plantCount.zoneD}</p>
            </div>
          </div>
        </Card>

        {/* Growth Stage & Harvest Readiness */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Harvest Readiness Score</h3>
          <div className="space-y-3">
            {Object.entries(visionData.growthMetrics.harvestReadiness).map(([zone, score]) => (
              <div key={zone}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 capitalize">{zone.replace("zone", "Zone ")}</span>
                  <span className="font-semibold text-slate-800">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Image Previews */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5 text-slate-600" />
            Recent Captures
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            Captured today at various growth stages
          </p>
        </Card>

        {/* AI Insights */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            AgriVision Insights
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-2">
            <strong>Recommended Actions:</strong>
          </p>
          <ul className="space-y-1 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Inspect Zone C for downy mildew confirmation (82% confidence)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">•</span>
              <span>Prioritize irrigation for Zone A due to visual water stress indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>Zone D approaching optimal harvest window (92% readiness)</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
