import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Cpu,
  Database,
  Volume2,
  VolumeX,
  Sun,
  Camera,
  Lock,
  Unlock,
  Play,
  Square,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Terminal,
  RefreshCw,
  Sliders,
  BellRing,
  Shield,
  Zap,
  Download,
  Clock,
  MapPin,
  AppWindow,
  ToggleLeft,
  ToggleRight,
  Eye,
  MousePointer,
  Keyboard,
  Key,
  Settings,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Script {
  id: number;
  name: string;
  status: string;
  type: string;
}

interface Device {
  id: string;
  name: string;
  status: string;
}

interface AutomationRule {
  id: string;
  name: string;
  triggerType: "time" | "location" | "app";
  triggerValue: string; // e.g. "07:00", "Home", "com.android.chrome"
  actionType: "wifi" | "volume" | "app" | "vibrate" | "brightness";
  actionValue: string; // e.g. "ON" / "OFF", "0" (Silent) / "80", "com.google.android.music", "Vibrate", "50%"
  enabled: boolean;
}

interface PhoneDashboardManagerProps {
  scripts: Script[];
  setScripts: React.Dispatch<React.SetStateAction<Script[]>>;
  battery: number;
  setBattery: React.Dispatch<React.SetStateAction<number>>;
  selectedDeviceId: string;
  devices: Device[];
  addLog: (log: string) => void;
  isManualOverride: boolean;
  setIsManualOverride: (val: boolean) => void;
  executeShellCommand?: (command: string) => void;
}

