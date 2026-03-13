import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Mic, Send, Volume2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotDialog({ open, onOpenChange }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your AgriBrain AI Assistant. I can help explain your farm data, provide agricultural advice, or answer questions about your zones. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"explainer" | "expert">("explainer");
  const [isListening, setIsListening] = useState(false);

  const quickPrompts = [
    "Explain Zone A data",
    "Why was irrigation delayed?",
    "What does high VPD mean?",
    "What crop is recommended for this soil?",
    "What should I do about disease alert in Zone C?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (mode === "explainer") {
        if (userMessage.toLowerCase().includes("zone a")) {
          response = "Zone A (Tomatoes) currently has 42% soil moisture, which is below the optimal range of 60-70% for tomatoes in the flowering stage. Temperature is 26°C and VPD is 1.8 kPa. The AI recommends irrigation in 2 hours to coincide with peak solar generation for energy efficiency.";
        } else if (userMessage.toLowerCase().includes("vpd")) {
          response = "VPD (Vapor Pressure Deficit) measures the difference between the moisture in the air and how much moisture the air can hold when saturated. High VPD (like 1.8 kPa) means drier air that pulls more water from plants, increasing water stress. Optimal VPD for most crops is 0.8-1.2 kPa.";
        } else if (userMessage.toLowerCase().includes("delayed")) {
          response = "Irrigation was delayed to optimize for solar charging. With battery at 28%, waiting 2 hours allows solar panels to charge the battery to ~45%, ensuring sufficient energy for evening operations while the water stress in Zone A remains manageable.";
        } else if (userMessage.toLowerCase().includes("disease") || userMessage.toLowerCase().includes("zone c")) {
          response = "Zone C shows possible downy mildew detected by AgriVision with 82% confidence. This fungal disease appears as yellowing patterns on 8% of leaves. Recommended actions: 1) Visual inspection to confirm, 2) Apply organic fungicide if confirmed, 3) Reduce irrigation frequency to lower humidity which favors disease spread.";
        } else {
          response = "I can explain farm metrics, sensor readings, and AI recommendations. Try asking about specific zones, weather conditions, or what certain agricultural terms mean!";
        }
      } else {
        if (userMessage.toLowerCase().includes("crop") || userMessage.toLowerCase().includes("soil")) {
          response = "Based on your soil conditions (fertility 75-85%, good drainage), I recommend continuing with your current rotation of tomatoes, peppers, lettuce, and cucumbers. Consider adding legumes like beans in the next season to naturally boost nitrogen levels. Your soil pH and moisture retention are ideal for these crops.";
        } else if (userMessage.toLowerCase().includes("disease") || userMessage.toLowerCase().includes("zone c")) {
          response = "For the suspected downy mildew in Zone C: 1) Confirm visually - look for yellow spots on upper leaf surfaces with fuzzy growth underneath. 2) If confirmed, apply copper-based fungicide or neem oil early morning. 3) Improve air circulation by spacing plants. 4) Water at soil level, not overhead. 5) Remove heavily affected leaves. 6) Monitor daily for 1 week.";
        } else if (userMessage.toLowerCase().includes("water stress") || userMessage.toLowerCase().includes("zone a")) {
          response = "For Zone A's water stress during flowering: Tomatoes need consistent moisture during flowering to ensure good fruit set. Irrigate to bring soil moisture to 65-70%. Consider mulching to retain moisture. The high VPD (1.8 kPa) is causing rapid transpiration - evening irrigation might reduce stress. Monitor fruit set closely over next 3-5 days.";
        } else {
          response = "As an agricultural expert, I can provide advice on crop management, pest control, irrigation strategies, soil health, and harvest timing. What specific challenge are you facing?";
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast.info("Voice input activated", {
      description: "Speak your question...",
    });
    setTimeout(() => {
      setIsListening(false);
      setInput("What does high VPD mean?");
      toast.success("Voice captured");
    }, 2000);
  };

  const handlePlayAudio = (message: string) => {
    toast.info("Playing audio response");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[620px] flex flex-col p-0 gap-0 border-slate-200">
        {/* Premium Header */}
        <DialogHeader className="px-6 pt-6 pb-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">AI Assistant</DialogTitle>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Always here to help</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={mode === "explainer" ? "default" : "outline"}
              className={`cursor-pointer font-semibold transition-all ${mode === "explainer" ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm" : "hover:bg-slate-100"}`}
              onClick={() => setMode("explainer")}
            >
              Data Explainer
            </Badge>
            <Badge
              variant={mode === "expert" ? "default" : "outline"}
              className={`cursor-pointer font-semibold transition-all ${mode === "expert" ? "bg-blue-600 hover:bg-blue-700 shadow-sm" : "hover:bg-slate-100"}`}
              onClick={() => setMode("expert")}
            >
              Agriculture Expert
            </Badge>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-5">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                      : "bg-slate-100 text-slate-900 border border-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                  {message.role === "assistant" && (
                    <button
                      onClick={() => handlePlayAudio(message.content)}
                      className="mt-2.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Play audio
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-2.5 mt-4">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-slate-700 font-medium transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2.5">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your farm..."
              className="min-h-[48px] max-h-[100px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleVoiceInput}
                className={`h-12 w-12 border-slate-200 ${isListening ? "bg-red-50 border-red-300" : "hover:bg-slate-100"}`}
              >
                <Mic className={`w-5 h-5 ${isListening ? "text-red-600" : "text-slate-600"}`} strokeWidth={2} />
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30"
              >
                <Send className="w-5 h-5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
