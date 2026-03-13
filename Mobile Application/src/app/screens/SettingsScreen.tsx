import { useNavigate } from "react-router";
import { User, MapPin, Globe, Gauge, Bell, MessageSquare, Moon, LogOut, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function SettingsScreen() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [chatbotAudio, setChatbotAudio] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="pb-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-zinc-600 text-white px-6 pt-8 pb-8">
        <h1 className="text-[28px] font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-slate-200 text-sm font-medium">Manage your farm preferences</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Profile Card */}
        <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <User className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg">John Farmer</p>
                <p className="text-sm text-slate-600 font-medium">farmer@example.com</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={2} />
            </div>
          </div>
        </Card>

        {/* Farm Information */}
        <Card className="p-5 shadow-sm border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Farm Information</h3>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all active:scale-98">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">Green Valley Farm</p>
                <p className="text-xs text-slate-600 font-medium">4 zones, 5.2 hectares</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={2} />
          </button>
        </Card>

        {/* Preferences */}
        <Card className="p-5 shadow-sm border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Preferences</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all active:scale-98">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Language</p>
                  <p className="text-xs text-slate-600 font-medium">English</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={2} />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all active:scale-98">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-purple-600" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Units</p>
                  <p className="text-xs text-slate-600 font-medium">Metric (°C, L, mm)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={2} />
            </button>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-5 shadow-sm border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">System Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Push Notifications</p>
                  <p className="text-xs text-slate-600 font-medium">Receive alerts and updates</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Auto Mode (AI)</p>
                  <p className="text-xs text-slate-600 font-medium">AI manages irrigation automatically</p>
                </div>
              </div>
              <Switch
                checked={autoMode}
                onCheckedChange={setAutoMode}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-violet-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI Audio Responses</p>
                  <p className="text-xs text-slate-600 font-medium">Voice output from assistant</p>
                </div>
              </div>
              <Switch
                checked={chatbotAudio}
                onCheckedChange={setChatbotAudio}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 bg-slate-700 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
                  <p className="text-xs text-slate-600 font-medium">Better for night viewing</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-slate-700"
              />
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-5 shadow-sm border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600 font-medium">App Version</span>
              <span className="font-semibold text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600 font-medium">Last Sync</span>
              <span className="font-semibold text-emerald-600">Just now</span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold transition-all shadow-sm"
        >
          <LogOut className="w-5 h-5 mr-2" strokeWidth={2} />
          Log Out
        </Button>

        <p className="text-center text-xs text-slate-500 py-4 font-medium">
          AgriBrain Farmer App © 2026
        </p>
      </div>
    </div>
  );
}
