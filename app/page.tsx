"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Battery,
  Signal,
  Wifi,
  Activity,
  Terminal as TerminalIcon,
  Play,
  Pause,
  Square,
  Cpu,
  Code,
  Zap,
  Clock,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldAlert,
  MonitorPlay,
  Settings,
  RotateCw,
  Power,
  Camera,
  Maximize,
  X,
  Mic,
  GitMerge,
  BrainCircuit,
  GlobeLock,
  Sparkles,
  Server,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Map,
  Search,
} from "lucide-react";
import PerformanceChart from "../components/PerformanceChart";
import SwarmFleetDashboard from "../components/SwarmFleetDashboard";
import GamepadControl from "../components/GamepadControl";
import AgenticSkillModule from "../components/AgenticSkillModule";
import PhoneDashboardManager from "../components/PhoneDashboardManager";

import LogicTree from "../components/LogicTree";
import WorkflowHistory, {
  WorkflowHistoryEntry,
} from "../components/WorkflowHistory";
import TopNav from "../components/TopNav";
import SecuritySettings from "../components/SecuritySettings";
import ModelSettings from "../components/ModelSettings";
import DeviceConnectionWizard from "../components/DeviceConnectionWizard";
import ClientHunter from "../components/ClientHunter";
import RealTerminal from "../components/RealTerminal";
import { useWebSocket } from "../hooks/useWebSocket";
import UserAuthModal, { UserSession } from "../components/UserAuthModal";
import HumanBehaviorCopilot from "../components/HumanBehaviorCopilot";
import RemoteControlDashboard from "../components/RemoteControlDashboard";

