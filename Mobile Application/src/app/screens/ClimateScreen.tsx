import { useNavigate } from "react-router";
import { ArrowLeft, Cloud, Thermometer, Droplets, Wind, CloudRain, Sun } from "lucide-react";
import { Card } from "../components/ui/card";
import { weatherData } from "../data/mockData";

export function ClimateScreen() {
  const navigate = useNavigate();

  const et0 = 4.1;
  const vpd = 1.6;
  const irrigationSuitability = "Good";

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Sunny")) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (condition.includes("Rainy")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (condition.includes("Cloudy")) return <Cloud className="w-8 h-8 text-slate-500" />;
    return <Cloud className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-500 text-white px-6 pt-6 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/app")}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Climate & Weather</h1>
            <p className="text-white/90 text-sm mt-0.5">Real-time conditions & forecast</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Current Weather */}
        <Card className="p-5 bg-gradient-to-br from-sky-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Conditions</p>
              <p className="text-4xl font-bold text-slate-800">{weatherData.current.temperature}°C</p>
              <p className="text-slate-700 mt-1">{weatherData.current.condition}</p>
            </div>
            <div>{getWeatherIcon(weatherData.current.condition)}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
            <div className="text-center">
              <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">Humidity</p>
              <p className="text-sm font-semibold text-slate-800">{weatherData.current.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 text-slate-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">Wind</p>
              <p className="text-sm font-semibold text-slate-800">{weatherData.current.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <CloudRain className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-slate-600">Rain</p>
              <p className="text-sm font-semibold text-slate-800">{weatherData.current.rainfall} mm</p>
            </div>
          </div>
        </Card>

        {/* Advanced Climate Metrics */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Advanced Climate Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-800">ET0 (Evapotranspiration)</p>
                <p className="text-xs text-slate-500">Reference evapotranspiration rate</p>
              </div>
              <span className="font-bold text-slate-800">{et0} mm/day</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-800">VPD (Vapor Pressure Deficit)</p>
                <p className="text-xs text-slate-500">Air moisture demand</p>
              </div>
              <span className="font-bold text-slate-800">{vpd} kPa</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-800">Irrigation Suitability</p>
                <p className="text-xs text-slate-500">Based on current conditions</p>
              </div>
              <span className="font-bold text-emerald-600">{irrigationSuitability}</span>
            </div>
          </div>
        </Card>

        {/* Hourly Forecast */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Hourly Forecast</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weatherData.forecast.map((hour, idx) => (
              <div key={idx} className="flex-shrink-0 bg-slate-50 rounded-lg p-3 text-center min-w-[80px]">
                <p className="text-xs text-slate-600 mb-2">{hour.time}</p>
                <div className="mb-2">{getWeatherIcon(hour.condition)}</div>
                <p className="text-sm font-semibold text-slate-800">{hour.temp}°C</p>
                <p className="text-xs text-slate-600 mt-1">{hour.rain}mm</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Forecast */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">5-Day Forecast</h3>
          <div className="space-y-2">
            {weatherData.weekly.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-semibold text-slate-800 w-10">{day.day}</span>
                  {getWeatherIcon(day.condition)}
                  <span className="text-sm text-slate-600">{day.condition}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-800 font-semibold">{day.high}°</span>
                  <span className="text-slate-500">{day.low}°</span>
                  <span className="text-blue-600 w-12 text-right">{day.rain}mm</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Climate Recommendation */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Climate-Based Recommendation
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Current conditions are favorable for irrigation. Moderate VPD (1.6 kPa) indicates good transpiration potential. 
            Rain forecast for Wednesday (15mm) - consider adjusting irrigation schedule. ET0 rate suggests moderate water demand across zones.
          </p>
        </Card>
      </div>
    </div>
  );
}
