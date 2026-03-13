import { CheckCircle2, Clock, Play } from "lucide-react";
import { actions } from "../data/mockData";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function ActionsScreen() {
  const completedActions = actions.filter((a) => a.status === "completed");
  const ongoingActions = actions.filter((a) => a.status === "ongoing");
  const scheduledActions = actions.filter((a) => a.status === "scheduled");

  return (
    <div className="pb-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-white px-6 pt-8 pb-8">
        <h1 className="text-[28px] font-bold tracking-tight mb-3">Actions & Planning</h1>
        <div className="flex items-center gap-5 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>{ongoingActions.length} Ongoing</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" strokeWidth={2} />
            <span>{scheduledActions.length} Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            <span>{completedActions.length} Done</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-5">
        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-5 h-11 bg-white border border-slate-200 p-1 shadow-sm">
            <TabsTrigger value="ongoing" className="font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="space-y-3 mt-0">
            {ongoingActions.length === 0 ? (
              <EmptyState message="No ongoing actions" icon={Play} />
            ) : (
              ongoingActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-3 mt-0">
            {scheduledActions.length === 0 ? (
              <EmptyState message="No scheduled actions" icon={Clock} />
            ) : (
              scheduledActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-0">
            {completedActions.length === 0 ? (
              <EmptyState message="No completed actions" icon={CheckCircle2} />
            ) : (
              completedActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: any }) {
  const getStatusConfig = (status: string) => {
    if (status === "completed") {
      return {
        icon: CheckCircle2,
        bgClass: "bg-gradient-to-br from-emerald-50/80 to-teal-50/50",
        borderClass: "border-l-emerald-500",
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
      };
    }
    if (status === "ongoing") {
      return {
        icon: Play,
        bgClass: "bg-gradient-to-br from-blue-50/80 to-sky-50/50",
        borderClass: "border-l-blue-500",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
      };
    }
    return {
      icon: Clock,
      bgClass: "bg-gradient-to-br from-purple-50/80 to-violet-50/50",
      borderClass: "border-l-purple-500",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    };
  };

  const config = getStatusConfig(action.status);
  const Icon = config.icon;

  const getSourceBadge = (source: string) => {
    if (source === "AI") {
      return "bg-violet-100 text-violet-700 border-0 font-bold";
    }
    if (source === "Manual") {
      return "bg-slate-100 text-slate-700 border-0 font-semibold";
    }
    return "bg-blue-100 text-blue-700 border-0 font-semibold";
  };

  const getPriorityDot = (priority: string) => {
    if (priority === "high") return "bg-red-500";
    if (priority === "medium") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card className={`p-5 border-l-4 ${config.borderClass} ${config.bgClass} shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`${config.iconBg} p-3 rounded-2xl shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug">{action.title}</h3>
            <div className={`w-2.5 h-2.5 rounded-full ${getPriorityDot(action.priority)} shrink-0 mt-1`} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 font-medium">
            <span>{action.zone}</span>
            <span className="text-slate-400">•</span>
            <span>{action.time}</span>
          </div>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{action.details}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getSourceBadge(action.source)}>{action.source}</Badge>
            <Badge className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-semibold capitalize">
              {action.priority} priority
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ message, icon: Icon }: { message: string; icon: any }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" strokeWidth={2} />
      </div>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}
