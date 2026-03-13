import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, MapPin, ListTodo, Bell, Settings } from "lucide-react";
import { useState } from "react";
import { ChatbotDialog } from "./ChatbotDialog";
import { alerts } from "../data/mockData";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  const navItems = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/zones", icon: MapPin, label: "Zones" },
    { path: "/app/actions", icon: ListTodo, label: "Actions" },
    { path: "/app/alerts", icon: Bell, label: "Alerts", badge: activeAlerts },
    { path: "/app/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto relative">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-28 right-6 z-40 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI Assistant"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {/* Bottom Navigation - Premium Design */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-slate-200/60 z-50 px-2">
        <div className="flex justify-around items-center h-20 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 ${
                  active ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
                )}
                
                <div className="relative">
                  <div className={`p-2 rounded-xl transition-all ${active ? "bg-emerald-50" : ""}`}>
                    <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] mt-1 font-medium ${active ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chatbot Dialog */}
      <ChatbotDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
