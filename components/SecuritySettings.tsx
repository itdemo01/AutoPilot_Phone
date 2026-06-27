import { useState, useEffect } from "react";
import { Shield, Key, X, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SecuritySettings({
  isOpen,
  onClose,
  currentKey,
  currentUrl,
  onSaveKey,
  onSaveUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string | null;
  currentUrl: string | null;
  onSaveKey: (key: string) => void;
  onSaveUrl: (url: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentKey || "");
      setUrlValue(currentUrl || "SIMULATE_LOCAL");
    }
  }, [isOpen, currentKey, currentUrl]);

  const handleSave = () => {
    onSaveKey(inputValue);
    onSaveUrl(urlValue);
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
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-500 font-sans tracking-wide">
                  Security Vault
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  Configure Termux/Ubuntu backend
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                  <Key className="w-3 h-3" /> HOST URL
                </label>
                <input
                  type="text"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="SIMULATE_LOCAL or ws://192.168.1.x:8000/ws/connect"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner shadow-black/80 mb-4"
                />
                <label className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
                  <Key className="w-3 h-3" /> SECRET API KEY
                </label>
                <input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your backend secret..."
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner shadow-black/80"
                />
                <p className="text-[10px] text-zinc-600 mt-3 font-mono leading-relaxed border-l-2 border-zinc-800 pl-2">
                  This key is required to establish the real-time WebSocket
                  connection to your host node. It is encrypted and stored
                  locally.
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                <Shield className="w-4 h-4" /> Save Key & Reconnect
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