export default function Page() {
  const {
    isConnected,
    latency,
    apiKey,
    saveApiKey,
    hostUrl,
    saveHostUrl,
    sendMessage,
    lastMessage,
  } = useWebSocket("SIMULATE_LOCAL");
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAutonomousActive, setIsAutonomousActive] = useState(false);
  const [isRemoteHandoffActive, setIsRemoteHandoffActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "> Initializing connection to target device...",
    "> Secure channel established over proxy.",
    "> Device identified as: Pixel 8 Pro (Android 14)",
  ]);
  const [battery, setBattery] = useState(87);
  const [isVisionExpanded, setIsVisionExpanded] = useState(false);
  const [visionZoom, setVisionZoom] = useState(1);
  const [visionPan, setVisionPan] = useState({ x: 0, y: 0 });
  const [commandInput, setCommandInput] = useState("");
  const [devices, setDevices] = useState([
    {
      id: "device_pixel_8",
      name: "Pixel 8 Pro (Android 14)",
      status: "connected",
    },
    {
      id: "device_galaxy_s24",
      name: "Galaxy S24 (Android 14)",
      status: "connected",
    },
  ]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("device_pixel_8");
  const [scripts, setScripts] = useState([
    { id: 1, name: "Social Auto-Scout", status: "Idle", type: "download" },
    { id: 2, name: "App Integrity Tester", status: "Idle", type: "shield" },
    { id: 3, name: "Location Spoofer", status: "Active", type: "zap" },
  ]);
  const [scheduledTasks, setScheduledTasks] = useState([
    {
      id: "t1",
      scriptName: "Location Spoofer",
      time: "18:30",
      status: "Pending",
      priority: "Medium",
    },
  ]);
  const [scheduleTaskName, setScheduleTaskName] = useState("Social Auto-Scout");
  const [scheduleTime, setScheduleTime] = useState("");
  const [schedulePriority, setSchedulePriority] = useState<
    "Low" | "Medium" | "High"
  >("Medium");
  const [automationProfiles, setAutomationProfiles] = useState<
    {
      id: string;
      name: string;
      conditionType: "Time" | "Location" | "Wi-Fi";
      conditionValue: string;
      actionScript: string;
      isActive: boolean;
    }[]
  >([
    {
      id: "prof_1",
      name: "Morning Routine",
      conditionType: "Time",
      conditionValue: "07:00",
      actionScript: "Social Auto-Scout",
      isActive: true,
    },
    {
      id: "prof_2",
      name: "Work Safe Mode",
      conditionType: "Wi-Fi",
      conditionValue: "CorpNet-5G",
      actionScript: "App Integrity Tester",
      isActive: false,
    },
  ]);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileConditionType, setNewProfileConditionType] = useState<
    "Time" | "Location" | "Wi-Fi"
  >("Time");
  const [newProfileConditionValue, setNewProfileConditionValue] = useState("");
  const [newProfileActionScript, setNewProfileActionScript] =
    useState("Social Auto-Scout");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [zeroTouchIntent, setZeroTouchIntent] = useState("");
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [agentContext, setAgentContext] = useState<
    "IDLE" | "AWAIT_CAMERA_CONFIRM"
  >("IDLE");
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [browserSearchQuery, setBrowserSearchQuery] = useState("");
  const [browserSearchResults, setBrowserSearchResults] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);
  const [workflowStates, setWorkflowStates] = useState<string[]>([]);
  const [workflowStep, setWorkflowStep] = useState<number>(0);
  const [workflowHistory, setWorkflowHistory] = useState<
    WorkflowHistoryEntry[]
  >([]);
  const workflowStartTimeRef = useRef<Date | null>(null);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [screenData, setScreenData] = useState<string | null>(null);
  const [generatedNodes, setGeneratedNodes] = useState<
    { id: string; label: string }[]
  >([]);
  const [detectionRefreshRate, setDetectionRefreshRate] = useState(1500);
  const [detectedUINodes, setDetectedUINodes] = useState<
    {
      id: string;
      label: string;
      x: number;
      y: number;
      w: number;
      h: number;
      confidence: number;
    }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isSystemPaused, setIsSystemPaused] = useState(false);
  const isSystemPausedRef = useRef(false);
  const isConnectedRef = useRef(isConnected);
  const sendMessageRef = useRef(sendMessage);

  useEffect(() => {
    isConnectedRef.current = isConnected;
    sendMessageRef.current = sendMessage;
  }, [isConnected, sendMessage]);

  useEffect(() => {
    if (lastMessage?.type === "log" && lastMessage.payload) {
      addLog(`[BACKEND] ${lastMessage.payload}`);
    } else if (lastMessage?.type === "screen" && lastMessage.data) {
      setScreenData(lastMessage.data);
    }
  }, [lastMessage]);

  useEffect(() => {
    isSystemPausedRef.current = isSystemPaused;
  }, [isSystemPaused]);

  useEffect(() => {
    const logsEl = document.getElementById("terminal-logs");
    if (logsEl) {
      logsEl.scrollTop = logsEl.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, `> ${message}`]);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("koro_user_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem("koro_user_session", JSON.stringify(newSession));
    addLog(`Operator authenticated: Welcome ${newSession.username} [Role: ${newSession.role.toUpperCase()}]`);
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("koro_user_session");
    addLog("Operator session terminated safely.");
  };

  const handleDownloadReport = () => {
    const totalTasks = workflowHistory.reduce((acc, entry) => acc + entry.tasksCompleted, 0);
    const completedWorkflows = workflowHistory.length;
    
    let totalDurationMs = 0;
    const historyData = workflowHistory.map(entry => {
      const durationMs = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
      totalDurationMs += durationMs;
      return {
        id: entry.id,
        intent: entry.intent,
        startTime: entry.startTime,
        endTime: entry.endTime,
        durationSeconds: (durationMs / 1000).toFixed(2),
        tasksCompleted: entry.tasksCompleted,
      };
    });

    const successRate = totalTasks > 0 ? "100%" : "N/A";

    const report = {
      timestamp: new Date().toISOString(),
      sessionSummary: {
        totalWorkflowsExecuted: completedWorkflows,
        totalTasksCompleted: totalTasks,
        successRate: successRate,
        totalSessionDurationSeconds: (totalDurationMs / 1000).toFixed(2),
      },
      workflows: historyData,
      devices: devices.map(d => ({ id: d.id, name: d.name })),
      connectedDevice: selectedDeviceId
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `koro_session_report_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    addLog("Session report JSON generated and downloaded.");
  };

  const executeTap = useCallback((x: number, y: number) => {
    setClickPosition({ x, y });
    if (isConnectedRef.current) {
      // Scale percentage coordinates to reasonable absolute device values
      sendMessageRef.current("action", {
        action: "tap",
        x: Math.floor((x / 100) * 1080),
        y: Math.floor((y / 100) * 2400),
      });
    }
  }, []);

  const executeShellCommand = useCallback((command: string) => {
    if (isConnectedRef.current) {
      sendMessageRef.current("action", {
        action: "shell",
        command,
      });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutonomousActive && !isManualOverride) {
      let states: string[] = ["home"];
      const intentLower = zeroTouchIntent.toLowerCase();

      if (
        intentLower.includes("map") ||
        intentLower.includes("location") ||
        intentLower.includes("route") ||
        intentLower.includes("navigate") ||
        intentLower.includes("path")
      ) {
        states = ["home", "maps", "searching_maps", "viewing_maps"];
      } else if (
        intentLower.includes("photo") ||
        intentLower.includes("camera") ||
        intentLower.includes("picture") ||
        intentLower.includes("video")
      ) {
        states = ["home", "camera", "taking_photo"];
      } else if (
        intentLower.includes("search") ||
        intentLower.includes("browser") ||
        intentLower.includes("chrome") ||
        intentLower.includes("web") ||
        intentLower.includes("google")
      ) {
        states = [
          "home",
          "chrome",
          "searching_chrome",
          "scrolling_chrome",
          "reading_chrome",
        ];
      } else {
        // Fallback or generic intent sequence
        states = ["home", "chrome", "scrolling_chrome"];
      }

      setWorkflowStates(states);
      setWorkflowStep(0);
      if (!workflowStartTimeRef.current) {
        workflowStartTimeRef.current = new Date();
      }

      let stateIndex = 0;

      interval = setInterval(() => {
        if (isSystemPausedRef.current) return;

        if (stateIndex >= states.length) {
          clearInterval(interval);
          setIsAutonomousActive(false);
          // Don't turn off screen, keep the last active app
          setClickPosition(null);
          addLog("Task successfully executed. Entering standby mode.");

          setWorkflowHistory((prev) => [
            {
              id: Math.random().toString(36).substring(7),
              intent: zeroTouchIntent,
              startTime: workflowStartTimeRef.current || new Date(),
              endTime: new Date(),
              tasksCompleted: states.length,
            },
            ...prev,
          ]);
          workflowStartTimeRef.current = null;

          return;
        }

        setWorkflowStep(stateIndex);
        const currentState = states[stateIndex];

        // Randomize touch position slightly
        executeTap(20 + Math.random() * 80, 30 + Math.random() * 100);

        if (currentState === "home") {
          setActiveApp("home");
          addLog("Vision: Analyzing Home Screen layout...");
          executeShellCommand("input keyevent KEYCODE_HOME");
        } else if (currentState === "chrome") {
          setActiveApp("chrome");
          addLog("Navigating to application com.android.chrome...");
          executeShellCommand(
            "am start -n com.android.chrome/com.google.android.apps.chrome.Main",
          );
        } else if (currentState === "searching_chrome") {
          addLog("Vision: Extracting text and initiating search query...");
          executeTap(50, 15);
        } else if (currentState === "scrolling_chrome") {
          addLog("Simulating human scroll behavior (velocity: 1.2px/ms)...");
          executeShellCommand("input swipe 500 1500 500 500");
        } else if (currentState === "reading_chrome") {
          addLog("Vision: Analyzing context & reading web content...");
        } else if (currentState === "maps") {
          setActiveApp("maps");
          addLog("Navigating to application com.google.android.apps.maps...");
          executeShellCommand(
            "am start -n com.google.android.apps.maps/com.google.android.maps.MapsActivity",
          );
        } else if (currentState === "searching_maps") {
          addLog("Vision: Detected search bar. Initiating query...");
        } else if (currentState === "viewing_maps") {
          addLog("Vision: Calculating route and ETA...");
          executeTap(50, 80);
        } else if (currentState === "camera") {
          setActiveApp("camera");
          addLog("Opening camera feed for visual analysis...");
          executeShellCommand("am start -a android.media.action.IMAGE_CAPTURE");
        } else if (currentState === "taking_photo") {
          addLog("Analyzing visual feed objects...");
          executeShellCommand("input keyevent KEYCODE_CAMERA");
        }

        setBattery((prev) => Math.max(0, prev - Math.random() * 0.5));
        stateIndex++;
      }, 3500);
    } else if (!isAutonomousActive) {
      // Screen remains on unless disconnected
      setClickPosition(null);
      setWorkflowStates([]);
      setWorkflowStep(0);
    }
    return () => clearInterval(interval);
  }, [isAutonomousActive, isManualOverride, zeroTouchIntent]);

  useEffect(() => {
    let nodeInterval: NodeJS.Timeout;
    if (isConnected) {
      nodeInterval = setInterval(() => {
        // Different UI nodes based on active app state
        let baseNodes = [];

        if (activeApp === "chrome") {
          baseNodes = [
            {
              id: "c1",
              label: "url_bar",
              x: 5,
              y: 5,
              w: 90,
              h: 10,
              confidence: 99,
            },
            {
              id: "c2",
              label: "content_heading",
              x: 10,
              y: 25,
              w: 80,
              h: 15,
              confidence: 95,
            },
            {
              id: "c3",
              label: "image_media",
              x: 10,
              y: 45,
              w: 30,
              h: 20,
              confidence: 91,
            },
            {
              id: "c4",
              label: "paragraph_text",
              x: 45,
              y: 45,
              w: 45,
              h: 40,
              confidence: 88,
            },
          ];
        } else if (activeApp === "maps") {
          baseNodes = [
            {
              id: "m1",
              label: "search_box",
              x: 5,
              y: 5,
              w: 90,
              h: 10,
              confidence: 98,
            },
            {
              id: "m2",
              label: "pin_location",
              x: 45,
              y: 45,
              w: 10,
              h: 10,
              confidence: 94,
            },
            {
              id: "m3",
              label: "poi_marker",
              x: 25,
              y: 30,
              w: 5,
              h: 5,
              confidence: 85,
            },
            {
              id: "m4",
              label: "bottom_sheet",
              x: 5,
              y: 80,
              w: 90,
              h: 20,
              confidence: 99,
            },
          ];
        } else if (activeApp === "camera") {
          baseNodes = [
            {
              id: "cam1",
              label: "viewfinder",
              x: 10,
              y: 10,
              w: 80,
              h: 60,
              confidence: 99,
            },
            {
              id: "cam2",
              label: "shutter_btn",
              x: 40,
              y: 80,
              w: 20,
              h: 15,
              confidence: 98,
            },
          ];
        } else {
          // Home screen nodes
          baseNodes = [
            {
              id: "h1",
              label: "app_whatsapp",
              x: 8,
              y: 35,
              w: 16,
              h: 12,
              confidence: 99,
            },
            {
              id: "h2",
              label: "app_chrome",
              x: 32,
              y: 35,
              w: 16,
              h: 12,
              confidence: 95,
            },
            {
              id: "h3",
              label: "app_maps",
              x: 56,
              y: 35,
              w: 16,
              h: 12,
              confidence: 88,
            },
            {
              id: "h4",
              label: "app_camera",
              x: 80,
              y: 35,
              w: 16,
              h: 12,
              confidence: 92,
            },
            {
              id: "h5",
              label: "dock_phone",
              x: 12,
              y: 88,
              w: 12,
              h: 8,
              confidence: 98,
            },
            {
              id: "h6",
              label: "dock_mail",
              x: 35,
              y: 88,
              w: 12,
              h: 8,
              confidence: 97,
            },
          ];
        }

        // Randomly adjust positions to simulate live feed tracking and add/remove nodes
        const activeNodes = baseNodes
          .filter(() => Math.random() > 0.1) // 90% chance to be visible
          .map((node) => ({
            ...node,
            x: Math.max(
              0,
              Math.min(100 - node.w, node.x + (Math.random() * 2 - 1)),
            ), // +/- 1% jitter
            y: Math.max(
              0,
              Math.min(100 - node.h, node.y + (Math.random() * 2 - 1)),
            ),
          }));

        setDetectedUINodes(activeNodes);
      }, detectionRefreshRate);
    } else {
      setDetectedUINodes([]);
    }

    return () => clearInterval(nodeInterval);
  }, [isConnected, detectionRefreshRate, activeApp]);

  useEffect(() => {
    if (isConnected) {
      addLog(`[WEBSOCKET] Seamless relay channel active.`);
      addLog(
        `[REDIS CACHE] Scanning & caching full device visual hierarchy...`,
      );
      setTimeout(() => {
        addLog(
          `[REDIS CACHE] Device hierarchy cached successfully (18ms). Response optimized.`,
        );
      }, 800);
    }
  }, [isConnected]);

  const toggleAutonomous = () => {
    if (!isAutonomousActive) {
      addLog("Activating Autonomous Mode (DeepSight Algorithm)...");
    } else {
      addLog("Autonomous Mode deactivated. Returning to manual control.");
    }
    setIsAutonomousActive(!isAutonomousActive);
  };

  const processZeroTouchIntent = (intentText: string) => {
    if (!intentText.trim()) return;
    setIsOrchestrating(true);
    setGeneratedNodes([]);
    setZeroTouchIntent(intentText); // ensure input shows it while processing

    const lowerIntent = intentText.toLowerCase();

    if (agentContext === "AWAIT_CAMERA_CONFIRM") {
      addLog(`[INTENT REGISTRATION] Processing response: "${intentText}"`);
      const match = lowerIntent.match(/(\d+)/);
      const count = match
        ? parseInt(match[1])
        : lowerIntent.includes("one") ||
            lowerIntent.includes("ekta") ||
            lowerIntent.includes("a")
          ? 1
          : lowerIntent.includes("two") || lowerIntent.includes("duita")
            ? 2
            : 1;

      setTimeout(() => {
        setGeneratedNodes([{ id: "n1", label: "Capture Frame" }]);
        addLog(`[ACTION] Initiating ${count} photo capture sequence...`);
        // Simulate taking photos
        for (let i = 0; i < count; i++) {
          setTimeout(handleCaptureScreenshot, i * 1000);
        }
      }, 500);

      setTimeout(
        () => {
          setGeneratedNodes((prev) => [
            ...prev,
            { id: "n2", label: "Process Image" },
          ]);
        },
        1500 + count * 1000,
      );

      setTimeout(
        () => {
          setGeneratedNodes((prev) => [
            ...prev,
            { id: "n3", label: "Save Local Memory" },
          ]);
          addLog(
            `[ORCHESTRATOR] Successfully captured ${count} photo(s) and saved to local memory without latency.`,
          );
          setZeroTouchIntent("");
          setAgentContext("IDLE");
          setActiveApp(null); // Close camera
        },
        2500 + count * 1000,
      );

      setTimeout(() => setIsOrchestrating(false), 4500 + count * 1000);
      return;
    }

    addLog(`[INTENT REGISTRATION] Interpreting: "${intentText}"`);

    if (
      lowerIntent.includes("camera") ||
      lowerIntent.includes("photo") ||
      lowerIntent.includes("chobi")
    ) {
      setTimeout(() => {
        setGeneratedNodes([{ id: "n1", label: "Query Cache" }]);
        addLog(
          `[REDIS] Retrieving pre-cached visual hierarchy for 'Camera'... (2ms)`,
        );
      }, 600);

      setTimeout(() => {
        setGeneratedNodes((prev) => [
          ...prev,
          { id: "n2", label: "Locate Icon" },
        ]);
        addLog(
          `[VISION] Camera application detected at coordinates (x: 820, y: 640).`,
        );
        // Show fake click (mapped to our visual frame)
        executeTap(95, 85);
      }, 1500);

      setTimeout(() => {
        setGeneratedNodes((prev) => [
          ...prev,
          { id: "n3", label: "Launch App" },
        ]);
        setClickPosition(null);
        setActiveApp("camera");
        addLog(`[ACTION] Auto-clicking Camera icon. Application opened.`);
        addLog(
          `[AGENT] Camera is now active. How many photos would you like me to take?`,
        );
        setZeroTouchIntent("");
        setAgentContext("AWAIT_CAMERA_CONFIRM");
      }, 2500);

      setTimeout(() => setIsOrchestrating(false), 3000);
      return;
    }

    // Default simulation
    setTimeout(() => {
      setGeneratedNodes([{ id: "n1", label: "Extract Intent" }]);
    }, 600);
    setTimeout(() => {
      setGeneratedNodes((prev) => [
        ...prev,
        { id: "n2", label: "Process Data" },
      ]);
    }, 1200);
    setTimeout(() => {
      setGeneratedNodes((prev) => [
        ...prev,
        { id: "n3", label: "Execute Workflow" },
      ]);
      addLog(`[ORCHESTRATOR] 0-Touch Workflow generated. Executing...`);
      setZeroTouchIntent("");
    }, 1800);

    setTimeout(() => setIsOrchestrating(false), 4000);
  };

  const handleZeroTouchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processZeroTouchIntent(zeroTouchIntent);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog("error: Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let currentTranscript = "";

    recognition.onstart = () => {
      setIsRecording(true);
      setZeroTouchIntent("");
      addLog("[MIC] Listening for zero-touch intent...");
    };

    // @ts-expect-error - Web Speech API typing
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      currentTranscript = transcript;
      setZeroTouchIntent(transcript);
    };

    // @ts-expect-error - Web Speech API typing
    recognition.onerror = (event) => {
      addLog(`[MIC] Error occurred: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (currentTranscript.trim()) {
        processZeroTouchIntent(currentTranscript);
      } else {
        addLog("[MIC] No speech detected.");
      }
    };

    recognition.start();
  };

  const executeQuickAction = (actionName: string) => {
    setActiveAction(actionName);
    addLog(`Executing administrative action: [${actionName}]...`);
    setTimeout(() => {
      addLog(`Action [${actionName}] completed successfully.`);
      setActiveAction(null);
    }, 1500);
  };

  const handleCaptureScreenshot = () => {
    addLog(`[VISION] Initiating capture sequence for target device...`);
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw a basic representation of the mobile screen
          ctx.fillStyle = "#18181b"; // zinc-900
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 48px monospace";
          ctx.fillText(
            `TARGET: ${devices.find((d) => d.id === selectedDeviceId)?.name || "Unknown"}`,
            100,
            150,
          );

          ctx.font = "36px monospace";
          const timestamp = new Date().toISOString();
          ctx.fillText(`TIMESTAMP: ${timestamp}`, 100, 220);

          ctx.fillStyle = "#10b981"; // emerald-500
          ctx.fillText(`STATUS: AUTONOMOUS LINK SECURE`, 100, 300);

          ctx.strokeStyle = "#3f3f46"; // zinc-700
          ctx.lineWidth = 4;
          ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

          ctx.fillStyle = "#3f3f46";
          for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 6; j++) {
              ctx.fillRect(100 + i * 180, 400 + j * 220, 120, 120);
            }
          }

          const dataUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `screenshot_${selectedDeviceId}_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          addLog(
            `[VISION] Screenshot successfully saved to local device storage.`,
          );
        }
      } catch (error) {
        addLog(`error: Screenshot capture failed.`);
      }
    }, 800);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setLogs((prev) => [...prev, `$ ${cmd}`]); // User command styling

    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === "clear") {
      setLogs(["> terminal cleared."]);
    } else if (lowerCmd === "help") {
      addLog("Available commands: start <name>, stop <name>, clear, help");
    } else if (lowerCmd.startsWith("start ")) {
      const target = lowerCmd.replace("start ", "").trim();
      const scriptIndex = scripts.findIndex((s) =>
        s.name.toLowerCase().includes(target),
      );
      if (scriptIndex >= 0) {
        const newScripts = [...scripts];
        newScripts[scriptIndex].status = "Active";
        setScripts(newScripts);
        addLog(`Starting Routine: ${scripts[scriptIndex].name}...`);
      } else {
        addLog(`error: Script [${target}] not found.`);
      }
    } else if (lowerCmd.startsWith("stop ")) {
      const target = lowerCmd.replace("stop ", "").trim();
      const scriptIndex = scripts.findIndex((s) =>
        s.name.toLowerCase().includes(target),
      );
      if (scriptIndex >= 0) {
        const newScripts = [...scripts];
        newScripts[scriptIndex].status = "Idle";
        setScripts(newScripts);
        addLog(`Halting Routine: ${scripts[scriptIndex].name}...`);
      } else {
        addLog(`error: Script [${target}] not found.`);
      }
    } else {
      addLog(`Command delegated to Autonomous Zero-Touch Engine...`);
      setIsAutonomousActive(true);
      processZeroTouchIntent(cmd);
    }
    setCommandInput("");
  };

  const allCommands = [
    "clear",
    "help",
    ...scripts.map((s) => `start ${s.name.toLowerCase()}`),
    ...scripts.map((s) => `stop ${s.name.toLowerCase()}`),
  ];

  const matchingSuggestions =
    commandInput.trim() === ""
      ? []
      : allCommands.filter(
          (c) =>
            c.startsWith(commandInput.toLowerCase()) &&
            c !== commandInput.toLowerCase(),
        );

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (matchingSuggestions.length > 0) {
        setCommandInput(matchingSuggestions[0] + " ");
      }
    }
  };

  const handleAddProfile = () => {
    if (!newProfileName || !newProfileConditionValue) {
      addLog("error: Name and Condition Value required for profile.");
      return;
    }

    setAutomationProfiles([
      ...automationProfiles,
      {
        id: `prof_${Date.now()}`,
        name: newProfileName,
        conditionType: newProfileConditionType,
        conditionValue: newProfileConditionValue,
        actionScript: newProfileActionScript,
        isActive: true,
      },
    ]);

    setNewProfileName("");
    setNewProfileConditionValue("");
    addLog(`Automation Profile created: ${newProfileName}`);
  };

  const toggleProfileActive = (id: string) => {
    setAutomationProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newState = !p.isActive;
          addLog(
            `Profile [${p.name}] is now ${newState ? "ACTIVE" : "INACTIVE"}`,
          );
          return { ...p, isActive: newState };
        }
        return p;
      }),
    );
  };

  const handleScheduleTask = () => {
    if (!scheduleTime) {
      addLog("error: Execution time required for scheduling.");
      return;
    }
    const newTask = {
      id: Math.random().toString(36).substring(7),
      scriptName: scheduleTaskName,
      time: scheduleTime,
      status: "Pending",
      priority: schedulePriority,
    };
    setScheduledTasks((prev) =>
      [...prev, newTask].sort((a, b) => a.time.localeCompare(b.time)),
    );
    addLog(
      `Task queued: ${scheduleTaskName} at ${scheduleTime} (Priority: ${schedulePriority})`,
    );
    setScheduleTime("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <TopNav
        isConnected={isConnected}
        latency={latency}
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onDeviceSelect={setSelectedDeviceId}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenModelSettings={() => setIsModelSettingsOpen(true)}
        isSystemPaused={isSystemPaused}
        onTogglePause={() => {
          setIsSystemPaused(!isSystemPaused);
          addLog(
            isSystemPaused ? "System resumed." : "System globally paused.",
          );
        }}
        session={session}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pb-20 max-w-7xl mx-auto">
        {/* Full-width Phone Dashboard Section */}
        <div className="lg:col-span-12">
          <PhoneDashboardManager
            scripts={scripts}
            setScripts={setScripts}
            battery={battery}
            setBattery={setBattery}
            selectedDeviceId={selectedDeviceId}
            devices={devices}
            addLog={addLog}
            isManualOverride={isManualOverride}
            setIsManualOverride={setIsManualOverride}
            executeShellCommand={executeShellCommand}
          />
        </div>

        {/* Full-width Secure Remote Control Dashboard Section */}
        <div className="lg:col-span-12">
          <RemoteControlDashboard
            activeApp={activeApp}
            setActiveApp={setActiveApp}
            addLog={addLog}
            executeTap={executeTap}
            battery={battery}
            devices={devices}
            selectedDeviceId={selectedDeviceId}
          />
        </div>

        {/* Left Column: Vision & Commands */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-4 sm:p-5">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center justify-between">
              <span>Vision Module</span>
              <div className="flex items-center gap-3">
                {isAutonomousActive && (
                  <span
                    className={`flex items-center gap-1 text-[10px] ${isSystemPaused ? "text-amber-500" : "text-emerald-400"}`}
                  >
                    <Activity
                      className={`w-3 h-3 ${!isSystemPaused && "animate-spin"}`}
                    />{" "}
                    {isSystemPaused ? "PAUSED" : "LIVE"}
                  </span>
                )}
                <button
                  onClick={handleCaptureScreenshot}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Capture Screenshot"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVisionExpanded(true)}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Expand Vision Feed"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </h2>
            <div className="relative h-[280px] rounded-lg overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
              {isConnected ? (
                <>
                  {isAutonomousActive && (
                    <>
                      <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-scan z-20 pointer-events-none"></div>
                      <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-500 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30 z-20 pointer-events-none flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${isSystemPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}
                        ></div>{" "}
                        {isSystemPaused ? "PAUSED" : "REC"} (
                        {devices.find((d) => d.id === selectedDeviceId)?.name ||
                          "Unknown"}
                        )
                      </div>
                    </>
                  )}
                  <div className="w-full h-full relative overflow-hidden bg-zinc-950 flex justify-center items-center">
                    {/* Simulated Mobile Device Frame */}
                    <div className="w-[130px] h-[240px] bg-zinc-950 border-[4px] border-zinc-800 rounded-[1.5rem] overflow-hidden relative shadow-2xl flex flex-col">
                      {/* Fake Status Bar */}
                      <div className="h-4 w-full bg-zinc-950 flex items-center justify-between px-2 text-[7px] text-zinc-400 font-medium z-10 shrink-0">
                        <span>19:24</span>
                        <div className="flex items-center gap-[2px]">
                          <Wifi className="w-2 h-2" />
                          <Signal className="w-2 h-2" />
                          <div
                            className={`flex items-center gap-[1px] ml-[1px] ${battery < 15 ? "text-red-500 animate-pulse" : ""}`}
                          >
                            <span className="scale-75">
                              {Math.round(battery)}%
                            </span>
                            <Battery className="w-2 h-2" />
                          </div>
                        </div>
                      </div>

                      {/* Fake Content Based on Active App */}
                      <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-950 p-2 relative">
                        {screenData ? (
                          <div className="absolute inset-0 bg-black flex items-center justify-center z-40">
                            <img
                              src={screenData}
                              className="w-full h-full object-cover"
                              alt="Real Device Screen"
                            />
                          </div>
                        ) : activeApp === "camera" ? (
                          <div className="absolute inset-0 bg-black flex items-center justify-center z-30">
                            {/* Camera Viewfinder Fake */}
                            <div className="absolute inset-4 border-2 border-white/30 flex items-center justify-center">
                              <div className="w-12 h-12 border border-white/50 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                              </div>
                            </div>
                            <div className="absolute bottom-2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                              <div className="w-8 h-8 border border-black rounded-full"></div>
                            </div>
                          </div>
                        ) : activeApp === "chrome" ? (
                          <div className="absolute inset-0 bg-white flex flex-col z-30 text-black">
                            {/* Browser Header Bar */}
                            <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center px-2 shadow-sm shrink-0 gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                              <div className="w-2 h-2 rounded-full bg-yellow-400" />
                              <div className="w-2 h-2 rounded-full bg-green-400" />
                              <div className="flex-1 bg-white border border-zinc-200 rounded-full h-6 px-3 flex items-center text-[8px] text-zinc-600 font-mono relative overflow-hidden">
                                <span className="text-zinc-300 mr-1 select-none">https://</span>
                                <span className="truncate">{browserSearchQuery ? `google.com/search?q=${encodeURIComponent(browserSearchQuery)}` : "google.com"}</span>
                              </div>
                            </div>

                            {/* Browser Web Viewport */}
                            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 text-xs">
                              {browserSearchResults ? (
                                <div className="flex flex-col gap-3 font-sans">
                                  {/* Result Heading */}
                                  <div className="border-b border-zinc-100 pb-2">
                                    <div className="text-[9px] text-zinc-400 font-mono tracking-widest font-semibold uppercase flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                      AI GROUNDED KNOWLEDGE
                                    </div>
                                    <h4 className="text-sm font-bold text-zinc-800 mt-1 leading-snug">
                                      Query: {browserSearchQuery}
                                    </h4>
                                  </div>

                                  {/* Grounded Summary Text */}
                                  <p className="text-[10px] text-zinc-600 leading-relaxed font-normal bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                                    {browserSearchResults.text}
                                  </p>

                                  {/* Sources List */}
                                  <div>
                                    <div className="text-[8px] text-zinc-400 font-mono font-bold uppercase tracking-wider">
                                      Verified Citations
                                    </div>
                                    <div className="flex flex-col gap-1.5 mt-1.5">
                                      {browserSearchResults.sources.slice(0, 3).map((source, idx) => (
                                        <a
                                          key={idx}
                                          href={source.uri}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded flex flex-col text-[8px] text-blue-600 transition-colors"
                                        >
                                          <span className="font-semibold truncate">{source.title}</span>
                                          <span className="text-zinc-400 font-mono truncate font-light mt-0.5">{source.uri}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-6">
                                  {/* Google Logo styling */}
                                  <div className="flex items-center text-lg font-bold tracking-tight mb-4 select-none">
                                    <span className="text-blue-500">G</span>
                                    <span className="text-red-500">o</span>
                                    <span className="text-yellow-500">o</span>
                                    <span className="text-blue-500">g</span>
                                    <span className="text-green-500">l</span>
                                    <span className="text-red-500">e</span>
                                  </div>

                                  <div className="w-full max-w-[220px] relative">
                                    <input
                                      type="text"
                                      placeholder="Search web with AI grounding..."
                                      value={browserSearchQuery}
                                      onChange={(e) => setBrowserSearchQuery(e.target.value)}
                                      onKeyDown={async (e) => {
                                        if (e.key === "Enter" && browserSearchQuery.trim()) {
                                          addLog(`[INTEGRATED BROWSER] Query initiated from phone emulator: "${browserSearchQuery}"`);
                                          // Trigger search
                                          try {
                                            const res = await fetch("/api/gemini", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({
                                                action: "search",
                                                prompt: browserSearchQuery,
                                              }),
                                            });
                                            const d = await res.json();
                                            if (d.error) throw new Error(d.error);
                                            setBrowserSearchResults({
                                              text: d.text,
                                              sources: d.sources || [],
                                            });
                                          } catch (err: any) {
                                            addLog(`error: Grounded query failed: ${err.message}`);
                                          }
                                        }
                                      }}
                                      className="w-full border border-zinc-200 rounded-full h-8 px-8 text-[9px] focus:outline-none focus:border-blue-400 font-sans text-center bg-zinc-50 hover:bg-zinc-100/50 transition-colors"
                                    />
                                    <Search className="w-3 h-3 text-zinc-300 absolute left-3.5 top-2.5" />
                                  </div>

                                  <p className="text-[8px] text-zinc-400 font-mono mt-4 max-w-[180px] text-center leading-normal">
                                    Type query and press Enter. Live Google-grounded summaries will populate above.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : activeApp === "maps" ? (
                          <div className="absolute inset-0 bg-[#e5e3df] flex flex-col z-30">
                            <div className="absolute top-2 left-2 right-2 h-6 bg-white rounded shadow-md flex items-center px-2 z-40">
                              <div className="w-3 h-3 text-zinc-400">
                                <Map className="w-2.5 h-2.5" />
                              </div>
                              <div className="flex-1 ml-1 text-[6px] text-zinc-400">
                                Search location...
                              </div>
                            </div>
                            {/* Fake map elements */}
                            <div className="w-full h-full relative overflow-hidden">
                              <div className="absolute top-10 left-[-10px] w-[150px] h-2 bg-[#f9db8d] rotate-45"></div>
                              <div className="absolute top-20 right-[-20px] w-[150px] h-2 bg-[#f9db8d] -rotate-12"></div>
                              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500/20 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow border border-white"></div>
                              </div>
                              <div className="absolute top-1/3 left-1/4">
                                <Map className="w-3 h-3 text-red-500" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 h-16 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-2 z-40">
                              <div className="w-8 h-1 bg-zinc-300 rounded-full mx-auto mb-1"></div>
                              <div className="text-[8px] font-bold text-zinc-800">
                                Target Location
                              </div>
                              <div className="text-[6px] text-zinc-500 mt-0.5">
                                15 mins • 2.4 miles
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Clock Widget */}
                            <div className="text-center mt-2 mb-6 text-white font-light text-xl">
                              19:24
                            </div>

                            {/* App Grid */}
                            <div className="grid grid-cols-4 gap-y-4 gap-x-1.5">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white shadow-lg">
                                  <MessageCircle className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center text-white shadow-lg">
                                  <Globe className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-white shadow-lg">
                                  <Map className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-zinc-300 rounded-md flex items-center justify-center text-zinc-900 shadow-lg">
                                  <Camera className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white shadow-lg">
                                  <Settings className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center text-white shadow-lg">
                                  <span className="font-bold text-[8px]">
                                    IG
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Dock */}
                            <div className="absolute bottom-2 left-2 right-2 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-around px-1 border border-white/10">
                              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white">
                                <Phone className="w-3 h-3" />
                              </div>
                              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-white">
                                <Mail className="w-3 h-3" />
                              </div>
                              <div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center text-white">
                                <MessageCircle className="w-3 h-3" />
                              </div>
                              <div className="w-6 h-6 bg-zinc-700 rounded-md flex items-center justify-center text-white">
                                <Globe className="w-3 h-3" />
                              </div>
                            </div>
                          </>
                        )}

                        {/* Agent Touch Indicator */}
                        <motion.div
                          animate={
                            clickPosition
                              ? {
                                  x: clickPosition.x - 12,
                                  y: clickPosition.y - 12,
                                  opacity: 1,
                                }
                              : {
                                  x: "50%",
                                  y: "120%",
                                  opacity: 0,
                                }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center z-[60] pointer-events-none"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] z-10"></div>
                          {clickPosition && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 1 }}
                              animate={{ scale: 2.5, opacity: 0 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="absolute w-full h-full border-2 border-emerald-400 rounded-full"
                            ></motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Object Detection Boxes */}
                      <AnimatePresence>
                        {detectedUINodes.map((node) => (
                          <motion.div
                            key={`v1-${node.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              left: `${node.x}%`,
                              top: `${node.y}%`,
                              width: `${node.w}%`,
                              height: `${node.h}%`,
                            }}
                            className="absolute border-2 border-emerald-500 bg-emerald-500/10 z-10 pointer-events-none"
                          ></motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <Camera className="w-8 h-8 opacity-50" />
                  <span className="text-xs font-mono uppercase tracking-widest opacity-80">
                    Feed Offline
                  </span>
                </div>
              )}
            </div>

            {/* Performance Slider */}
            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 uppercase tracking-wider">
                  Detection Refresh Rate
                </span>
                <span
                  className={
                    detectionRefreshRate < 500
                      ? "text-amber-500 font-bold"
                      : "text-emerald-500 font-bold"
                  }
                >
                  {detectionRefreshRate}ms
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={detectionRefreshRate}
                onChange={(e) =>
                  setDetectionRefreshRate(Number(e.target.value))
                }
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                <span>High CPU / Fast (100ms)</span>
                <span>Low CPU / Slow (3000ms)</span>
              </div>
            </div>
          </div>

          {/* Terminal Logs (Command Section) */}
          <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 flex flex-col h-[280px]">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" /> Agent Logs
              </h2>
              <div className="flex items-center gap-3">
                {isRemoteHandoffActive && (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    Waiting for remote response...
                  </div>
                )}
                <button
                  onClick={() => setLogs(["> Logs cleared."])}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div
              className="p-4 flex-1 overflow-y-auto flex flex-col gap-1 font-mono text-sm scroll-smooth"
              id="terminal-logs"
            >
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${log.includes("successfully") ? "text-emerald-400" : log.includes("error") ? "text-red-400" : log.startsWith("$") ? "text-zinc-100 font-bold tracking-wide mt-2" : "text-zinc-400"}`}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form
              onSubmit={handleCommand}
              className="border-t border-zinc-800 shrink-0 flex items-center bg-zinc-900/30 relative"
            >
              <div className="flex items-center text-xs font-mono px-3 py-1 bg-zinc-800/50 border-r border-zinc-800 text-zinc-500 whitespace-nowrap hidden sm:flex">
                [TARGET:{" "}
                <span className="text-zinc-300 ml-1 truncate max-w-[80px]">
                  {devices.find((d) => d.id === selectedDeviceId)?.name ||
                    "N/A"}
                </span>
                ]
              </div>
              <span className="text-emerald-500 font-mono font-bold pl-3 pr-2">
                »
              </span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none text-zinc-100 font-mono text-sm py-3 pr-4 focus:ring-0 focus:outline-none placeholder-zinc-700"
              />
              <AnimatePresence>
                {isInputFocused && matchingSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-20"
                  >
                    <div className="text-xs text-zinc-500 font-mono px-3 py-1.5 border-b border-zinc-700/50 bg-zinc-900/50 flex justify-between">
                      <span>Suggestions</span>
                      <span>[Tab] to autocomplete</span>
                    </div>
                    <ul className="max-h-40 overflow-y-auto w-full">
                      {matchingSuggestions.map((suggestion, idx) => (
                        <li
                          key={`${suggestion}-${idx}`}
                          className={`px-3 py-2 text-sm font-mono cursor-pointer flex items-center gap-2 ${idx === 0 ? "bg-zinc-700/30 text-zinc-200" : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"} transition-colors`}
                          onClick={() => {
                            setCommandInput(suggestion + " ");
                            const inputEl = document.querySelector(
                              'input[placeholder*="Enter command"]',
                            ) as HTMLInputElement;
                            if (inputEl) inputEl.focus();
                          }}
                        >
                          <span
                            className={`${idx === 0 ? "text-emerald-400 font-bold" : "text-zinc-500 opacity-50"}`}
                          >
                            »
                          </span>
                          <span>
                            {suggestion.substring(0, commandInput.length)}
                          </span>
                          <span
                            className={
                              idx === 0 ? "text-zinc-300" : "text-zinc-500"
                            }
                          >
                            {suggestion.substring(commandInput.length)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Real Terminal & Git Pipeline */}
          <div className="h-[350px]">
            <RealTerminal
              battery={battery}
              session={session}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>

          {/* Zero-Touch Orchestration Bar */}
          <div className="bg-zinc-900 border border-zinc-800 p-2 pl-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.05)] focus-within:border-emerald-500/50 transition-colors">
            <form
              onSubmit={handleZeroTouchSubmit}
              className="flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <input
                type="text"
                value={zeroTouchIntent}
                onChange={(e) => setZeroTouchIntent(e.target.value)}
                placeholder="Enter Zero-Touch Intent (e.g. 'Download invoices and send via WhatsApp')..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 font-mono"
              />
              <button
                type="submit"
                className={`p-2 rounded-lg transition-colors ${zeroTouchIntent.length > 0 ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-zinc-800 text-zinc-500"}`}
              >
                <Activity className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={startSpeechRecognition}
                disabled={isRecording}
                className={`p-2 rounded-lg transition-colors ${isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
              >
                <div className="relative">
                  <Mic className="w-4 h-4" />
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* How It Works Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-emerald-400 tracking-wider font-mono uppercase mb-3 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> 
              How Zero-Touch Execution Works
            </h4>
            <div className="space-y-3">
              <div className="bg-black/30 border border-zinc-800/60 rounded p-3 text-xs">
                <span className="font-bold text-zinc-200">1. Screen Analysis:</span> 
                <span className="text-zinc-400 ml-2">The app continuously captures and sends the visual content of your screen to an AI model.</span>
              </div>
              <div className="bg-black/30 border border-zinc-800/60 rounded p-3 text-xs">
                <span className="font-bold text-zinc-200">2. Cognitive Decision Making:</span> 
                <span className="text-zinc-400 ml-2">The AI "thinks" about the current interface, interprets what is happening, and determines the necessary next step to fulfill your instructions.</span>
              </div>
              <div className="bg-black/30 border border-zinc-800/60 rounded p-3 text-xs">
                <span className="font-bold text-zinc-200">3. Action Execution:</span> 
                <span className="text-zinc-400 ml-2">Once the model identifies the correct location, it uses Android’s built-in Accessibility Service to simulate a human tap or interaction at those specific coordinates.</span>
              </div>
            </div>
          </div>

          {/* Phone Dashboard & Task Manager is now rendered in full-width at the top of the main container */}
        </div>

        {/* Right Column: Actions & Dashboards */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          <ClientHunter
            selectedDeviceId={selectedDeviceId}
            deviceName={
              devices.find((d) => d.id === selectedDeviceId)?.name ||
              "Target Device"
            }
            onLog={addLog}
          />

          {/* Orchestrator Node Visualizer */}
          <AnimatePresence>
            {(isOrchestrating || generatedNodes.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 border border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5 flex items-center justify-center gap-4 min-h-[100px]">
                  {generatedNodes.map((node, i) => (
                    <motion.div
                      key={`${node.id}-${i}`}
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      className="flex items-center gap-4"
                    >
                      <div className="px-4 py-2 bg-zinc-900 border border-emerald-500/50 rounded flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <GitMerge className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-zinc-200">
                          {node.label}
                        </span>
                      </div>
                      {i < generatedNodes.length - 1 && (
                        <div className="w-8 h-px bg-emerald-500/50 relative">
                          <div className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1 border-4 border-transparent border-l-emerald-500/50"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isOrchestrating && generatedNodes.length < 3 && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 border-dashed rounded text-xs font-mono text-zinc-500"
                    >
                      Synthesizing Nodes...
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {workflowStates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <LogicTree
                  states={workflowStates}
                  currentStep={workflowStep}
                  isPaused={isSystemPaused}
                />
              </motion.div>
            )}

            {workflowHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <WorkflowHistory history={workflowHistory} />
              </motion.div>
            )}
          </AnimatePresence>

          <HumanBehaviorCopilot
            activeApp={activeApp}
            setActiveApp={setActiveApp}
            addLog={addLog}
            executeTap={executeTap}
            setDetectedUINodes={setDetectedUINodes}
            zeroTouchIntent={zeroTouchIntent}
            setZeroTouchIntent={setZeroTouchIntent}
            setIsAutonomousActive={setIsAutonomousActive}
            selectedDeviceId={selectedDeviceId}
            devices={devices}
            browserSearchQuery={browserSearchQuery}
            setBrowserSearchQuery={setBrowserSearchQuery}
            browserSearchResults={browserSearchResults}
            setBrowserSearchResults={setBrowserSearchResults}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg">
              <h3 className="text-zinc-400 text-xs tracking-wider mb-2 uppercase">
                Target Device
              </h3>
              <p className="text-lg text-white font-medium">
                {devices.find((d) => d.id === selectedDeviceId)?.name ||
                  "Unknown Device"}
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                ID: {selectedDeviceId}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg relative overflow-hidden">
              {isEdgeMode && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold tracking-widest rounded border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    <GlobeLock className="w-3 h-3 inline-block mr-1" />
                    ZERO-LATENCY
                  </div>
                </div>
              )}
              <h3 className="text-zinc-400 text-xs tracking-wider mb-2 uppercase flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> AI Inference Engine
              </h3>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setIsEdgeMode(false)}
                  className={`flex-1 text-xs py-1 text-center font-bold font-mono transition-colors border-b-2 ${!isEdgeMode ? "border-blue-500 text-blue-400" : "border-zinc-800 text-zinc-600 hover:text-zinc-400"}`}
                >
                  CLOUD API
                </button>
                <button
                  onClick={() => setIsEdgeMode(true)}
                  className={`flex-1 text-xs py-1 text-center font-bold font-mono transition-colors border-b-2 ${isEdgeMode ? "border-emerald-500 text-emerald-400" : "border-zinc-800 text-zinc-600 hover:text-zinc-400"}`}
                >
                  EDGE SLM
                </button>
              </div>
              <p className="text-zinc-500 text-sm mt-3 flex justify-between items-end">
                <span>Execution Time</span>
                <span
                  className={`font-mono font-bold ${isEdgeMode ? "text-emerald-400" : "text-blue-400"}`}
                >
                  {isEdgeMode ? "< 4ms" : "~240ms"}
                </span>
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-center items-center relative overflow-hidden group gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAutonomous}
                className={`relative z-10 w-full rounded-lg py-2 font-bold tracking-widest uppercase transition-colors border text-sm ${isAutonomousActive && !isManualOverride ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"}`}
              >
                {isAutonomousActive && !isManualOverride
                  ? "Auto Active"
                  : isAutonomousActive && isManualOverride
                    ? "Resume Auto"
                    : "Engage Auto"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isAutonomousActive)
                    setIsManualOverride(!isManualOverride);
                }}
                disabled={!isAutonomousActive}
                className={`relative z-10 w-full rounded-lg py-2 font-bold tracking-widest uppercase transition-colors border text-sm ${isManualOverride ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}
              >
                {isManualOverride ? "Override On" : "Manual Override"}
              </motion.button>

              {isAutonomousActive && !isManualOverride && (
                <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-xl animate-pulse pointer-events-none"></div>
              )}
              {isManualOverride && (
                <div className="absolute inset-0 border-2 border-amber-500/50 rounded-xl animate-pulse pointer-events-none"></div>
              )}
            </div>
          </div>

          <AgenticSkillModule
            isAutonomousActive={isAutonomousActive}
            onLog={addLog}
            onHandoffStateChange={setIsRemoteHandoffActive}
          />

          <SwarmFleetDashboard
            isEdgeMode={isEdgeMode}
            isAutonomousActive={isAutonomousActive}
          />

          {/* Proactive Suggestions */}
          <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)] p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
              <BrainCircuit className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Predictive Action
            </h2>
            <p className="text-sm text-zinc-300 relative z-10 leading-relaxed font-mono">
              Routine detected: Do you want me to auto-send yesterday's reports?
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() =>
                  addLog("Executing proactive task: Auto-sending reports...")
                }
                className="text-xs bg-emerald-500 text-black font-bold px-4 py-1.5 rounded hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                Execute Now
              </button>
              <button
                onClick={() => addLog("Dismissing proactive suggestion.")}
                className="text-xs text-zinc-500 hover:text-zinc-300 hover:underline transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Task Scheduler
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative">
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  automation script
                </label>
                <select
                  value={scheduleTaskName}
                  onChange={(e) => setScheduleTaskName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                  {scripts.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  execution time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  priority level
                </label>
                <select
                  value={schedulePriority}
                  onChange={(e) =>
                    setSchedulePriority(
                      e.target.value as "Low" | "Medium" | "High",
                    )
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  onClick={handleScheduleTask}
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Queue Task
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {scheduledTasks.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
                  No tasks queued.
                </div>
              ) : (
                scheduledTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg relative overflow-hidden group"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                        task.priority === "High"
                          ? "bg-red-500/40 group-hover:bg-red-500"
                          : task.priority === "Low"
                            ? "bg-blue-500/40 group-hover:bg-blue-500"
                            : "bg-amber-500/40 group-hover:bg-amber-500"
                      }`}
                    ></div>
                    <div className="flex items-center gap-4 pl-2">
                      <div className="bg-zinc-900 border border-zinc-800 w-12 h-12 rounded flex flex-col items-center justify-center">
                        <Clock className="w-4 h-4 text-zinc-500 mb-0.5" />
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {task.time}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                          <span>{task.scriptName}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              task.priority === "High"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : task.priority === "Low"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 animate-pulse"></div>
                          {task.status}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setScheduledTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        )
                      }
                      className="text-zinc-500 hover:text-red-400 p-2 transition-colors border border-transparent hover:border-red-500/30 hover:bg-red-500/10 flex items-center justify-center rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Automation Profiles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Automation Profiles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  profile name
                </label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Morning Routine"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  condition type
                </label>
                <select
                  value={newProfileConditionType}
                  onChange={(e) =>
                    setNewProfileConditionType(
                      e.target.value as "Time" | "Location" | "Wi-Fi",
                    )
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Time">Time of Day</option>
                  <option value="Location">Location</option>
                  <option value="Wi-Fi">Wi-Fi Network</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  condition value
                </label>
                <input
                  type={newProfileConditionType === "Time" ? "time" : "text"}
                  value={newProfileConditionValue}
                  onChange={(e) => setNewProfileConditionValue(e.target.value)}
                  placeholder={
                    newProfileConditionType === "Wi-Fi"
                      ? "e.g. CorpNet"
                      : newProfileConditionType === "Location"
                        ? "e.g. Office"
                        : ""
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">
                  action script
                </label>
                <select
                  value={newProfileActionScript}
                  onChange={(e) => setNewProfileActionScript(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                  {scripts.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex items-end justify-end mt-2">
                <button
                  onClick={handleAddProfile}
                  className="px-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Create Profile
                </button>
              </div>
            </div>

            {/* Visual Summary: Automation Topology */}
            {automationProfiles.length > 0 && (
              <div className="mb-6 bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Activity className="w-32 h-32" />
                </div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                  Daily Automation Topology
                </h3>

                {/* Timeline for Time-based */}
                <div className="relative mb-6">
                  <div className="absolute top-6 left-4 right-4 h-px bg-zinc-800/80 -translate-y-1/2"></div>
                  <div className="flex justify-between items-start relative z-10 px-2 overflow-x-auto pb-2 scrollbar-hide">
                    {automationProfiles.filter(
                      (p) => p.conditionType === "Time",
                    ).length > 0 ? (
                      automationProfiles
                        .filter((p) => p.conditionType === "Time")
                        .sort((a, b) =>
                          a.conditionValue.localeCompare(b.conditionValue),
                        )
                        .map((profile) => (
                          <div
                            key={profile.id}
                            className="flex flex-col items-center group min-w-[80px]"
                          >
                            <div
                              className={`text-[10px] font-mono mb-2 px-1.5 py-0.5 rounded ${profile.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-900 text-zinc-500"}`}
                            >
                              {profile.conditionValue}
                            </div>
                            <div
                              className={`w-3 h-3 rounded-full border-2 relative ${profile.isActive ? "bg-zinc-950 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-900 border-zinc-700"} mb-2`}
                            >
                              {profile.isActive && (
                                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                              )}
                            </div>
                            <div
                              className="text-[10px] text-zinc-400 max-w-[70px] text-center truncate group-hover:text-zinc-200 transition-colors"
                              title={profile.name}
                            >
                              {profile.name}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-xs text-zinc-600 italic bg-zinc-950/50 px-2 py-1 mx-auto text-center w-full">
                        No time-based triggers defined
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges for Event-based */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center mr-2">
                    Event Triggers
                  </div>
                  {automationProfiles.filter((p) => p.conditionType !== "Time")
                    .length > 0 ? (
                    automationProfiles
                      .filter((p) => p.conditionType !== "Time")
                      .map((profile) => (
                        <div
                          key={profile.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono ${profile.isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                        >
                          {profile.conditionType === "Location" ? (
                            <Map className="w-3 h-3" />
                          ) : (
                            <Wifi className="w-3 h-3" />
                          )}
                          <span className="truncate max-w-[120px]">
                            {profile.conditionValue}
                          </span>
                        </div>
                      ))
                  ) : (
                    <div className="text-xs text-zinc-600 italic flex items-center">
                      None
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {automationProfiles.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
                  No automation profiles active.
                </div>
              ) : (
                automationProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`flex justify-between items-center p-4 bg-zinc-950/50 border rounded-lg relative overflow-hidden group transition-colors ${profile.isActive ? "border-emerald-500/30" : "border-zinc-800"}`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                        profile.isActive
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-zinc-800"
                      }`}
                    ></div>
                    <div className="flex items-center gap-4 pl-2">
                      <div
                        className={`border w-12 h-12 rounded flex flex-col items-center justify-center transition-colors ${profile.isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                      >
                        {profile.conditionType === "Time" && (
                          <Clock className="w-5 h-5 mb-0.5" />
                        )}
                        {profile.conditionType === "Location" && (
                          <Map className="w-5 h-5 mb-0.5" />
                        )}
                        {profile.conditionType === "Wi-Fi" && (
                          <Wifi className="w-5 h-5 mb-0.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                          <span>{profile.name}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              profile.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            }`}
                          >
                            {profile.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-2">
                          <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            IF {profile.conditionType.toUpperCase()} ={" "}
                            {profile.conditionValue}
                          </span>
                          <span className="text-zinc-600">→</span>
                          <span className="text-emerald-500/70">
                            RUN {profile.actionScript}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProfileActive(profile.id)}
                        className={`p-2 transition-colors border flex items-center justify-center rounded-md ${profile.isActive ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10" : "text-zinc-500 border-zinc-800 hover:text-white hover:bg-zinc-800"}`}
                        title={
                          profile.isActive
                            ? "Disable Profile"
                            : "Enable Profile"
                        }
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setAutomationProfiles((prev) =>
                            prev.filter((p) => p.id !== profile.id),
                          )
                        }
                        className="text-zinc-500 hover:text-red-400 p-2 transition-colors border border-transparent hover:border-red-500/30 hover:bg-red-500/10 flex items-center justify-center rounded-md"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Full-screen Vision Modal */}
      <AnimatePresence>
        {isVisionExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="w-full max-w-6xl h-[80vh] flex flex-col lg:flex-row gap-0 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setIsVisionExpanded(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black rounded-lg text-zinc-400 hover:text-white transition-colors border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {isConnected ? (
                  <>
                    {isAutonomousActive && (
                      <>
                        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-scan z-20 pointer-events-none"></div>
                        <div className="absolute top-4 left-4 text-xs font-mono text-emerald-500 bg-black/60 px-2 py-1 rounded border border-emerald-500/30 z-30 pointer-events-none flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${isSystemPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}
                          ></div>{" "}
                          {isSystemPaused ? "PAUSED" : "REC"} -{" "}
                          {devices.find((d) => d.id === selectedDeviceId)
                            ?.name || "Unknown"}
                        </div>
                      </>
                    )}

                    <motion.div
                      drag
                      dragConstraints={{
                        left: -1500,
                        right: 1500,
                        top: -1500,
                        bottom: 1500,
                      }}
                      dragElastic={0.1}
                      style={{ scale: visionZoom }}
                      className="w-full h-full relative cursor-grab active:cursor-grabbing transform-origin-center z-10"
                    >
                      <img
                        src={
                          screenData
                            ? screenData
                            : activeApp === "chrome"
                              ? "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop"
                              : activeApp === "maps"
                                ? "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                                : activeApp === "home"
                                  ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
                                  : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt="Vision capture feed"
                        className={`w-full h-full object-cover pointer-events-none transition-all duration-700 ${screenData ? "scale-[1.0] opacity-100 grayscale-0 contrast-100 rounded-lg" : "scale-[1.1] opacity-70 grayscale contrast-125"}`}
                        draggable={false}
                      />
                      {/* Object Detection Boxes */}
                      <AnimatePresence>
                        {detectedUINodes.map((node) => (
                          <motion.div
                            key={`v2-${node.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              left: `${node.x}%`,
                              top: `${node.y}%`,
                              width: `${node.w}%`,
                              height: `${node.h}%`,
                            }}
                            className="absolute border-2 border-emerald-500 bg-emerald-500/10 z-10 pointer-events-none"
                          >
                            <span className="absolute -top-6 left-[-1px] text-[10px] font-mono bg-emerald-500 text-black font-bold px-1.5 py-0.5 whitespace-nowrap">
                              {node.label} [{node.confidence}%]
                            </span>
                            <div className="absolute top-[-2px] left-[-2px] w-2 h-2 bg-emerald-500"></div>
                            <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-emerald-500"></div>
                            <div className="absolute bottom-[-2px] left-[-2px] w-2 h-2 bg-emerald-500"></div>
                            <div className="absolute bottom-[-2px] right-[-2px] w-2 h-2 bg-emerald-500"></div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Zoom & Pan Controls */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1 z-30 bg-black/60 p-1.5 rounded-lg border border-zinc-800 backdrop-blur-sm shadow-xl">
                      <button
                        onClick={() =>
                          setVisionZoom(Math.max(0.5, visionZoom - 0.25))
                        }
                        className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono text-zinc-300 w-14 text-center select-none font-bold">
                        {Math.round(visionZoom * 100)}%
                      </span>
                      <button
                        onClick={() =>
                          setVisionZoom(Math.min(4, visionZoom + 0.25))
                        }
                        className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <div className="w-[1px] h-6 bg-zinc-700 mx-1"></div>
                      <button
                        onClick={() => {
                          setVisionZoom(1);
                          // Motion handles pan reset automatically if we can force re-render or reset drag offsets,
                          // but the easiest way is to let the user re-center it or we force reset via a ref.
                          // Without ref, setting zoom to 1 gives a good default.
                        }}
                        className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        title="Reset View"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                      <div className="w-[1px] h-6 bg-zinc-700 mx-1"></div>
                      <div className="px-2 text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                        <MousePointer2 className="w-3 h-3" />
                        <span>DRAG TO PAN</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-zinc-600">
                    <Camera className="w-12 h-12 opacity-50" />
                    <span className="text-sm font-mono uppercase tracking-widest opacity-80">
                      Feed Offline
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-80 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
                    Detection Logs
                  </h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col gap-3">
                  {isAutonomousActive ? (
                    <>
                      <div className="text-zinc-500">
                        [17:23:50] Initializing vision module...
                      </div>
                      <div className="text-emerald-400">
                        [17:23:51] Connected to frame buffer
                      </div>
                      <div className="text-zinc-500">
                        [17:23:52] Scanning layout structures
                      </div>
                      <div className="text-blue-400">
                        [17:23:54] Found text node: "Settings"
                      </div>
                      <div className="text-blue-400">
                        [17:23:55] Found text node: "Profile"
                      </div>
                      <div className="text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded border border-emerald-500/20 mt-2">
                        [17:23:58] [MATCH] Target ui_element_detected!
                        Confidence: 98.4%
                      </div>
                      <div className="text-zinc-400 pl-2 border-l-2 border-zinc-700 ml-1">
                        &gt; BBox: x:120 y:340 w:220 h:90
                        <br />
                        &gt; Action recommended: TAP
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500 italic text-center mt-10">
                      Awaiting visual context...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SecuritySettings
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        currentKey={apiKey}
        currentUrl={hostUrl}
        onSaveKey={saveApiKey}
        onSaveUrl={saveHostUrl}
      />
      <ModelSettings
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
        onSave={(config) => {
          console.log("Model config saved:", config);
          addLog(
            `> Switched AI engine to ${config.type.toUpperCase()} (${config.modelId})`,
          );
        }}
      />
      <DeviceConnectionWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        backendUrl="http://localhost:8000"
        onAddDevice={(device) => {
          setDevices((prev) => [...prev, device]);
          setSelectedDeviceId(device.id);
        }}
      />
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        session={session}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Global Footer */}
      <footer className="w-full border-t-2 border-indigo-500/40 bg-[#020205] shadow-[0_-4px_20px_rgba(99,102,241,0.15)] py-6 px-4 sm:px-6 mt-12 text-center" id="global-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-zinc-400 font-bold tracking-wider">KORO AUTOMATION ENGINE</span>
            <span className="text-zinc-600">v1.2.0</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded"
              title="Download JSON Report"
            >
              <Download className="w-3.5 h-3.5" />
              Download Session Report
            </button>
            <span>© 2026 Koro. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
