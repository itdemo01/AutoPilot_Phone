import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Shield,
  Power,
  Usb,
  Smartphone,
  ChevronDown,
  BrainCircuit,
  MoreVertical,
  Pause,
  Play,
} from "lucide-react";

export default function TopNav({
  isConnected,
  latency,
  devices,
  selectedDeviceId,
  onDeviceSelect,
  onOpenSecurity,
  onOpenWizard,
  onOpenModelSettings,
  isSystemPaused,
  onTogglePause,
}: {
  isConnected: boolean;
  latency: number | null;
  devices?: { id: string; name: string; status: string }[];
  selectedDeviceId?: string;
  onDeviceSelect?: (id: string) => void;
  onOpenSecurity: () => void;
  onOpenWizard: () => void;
  onOpenModelSettings: () => void;
  isSystemPaused: boolean;
  onTogglePause: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-l border-r border-zinc-900 border-opacity-30">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className="bg-emerald-500/10 p-1.5 sm:p-2 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer hover:bg-emerald-500/20 transition-colors"
            onClick={onOpenWizard}
          >
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-500 flex items-center gap-2">
            PHONEPILOT
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold tracking-widest text-emerald-400">
              2030 VISION
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          {/* Device Selector */}
          {devices && devices.length > 0 && (
            <div className="relative shrink-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 bg-black border border-zinc-800 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="max-w-[70px] sm:max-w-[120px] truncate">
                  {devices.find((d) => d.id === selectedDeviceId)?.name ||
                    "Select"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-zinc-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                      {devices.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => {
                            if (onDeviceSelect) onDeviceSelect(device.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-zinc-800 transition-colors ${selectedDeviceId === device.id ? "text-emerald-400 bg-zinc-800/50" : "text-zinc-300"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${device.status === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-zinc-600"}`}
                          ></div>
                          <span className="truncate font-medium">
                            {device.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="w-px h-6 bg-zinc-800 hidden lg:block"></div>

          {/* Connection Health & Latency Monitor */}
          <div
            onClick={onOpenWizard}
            className="hidden lg:flex shrink-0 items-center gap-2 font-mono text-xs bg-black border border-zinc-800 px-3 py-1.5 rounded-lg shadow-inner shadow-black/50 overflow-hidden relative cursor-pointer hover:border-emerald-500/30 transition-colors"
          >
            {isConnected ? (
              <>
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-emerald-500/5 mix-blend-screen pointer-events-none"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <span className="text-emerald-400 ml-1">
                  {latency ? `${latency}ms` : "..."} Edge Connection
                </span>
              </>
            ) : (
              <>
                <div className="absolute top-0 left-0 bottom-0 w-full bg-red-500/5 mix-blend-screen pointer-events-none"></div>
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping"></div>
                <span className="text-red-400 ml-1">
                  Device Unreachable - Retrying...
                </span>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-zinc-800 hidden md:block"></div>

          {/* Settings & Power - Desktop */}
          <div className="hidden md:flex gap-1.5 sm:gap-2">
            <button
              onClick={onTogglePause}
              className={`border p-2 rounded-lg transition-colors flex items-center gap-2 ${isSystemPaused ? "bg-red-500/10 border-red-500 text-red-500" : "bg-black border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/50"}`}
              title={isSystemPaused ? "Resume System" : "Pause System"}
            >
              {isSystemPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onOpenModelSettings}
              className="bg-black border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 p-2 rounded-lg transition-colors flex items-center gap-2"
              title="Model Engine Setup"
            >
              <BrainCircuit className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenWizard}
              className="bg-black border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 p-2 rounded-lg transition-colors flex items-center gap-2"
              title="Device Connection Wizard"
            >
              <Usb className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSecurity}
              className="bg-black border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 p-2 rounded-lg transition-colors flex items-center gap-2"
              title="Security Vault"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button className="bg-black border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/50 p-2 rounded-lg transition-colors">
              <Power className="w-4 h-4" />
            </button>
          </div>

          {/* Settings & Power - Mobile Dropdown */}
          <div className="relative md:hidden shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-black border border-zinc-800 text-zinc-400 hover:text-emerald-400 p-1.5 sm:p-2 rounded-md transition-colors flex items-center justify-center"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col p-1 gap-1"
                  >
                    <button
                      onClick={() => {
                        onOpenModelSettings();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-md transition-colors"
                    >
                      <BrainCircuit className="w-4 h-4" /> Engine Setup
                    </button>
                    <button
                      onClick={() => {
                        onTogglePause();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 rounded-md transition-colors ${isSystemPaused ? "bg-red-500/10 text-red-500" : "hover:bg-zinc-800 text-zinc-300 hover:text-red-400"}`}
                    >
                      {isSystemPaused ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}{" "}
                      {isSystemPaused ? "Resume System" : "Pause System"}
                    </button>
                    <button
                      onClick={() => {
                        onOpenWizard();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-md transition-colors"
                    >
                      <Usb className="w-4 h-4" /> Device Wizard
                    </button>
                    <button
                      onClick={() => {
                        onOpenSecurity();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-md transition-colors"
                    >
                      <Shield className="w-4 h-4" /> Security Vault
                    </button>
                    <div className="h-px w-full bg-zinc-800 my-1"></div>
                    <button className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 hover:bg-zinc-800 text-red-400 rounded-md transition-colors">
                      <Power className="w-4 h-4" /> Disconnect
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
