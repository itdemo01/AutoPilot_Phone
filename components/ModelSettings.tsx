import { useState, useEffect } from "react";
import { BrainCircuit, X, Database, Link, Laptop, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ModelSettings({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: {
    type: "openai" | "openrouter" | "local" | "opencode";
    apiKey: string;
    modelId: string;
    endpoint?: string;
  }) => void;
}) {
  const [modelType, setModelType] = useState<
    "openai" | "openrouter" | "local" | "opencode"
  >("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [modelId, setModelId] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const handleSave = () => {
    onSave({ type: modelType, apiKey, modelId, endpoint });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50 shrink-0">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-500 font-sans tracking-wide">
                  Model Engine Setup
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  Configure Local or 3rd Party LLMs
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                  <Database className="w-3 h-3" /> ENGINE PROVIDER
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setModelType("opencode");
                      setEndpoint("https://api.opencode.example.com/v1");
                      setModelId("opencode-pro");
                    }}
                    className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors flex flex-col items-center gap-1 ${modelType === "opencode" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}
                  >
                    <Database className="w-4 h-4" /> Opencode AI
                  </button>
                  <button
                    onClick={() => {
                      setModelType("openrouter");
                      setEndpoint("");
                      setModelId("google/gemini-pro-1.5");
                    }}
                    className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors flex flex-col items-center gap-1 ${modelType === "openrouter" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}
                  >
                    <Link className="w-4 h-4" /> OpenRouter
                  </button>
                  <button
                    onClick={() => {
                      setModelType("openai");
                      setEndpoint("");
                      setModelId("gpt-4o");
                    }}
                    className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors flex flex-col items-center gap-1 ${modelType === "openai" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}
                  >
                    <Database className="w-4 h-4" /> OpenAI
                  </button>
                  <button
                    onClick={() => {
                      setModelType("local");
                      setEndpoint("http://localhost:11434");
                      setModelId("llama3");
                    }}
                    className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors flex flex-col items-center gap-1 ${modelType === "local" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}
                  >
                    <Laptop className="w-4 h-4" /> Local (Ollama)
                  </button>
                </div>
              </div>

              {(modelType === "openrouter" ||
                modelType === "openai" ||
                modelType === "opencode") && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> API KEY
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${modelType === "opencode" ? "Opencode" : modelType === "openrouter" ? "OpenRouter" : "OpenAI"} key...`}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner shadow-black/80"
                  />
                </div>
              )}

              {(modelType === "local" || modelType === "opencode") && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                    <Link className="w-3 h-3" />{" "}
                    {modelType === "opencode" ? "BASE URL" : "ENDPOINT URL"}
                  </label>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder={
                      modelType === "opencode"
                        ? "https://api.opencode.example.com/v1"
                        : "http://localhost:11434"
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner shadow-black/80"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-3 h-3" /> MODEL IDENTIFIER
                </label>
                <input
                  type="text"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  placeholder={
                    modelType === "opencode"
                      ? "opencode-pro"
                      : modelType === "openrouter"
                        ? "google/gemini-pro-1.5"
                        : modelType === "openai"
                          ? "gpt-4o"
                          : "llama3"
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner shadow-black/80"
                />
                <p className="text-[10px] text-zinc-600 mt-3 font-mono leading-relaxed border-l-2 border-zinc-800 pl-2">
                  This AI engine will power the autonomous capabilities of the
                  PhonePilot agent.
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end shrink-0">
              <button
                onClick={handleSave}
                disabled={
                  !modelId ||
                  ((modelType === "openai" || modelType === "openrouter") &&
                    !apiKey) ||
                  (modelType === "local" && !endpoint) ||
                  (modelType === "opencode" && (!apiKey || !endpoint))
                }
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                <BrainCircuit className="w-4 h-4" /> Save & Connect
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
