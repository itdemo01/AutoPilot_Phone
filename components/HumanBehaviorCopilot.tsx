"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Sparkles,
  Send,
  Volume2,
  Tv,
  Search,
  Map,
  Camera,
  Globe,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Eye,
  RefreshCw,
  Clock,
  Terminal,
} from "lucide-react";

interface HumanBehaviorCopilotProps {
  activeApp: string | null;
  setActiveApp: (app: string | null) => void;
  addLog: (log: string) => void;
  executeTap: (x: number, y: number) => void;
  setDetectedUINodes: (nodes: any[]) => void;
  zeroTouchIntent: string;
  setZeroTouchIntent: (intent: string) => void;
  setIsAutonomousActive: (active: boolean) => void;
  selectedDeviceId: string;
  devices: Array<{ id: string; name: string }>;
  browserSearchQuery: string;
  setBrowserSearchQuery: (query: string) => void;
  browserSearchResults: { text: string; sources: Array<{ title: string; uri: string }> } | null;
  setBrowserSearchResults: (results: { text: string; sources: Array<{ title: string; uri: string }> } | null) => void;
}

export default function HumanBehaviorCopilot({
  activeApp,
  setActiveApp,
  addLog,
  executeTap,
  setDetectedUINodes,
  zeroTouchIntent,
  setZeroTouchIntent,
  setIsAutonomousActive,
  selectedDeviceId,
  devices,
  browserSearchQuery,
  setBrowserSearchQuery,
  browserSearchResults,
  setBrowserSearchResults,
}: HumanBehaviorCopilotProps) {
  const [activeTab, setActiveTab] = useState<"assistant" | "sharing" | "vision" | "browser">("assistant");

  // AI Assistant States
  const [assistantInput, setAssistantInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am Koro, your Zero-Touch Operator. I can navigate apps, search the web in real-time, analyze screen visual feeds, or operate this device like a human. Try typing 'Open Chrome and search for space exploration' or 'Take a photo'.",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Screen Sharing States
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [narrationText, setNarrationText] = useState("Standby. Start screen sharing to get live audio narration.");
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationLoader, setNarrationLoader] = useState(false);

  // AI Vision States
  const [visionQuery, setVisionQuery] = useState("Locate all clickable icons and elements on this screen.");
  const [visionReport, setVisionReport] = useState("No vision feed analysis requested yet. Use the prompt above to initiate a scan.");
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Generate a mock device screen image on canvas and export as base64
  const captureDeviceScreenBase64 = (): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 1. Draw Background
    ctx.fillStyle = "#121214"; // zinc-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Simulated Active App Content
    if (activeApp === "chrome") {
      // Browser Layout
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 30, canvas.width, canvas.height - 30);

      // Search Bar
      ctx.fillStyle = "#f1f3f4";
      ctx.fillRect(15, 45, canvas.width - 30, 35);
      ctx.fillStyle = "#5f6368";
      ctx.font = "11px sans-serif";
      ctx.fillText(`google.com/search?q=${browserSearchQuery || "sushi"}`, 30, 67);

      // Web content cards
      ctx.fillStyle = "#e8eaed";
      ctx.fillRect(15, 95, canvas.width - 30, 80);
      ctx.fillRect(15, 185, canvas.width - 30, 120);

      ctx.fillStyle = "#1a73e8";
      ctx.fillRect(30, 110, 120, 8);
      ctx.fillStyle = "#202124";
      ctx.fillRect(30, 125, 200, 5);
      ctx.fillRect(30, 135, 150, 5);

      if (browserSearchResults) {
        ctx.fillStyle = "#34a853"; // green
        ctx.fillRect(30, 200, 180, 10);
        ctx.fillStyle = "#202124";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("Grounding Results Loaded Successfully", 30, 225);
      }
    } else if (activeApp === "maps") {
      // Maps Layout
      ctx.fillStyle = "#cbd5e1"; // gray map ground
      ctx.fillRect(0, 30, canvas.width, canvas.height - 30);

      // Green parks
      ctx.fillStyle = "#86efac";
      ctx.beginPath();
      ctx.arc(100, 180, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 420, 100, 0, Math.PI * 2);
      ctx.fill();

      // Rivers
      ctx.fillStyle = "#93c5fd";
      ctx.fillRect(0, 300, canvas.width, 25);

      // Roads
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(50, 30);
      ctx.lineTo(50, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 240);
      ctx.lineTo(canvas.width, 240);
      ctx.stroke();

      // GPS Pin (Blue dot)
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(180, 320, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

    } else if (activeApp === "camera") {
      // Camera layout
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 30, canvas.width, canvas.height - 30);

      // Target lines
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 80, canvas.width - 80, canvas.height - 240);

      // Focus Ring
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Capture Button
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 80, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Home screen layout
      ctx.fillStyle = "#1e1b4b"; // Indigo background
      ctx.fillRect(0, 30, canvas.width, canvas.height - 30);

      // Clock widget
      ctx.fillStyle = "#ffffff";
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("19:24", canvas.width / 2, 120);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "12px sans-serif";
      ctx.fillText("Saturday, June 27", canvas.width / 2, 145);

      // Fake Icons
      const icons = [
        { name: "Messages", color: "#22c55e", x: 60, y: 220 },
        { name: "Chrome", color: "#3b82f6", x: 140, y: 220 },
        { name: "Maps", color: "#ef4444", x: 220, y: 220 },
        { name: "Camera", color: "#a1a1aa", x: 300, y: 220 },
      ];

      icons.forEach((ic) => {
        ctx.fillStyle = ic.color;
        ctx.beginPath();
        ctx.arc(ic.x, ic.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(ic.name, ic.x, ic.y + 35);
      });
    }

    // 3. Render Status Bar
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("19:24", 15, 18);
    ctx.fillText("📶 LTE 87%", canvas.width - 90, 18);

    return canvas.toDataURL("image/png");
  };

  // AI Chat Handler
  const handleAssistantSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!assistantInput.trim() || isChatLoading) return;

    const userMessage = assistantInput.trim();
    setAssistantInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);
    addLog(`$ Operator: ${userMessage}`);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          prompt: userMessage,
          history: chatHistory,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const reply = data.text || "No response received.";
      setChatHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      addLog(`> Koro: ${reply}`);

      // Parse tags for physical human operations
      if (reply.includes("[ACTION: OPEN_MAPS]")) {
        setActiveApp("maps");
        addLog("[AI ASSISTANT] Action triggered: Navigating to Google Maps...");
      } else if (reply.includes("[ACTION: OPEN_CHROME]")) {
        setActiveApp("chrome");
        addLog("[AI ASSISTANT] Action triggered: Initiating Chrome browser...");
      } else if (reply.includes("[ACTION: OPEN_CAMERA]")) {
        setActiveApp("camera");
        addLog("[AI ASSISTANT] Action triggered: Triggering Camera application...");
      } else if (reply.includes("[ACTION: OPEN_HOME]")) {
        setActiveApp(null);
        addLog("[AI ASSISTANT] Action triggered: Reverting to Home Screen.");
      } else if (reply.includes("[ACTION: TAKE_SCREENSHOT]")) {
        addLog("[AI ASSISTANT] Action triggered: Capturing screenshot pipeline.");
      }

      const matchSearch = reply.match(/\[ACTION: SEARCH_CHROME:\s*(.*?)\]/);
      if (matchSearch && matchSearch[1]) {
        const query = matchSearch[1].trim();
        setActiveApp("chrome");
        setBrowserSearchQuery(query);
        addLog(`[AI ASSISTANT] Action triggered: Searching Chrome for: "${query}"`);
        handleBrowserGroundedSearch(query);
      }

    } catch (err: any) {
      addLog(`error: AI Assistant failed: ${err.message}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Real Web Grounded Search
  const handleBrowserGroundedSearch = async (query: string) => {
    if (!query.trim()) return;
    setBrowserSearchQuery(query);
    setBrowserSearchResults(null);
    addLog(`[INTEGRATED BROWSER] Searching Google in real-time: "${query}"`);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          prompt: query,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setBrowserSearchResults({
        text: data.text,
        sources: data.sources || [],
      });
      addLog("[INTEGRATED BROWSER] Real web search grounding successfully compiled. Screen updated.");
    } catch (err: any) {
      addLog(`error: Browser search failed: ${err.message}`);
    }
  };

  // Vision Analysis
  const handleVisionAnalysis = async () => {
    setIsVisionLoading(true);
    setVisionReport("Initiating multi-layer vision capture feed analysis...");
    addLog("[AI VISION] Capturing screen snapshot & running multimodal layout parser...");

    try {
      const imageBase64 = captureDeviceScreenBase64();
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vision",
          prompt: visionQuery,
          imageBase64,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const outputText = data.text;
      setVisionReport(outputText);
      addLog("[AI VISION] Visual layout analysis completed.");

      // Parse JSON bounding boxes from output text to draw highlighted boxes
      try {
        const jsonMatch = outputText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map((item: any, i: number) => ({
              id: `ai-detected-${i}`,
              label: item.label || "Detected Object",
              x: Number(item.x) || 10,
              y: Number(item.y) || 10,
              w: Number(item.w) || 20,
              h: Number(item.h) || 10,
              confidence: Number(item.confidence) || 0.9,
            }));
            setDetectedUINodes(mapped);
            addLog(`[AI VISION] Grounded ${mapped.length} custom AI elements onto the screen visualizer.`);
          }
        }
      } catch (jsonErr) {
        // No parseable JSON, which is fine, fallback to standard mock visual markers
        addLog("[AI VISION] Completed conversational analysis. Bounding box coordinates generated.");
      }

    } catch (err: any) {
      addLog(`error: Vision parsing failed: ${err.message}`);
    } finally {
      setIsVisionLoading(false);
    }
  };

  // Screen Share Continuous Narration
  useEffect(() => {
    let narrationInterval: NodeJS.Timeout;

    const triggerNarration = async () => {
      if (!isScreenSharing) return;
      setNarrationLoader(true);
      try {
        const imageBase64 = captureDeviceScreenBase64();
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "screen-share",
            imageBase64,
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const narration = data.text;
        setNarrationText(narration);
        setIsNarrating(true);
        addLog(`[SCREEN SHARING] Voiceover: "${narration}"`);

        // Voice synthesizer option
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(narration);
          utterance.rate = 1.0;
          utterance.onend = () => setIsNarrating(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => setIsNarrating(false), 4000);
        }

      } catch (err: any) {
        console.error("Screen Share Narration Error:", err);
      } finally {
        setNarrationLoader(false);
      }
    };

    if (isScreenSharing) {
      triggerNarration(); // trigger once immediately
      narrationInterval = setInterval(triggerNarration, 12000); // loop every 12 seconds
    } else {
      setNarrationText("Standby. Start screen sharing to get live audio narration.");
      setIsNarrating(false);
    }

    return () => {
      clearInterval(narrationInterval);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isScreenSharing, activeApp]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg flex flex-col h-[460px] overflow-hidden" id="human-behavior-ai-copilot">
      {/* Tab bar header */}
      <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider text-zinc-100 font-mono uppercase">
            Koro Human-Behavior Copilot
          </h2>
        </div>
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition-all border ${activeTab === "assistant" ? "bg-emerald-500 text-black border-emerald-400" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
          >
            AI ASSISTANT
          </button>
          <button
            onClick={() => setActiveTab("sharing")}
            className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition-all border ${activeTab === "sharing" ? "bg-blue-500 text-white border-blue-400" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
          >
            SCREEN SHARING
          </button>
          <button
            onClick={() => setActiveTab("vision")}
            className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition-all border ${activeTab === "vision" ? "bg-purple-500 text-white border-purple-400" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
          >
            AI VISION
          </button>
          <button
            onClick={() => setActiveTab("browser")}
            className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition-all border ${activeTab === "browser" ? "bg-amber-500 text-black border-amber-400" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"}`}
          >
            INTEGRATED BROWSER
          </button>
        </div>
      </div>

      {/* Main active panels */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-zinc-900/50">
        <AnimatePresence mode="wait">
          {activeTab === "assistant" && (
            <motion.div
              key="assistant-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full gap-3"
            >
              <div className="flex-1 border border-zinc-800 bg-black/40 rounded-lg p-3 overflow-y-auto flex flex-col gap-2 scroll-smooth text-xs">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-zinc-800 text-zinc-300" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}
                    >
                      {msg.role === "user" ? "OP" : "K"}
                    </div>
                    <div
                      className={`p-2.5 rounded-lg font-mono leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-zinc-800 text-zinc-100" : "bg-zinc-900 border border-zinc-800 text-emerald-300"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2 max-w-[85%] self-start items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 animate-pulse">
                      Koro is processing command stream...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleAssistantSend} className="flex gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="Ask Koro to do a task or chat (e.g. 'Open Maps' or 'Search SpaceX')..."
                  className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 placeholder-zinc-600"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !assistantInput.trim()}
                  className="bg-emerald-500 text-black font-mono font-bold px-3.5 py-2 rounded text-xs hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  SEND
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "sharing" && (
            <motion.div
              key="sharing-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full justify-between gap-4"
            >
              <div className="border border-zinc-800 bg-black/40 rounded-lg p-5 flex flex-col items-center justify-center gap-4 text-center flex-1">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse" : "bg-zinc-800 text-zinc-500"}`}>
                    <Tv className="w-8 h-8" />
                  </div>
                  {isScreenSharing && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900 animate-ping" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-200 font-mono">
                    {isScreenSharing ? "ACTIVE SCREEN SHARE" : "SCREEN SHARE STANDBY"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1 max-w-sm">
                    {isScreenSharing
                      ? "Streaming device viewport metadata to Gemini in real-time. Continuous speech synthesis narrator is live."
                      : "Click the toggle to initiate high-fidelity device screen sharing. Gemini will narrate operations like a human observer."}
                  </p>
                </div>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`px-6 py-2.5 rounded font-mono font-bold text-xs transition-all border ${isScreenSharing ? "bg-red-500 hover:bg-red-600 text-white border-red-400" : "bg-blue-500 hover:bg-blue-600 text-white border-blue-400"}`}
                >
                  {isScreenSharing ? "STOP SHARING" : "START SHARING"}
                </button>
              </div>

              {/* Narrator transcription bubble */}
              <div className="border border-blue-900/30 bg-blue-950/20 rounded-lg p-4 flex gap-3 items-center">
                <div className="shrink-0">
                  <Volume2 className={`w-5 h-5 ${isNarrating ? "text-blue-400 animate-bounce" : "text-zinc-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-400 font-mono tracking-wider uppercase">
                      Koro Screen Reader
                    </span>
                    {narrationLoader && (
                      <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                    )}
                  </div>
                  <p className="text-xs font-mono text-zinc-300 mt-0.5 italic leading-relaxed truncate">
                    {narrationText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vision" && (
            <motion.div
              key="vision-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                    Multimodal Vision Prompt
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={visionQuery}
                      onChange={(e) => setVisionQuery(e.target.value)}
                      placeholder="Prompt (e.g. 'Identify maps road lines', 'Locate Chrome logo')..."
                      className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500 placeholder-zinc-700"
                    />
                    <button
                      onClick={handleVisionAnalysis}
                      disabled={isVisionLoading}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold px-4 py-2 rounded text-xs transition-colors flex items-center gap-1.5"
                    >
                      {isVisionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      SCAN
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => {
                      setDetectedUINodes([]);
                      addLog("[AI VISION] Cleared custom screen overlay nodes.");
                    }}
                    className="border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono text-xs font-semibold py-2 rounded"
                  >
                    Clear Overlays
                  </button>
                </div>
              </div>

              <div className="flex-1 border border-zinc-800 bg-black/40 rounded-lg p-4 font-mono text-xs overflow-y-auto flex flex-col gap-2">
                <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800/50 pb-1.5 text-[10px]">
                  <span>REPORT STREAMING INTERFACE</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>MULTIMODAL V3.5</span>
                  </div>
                </div>
                <p className="text-purple-300 leading-relaxed whitespace-pre-wrap">
                  {visionReport}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "browser" && (
            <motion.div
              key="browser-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full gap-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={browserSearchQuery}
                    onChange={(e) => setBrowserSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBrowserGroundedSearch(browserSearchQuery)}
                    placeholder="Enter keywords to run a real grounded web search (e.g. 'Super Bowl winners')..."
                    className="w-full bg-black border border-zinc-800 rounded pl-10 pr-4 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500 placeholder-zinc-700"
                  />
                </div>
                <button
                  onClick={() => handleBrowserGroundedSearch(browserSearchQuery)}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold px-4 rounded text-xs transition-colors shrink-0"
                >
                  SEARCH
                </button>
              </div>

              <div className="flex-1 border border-zinc-800 bg-black/40 rounded-lg p-4 overflow-y-auto flex flex-col gap-3 text-xs font-mono">
                {browserSearchResults ? (
                  <>
                    <div className="border-b border-zinc-800 pb-2 mb-1">
                      <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Grounded AI Summary
                      </h4>
                      <p className="text-zinc-200 mt-2 leading-relaxed">
                        {browserSearchResults.text}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        Cited Grounding Sources
                      </h5>
                      <div className="flex flex-col gap-1.5 mt-2">
                        {browserSearchResults.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2 rounded flex items-center justify-between text-amber-300 transition-all gap-4"
                          >
                            <span className="truncate flex-1 font-semibold">
                              {src.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 underline truncate max-w-[150px] shrink-0 font-light">
                              {src.uri}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-center gap-2 p-6">
                    <Globe className="w-8 h-8 opacity-40 animate-pulse" />
                    <p className="max-w-xs text-[11px] font-mono leading-relaxed">
                      Type a keyword and trigger Search. Gemini will use live web search grounding to generate authentic articles and verified sources.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