export default function PhoneDashboardManager({
  scripts,
  setScripts,
  battery,
  setBattery,
  selectedDeviceId,
  devices,
  addLog,
  isManualOverride,
  setIsManualOverride,
  executeShellCommand,
}: PhoneDashboardManagerProps) {
  // Local States
  const [isCharging, setIsCharging] = useState(false);
  const [networkType, setNetworkType] = useState("Wi-Fi 6E");
  const [wifiStrength, setWifiStrength] = useState(4); // 1-4 bars
  const [cpuLoad, setCpuLoad] = useState(38);
  const [ramUsed, setRamUsed] = useState(4.8); // out of 8GB
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Shell Command Input
  const [customShellCmd, setCustomShellCmd] = useState("");

  // Tab State: Automation Scripts vs Trigger-Action Rules vs Remote Control & Mirroring
  const [activeTab, setActiveTab] = useState<"scripts" | "rules" | "remote">("rules");

  // Remote Control & Mirroring States
  const [isMirroringActive, setIsMirroringActive] = useState(true);
  const [mirrorFps, setMirrorFps] = useState(30);
  const [mirrorQuality, setMirrorQuality] = useState(85);
  const [mirrorLatency, setMirrorLatency] = useState(14);
  const [mirrorBitrate, setMirrorBitrate] = useState(2.4);
  const [isKeyboardCaptured, setIsKeyboardCaptured] = useState(false);
  const [lastTypedKey, setLastTypedKey] = useState<string>("");
  const [typedBuffer, setTypedBuffer] = useState<string>("");
  const [remotePin, setRemotePin] = useState("849302");
  const [enteredPin, setEnteredPin] = useState("");
  const [isRemoteAuthorized, setIsRemoteAuthorized] = useState(true);
  const [encryptionLevel, setEncryptionLevel] = useState("AES-256-GCM");
  
  // Permissions
  const [allowTouch, setAllowTouch] = useState(true);
  const [allowKeys, setAllowKeys] = useState(true);
  const [allowClipboard, setAllowClipboard] = useState(true);
  const [allowReboot, setAllowReboot] = useState(false);

  // Connection settings
  const [allowedIpRange, setAllowedIpRange] = useState("192.168.1.0/24");
  
  // Local interaction coordinate state for feedback
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [remoteClicks, setRemoteClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Security Audit Log State
  const [securityLogs, setSecurityLogs] = useState<string[]>([
    `[10:30:15] Security handshake completed: ECDH Prime256v1.`,
    `[10:30:15] Authorized remote agent: PC-CHROME-WIN11.`,
    `[10:31:02] Token validation successful.`,
    `[10:32:45] Touch injection interface initialized.`
  ]);

  // Script Add/Edit states
  const [editingScriptId, setEditingScriptId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("zap");
  const [isAddingScript, setIsAddingScript] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("zap");

  // Custom Trigger-Action Automation Rules State
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "rule_1",
      name: "Office Silent Auto",
      triggerType: "location",
      triggerValue: "Office",
      actionType: "volume",
      actionValue: "0",
      enabled: true,
    },
    {
      id: "rule_2",
      name: "Arrive Home Wi-Fi",
      triggerType: "location",
      triggerValue: "Home",
      actionType: "wifi",
      actionValue: "ON",
      enabled: true,
    },
    {
      id: "rule_3",
      name: "Wakeup Spotify Sync",
      triggerType: "time",
      triggerValue: "07:00",
      actionType: "app",
      actionValue: "com.spotify.music",
      enabled: false,
    },
    {
      id: "rule_4",
      name: "App Lock Vibration",
      triggerType: "app",
      triggerValue: "com.android.settings",
      actionType: "vibrate",
      actionValue: "Vibrate 300ms",
      enabled: true,
    },
  ]);

  // Rule Builder Form State
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleTriggerType, setRuleTriggerType] = useState<"time" | "location" | "app">("time");
  const [ruleTriggerValue, setRuleTriggerValue] = useState("");
  const [ruleActionType, setRuleActionType] = useState<"wifi" | "volume" | "app" | "vibrate" | "brightness">("volume");
  const [ruleActionValue, setRuleActionValue] = useState("");

  // Rule Editing State
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editRuleName, setEditRuleName] = useState("");
  const [editRuleTriggerType, setEditRuleTriggerType] = useState<"time" | "location" | "app">("time");
  const [editRuleTriggerValue, setEditRuleTriggerValue] = useState("");
  const [editRuleActionType, setEditRuleActionType] = useState<"wifi" | "volume" | "app" | "vibrate" | "brightness">("volume");
  const [editRuleActionValue, setEditRuleActionValue] = useState("");

  // Get active device info
  const activeDevice = devices.find((d) => d.id === selectedDeviceId) || {
    name: "Pixel 8 Pro (Android 14)",
    status: "connected",
  };

  // Battery simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCharging) {
      interval = setInterval(() => {
        setBattery((prev) => {
          if (prev >= 100) {
            setIsCharging(false);
            addLog("[DASHBOARD] Device fully charged (100%).");
            return 100;
          }
          return Math.min(100, prev + 1);
        });
      }, 3000);
    } else {
      // Slow background discharge
      interval = setInterval(() => {
        setBattery((prev) => Math.max(5, prev - 1));
      }, 25000);
    }
    return () => clearInterval(interval);
  }, [isCharging, setBattery, addLog]);

  // Keyboard Input Capture listener
  useEffect(() => {
    if (!isKeyboardCaptured || !isRemoteAuthorized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser shortcuts when capturing
      if (e.key === "Tab" || e.key === "Escape" || e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
      }

      // Handle Backspace
      if (e.key === "Backspace") {
        setTypedBuffer((prev) => prev.slice(0, -1));
        setLastTypedKey("BACKSPACE");
        runAdbCommand("input keyevent 67", "Inject KEYCODE_DEL (Backspace)");
        return;
      }

      // Handle Enter
      if (e.key === "Enter") {
        setLastTypedKey("ENTER");
        runAdbCommand("input keyevent 66", "Inject KEYCODE_ENTER (Enter)");
        addLog(`[REMOTE CONTROL] Submitted keyboard buffer: "${typedBuffer}"`);
        setTypedBuffer("");
        return;
      }

      // Capture single alphanumeric characters & spaces
      if (e.key.length === 1) {
        const char = e.key;
        setLastTypedKey(char);
        setTypedBuffer((prev) => prev + char);
        
        let adbText = char;
        if (char === " ") adbText = "%s"; 
        
        runAdbCommand(`input text "${adbText}"`, `Inject Character Key '${char}'`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isKeyboardCaptured, isRemoteAuthorized, typedBuffer]);

  // Simulate remote mirror network latency fluctuations
  useEffect(() => {
    if (!isMirroringActive) return;
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2; 
      setMirrorLatency((prev) => Math.max(8, Math.min(35, prev + delta)));
      
      const bDelta = (Math.random() * 0.4) - 0.2;
      setMirrorBitrate((prev) => Math.max(1.1, Math.min(4.8, Number((prev + bDelta).toFixed(2)))));
    }, 4000);
    return () => clearInterval(interval);
  }, [isMirroringActive]);

  // CPU Fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates slightly based on how many tasks/rules are active
      const activeCount = scripts.filter((s) => s.status === "Active").length;
      const activeRulesCount = automationRules.filter((r) => r.enabled).length;
      const baseLoad = 12 + activeCount * 10 + activeRulesCount * 5;
      const noise = Math.floor(Math.random() * 12) - 6;
      setCpuLoad(Math.max(5, Math.min(99, baseLoad + noise)));

      const baseRam = 2.8 + activeCount * 0.7 + activeRulesCount * 0.3;
      const ramNoise = parseFloat((Math.random() * 0.3 - 0.15).toFixed(1));
      setRamUsed(Math.max(1.8, Math.min(7.9, baseRam + ramNoise)));
    }, 4000);
    return () => clearInterval(interval);
  }, [scripts, automationRules]);

  // Helper helper to run a shell command and add beautiful log entries
  const runAdbCommand = (cmd: string, logDesc: string) => {
    addLog(`[MANUAL TRIGGER] ${logDesc}`);
    addLog(`[ADB EXECUTE] adb shell ${cmd}`);
    if (executeShellCommand) {
      executeShellCommand(cmd);
    }
  };

  // Handle Quick Trigger Functionalities
  const triggerVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal === 0) {
      setIsMuted(true);
      runAdbCommand("cmd sound_trigger set-mute 1", "Mute sound output");
    } else {
      setIsMuted(false);
      runAdbCommand(`media volume --set ${newVal}`, `Configure volume level to ${newVal}%`);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      runAdbCommand("cmd sound_trigger set-mute 1", "Mute sound output");
    } else {
      runAdbCommand(`media volume --set ${volume}`, `Restore sound volume to ${volume}%`);
    }
  };

  const triggerBrightnessChange = (newVal: number) => {
    setBrightness(newVal);
    const systemVal = Math.round((newVal / 100) * 255);
    runAdbCommand(`settings put system screen_brightness ${systemVal}`, `Adjust screen brightness parameter to ${systemVal}`);
  };

  const handleDeviceAction = (action: string) => {
    if (action === "Screenshot") {
      addLog(`[MANUAL TRIGGER] Take device Screenshot`);
      addLog(`[ADB EXECUTE] adb shell screencap -p /sdcard/screenshot.png`);
      addLog(`[ADB EXECUTE] adb pull /sdcard/screenshot.png ./output/`);
      if (executeShellCommand) {
        executeShellCommand("screencap -p /sdcard/screenshot.png");
      }
      addLog("[DASHBOARD] Screenshot downloaded to system context pipeline.");
    } else if (action === "Lock/Unlock") {
      const nextLocked = !isLocked;
      setIsLocked(nextLocked);
      runAdbCommand("input keyevent 26", nextLocked ? "Send Power lock sequence" : "Send Power unlock sequence");
    } else if (action === "Haptic Buzz") {
      runAdbCommand("cmd vibrator vibrate 500", "Vibrate phone for 500ms");
    } else if (action === "Launch Camera") {
      runAdbCommand("am start -a android.media.action.IMAGE_CAPTURE", "Start Camera application intent");
    } else if (action === "Return Home") {
      runAdbCommand("input keyevent 3", "Simulate HOME button touch");
    } else if (action === "Back Key") {
      runAdbCommand("input keyevent 4", "Simulate BACK button touch");
    } else if (action === "App Switcher") {
      runAdbCommand("input keyevent 187", "Simulate APP SWITCHER button touch");
    }
  };

  const handleExecuteShell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customShellCmd.trim()) return;
    const cleanCmd = customShellCmd.trim().replace(/^adb\s+shell\s+/, "").replace(/^adb\s+/, "");
    
    addLog(`$ adb shell ${cleanCmd}`);
    if (executeShellCommand) {
      executeShellCommand(cleanCmd);
    }

    // Interactive console simulations
    setTimeout(() => {
      if (cleanCmd.includes("getprop")) {
        addLog(`[OUTPUT] [ro.product.model]: [${activeDevice.name.split(" ")[0]}]`);
        addLog(`[OUTPUT] [ro.build.version.release]: [14]`);
        addLog(`[OUTPUT] [ro.hardware]: [tensor]`);
      } else if (cleanCmd.includes("dumpsys battery")) {
        addLog(`[OUTPUT] Battery service state:`);
        addLog(`[OUTPUT]   AC powered: ${isCharging ? "true" : "false"}`);
        addLog(`[OUTPUT]   USB powered: ${isCharging ? "true" : "false"}`);
        addLog(`[OUTPUT]   level: ${Math.round(battery)}`);
        addLog(`[OUTPUT]   status: ${isCharging ? "2 (Charging)" : "3 (Discharging)"}`);
        addLog(`[OUTPUT]   health: 2 (Good)`);
      } else if (cleanCmd.includes("pm list packages")) {
        addLog("[OUTPUT] package:com.android.chrome");
        addLog("[OUTPUT] package:com.spotify.music");
        addLog("[OUTPUT] package:com.android.settings");
        addLog("[OUTPUT] package:com.google.android.youtube");
        addLog("[OUTPUT] package:com.google.android.apps.photos");
      } else if (cleanCmd.includes("svc wifi")) {
        addLog(`[OUTPUT] wifi status query acknowledged.`);
      } else {
        addLog(`[OUTPUT] Command sequence processed successfully on device root context.`);
      }
    }, 600);
    setCustomShellCmd("");
  };

  // Enable/Disable script status
  const toggleScriptStatus = (id: number) => {
    const updated = scripts.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === "Active" ? "Idle" : "Active";
        addLog(`[DASHBOARD] Script ${s.name} set to: ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setScripts(updated);
  };

  // Add script
  const handleAddScriptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newScript: Script = {
      id: Date.now(),
      name: newName.trim(),
      status: "Idle",
      type: newType,
    };
    setScripts([...scripts, newScript]);
    addLog(`[DASHBOARD] Loaded ADB workflow automation script: ${newScript.name}`);
    setNewName("");
    setIsAddingScript(false);
  };

  // Edit script
  const startEditing = (script: Script) => {
    setEditingScriptId(script.id);
    setEditName(script.name);
    setEditType(script.type);
  };

  const saveEdit = (id: number) => {
    if (!editName.trim()) return;
    const updated = scripts.map((s) => {
      if (s.id === id) {
        addLog(`[DASHBOARD] Configured Script: ${editName}`);
        return { ...s, name: editName, type: editType };
      }
      return s;
    });
    setScripts(updated);
    setEditingScriptId(null);
  };

  // Delete script
  const deleteScript = (id: number) => {
    const target = scripts.find((s) => s.id === id);
    if (target) {
      addLog(`[DASHBOARD] Deleted Script: ${target.name}`);
    }
    setScripts(scripts.filter((s) => s.id !== id));
  };

  // Custom Automation Rules trigger engine simulation
  const simulateRuleTrigger = (rule: AutomationRule) => {
    if (!rule.enabled) {
      addLog(`[AUTOMATION] Cannot simulate disabled rule "${rule.name}"`);
      return;
    }
    addLog(`[AUTOMATION] ⚡ Simulated Event Condition Met: "${rule.name}"`);
    addLog(`[AUTOMATION] Trigger matched: [${rule.triggerType}] = "${rule.triggerValue}"`);

    let shellCmd = "";
    let logDesc = "";

    if (rule.actionType === "wifi") {
      const isEnabling = rule.actionValue.toUpperCase() === "ON";
      shellCmd = isEnabling ? "svc wifi enable" : "svc wifi disable";
      logDesc = `Auto-configure Wi-Fi to ${rule.actionValue}`;
      setNetworkType(isEnabling ? "Wi-Fi 6E" : "Airplane Mode");
    } else if (rule.actionType === "volume") {
      const isSilent = rule.actionValue === "0";
      shellCmd = isSilent ? "cmd sound_trigger set-mute 1" : `media volume --set ${rule.actionValue}`;
      logDesc = `Auto-set Volume level to ${rule.actionValue}%`;
      setIsMuted(isSilent);
      if (!isSilent) setVolume(Number(rule.actionValue) || 50);
    } else if (rule.actionType === "app") {
      shellCmd = `monkey -p ${rule.actionValue} -c android.intent.category.LAUNCHER 1`;
      logDesc = `Auto-launch App package: ${rule.actionValue}`;
    } else if (rule.actionType === "vibrate") {
      shellCmd = "cmd vibrator vibrate 300";
      logDesc = "Auto-buzz system vibrator";
    } else if (rule.actionType === "brightness") {
      const bPct = Number(rule.actionValue.replace("%", "")) || 60;
      shellCmd = `settings put system screen_brightness ${Math.round((bPct / 100) * 255)}`;
      logDesc = `Auto-adjust screen brightness panel to ${bPct}%`;
      setBrightness(bPct);
    }

    addLog(`[AUTOMATION] Executing Trigger action: ${logDesc}`);
    addLog(`[ADB EXECUTE] adb shell ${shellCmd}`);
    if (executeShellCommand) {
      executeShellCommand(shellCmd);
    }
  };

  // Add rule submit
  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleTriggerValue.trim() || !ruleActionValue.trim()) return;

    const newRule: AutomationRule = {
      id: "rule_" + Date.now(),
      name: ruleName.trim(),
      triggerType: ruleTriggerType,
      triggerValue: ruleTriggerValue.trim(),
      actionType: ruleActionType,
      actionValue: ruleActionValue.trim(),
      enabled: true,
    };

    setAutomationRules([...automationRules, newRule]);
    addLog(`[AUTOMATION] Successfully built automated trigger rule: "${newRule.name}"`);
    
    // reset form
    setRuleName("");
    setRuleTriggerValue("");
    setRuleActionValue("");
    setIsAddingRule(false);
  };

  // Toggle Automation Rule Enabled
  const toggleRuleEnabled = (id: string) => {
    const updated = automationRules.map((rule) => {
      if (rule.id === id) {
        const nextVal = !rule.enabled;
        addLog(`[AUTOMATION] Rule "${rule.name}" is now ${nextVal ? "ENABLED" : "DISABLED"}`);
        return { ...rule, enabled: nextVal };
      }
      return rule;
    });
    setAutomationRules(updated);
  };

  // Delete Automation Rule
  const deleteRule = (id: string) => {
    const target = automationRules.find((r) => r.id === id);
    if (target) {
      addLog(`[AUTOMATION] Deleted automated trigger rule: "${target.name}"`);
    }
    setAutomationRules(automationRules.filter((r) => r.id !== id));
  };

  // Start Editing Automation Rule
  const startEditingRule = (rule: AutomationRule) => {
    setEditingRuleId(rule.id);
    setEditRuleName(rule.name);
    setEditRuleTriggerType(rule.triggerType);
    setEditRuleTriggerValue(rule.triggerValue);
    setEditRuleActionType(rule.actionType);
    setEditRuleActionValue(rule.actionValue);
  };

  // Save Edited Rule
  const saveRuleEdit = (id: string) => {
    if (!editRuleName.trim() || !editRuleTriggerValue.trim() || !editRuleActionValue.trim()) return;
    const updated = automationRules.map((rule) => {
      if (rule.id === id) {
        addLog(`[AUTOMATION] Saved changes to rule "${editRuleName}"`);
        return {
          ...rule,
          name: editRuleName.trim(),
          triggerType: editRuleTriggerType,
          triggerValue: editRuleTriggerValue.trim(),
          actionType: editRuleActionType,
          actionValue: editRuleActionValue.trim(),
        };
      }
      return rule;
    });
    setAutomationRules(updated);
    setEditingRuleId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="phone-dashboard-root">
      {/* 1. Phone Status Module */}
      <div className="md:col-span-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Smartphone className="w-24 h-24 text-indigo-400" />
        </div>

        <div className="flex justify-between items-center relative z-10">
          <h3 className="text-sm font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Device Controller & Status
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold tracking-widest uppercase animate-pulse">
            {activeDevice.status}
          </span>
        </div>

        <div className="text-xs text-zinc-400 border-b border-zinc-800/80 pb-3 font-mono flex flex-col gap-0.5">
          <span className="text-zinc-500">Connected Target Model</span>
          <span className="text-sm font-semibold text-zinc-200">{activeDevice.name}</span>
        </div>

        {/* Status Grid indicators */}
        <div className="grid grid-cols-2 gap-4 my-1">
          {/* Battery Status card */}
          <div className="bg-black/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-mono">BATTERY</span>
              <button
                onClick={() => {
                  setIsCharging(!isCharging);
                  addLog(isCharging ? "[DASHBOARD] Unplugged power cable." : "[DASHBOARD] Power adapter connected (USB Charging).");
                }}
                className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors font-mono uppercase font-semibold ${isCharging ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200"}`}
              >
                {isCharging ? "charging" : "plug-in"}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isCharging ? (
                <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className={`w-5 h-5 ${battery < 20 ? "text-red-400 animate-bounce" : "text-zinc-300"}`} />
              )}
              <span className={`text-xl font-bold tracking-tight font-mono ${battery < 20 ? "text-red-400" : "text-zinc-100"}`}>
                {Math.round(battery)}%
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isCharging ? "bg-emerald-400" : battery < 20 ? "bg-red-500" : "bg-indigo-500"}`}
                style={{ width: `${battery}%` }}
              />
            </div>
          </div>

          {/* Network Connection Status card */}
          <div className="bg-black/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-mono">NETWORK</span>
              <select
                value={networkType}
                onChange={(e) => {
                  setNetworkType(e.target.value);
                  addLog(`[DASHBOARD] Radio switched to: ${e.target.value}`);
                }}
                className="bg-transparent text-zinc-400 text-[10px] font-mono border-none focus:ring-0 p-0 text-right cursor-pointer hover:text-zinc-200"
              >
                <option value="Wi-Fi 6E" className="bg-zinc-900">Wi-Fi 6E</option>
                <option value="5G LTE" className="bg-zinc-900">5G LTE</option>
                <option value="Roaming" className="bg-zinc-900">Roaming</option>
                <option value="Airplane Mode" className="bg-zinc-900">Offline</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {networkType === "Airplane Mode" ? (
                <WifiOff className="w-5 h-5 text-zinc-500" />
              ) : (
                <Wifi className="w-5 h-5 text-indigo-400" />
              )}
              <span className="text-sm font-bold tracking-tight font-mono text-zinc-100 truncate">
                {networkType}
              </span>
            </div>
            {/* Wireless Signal bars */}
            <div className="flex gap-0.5 mt-3 justify-end">
              {[1, 2, 3, 4].map((bar) => (
                <button
                  key={bar}
                  onClick={() => {
                    if (networkType !== "Airplane Mode") {
                      setWifiStrength(bar);
                      addLog(`[DASHBOARD] Network signal calibrated to ${bar}/4 bars.`);
                    }
                  }}
                  className={`w-2.5 rounded-t-sm transition-colors ${
                    networkType === "Airplane Mode"
                      ? "bg-zinc-800"
                      : wifiStrength >= bar
                      ? "bg-indigo-400 hover:bg-indigo-300"
                      : "bg-zinc-800"
                  }`}
                  style={{ height: `${bar * 4}px` }}
                  title={`Signal strength: ${bar}/4`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic usage details */}
        <div className="grid grid-cols-2 gap-4 mt-1">
          {/* CPU Performance card */}
          <div className="bg-black/30 border border-zinc-800/60 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              CPU USAGE
            </span>
            <div className="text-xl font-bold font-mono text-zinc-100 mt-1">{cpuLoad}%</div>
            <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${cpuLoad}%` }}
              />
            </div>
          </div>

          {/* RAM memory usage card */}
          <div className="bg-black/30 border border-zinc-800/60 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-zinc-500" />
              RAM SYSTEM
            </span>
            <div className="text-sm font-bold font-mono text-zinc-100 mt-1">
              {ramUsed.toFixed(1)} GB <span className="text-zinc-500 font-normal text-xs">/ 8.0 GB</span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-400 h-full transition-all duration-300"
                style={{ width: `${(ramUsed / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            addLog("[DASHBOARD] Clean sweep initiated! Cleared cached app memory & boosted processor states.");
            setCpuLoad(15);
            setRamUsed(2.4);
            if (executeShellCommand) {
              executeShellCommand("am kill-all");
            }
          }}
          className="text-xs bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Background Context & Boost RAM
        </button>

        {/* Analog Sliders for Brightness / Volume */}
        <div className="flex flex-col gap-3 mt-1 bg-black/40 border border-zinc-800/80 p-3.5 rounded-lg">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Brightness
              </span>
              <span>{brightness}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={brightness}
              onChange={(e) => triggerBrightnessChange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <button
                onClick={toggleMute}
                className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>Sound Level</span>
              </button>
              <span>{isMuted ? "MUTED" : `${volume}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              disabled={isMuted}
              value={isMuted ? 0 : volume}
              onChange={(e) => triggerVolumeChange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* 2. Automated Tasks Module with triple tabs (Automation Scripts, Rule Builder, and Remote Control) */}
      <div className="md:col-span-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-850 pb-2 gap-2">
          {/* Triple Tab Controller */}
          <div className="flex bg-black/40 border border-zinc-800 p-1 rounded-lg flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("rules")}
              className={`text-[11px] px-2.5 py-1.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
                activeTab === "rules"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Rules
            </button>
            <button
              onClick={() => setActiveTab("scripts")}
              className={`text-[11px] px-2.5 py-1.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
                activeTab === "scripts"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Scripts
            </button>
            <button
              onClick={() => setActiveTab("remote")}
              className={`text-[11px] px-2.5 py-1.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
                activeTab === "remote"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              Remote
            </button>
          </div>

          {activeTab !== "remote" ? (
            <button
              onClick={() => {
                if (activeTab === "rules") {
                  setIsAddingRule(!isAddingRule);
                  setIsAddingScript(false);
                } else {
                  setIsAddingScript(!isAddingScript);
                  setIsAddingRule(false);
                }
              }}
              className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {activeTab === "rules" ? "Add Rule" : "Upload Script"}
            </button>
          ) : (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-mono font-bold tracking-widest uppercase">
              Encrypted Session
            </span>
          )}
        </div>

        {/* 2A. Rules Tab content */}
        {activeTab === "rules" && (
          <div className="flex flex-col gap-4 flex-1">
            {/* Form Dialog for building Custom Rules */}
            <AnimatePresence>
              {isAddingRule && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddRuleSubmit}
                  className="bg-black/60 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-3 overflow-hidden"
                >
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Build Custom Trigger-Action Rule
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Rule Title */}
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide block mb-1">Rule Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Mute in Meeting"
                        required
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Trigger configuration */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide block mb-1">Trigger Condition</label>
                        <select
                          value={ruleTriggerType}
                          onChange={(e) => {
                            const val = e.target.value as "time" | "location" | "app";
                            setRuleTriggerType(val);
                            setRuleTriggerValue("");
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="time">Time of Day</option>
                          <option value="location">Arrive at Location</option>
                          <option value="app">Opening specific App</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide block mb-1">Trigger Value</label>
                        {ruleTriggerType === "time" ? (
                          <input
                            type="time"
                            required
                            value={ruleTriggerValue}
                            onChange={(e) => setRuleTriggerValue(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 [color-scheme:dark] focus:outline-none focus:border-indigo-500"
                          />
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder={ruleTriggerType === "location" ? "e.g. Office, Gym, Home" : "e.g. com.android.chrome"}
                            value={ruleTriggerValue}
                            onChange={(e) => setRuleTriggerValue(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                          />
                        )}
                      </div>
                    </div>

                    {/* Action configuration */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide block mb-1">Action to Trigger</label>
                        <select
                          value={ruleActionType}
                          onChange={(e) => {
                            const val = e.target.value as "wifi" | "volume" | "app" | "vibrate" | "brightness";
                            setRuleActionType(val);
                            setRuleActionValue(val === "wifi" ? "ON" : val === "vibrate" ? "Vibrate" : "");
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="wifi">Toggle Wi-Fi</option>
                          <option value="volume">Set Volume Level</option>
                          <option value="app">Launch App package</option>
                          <option value="brightness">Configure Brightness</option>
                          <option value="vibrate">Trigger Vibration</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide block mb-1">Action Value</label>
                        {ruleActionType === "wifi" ? (
                          <select
                            value={ruleActionValue}
                            onChange={(e) => setRuleActionValue(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="ON">Turn Wi-Fi ON</option>
                            <option value="OFF">Turn Wi-Fi OFF</option>
                          </select>
                        ) : ruleActionType === "volume" ? (
                          <select
                            value={ruleActionValue}
                            onChange={(e) => setRuleActionValue(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="0">Silent / Muted</option>
                            <option value="30">Low (30%)</option>
                            <option value="60">Medium (60%)</option>
                            <option value="100">Loud (100%)</option>
                          </select>
                        ) : ruleActionType === "vibrate" ? (
                          <input
                            type="text"
                            disabled
                            value="Vibrate 300ms"
                            className="w-full bg-zinc-950/40 border border-zinc-850 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 focus:outline-none cursor-not-allowed"
                          />
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder={ruleActionType === "app" ? "e.g. com.android.chrome" : "e.g. 50%"}
                            value={ruleActionValue}
                            onChange={(e) => setRuleActionValue(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-emerald-500 text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors"
                      >
                        Create Rule
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingRule(false)}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Custom Rules */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {automationRules.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-lg font-mono">
                  No automated rules configured. Click "Add Rule" to configure one!
                </div>
              ) : (
                automationRules.map((rule) => {
                  const isEditingRule = editingRuleId === rule.id;

                  return (
                    <div
                      key={rule.id}
                      className={`p-3.5 bg-black/40 border rounded-lg transition-all flex flex-col gap-3 group relative ${
                        rule.enabled ? "border-indigo-500/25 bg-indigo-500/5" : "border-zinc-800 opacity-60"
                      }`}
                    >
                      {isEditingRule ? (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editRuleName}
                              onChange={(e) => setEditRuleName(e.target.value)}
                              placeholder="Rule name"
                              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100"
                            />
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => saveRuleEdit(rule.id)}
                                className="p-1 text-emerald-400 hover:text-emerald-300 bg-zinc-800 rounded border border-zinc-700"
                                title="Save rule config"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingRuleId(null)}
                                className="p-1 text-red-400 hover:text-red-300 bg-zinc-800 rounded border border-zinc-700"
                                title="Cancel editing"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500 uppercase font-bold">Trigger</span>
                              <input
                                type="text"
                                value={editRuleTriggerValue}
                                onChange={(e) => setEditRuleTriggerValue(e.target.value)}
                                className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500 uppercase font-bold">Action Target</span>
                              <input
                                type="text"
                                value={editRuleActionValue}
                                onChange={(e) => setEditRuleActionValue(e.target.value)}
                                className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-zinc-500 mt-0.5">
                              {rule.triggerType === "time" && <Clock className="w-4 h-4 text-emerald-400" />}
                              {rule.triggerType === "location" && <MapPin className="w-4 h-4 text-pink-400" />}
                              {rule.triggerType === "app" && <AppWindow className="w-4 h-4 text-sky-400" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-100 font-mono tracking-wide flex items-center gap-2">
                                {rule.name}
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-normal uppercase ${rule.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                                  {rule.enabled ? "Enabled" : "Disabled"}
                                </span>
                              </div>

                              <div className="text-[10px] text-zinc-400 font-mono mt-1 flex flex-col gap-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-zinc-500 font-semibold uppercase text-[8px]">WHEN:</span>
                                  <span className="text-zinc-300">
                                    {rule.triggerType === "time" ? "Clock reaches " : rule.triggerType === "location" ? "Arrives at " : "Launch application "}
                                    <strong className="text-indigo-300 font-medium font-sans">"{rule.triggerValue}"</strong>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-zinc-500 font-semibold uppercase text-[8px]">THEN:</span>
                                  <span className="text-zinc-300">
                                    {rule.actionType === "wifi" ? `Power Wi-Fi ${rule.actionValue}` : rule.actionType === "volume" ? `Calibrate audio volume to ${rule.actionValue === "0" ? "Silent" : rule.actionValue + "%"}` : rule.actionType === "app" ? `Initiate package "${rule.actionValue}"` : rule.actionType === "vibrate" ? `Vibrate phone context` : `Set screen brightness to ${rule.actionValue}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Run Trigger Simulator Button */}
                            <button
                              onClick={() => simulateRuleTrigger(rule)}
                              disabled={!rule.enabled}
                              className={`p-1.5 rounded transition-all flex items-center justify-center border ${
                                rule.enabled
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-600 cursor-not-allowed"
                              }`}
                              title="Force trigger simulation (Test run ADB Shell actions)"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>

                            {/* Enable / Disable rule toggle button */}
                            <button
                              onClick={() => toggleRuleEnabled(rule.id)}
                              className="text-zinc-400 hover:text-white p-1 transition-colors"
                              title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                            >
                              {rule.enabled ? (
                                <ToggleRight className="w-6 h-6 text-emerald-400" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-zinc-500" />
                              )}
                            </button>

                            <button
                              onClick={() => startEditingRule(rule)}
                              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded hover:bg-zinc-850 transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit trigger-action config"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteRule(rule.id)}
                              className="text-red-500/70 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove automated task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 2B. Scripts Tab Content */}
        {activeTab === "scripts" && (
          <div className="flex flex-col gap-4 flex-1">
            {/* Optional Add Script Dialog */}
            <AnimatePresence>
              {isAddingScript && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddScriptSubmit}
                  className="bg-black/50 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-3 overflow-hidden"
                >
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
                    Add New Automated Task Node
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Task Name (e.g. Ad Clicker)"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="zap">Trigger (Zap)</option>
                        <option value="download">Download Task</option>
                        <option value="shield">Security Test</option>
                      </select>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="submit"
                        className="bg-emerald-500 text-black px-3 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingScript(false)}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-lg text-xs font-bold hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Task listings list */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {scripts.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-lg font-mono">
                  No tasks currently configured.
                </div>
              ) : (
                scripts.map((script) => {
                  const isEditing = editingScriptId === script.id;
                  const isActive = script.status === "Active";

                  return (
                    <div
                      key={script.id}
                      className={`p-3.5 bg-black/40 border rounded-lg transition-all flex flex-col gap-3 group relative ${
                        isActive ? "border-indigo-500/30 bg-indigo-500/5" : "border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {isEditing ? (
                          <div className="flex flex-1 gap-2 mr-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100"
                            />
                            <select
                              value={editType}
                              onChange={(e) => setEditType(e.target.value)}
                              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300"
                            >
                              <option value="zap">Zap</option>
                              <option value="download">Download</option>
                              <option value="shield">Shield</option>
                            </select>
                            <button
                              onClick={() => saveEdit(script.id)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 bg-zinc-800 rounded border border-zinc-700"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingScriptId(null)}
                              className="p-1 text-red-400 hover:text-red-300 bg-zinc-800 rounded border border-zinc-700"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-zinc-500">
                              {script.type === "download" && <Download className="w-4 h-4 text-blue-400" />}
                              {script.type === "shield" && <Shield className="w-4 h-4 text-red-400" />}
                              {script.type === "zap" && <Zap className="w-4 h-4 text-amber-400" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-200 font-mono tracking-wide">
                                {script.name}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                                  }`}
                                />
                                <span
                                  className={`text-[9px] uppercase font-bold tracking-widest ${
                                    isActive ? "text-emerald-400" : "text-zinc-500"
                                  }`}
                                >
                                  {script.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-2">
                            {/* Slide Toggle for Enable/Disable */}
                            <button
                              onClick={() => toggleScriptStatus(script.id)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 ${
                                isActive ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-zinc-800 border border-zinc-700"
                              }`}
                              title={isActive ? "Disable task" : "Enable task"}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full transition-transform duration-250 ${
                                  isActive ? "bg-emerald-400 translate-x-4" : "bg-zinc-500 translate-x-0"
                                }`}
                              />
                            </button>

                            <button
                              onClick={() => startEditing(script)}
                              className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-850 transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit task name"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteScript(script.id)}
                              className="text-red-500/70 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 2C. Remote Control & Mirroring Tab Content */}
        {activeTab === "remote" && (
          <div className="flex flex-col gap-5 flex-1">
            {/* Mirror Stream Status Header */}
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold flex items-center gap-1.5 uppercase">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Live Mirror Feed
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isMirroringActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                  {isMirroringActive ? "STREAMING" : "STREAM OFFLINE"}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-2 mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">Latency</span>
                  <span className="text-zinc-300 font-bold">{isMirroringActive ? `${mirrorLatency} ms` : "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">FPS Limit</span>
                  <span className="text-zinc-300 font-bold">{isMirroringActive ? `${mirrorFps} FPS` : "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">Bitrate</span>
                  <span className="text-zinc-300 font-bold">{isMirroringActive ? `${mirrorBitrate} Mbps` : "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">Tunnel</span>
                  <span className="text-emerald-400 font-bold">{isMirroringActive ? encryptionLevel : "N/A"}</span>
                </div>
              </div>

              {/* Live Streaming Controls */}
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60">
                <button
                  onClick={() => {
                    setIsMirroringActive(!isMirroringActive);
                    addLog(isMirroringActive ? "[REMOTE] Stopped screen mirroring stream." : "[REMOTE] Established secure mirroring connection over WebSocket tunnel.");
                    const logMsg = isMirroringActive ? "Screen mirroring stream disabled by operator." : "Secure screen mirroring stream started.";
                    setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] ${logMsg}`, ...prev]);
                  }}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 uppercase ${
                    isMirroringActive 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {isMirroringActive ? "Stop Stream" : "Start Stream"}
                </button>
                
                {isMirroringActive && (
                  <>
                    <select
                      value={mirrorFps}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMirrorFps(val);
                        addLog(`[REMOTE] Adjusted screen mirror stream rate to ${val} FPS.`);
                      }}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 font-mono"
                    >
                      <option value={15}>15 FPS</option>
                      <option value={30}>30 FPS</option>
                      <option value={60}>60 FPS (Ultra)</option>
                    </select>

                    <div className="flex items-center gap-1.5 ml-auto text-[10px] text-zinc-400">
                      <span>Quality:</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={mirrorQuality}
                        onChange={(e) => setMirrorQuality(Number(e.target.value))}
                        className="w-16 h-1 bg-zinc-800 rounded accent-emerald-500 cursor-pointer"
                        title={`Stream Compression Quality: ${mirrorQuality}%`}
                      />
                      <span>{mirrorQuality}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mirror Stream Screen Interactive Window */}
            <div className="relative border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden p-6 flex flex-col items-center justify-center min-h-[380px] shadow-2xl group/screen">
              {!isRemoteAuthorized ? (
                <div className="flex flex-col items-center justify-center p-6 text-center max-w-xs gap-3">
                  <Lock className="w-10 h-10 text-amber-500 animate-bounce" />
                  <h4 className="text-sm font-bold text-zinc-200">Device Handshake Required</h4>
                  <p className="text-xs text-zinc-500 font-mono">Enter the 6-digit Remote Authorization PIN that is shown on the target phone.</p>
                  <div className="flex gap-2 w-full mt-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="ENTER PIN"
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                      className="bg-black border border-zinc-800 text-emerald-400 text-center font-mono text-sm tracking-widest p-2 rounded-lg flex-1 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => {
                        if (enteredPin === remotePin) {
                          setIsRemoteAuthorized(true);
                          addLog("[REMOTE] Device authorization handshake successful.");
                          setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Handshake success. Operator authorized.`, ...prev]);
                        } else {
                          addLog("error: Incorrect security PIN entered for remote mirror.");
                          setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Security Warning: Unauthorized PIN attempt.`, ...prev]);
                        }
                      }}
                      className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-xs font-bold font-mono hover:bg-emerald-400"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : !isMirroringActive ? (
                <div className="flex flex-col items-center justify-center p-6 text-center gap-2">
                  <Smartphone className="w-12 h-12 text-zinc-700 mb-2 animate-pulse" />
                  <p className="text-xs text-zinc-400 font-mono">Stream Offline</p>
                  <button
                    onClick={() => {
                      setIsMirroringActive(true);
                      addLog("[REMOTE] Started screen mirroring stream.");
                    }}
                    className="mt-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 px-4 py-2 rounded-lg text-xs font-bold text-zinc-300"
                  >
                    Establish Secure Tunnel
                  </button>
                </div>
              ) : (
                <div className="relative w-full flex flex-col items-center select-none">
                  {/* Phone Screen Canvas Frame */}
                  <div
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const clickY = e.clientY - rect.top;
                      const pctX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                      const pctY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));
                      
                      // map to standard 1080x2400
                      const mappedX = Math.round((pctX / 100) * 1080);
                      const mappedY = Math.round((pctY / 100) * 2400);
                      setHoverCoord({ x: mappedX, y: mappedY });
                    }}
                    onMouseLeave={() => setHoverCoord(null)}
                    onMouseDown={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const clickY = e.clientY - rect.top;
                      const pctX = (clickX / rect.width) * 100;
                      const pctY = (clickY / rect.height) * 100;
                      setDragStart({ x: Math.round((pctX / 100) * 1080), y: Math.round((pctY / 100) * 2400) });
                    }}
                    onMouseUp={(e) => {
                      if (!allowTouch) {
                        addLog("[SECURITY] Touch injection is disabled in remote permissions.");
                        setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Warning: Blocked touch injection (permission restricted).`, ...prev]);
                        setDragStart(null);
                        return;
                      }

                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const clickY = e.clientY - rect.top;
                      const pctX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                      const pctY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));
                      
                      const mappedX = Math.round((pctX / 100) * 1080);
                      const mappedY = Math.round((pctY / 100) * 2400);

                      if (dragStart) {
                        const dist = Math.sqrt(Math.pow(mappedX - dragStart.x, 2) + Math.pow(mappedY - dragStart.y, 2));
                        if (dist > 120) {
                          // Trigger Swipe ADB
                          addLog(`[REMOTE] Swiped from (X: ${dragStart.x}, Y: ${dragStart.y}) to (X: ${mappedX}, Y: ${mappedY})`);
                          runAdbCommand(`input swipe ${dragStart.x} ${dragStart.y} ${mappedX} ${mappedY} 350`, `Inject Swipe gesture from (${dragStart.x},${dragStart.y}) to (${mappedX},${mappedY})`);
                          setDragStart(null);
                          return;
                        }
                      }

                      // Trigger Tap ADB
                      const newClickId = Date.now();
                      setRemoteClicks(prev => [...prev, { id: newClickId, x: pctX, y: pctY }]);
                      setTimeout(() => {
                        setRemoteClicks(prev => prev.filter(c => c.id !== newClickId));
                      }, 800);

                      addLog(`[REMOTE CONTROL] Mouse CLICK coordinate resolved: (X: ${mappedX}px, Y: ${mappedY}px) [${Math.round(pctX)}%, ${Math.round(pctY)}%]`);
                      runAdbCommand(`input tap ${mappedX} ${mappedY}`, `Inject Touch tap coordinate at (${mappedX}, ${mappedY})`);
                      setDragStart(null);
                    }}
                    className="relative w-[240px] h-[440px] bg-zinc-950 border-[6px] border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col cursor-crosshair hover:border-emerald-500/40 transition-colors"
                  >
                    {/* Simulated OS View */}
                    <div className="h-5 w-full bg-zinc-950 flex items-center justify-between px-3 text-[8px] text-zinc-400 font-mono select-none">
                      <span>10:30 AM</span>
                      <div className="flex items-center gap-[4px]">
                        <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                        <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                        <span>{Math.round(battery)}%</span>
                      </div>
                    </div>

                    {/* Content Viewport */}
                    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black relative flex flex-col p-3 text-zinc-200">
                      {/* Interactive Mirror Feed Placeholder App Content */}
                      <div className="flex-1 flex flex-col justify-between py-2 text-center select-none pointer-events-none">
                        <div className="flex flex-col items-center">
                          <Smartphone className="w-8 h-8 text-emerald-400 mb-1 opacity-70" />
                          <span className="text-[9px] text-emerald-400/80 font-mono tracking-widest font-bold uppercase">Koro ADB Mirror</span>
                          <span className="text-[8px] text-zinc-500 mt-0.5">Control Enabled • Secure AES TLS</span>
                        </div>

                        {/* Interactive UI Nodes Mockup */}
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded p-2 text-left font-mono text-[8px] space-y-1.5 shadow-inner">
                          <div className="flex justify-between border-b border-zinc-800 pb-1">
                            <span className="text-zinc-500">SYSTEM AGENT ACTIVE</span>
                            <span className="text-emerald-400 animate-pulse">● LIVE</span>
                          </div>
                          <div><span className="text-zinc-400">HOST:</span> <span className="text-zinc-300">{activeDevice?.name || "Android Device"}</span></div>
                          <div><span className="text-zinc-400">ACCESSIBILITY:</span> <span className="text-emerald-400">GRANTED</span></div>
                          <div><span className="text-zinc-400">DRAG/SWIPE:</span> <span className="text-zinc-500">Hold & drag mouse</span></div>
                        </div>

                        <div className="text-[7px] text-zinc-600 font-mono uppercase tracking-wider">
                          Click screen to simulate tap<br />
                          Hold & drag mouse to simulate swipe
                        </div>
                      </div>

                      {/* Ripple Clicks Feedbacks */}
                      {remoteClicks.map((click) => (
                        <div
                          key={click.id}
                          className="absolute pointer-events-none w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                          style={{ left: `${click.x}%`, top: `${click.y}%` }}
                        >
                          <div className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                          <motion.div
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 3.5, opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute w-full h-full border-2 border-emerald-400 rounded-full"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Bottom Navigation Pills */}
                    <div className="h-6 w-full bg-zinc-950 flex items-center justify-around px-2 text-[10px] text-zinc-600 shrink-0 select-none">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          runAdbCommand("input keyevent 4", "Inject System Back button");
                        }} 
                        className="hover:text-zinc-300 transition-colors"
                      >
                        ◀
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          runAdbCommand("input keyevent 3", "Inject System Home button");
                        }} 
                        className="w-2.5 h-2.5 rounded-full border border-zinc-600 hover:border-zinc-300 transition-all"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          runAdbCommand("input keyevent 187", "Inject System Apps switcher button");
                        }} 
                        className="w-2 h-2 border border-zinc-600 hover:border-zinc-300 rounded-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Coordinate Overlay HUD */}
                  {hoverCoord && (
                    <div className="absolute bottom-[-15px] bg-zinc-900/95 border border-zinc-800 rounded px-2.5 py-1 text-[9px] font-mono text-emerald-400 shadow-md">
                      MOUSE POS: <span className="font-bold text-zinc-100">X: {hoverCoord.x}px, Y: {hoverCoord.y}px</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Keyboard Control Hub */}
            {isRemoteAuthorized && isMirroringActive && (
              <div className="bg-black/30 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold uppercase">
                    <Keyboard className="w-4 h-4 text-emerald-400" />
                    Keyboard Access Protocol
                  </div>
                  
                  {/* Keyboard Capture Toggle */}
                  <button
                    onClick={() => {
                      const nextCap = !isKeyboardCaptured;
                      setIsKeyboardCaptured(nextCap);
                      addLog(nextCap ? "[REMOTE] Keyboard interceptor enabled. All keystrokes redirected." : "[REMOTE] Keyboard interceptor disabled.");
                      setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Keyboard capture: ${nextCap ? "ENABLED" : "DISABLED"}`, ...prev]);
                    }}
                    className={`text-[9px] font-bold px-3 py-1 rounded transition-all uppercase border ${
                      isKeyboardCaptured 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                    }`}
                  >
                    {isKeyboardCaptured ? "Capture Enabled" : "Enable Capture"}
                  </button>
                </div>

                {isKeyboardCaptured ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 flex flex-col gap-2">
                    <div className="text-[10px] text-emerald-400/80 font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      SYSTEM KEYBOARD HOOKED
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      All physical keyboard inputs will be intercepted and injected directly to your phone via ADB. Click anywhere outside or toggle off to release cursor.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-850">
                        <div className="text-[8px] text-zinc-600 uppercase">Last Key Injected</div>
                        <div className="text-xs text-zinc-200 font-bold mt-0.5">{lastTypedKey || "NONE"}</div>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-850">
                        <div className="text-[8px] text-zinc-600 uppercase">Input Buffer</div>
                        <div className="text-xs text-emerald-400 font-bold truncate mt-0.5">{typedBuffer || "EMPTY"}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-zinc-500 bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
                    Physical computer keyboard inputs are routed locally. Toggle capture mode above to start typing directly into your connected smartphone emulator fields.
                  </div>
                )}

                {/* Virtual Key Buttons Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[8px] text-zinc-600 uppercase tracking-wider font-bold">Quick Injections</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "BACKSPACE", cmd: "input keyevent 67" },
                      { label: "ENTER", cmd: "input keyevent 66" },
                      { label: "SPACE", cmd: "input text %s" },
                      { label: "TAB", cmd: "input keyevent 61" },
                      { label: "VOLUME UP", cmd: "input keyevent 24" },
                      { label: "VOLUME DOWN", cmd: "input keyevent 25" },
                      { label: "BRIGHTNESS UP", cmd: "settings put system screen_brightness 220" },
                      { label: "BRIGHTNESS DOWN", cmd: "settings put system screen_brightness 50" },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!allowKeys) {
                            addLog("[SECURITY] Key injection is disabled in remote permissions.");
                            return;
                          }
                          addLog(`[REMOTE] Injected virtual key event: "${btn.label}"`);
                          runAdbCommand(btn.cmd, `Inject quick virtual key: ${btn.label}`);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[9px] text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded transition-all font-bold"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Parameters & Authentication Panel */}
            <div className="bg-black/30 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-3 font-mono">
              <span className="text-xs text-zinc-300 font-bold flex items-center gap-1.5 uppercase">
                <Shield className="w-4 h-4 text-emerald-500" />
                Remote Security Parameters
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                {/* Authorization token pin change block */}
                <div className="bg-zinc-950 p-3 rounded border border-zinc-850 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1">
                      <Key className="w-3 h-3 text-emerald-400" /> Remote Access PIN
                    </span>
                    <button
                      onClick={() => {
                        const newPin = Math.floor(100000 + Math.random() * 900000).toString();
                        setRemotePin(newPin);
                        addLog(`[SECURITY] Generated new Remote Access PIN: ${newPin}`);
                        setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Regenerated access PIN code: ${newPin}`, ...prev]);
                      }}
                      className="text-[8px] text-indigo-400 hover:text-indigo-300 underline uppercase"
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 tracking-widest bg-black/60 px-3 py-1.5 rounded border border-zinc-900 text-center select-all">
                    {remotePin}
                  </div>
                  <span className="text-[8px] text-zinc-600 leading-normal">
                    This security PIN code is generated dynamically by target device and is required to authorize the computer's connection control.
                  </span>
                </div>

                {/* Secure Tunnel Select block */}
                <div className="bg-zinc-950 p-3 rounded border border-zinc-850 flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1">
                    <Settings className="w-3 h-3 text-emerald-400" /> Encryption Socket
                  </span>
                  <select
                    value={encryptionLevel}
                    onChange={(e) => {
                      setEncryptionLevel(e.target.value);
                      addLog(`[SECURITY] Encryption mode switched to: ${e.target.value}`);
                      setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Socket encryption changed to: ${e.target.value}`, ...prev]);
                    }}
                    className="bg-black border border-zinc-800 rounded p-1.5 text-xs text-zinc-300 font-mono focus:outline-none"
                  >
                    <option value="AES-256-GCM">AES-256-GCM Secure Tunnel</option>
                    <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 RFC7539</option>
                    <option value="SSL/TLS Handshake">SSL/TLS Socket Handshake</option>
                    <option value="Unencrypted Raw">Unencrypted Raw LAN (Fastest)</option>
                  </select>
                  <span className="text-[8px] text-zinc-600 leading-normal">
                    Selects the algorithmic cipher suite to envelope WebRTC visual frames and keystroke command buffers.
                  </span>
                </div>
              </div>

              {/* Checkboxes with custom styling */}
              <div className="bg-zinc-950 p-3 rounded border border-zinc-850 flex flex-col gap-2.5">
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Tunnel Permission Ruleset</span>
                <div className="grid grid-cols-2 gap-2 text-[9px] text-zinc-400">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={allowTouch}
                      onChange={(e) => {
                        setAllowTouch(e.target.checked);
                        addLog(`[SECURITY] Touch coordinates injection set to ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                        setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Permission modified: AllowTouch = ${e.target.checked}`, ...prev]);
                      }}
                      className="rounded bg-black border-zinc-800 text-emerald-500 focus:ring-0"
                    />
                    Allow Touch Simulation
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={allowKeys}
                      onChange={(e) => {
                        setAllowKeys(e.target.checked);
                        addLog(`[SECURITY] Keyboard strokes injection set to ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                        setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Permission modified: AllowKeys = ${e.target.checked}`, ...prev]);
                      }}
                      className="rounded bg-black border-zinc-800 text-emerald-500 focus:ring-0"
                    />
                    Allow Key Simulation
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={allowClipboard}
                      onChange={(e) => {
                        setAllowClipboard(e.target.checked);
                        addLog(`[SECURITY] Bidirectional clipboard synchronization set to ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                      }}
                      className="rounded bg-black border-zinc-800 text-emerald-500 focus:ring-0"
                    />
                    Allow Clipboard Sync
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={allowReboot}
                      onChange={(e) => {
                        setAllowReboot(e.target.checked);
                        addLog(`[SECURITY] ADB Reboot privileges set to ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                      }}
                      className="rounded bg-black border-zinc-800 text-emerald-500 focus:ring-0"
                    />
                    Allow ADB Remote Reboot
                  </label>
                </div>
              </div>

              {/* IP Whitelist constraint */}
              <div className="bg-zinc-950 p-3 rounded border border-zinc-850 flex flex-col gap-1.5">
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Restrict Connection Subnet</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allowedIpRange}
                    onChange={(e) => setAllowedIpRange(e.target.value)}
                    placeholder="e.g. 192.168.1.0/24"
                    className="bg-black border border-zinc-800 text-zinc-300 text-xs p-1.5 rounded-lg flex-1 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      addLog(`[SECURITY] IP constraint rules updated: ${allowedIpRange}`);
                      setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] Subnet rule added: ${allowedIpRange}`, ...prev]);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white px-3 py-1 rounded"
                  >
                    Set Subnet
                  </button>
                </div>
              </div>

              {/* Security Audit Log area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wide">Security Audit Logs (Handshake & Signals)</span>
                <div className="bg-black border border-zinc-900 rounded p-2 h-[90px] overflow-y-auto text-[8.5px] font-mono text-zinc-500 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
                  {securityLogs.map((logItem, index) => (
                    <div key={index} className="leading-relaxed border-b border-zinc-950 pb-0.5 last:border-none">
                      <span className="text-zinc-600 font-normal">{logItem.split(" ")[0]}</span>
                      <span className="text-zinc-400 ml-1">{logItem.substring(logItem.indexOf(" ") + 1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Manual Function Triggers (Control center & Shell execution) */}
      <div className="md:col-span-12 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Manual Action Hub & Shell Injection
          </h3>
          <button
            onClick={() => {
              setIsManualOverride(!isManualOverride);
              addLog(isManualOverride ? "[DASHBOARD] Deactivated adb gamepad input." : "[DASHBOARD] Keypad map activated.");
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all uppercase ${
              isManualOverride
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "bg-zinc-850 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {isManualOverride ? "Override Active" : "Enable Override"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-5">
          <button
            onClick={() => handleDeviceAction("Screenshot")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <Camera className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">SCREENSHOT</span>
          </button>

          <button
            onClick={() => handleDeviceAction("Lock/Unlock")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            {isLocked ? (
              <Unlock className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            ) : (
              <Lock className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">
              {isLocked ? "UNLOCK SCREEN" : "LOCK SCREEN"}
            </span>
          </button>

          <button
            onClick={() => handleDeviceAction("Haptic Buzz")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <BellRing className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">HAPTIC BUZZ</span>
          </button>

          <button
            onClick={() => handleDeviceAction("Launch Camera")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <Camera className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">OPEN CAMERA</span>
          </button>

          <button
            onClick={() => handleDeviceAction("Return Home")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <Smartphone className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">HOME KEY</span>
          </button>

          <button
            onClick={() => handleDeviceAction("Back Key")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <X className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">BACK KEY</span>
          </button>

          <button
            onClick={() => handleDeviceAction("App Switcher")}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <Sliders className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">APP SWITCHER</span>
          </button>

          <button
            onClick={() => {
              addLog("[MANUAL TRIGGER] Sent adb reboot to target hardware.");
              runAdbCommand("reboot", "Send system reboot request");
            }}
            className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-zinc-500 group"
          >
            <RefreshCw className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-300">REBOOT PHONE</span>
          </button>
        </div>

        {/* ADB Shell command injector */}
        <form onSubmit={handleExecuteShell} className="flex gap-2 bg-black/40 border border-zinc-800 p-2.5 rounded-lg">
          <div className="flex items-center text-xs font-mono text-zinc-500 px-3 bg-zinc-950 border border-zinc-800 rounded-md">
            adb shell
          </div>
          <input
            type="text"
            value={customShellCmd}
            onChange={(e) => setCustomShellCmd(e.target.value)}
            placeholder="input keyevent 4 OR getprop ro.product.model OR dumpsys battery"
            className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-700 font-mono text-sm focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-black px-4 py-1.5 rounded-md font-mono text-xs font-bold hover:bg-emerald-400 transition-colors"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}
